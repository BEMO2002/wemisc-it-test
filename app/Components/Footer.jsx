"use client";
import React, { useState, useContext, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
  FaSpinner,
  FaCalculator,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import axios from "axios";
import { ApiAuthContext } from "../Context/AuthContext";
import { useSettings } from "../Context/SettingContext";
import { Link } from "../../i18n/routing";
import wave from "../../public/Home/footer_shape_1.png";
const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { XTenantID, XApiKey, baseUrl } = useContext(ApiAuthContext);
  const { settings } = useSettings();

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [extraKey, setExtraKey] = useState(""); // Honeypot field

  const isRTL = locale === "ar";

  const currentAddressArray = isRTL
    ? settings?.site_address_ar || []
    : settings?.site_address_en || [];
  const currentAddress = Array.isArray(currentAddressArray)
    ? currentAddressArray.join(" ")
    : currentAddressArray || "";

  const currentFooterText = isRTL
    ? settings?.footer_text_ar || t("footer.legalText")
    : settings?.footer_text_en || t("footer.legalText");

  const currentEmail = settings?.site_email || t("footer.email");
  const currentPhone = settings?.site_phone || t("footer.phone");

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

  // Math question generator helper function
  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let question, answer;

    switch (operation) {
      case "+":
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
        break;
      case "-":
        // Ensure positive result by swapping if needed
        const [largerNum, smallerNum] =
          num1 >= num2 ? [num1, num2] : [num2, num1];
        question = `${largerNum} - ${smallerNum} = ?`;
        answer = largerNum - smallerNum;
        break;
      case "*":
        question = `${num1} × ${num2} = ?`;
        answer = num1 * num2;
        break;
      default:
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    }

    setMathQuestion(question);
    setCorrectAnswer(answer);
    setMathAnswer("");
  };

  // Generate initial math question
  useEffect(() => {
    generateMathQuestion();
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Comprehensive validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = t("footer.newsletterErrorRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("footer.newsletterErrorInvalid");
    }

    // Honeypot validation
    if (extraKey && extraKey.trim() !== "") {
      newErrors.extraKey =
        t("contactForm.errorInvalidSubmission") ||
        "Invalid submission detected";
    }

    // Math CAPTCHA validation
    if (!mathAnswer.trim()) {
      newErrors.mathAnswer =
        t("contactForm.errorMathRequired") || "Math answer is required";
    } else if (parseInt(mathAnswer) !== correctAnswer) {
      newErrors.mathAnswer =
        t("contactForm.errorMathIncorrect") || "Incorrect math answer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "mathAnswer":
        setMathAnswer(value);
        break;
      case "extra_key":
        setExtraKey(value);
        break;
      default:
        break;
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        t("contactForm.errorValidation") || "Please fix the errors below",
        {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
        },
      );
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting newsletter data:", {
        email: email.trim(),
        extra_key: null,
      });

      const response = await axios.post(
        `${baseUrl}/subscribes`,
        { email: email.trim(), extra_key: null },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Tenant-ID": XTenantID,
            "X-API-KEY": XApiKey,
          },
          timeout: 10000,
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(t("footer.newsletterSuccess"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
        });

        // Reset form
        setEmail("");
        setExtraKey("");
        setMathAnswer("");
        setErrors({});

        // Generate new math question
        generateMathQuestion();
      } else {
        toast.error(t("footer.newsletterError"));
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message;
      const emailValidationMsg = error?.response?.data?.data?.email?.[0];

      let msg = serverMsg || t("footer.newsletterError");

      if (status === 422) {
        msg =
          emailValidationMsg ||
          serverMsg ||
          t("footer.newsletterErrorConflict");
      } else if (status === 409) {
        msg = serverMsg || t("footer.newsletterErrorConflict");
      } else if (status === 401 || status === 403) {
        msg = serverMsg || t("footer.newsletterErrorAuth");
      } else if (status >= 500) {
        msg = serverMsg || t("footer.newsletterErrorServer");
      } else if (!error.response) {
        if (error.code === "ECONNABORTED") {
          msg = t("footer.newsletterErrorTimeout");
        } else {
          msg = t("footer.newsletterErrorNetwork");
        }
      }

      toast.error(msg, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-10">
      <footer className="relative  text-black  py-10 pb-6 px-4 md:px-8 overflow-hidden bg-third">
        <img
          src={wave?.src || wave}
          alt="download"
          className="absolute top-0 left-0   w-[700px]  object-contain  "
        />

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 footer-grid">
            {/* Logo and About */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <div
                className={`flex justify-center ${
                  isRTL ? "lg:justify-start" : "lg:justify-start"
                } mb-4`}
              >
                {settings?.main_logo_light && (
                  <img
                    src={settings.main_logo_light}
                    alt="Company Logo"
                    className="w-60"
                  />
                )}
              </div>
              <h3 className="text-lg font-bold mb-3">
                {t("footer.companyName")}
              </h3>
              <p className="text-sm text-black/90 leading-relaxed mb-4 max-w-sm">
                {t("footer.aboutDescription")}
              </p>
              <div className="text-sm font-medium text-secondary">
                {t("footer.mission")}
              </div>
            </div>

            {/* Quick Links */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <h3 className="text-xl font-bold mb-6">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.blogs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/links"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.links")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accreditations"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("footer.accreditations")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("footer.sitemap", "Sitemap")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <h3 className="text-xl font-bold mb-6">
                {t("footer.contactInfo")}
              </h3>
              <ul className="space-y-4">
                <li
                  className={`flex items-start gap-3 justify-center ${
                    isRTL
                      ? "lg:justify-end flex-row-reverse"
                      : "lg:justify-start"
                  }`}
                >
                  <span className="text-md flex items-center gap-1 text-black leading-relaxed max-w-xs">
                    <FaMapMarkerAlt className="mt-1 text-secondary flex-shrink-0 w-4 h-4" />
                    {currentAddress || t("footer.companyAddress")}
                  </span>
                </li>
                <li
                  className={`flex items-center gap-3 justify-center ${
                    isRTL
                      ? "lg:justify-end flex-row-reverse"
                      : "lg:justify-start "
                  }`}
                >
                  <a
                    href={`mailto:${currentEmail}`}
                    className="text-md flex items-center gap-1 text-black hover:text-secondary transition-colors duration-200"
                  >
                    <FaEnvelope className="text-secondary flex-shrink-0 w-4 h-4" />
                    {currentEmail}
                  </a>
                </li>
                <li
                  className={`flex items-center gap-3 justify-center ${
                    isRTL
                      ? "lg:justify-end flex-row-reverse"
                      : "lg:justify-start"
                  }`}
                >
                  <a
                    href={`tel:${currentPhone}`}
                    className="text-md flex items-center gap-1 text-black hover:text-secondary transition-colors duration-200"
                  >
                    <FaPhoneAlt className="text-secondary flex-shrink-0 w-4 h-4" />
                    {currentPhone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <div className="bg-gradient-to-br from-black/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-primary" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-lg font-bold text-black">
                      {t("footer.newsletterTitle")}
                    </h3>
                  </div>
                </div>

                <p
                  className={`text-xs text-black leading-relaxed ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.newsletterDescription")}
                </p>

                <div className="hidden">
                  <input
                    type="text"
                    name="extra_key"
                    value={extraKey}
                    onChange={handleInputChange}
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </div>

                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder={t("footer.newsletterPlaceholder")}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-black/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/15 transition-all duration-300 text-sm ${
                        errors.email
                          ? "border-red-400/60 bg-red-500/10 focus:ring-red-400/50"
                          : ""
                      } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
                      disabled={isLoading}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    <FaEnvelope
                      className={`absolute top-3.5 w-4 h-4 text-black pointer-events-none ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className={`text-red-300 text-xs mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <label
                        htmlFor="mathAnswer"
                        className={`text-xs text-black font-medium ${
                          isRTL ? "" : ""
                        }`}
                      >
                        {t("footer.mathCaptchaLabel") || "Verify you're human"}{" "}
                        ({mathQuestion})
                      </label>
                    </div>
                    <input
                      type="number"
                      id="mathAnswer"
                      name="mathAnswer"
                      value={mathAnswer}
                      onChange={handleInputChange}
                      placeholder={
                        t("footer.mathPlaceholder") || "Enter answer"
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-black/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/15 transition-all duration-300 text-sm ${
                        errors.mathAnswer
                          ? "border-red-400/60 bg-red-500/10 focus:ring-red-400/50"
                          : ""
                      } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
                      disabled={isLoading}
                      min="0"
                      aria-invalid={!!errors.mathAnswer}
                      aria-describedby={
                        errors.mathAnswer ? "math-error" : undefined
                      }
                    />
                    {errors.mathAnswer && (
                      <p
                        id="math-error"
                        className={`text-red-300 text-xs mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.mathAnswer}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin w-4 h-4" />
                        <span>{t("footer.newsletterSending")}</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-4 h-4" />
                        <span>{t("footer.newsletterSubscribe")}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-black/20 space-y-2">
            {(facebookUrl || instagramUrl || twitterUrl || whatsappUrl) && (
              <div className="flex justify-center items-center gap-4 mt-2">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/80 hover:text-secondary transition-colors duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/80 hover:text-secondary transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                )}
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black/80 hover:text-secondary transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-black hover:text-secondary transition-colors duration-200"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-center items-center gap-4">
              <p className="text-sm text-black">{currentFooterText}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
