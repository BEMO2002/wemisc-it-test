import { getTranslations } from "next-intl/server";
import SliderServer from "../HomePage/SliderServer";
import { fetchSettings } from "../lib/server-api";
// import SpecialServices from "../HomePage/SpecialServices";
// import HowItWorks from "../HomePage/HowItWorks";
// import AboutTwo from "../HomePage/AboutTwo";
// import InfinitySlider from "../HomePage/InfinitySlider";
// import Services from "../Services/Services";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const t = await getTranslations({ locale, namespace: "navbar" });

  let title = "WeMisc IT";
  let description = t.has("seo_description") ? t("seo_description") : "";
  let keywords = t.has("seo_keywords") ? t("seo_keywords") : "";
  let ogImage = "";

  try {
    const settings = await fetchSettings();
    if (settings) {
      title = locale === "ar" ? settings.site_name_ar : settings.site_name_en;

      // If we don't have a translation locally, fallback to settings
      if (!description) {
        description =
          locale === "ar"
            ? settings.site_description_ar
            : settings.site_description_en;
      }
      if (settings.main_logo_light) {
        ogImage = settings.main_logo_light;
      }
    }
  } catch (error) {
    console.error("Failed to fetch global settings for Home Page SEO:", error);
  }

  return {
    title: `${title} | ${t("home", { fallback: "Home" })}`,
    description: description || "WeMisc IT Home Page",
    keywords: keywords || "",
    openGraph: {
      title: `${title} | ${t("home", { fallback: "Home" })}`,
      description: description || "WeMisc IT Home Page",
      ...(ogImage && { images: [ogImage] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${t("home", { fallback: "Home" })}`,
      description: description || "WeMisc IT Home Page",
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function MainHome() {
  return (
    <>
      <SliderServer />

      {/* قم بفك التعليق (Uncomment) عن المكونات التالية بمجرد إضافتها للمشروع */}
      {/* <SpecialServices /> */}
      {/* <HowItWorks /> */}
      {/* <AboutTwo /> */}
      {/* <InfinitySlider /> */}
      {/* <Services /> */}
    </>
  );
}
