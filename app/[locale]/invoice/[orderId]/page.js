import { getTranslations } from "next-intl/server";
import { fetchSettings } from "../../../../lib/server-api";
import Invoice from "../../../Checkout-Page/Invoice";

export async function generateMetadata({ params }) {
  const { locale, orderId } = await params;
  const t = await getTranslations({ locale });

  let siteName = "WeMisc IT";
  let description = t("invoice.description") || t("contactForm.description");
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

  const title = `${t("invoice.title")} #${orderId}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      ...(ogImage && { images: [ogImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default function InvoicePage() {
  return (
    <div className="invoice-page-container mt-20">
      <Invoice />
    </div>
  );
}
