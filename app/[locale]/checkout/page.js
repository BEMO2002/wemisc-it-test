import { getTranslations } from "next-intl/server";
import { fetchSettings } from "../../lib/server-api";
import Checkout from "../../Checkout-Page/Checkout";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let siteName = "WeMisc IT";
  let description = t("checkout.description") || t("contactForm.description");
  let ogImage = "";
  let settings = null;

  try {
    settings = await fetchSettings();
    if (settings) {
      siteName =
        locale === "ar" ? settings.site_name_ar : settings.site_name_en;
      if (settings.main_logo_light) {
        ogImage = settings.main_logo_light;
      }
    }
  } catch (err) {
    console.error("Error fetching settings for metadata", err);
  }

  const title = t("checkout.title");

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: false,
      follow: false,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function CheckoutPage() {
  return (
    <div className="checkout-page-container mt-20">
      <Checkout />
    </div>
  );
}
