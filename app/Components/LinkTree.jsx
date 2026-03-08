"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "../../i18n/routing";
import { useSettings } from "../Context/SettingContext";
import { useLocale } from "next-intl";

const LinkTree = () => {
  const t = useTranslations();
  const { settings } = useSettings();
  const isRTL = useLocale() === "ar";
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const facebookUrl = Array.isArray(settings?.facebook)
    ? settings.facebook[0]
    : settings?.facebook || null;
  const instagramUrl = Array.isArray(settings?.instagram)
    ? settings.instagram[0]
    : settings?.instagram || null;
  const twitterUrl = Array.isArray(settings?.twitter)
    ? settings.twitter[0]
    : settings?.twitter || null;
  const whatsappUrl = Array.isArray(settings?.whatsapp)
    ? settings.whatsapp[0]
    : settings?.whatsapp || null;

  const logo = settings?.main_logo_light || null;

  const socialLinks = [
    {
      name: t("linkTree.facebook"),
      url: facebookUrl,
      icon: FaFacebookF,
      color: "bg-blue-600",
    },
    {
      name: t("linkTree.instagram"),
      url: instagramUrl,
      icon: FaInstagram,
      color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
    },
    {
      name: t("linkTree.twitter"),
      url: twitterUrl,
      icon: FaTwitter,
      color: "bg-blue-400",
    },
    {
      name: t("linkTree.whatsapp"),
      url: whatsappUrl,
      icon: FaWhatsapp,
      color: "bg-green-500",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <p className="text-gray-600 text-lg">
          {t("linkTree.noLinks") || "No social media links available"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="w-full bg-third   py-10 flex flex-col items-center justify-center">
            {/* Logo */}
            {logo && (
              <div className="mb-5">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            )}

            {/* Text */}
            <p className="text-gray-800 font-medium text-center px-6">
              {t("linkTree.connectText") ||
                "Connect with us on your favorite platform"}
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="p-6 space-y-3">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between  gap-10  px-5 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer ${
                    isRTL ? "" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 ${link.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Platform Name */}
                  <span className="text-gray-800 font-bold flex-1">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTree;
