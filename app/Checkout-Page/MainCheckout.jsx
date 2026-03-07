import React from "react";
import Checkout from "./Checkout";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSettings } from "../Context/SettingContext";
const MainCheckout = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const isRTL = i18n?.language === "ar";

  const metaTitle = isRTL
    ? settings?.site_name_ar
    : settings?.site_name_en || t("headHome.title", "Home");

  const metaDesc =
    settings?.site_description_en || t("contactForm.description");
  return (
    <>
      <Helmet>
        <title>{`${metaTitle} | ${t("checkout.title")}`}</title>
        <meta name="description" content={metaDesc} />
        <meta
          property="og:title"
          content={`${metaTitle} | ${t("checkout.title")}`}
        />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {settings?.main_logo_light && (
          <meta property="og:image" content={settings.main_logo_light} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("checkout.title")} />
        <meta name="twitter:description" content={t("checkout.description")} />
        {settings?.main_logo_light && (
          <meta name="twitter:image" content={settings.main_logo_light} />
        )}
      </Helmet>
      <Checkout />
    </>
  );
};

export default MainCheckout;
