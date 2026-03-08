import LinkTree from "../../Components/LinkTree";
import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const description =
    settings?.site_description_en || t("contactForm.description");

  return {
    title: t("linkTree.title", "Links"),
    description: description,
    openGraph: {
      title: t("linkTree.title", "Links"),
      description: description,
      type: "website",
      ...(settings?.main_logo_light && { images: [settings.main_logo_light] }),
    },
    twitter: {
      card: "summary_large_image",
      title: t("linkTree.title", "Links"),
      description: description,
      ...(settings?.main_logo_light && { images: [settings.main_logo_light] }),
    },
  };
}

export default function LinksPage() {
  return <LinkTree />;
}
