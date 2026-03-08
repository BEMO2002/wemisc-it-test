"use client";
import { useState, useEffect, useId } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import React from "react";
import { Link, usePathname, useRouter } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSettings } from "../Context/SettingContext";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../Context/CartContextBase";
import Droplist from "./Droplist";
// US Flag Component
const USFlag = ({ className = "w-6 h-4" }) => {
  const id = useId();
  const uniqueId = id.replace(/:/g, ""); // Remove colons for SVG compatibility
  return (
    <div
      className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 60 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`usRed-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#B22234" />
            <stop offset="100%" stopColor="#A01E2A" />
          </linearGradient>
          <linearGradient
            id={`usBlue-${uniqueId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3C3B6E" />
            <stop offset="100%" stopColor="#2A2A5A" />
          </linearGradient>
        </defs>
        <rect width="60" height="40" fill={`url(#usRed-${uniqueId})`} />
        <rect width="60" height="3.08" y="3.08" fill="white" />
        <rect width="60" height="3.08" y="9.23" fill="white" />
        <rect width="60" height="3.08" y="15.38" fill="white" />
        <rect width="60" height="3.08" y="21.54" fill="white" />
        <rect width="60" height="3.08" y="27.69" fill="white" />
        <rect width="60" height="3.08" y="33.85" fill="white" />
        <rect width="24" height="21.54" fill={`url(#usBlue-${uniqueId})`} />
        <g fill="white">
          <circle cx="3" cy="2.5" r="0.8" />
          <circle cx="9" cy="2.5" r="0.8" />
          <circle cx="15" cy="2.5" r="0.8" />
          <circle cx="21" cy="2.5" r="0.8" />
          <circle cx="6" cy="5.5" r="0.8" />
          <circle cx="12" cy="5.5" r="0.8" />
          <circle cx="18" cy="5.5" r="0.8" />
          <circle cx="3" cy="8.5" r="0.8" />
          <circle cx="9" cy="8.5" r="0.8" />
          <circle cx="15" cy="8.5" r="0.8" />
          <circle cx="21" cy="8.5" r="0.8" />
          <circle cx="6" cy="11.5" r="0.8" />
          <circle cx="12" cy="11.5" r="0.8" />
          <circle cx="18" cy="11.5" r="0.8" />
          <circle cx="3" cy="14.5" r="0.8" />
          <circle cx="9" cy="14.5" r="0.8" />
          <circle cx="15" cy="14.5" r="0.8" />
          <circle cx="21" cy="14.5" r="0.8" />
          <circle cx="6" cy="17.5" r="0.8" />
          <circle cx="12" cy="17.5" r="0.8" />
          <circle cx="18" cy="17.5" r="0.8" />
        </g>
      </svg>
    </div>
  );
};

// Egypt Flag Component
const EgyptFlag = ({ className = "w-6 h-4" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <svg
      className="w-full h-full"
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="13.33" fill="#CE1126" />
      <rect width="60" height="13.33" y="13.33" fill="white" />
      <rect width="60" height="13.33" y="26.67" fill="#000000" />
      <g transform="translate(30, 20)">
        <circle cx="0" cy="0" r="1.5" fill="#D4AF37" />
        <path
          d="M-1,-0.8 L1,0.8 M1,-0.8 L-1,0.8"
          stroke="#D4AF37"
          strokeWidth="0.3"
        />
      </g>
    </svg>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isMegaMobileOpen, setIsMegaMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();
  const { items } = useCart();
  console.log("Navbar settings:", settings);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setIsMegaMobileOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMegaMobileOpen(false);
  };

  const closeMega = () => {
    setIsMegaOpen(false);
  };

  const closeMegaMobile = () => {
    setIsMegaMobileOpen(false);
  };

  const isActive = (path) => {
    return pathname === path;
  };
  // stop scroll when change language (important)
  const toggleLanguage = () => {
    const newLang = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLang, scroll: false });
  };

  const NavLink = ({ to, children }) => (
    <Link
      href={to}
      onClick={closeMenu}
      className={`relative group px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 ${
        isActive(to) ? "text-baseTwo" : "text-baseTwo hover:text-primary"
      }`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
          isActive(to) ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm backdrop-blur-sm fixed top-0 left-0 right-0 z-50 py-4 md:px-6 px-2">
      <div className="max-w-7xl mx-auto md:px-4 px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMenu} className="flex items-center">
              {settings?.main_logo_light && (
                <img
                  src={settings.main_logo_light}
                  alt="Logo"
                  className="md:w-40 w-36 object-contain"
                />
              )}
              {/* <img src={logo} alt="Logo" className="w-40 object-cover" /> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden  whitespace-nowrap lg:flex items-center space-x-8">
            <NavLink to="/">{t("navbar.home")}</NavLink>
            <NavLink to="/courses">{t("navbar.services")}</NavLink>
            <NavLink to="/blogs">{t("navbar.blogs")}</NavLink>
            <NavLink to="/about">{t("navbar.about")}</NavLink>
            <NavLink to="/contact">{t("navbar.contact")}</NavLink>
            <div
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                className="relative flex items-center gap-2 group px-4 py-3 text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 text-baseTwo hover:text-primary"
                onClick={() => setIsMegaOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isMegaOpen}
              >
                {t("megaMenu.trigger")}
                <MdOutlineKeyboardArrowDown size={24} />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isMegaOpen ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
              <Droplist open={isMegaOpen} onClose={closeMega} align="center" />
            </div>
          </div>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center md:space-x-6 space-x-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="items-center space-x-2 flex bg-gray-100 shadow-lg rounded-full px-3 py-2 transition-all duration-300 backdrop-blur-sm border border-gray-300"
              title={locale === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              {locale === "en" ? (
                <USFlag className="w-6 h-4" />
              ) : (
                <EgyptFlag className="w-6 h-4" />
              )}
              <span className="text-baseTwo text-sm font-medium">
                {locale === "en" ? "AR" : "EN"}
              </span>
            </button>
            <Link href="/cart" className="text-baseTwo hover:text-primary">
              <div className="relative">
                <HiOutlineShoppingBag size={30} className="text-primary" />
                {isMounted && items.length > 0 && (
                  <span className="text-[10px] font-bold bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2 border-2 border-white">
                    {items.length}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-primary p-2 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative w-8 h-8">
                <FiMenu
                  size={30}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? `rotate-180 opacity-0` : "rotate-0 opacity-100"
                  }`}
                />
                <FiX
                  size={30}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen
                      ? "rotate-0 opacity-100"
                      : "-rotate-180 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[660px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-third border-t border-white/10 backdrop-blur-sm">
          <div className="px-6 py-8 space-y-10 max-h-[calc(100vh-250px)] overflow-y-auto overscroll-contain">
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "100ms" : "0ms" }}
            >
              <NavLink to="/">{t("navbar.home")}</NavLink>
            </div>
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
            >
              <NavLink to="/courses">{t("navbar.services")}</NavLink>
            </div>

            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
            >
              <NavLink to="/blogs">{t("navbar.blogs")}</NavLink>
            </div>
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "150ms" : "0ms" }}
            ></div>
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
            >
              <NavLink to="/about">{t("navbar.about")}</NavLink>
            </div>
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "300ms" : "0ms" }}
            >
              <NavLink to="/contact">{t("navbar.contact")}</NavLink>
            </div>
            <div
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "175ms" : "0ms" }}
            >
              <button
                type="button"
                onClick={() => setIsMegaMobileOpen((v) => !v)}
                className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-all duration-300 "
                aria-expanded={isMegaMobileOpen}
              >
                <span className="text-baseTwo font-medium">
                  {t("megaMenu.trigger")}
                </span>
                <MdOutlineKeyboardArrowDown
                  size={22}
                  className={`transition-transform duration-200 ${
                    isMegaMobileOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div className="mt-3">
                <Droplist
                  open={isMegaMobileOpen}
                  onClose={() => {
                    closeMegaMobile();
                    closeMenu();
                  }}
                  variant="mobile"
                />
              </div>
            </div>
            {/* Mobile Language Toggle */}
            <div
              className={`pt-4 border-t border-gray-400 transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "350ms" : "0ms" }}
            >
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center space-x-3 w-full bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 transition-all duration-300 backdrop-blur-sm border border-gray-400"
                title={
                  locale === "en" ? "Switch to Arabic" : "Switch to English"
                }
              >
                {locale === "en" ? (
                  <USFlag className="w-6 h-4" />
                ) : (
                  <EgyptFlag className="w-6 h-4" />
                )}
                <span className="text-baseTwo  font-medium">
                  {locale === "en" ? "Switch to Arabic" : "التبديل للإنجليزية"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
