import { getTranslations } from "next-intl/server";
import { fetchSettings } from "../../lib/server-api";
import HeadServices from "../../CoursesPage/HeadServices";
import Services from "../../CoursesPage/Services";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let siteName = "WeMisc IT";
  let description = t("headServices.description");

  try {
    const settings = await fetchSettings();
    if (settings) {
      siteName =
        locale === "ar" ? settings.site_name_ar : settings.site_name_en;
    }
  } catch (err) {
    console.error("Error fetching settings for metadata", err);
  }

  return {
    title: t("navbar.services"),
    description: description,
    openGraph: {
      title: t("navbar.services"),
      description: description,
    },
  };
}

export default function CoursesPage() {
  return (
    <div className="courses-page-container mt-20">
      <HeadServices />
      <Services />
    </div>
  );
}
