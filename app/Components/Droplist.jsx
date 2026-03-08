"use client";
import React, { useMemo } from "react";
import { Link } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";

const Droplist = ({ open, onClose, align = "center", variant = "desktop" }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const sections = useMemo(
    () => [
      {
        key: "marketing",
        titleKey: "megaMenu.sections.marketing",
        items: [
          {
            key: "home",
            labelKey: "megaMenu.items.home",
            href: "https://newwebsite.kuwaitneuro.org/patient-education",
          },
          {
            key: "services",
            labelKey: "megaMenu.items.services",
            href: "/services",
          },
          { key: "blogs", labelKey: "megaMenu.items.blogs", href: "/blogs" },
          { key: "about", labelKey: "megaMenu.items.about", href: "/about" },
          {
            key: "contact",
            labelKey: "megaMenu.items.contact",
            href: "/contact",
          },
        ],
      },
      {
        key: "pms",
        titleKey: "megaMenu.sections.pms",
        items: [
          { key: "about", labelKey: "megaMenu.items.about", href: "/about" },
          {
            key: "solutions",
            labelKey: "megaMenu.items.solutions",
            href: "/services",
          },
          {
            key: "courses",
            labelKey: "megaMenu.items.courses",
            href: "/services",
          },
          {
            key: "pricing",
            labelKey: "megaMenu.items.pricing",
            href: "/contact",
          },
          {
            key: "contact",
            labelKey: "megaMenu.items.contact",
            href: "/contact",
          },
          { key: "blog", labelKey: "megaMenu.items.blog", href: "/blogs" },
          {
            key: "clientsPartners",
            labelKey: "megaMenu.items.clientsPartners",
            href: "/#partners",
          },
        ],
      },
      {
        key: "courses",
        titleKey: "megaMenu.sections.courses",
        items: [
          { key: "about", labelKey: "megaMenu.items.about", href: "/about" },
          {
            key: "services",
            labelKey: "megaMenu.items.services",
            href: "/services",
          },
          { key: "blogs", labelKey: "megaMenu.items.blogs", href: "/blogs" },
          {
            key: "contact",
            labelKey: "megaMenu.items.contact",
            href: "/contact",
          },
        ],
      },
    ],
    [],
  );

  const alignClass =
    align === "start"
      ? "left-0"
      : align === "end"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  const renderItem = (item, styles = {}) => {
    const href = item?.href;
    const label = t(item.labelKey);
    const linkClass =
      styles.linkClass ||
      "block w-full text-sm font-semibold text-gray-700 hover:text-primary transition-colors";
    const disabledClass =
      styles.disabledClass ||
      "block w-full text-sm font-semibold text-gray-400 cursor-not-allowed";

    if (!href) {
      return (
        <span className={disabledClass} aria-disabled="true">
          {label}
        </span>
      );
    }

    const isExternal = /^https?:\/\//i.test(href);
    const isHashOnly = href.startsWith("#");
    const isInternal = href.startsWith("/") || isHashOnly;

    if (isInternal && !isExternal) {
      return (
        <Link href={href} onClick={onClose} className={linkClass}>
          {label}
        </Link>
      );
    }

    return (
      <a
        href={href}
        onClick={onClose}
        target={isExternal ? "_self" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={linkClass}
      >
        {label}
      </a>
    );
  };

  if (variant === "mobile") {
    return (
      <div
        className={`${open ? "block " : "hidden"}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="rounded-xl   bg-white/10 border border-gray-300 p-4">
          <div className="space-y-6 max-h-[50vh] overflow-y-auto overscroll-contain">
            {sections.map((section) => (
              <div key={section.key}>
                <h3 className="text-md font-extrabold text-baseTwo mb-3">
                  {t(section.titleKey)}
                </h3>
                <div className="space-y-2 ">
                  {section.items.map((item) => (
                    <div key={`${section.key}-${item.key}`}>
                      {renderItem(item, {
                        linkClass:
                          "block w-full text-sm font-semibold text-baseTwo hover:text-primary transition-colors",
                        disabledClass:
                          "block w-full text-sm  text-gray-200 cursor-not-allowed",
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute top-full mt-3 z-50 ${alignClass} ${
        open
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-1"
      } transition-all duration-200`}
      onMouseLeave={onClose}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="min-w-[920px] max-w-[1100px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-3 gap-10">
            {sections.map((section) => (
              <div key={section.key}>
                <h3 className="text-md font-extrabold text-gray-900 mb-4">
                  {t(section.titleKey)}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={`${section.key}-${item.key}`}>
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
          {/* <Link
            to="/"
            onClick={onClose}
            className="text-sm font-extrabold text-gray-700 hover:text-primary transition-colors"
          >
            {t("megaMenu.viewSitemap")}
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Droplist;
