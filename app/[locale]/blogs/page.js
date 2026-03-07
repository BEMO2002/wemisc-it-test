import { fetchSettings } from "../../lib/server-api";
import Blogs from "../../BlogsPage/Blogs";
import { getTranslations } from "next-intl/server";
import HeadBlogs from "../../BlogsPage/HeadBlogs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings
    ? locale === "ar"
      ? settings.site_name_ar
      : settings.site_name_en
    : "WeMisc IT";

  const title = t("blogs.title2");
  const description = t("blogs.description");

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      ...(settings?.main_logo_light && { images: [settings.main_logo_light] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(settings?.main_logo_light && { images: [settings.main_logo_light] }),
    },
  };
}

export default function BlogsPage() {
  return (
    <div className="courses-page-container mt-20">
      <HeadBlogs />
      <Blogs />
    </div>
  );
}
