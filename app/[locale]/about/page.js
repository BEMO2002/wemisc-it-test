import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadAbout from "../../AboutPage/HeadAbout";
import AboutTwo from "../../HomePage/AboutTwo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("about.title") || t("navbar.about");
  const description = t("about.description");

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

export default function AboutPage() {
  return (
    <div className="about-page-container mt-20">
      <HeadAbout />
      <div className="">
        <AboutTwo />
      </div>
    </div>
  );
}
