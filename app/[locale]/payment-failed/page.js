import { getTranslations } from "next-intl/server";
import PaymentFailed from "../../Checkout-Page/PaymentFailed";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("payment_failed.title"),
    description: t("payment_failed.desc"),
  };
}

export default function PaymentFailedPage() {
  return <PaymentFailed />;
}
