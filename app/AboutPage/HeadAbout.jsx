"use client";

import React from "react";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "../../i18n/routing";
import spinnerImage from "../../public/Home/shape-31.png";
import spinnerImageTwo from "../../public/Home/shape-32.png";

const HeadAbout = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className=" relative">
      <div className="bg-third p-20 text-white relative overflow-hidden">
        <img
          src={spinnerImage.src || spinnerImage}
          alt="decoration"
          className="absolute bottom-5 left-5 w-40 h-40 object-contain hidden md:block"
        />
        <img
          src={spinnerImageTwo.src || spinnerImageTwo}
          alt="decoration"
          className="absolute top-7 right-5 w-50 h-50 object-contain hidden md:block"
        />
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <h1
            className={`text-5xl md:text-6xl text-primary font-bold ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("navbar.about")}
          </h1>

          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-3 text-lg ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              href="/"
              className="text-black transition-colors duration-300 font-medium"
            >
              {t("navbar.home")}
            </Link>

            {isRTL ? (
              <MdOutlineKeyboardDoubleArrowLeft className="text-primary" />
            ) : (
              <MdOutlineKeyboardDoubleArrowRight className="text-primary" />
            )}

            <span className="text-black font-medium">{t("navbar.about")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadAbout;
