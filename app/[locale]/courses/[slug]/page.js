import { getTranslations } from "next-intl/server";
import { fetchItemDetails, fetchSettings } from "../../../lib/server-api";
import { notFound } from "next/navigation";
import ServicesDetails from "../../../CoursesPage/ServicesDetails";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const item = await fetchItemDetails(slug);
  if (!item) return {};

  const settings = await fetchSettings();
  const siteName = settings
    ? locale === "ar"
      ? settings.site_name_ar
      : settings.site_name_en
    : "WeMisc IT";

  const title = locale === "ar" ? item.meta_title_ar : item.meta_title_en;
  const description =
    locale === "ar" ? item.meta_description_ar : item.meta_description_en;
  const banner = locale === "ar" ? item.banner_ar : item.banner_en;
  const ogImage = item.meta_img || banner || settings?.main_logo_light;

  return {
    title: title || (locale === "ar" ? item.title_ar : item.title_en),
    description:
      description ||
      (locale === "ar" ? item.short_description_ar : item.short_description_en),
    openGraph: {
      title: title || (locale === "ar" ? item.title_ar : item.title_en),
      description:
        description ||
        (locale === "ar"
          ? item.short_description_ar
          : item.short_description_en),
      ...(ogImage && { images: [ogImage] }),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title || (locale === "ar" ? item.title_ar : item.title_en),
      description:
        description ||
        (locale === "ar"
          ? item.short_description_ar
          : item.short_description_en),
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function CourseDetailsPage({ params }) {
  const { slug } = await params;

  const item = await fetchItemDetails(slug);

  if (!item) {
    notFound();
  }

  return <ServicesDetails initialData={item} />;
}
