import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadContact from "../../ContactPage/HeadContact";
import ContactForm from "../../ContactPage/ContactForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("headContact.title");
  const description = t("contactForm.description");

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

export default function ContactPage() {
  return (
    <div className="contact-page-container">
      <HeadContact />
      <ContactForm />
    </div>
  );
}
