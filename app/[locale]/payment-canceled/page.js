import { getTranslations } from "next-intl/server";
import PaymentCanceled from "../../Checkout-Page/PaymentCanceled";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("payment.canceled_title"),
    description: t("payment.canceled_desc"),
  };
}

export default function PaymentCanceledPage() {
  return <PaymentCanceled />;
}
