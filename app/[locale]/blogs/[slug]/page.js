import { fetchBlogDetails, fetchSettings } from "../../../lib/server-api";
import { notFound } from "next/navigation";
import BlogsDetails from "../../../BlogsPage/BlogsDetails";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const blog = await fetchBlogDetails(slug);
  if (!blog) return {};

  const settings = await fetchSettings();

  const title = locale === "ar" ? blog.meta_title_ar : blog.meta_title_en;
  const description =
    locale === "ar" ? blog.meta_description_ar : blog.meta_description_en;
  const banner = locale === "ar" ? blog.banner_ar : blog.banner_en;
  const ogImage = blog.meta_img || banner || settings?.main_logo_light;

  const displayTitle =
    title || (locale === "ar" ? blog.title_ar : blog.title_en);
  const displayDesc =
    description ||
    (locale === "ar" ? blog.short_description_ar : blog.short_description_en);

  return {
    title: displayTitle,
    description: displayDesc,
    openGraph: {
      title: displayTitle,
      description: displayDesc,
      ...(ogImage && { images: [ogImage] }),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: displayDesc,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;

  const blog = await fetchBlogDetails(slug);

  if (!blog) {
    notFound();
  }

  return <BlogsDetails initialData={blog} />;
}
