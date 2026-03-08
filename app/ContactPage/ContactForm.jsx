"use client";

import React, { useState, useContext, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { submitContactForm } from "../lib/server-api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import contactImage from "../../public/Home/contactus.jpg";

const ContactForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    extra_key: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Generate random math question
  useEffect(() => {
    const generateMathQuestion = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operations = ["+", "-", "*"];
      const operation =
        operations[Math.floor(Math.random() * operations.length)];
      let question, answer;

      switch (operation) {
        case "+":
          question = `${num1} + ${num2} = ?`;
          answer = num1 + num2;
          break;
        case "-":
          question = `${num1} - ${num2} = ?`;
          answer = num1 - num2;
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
    };

    generateMathQuestion();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle math answer change
  const handleMathAnswerChange = (e) => {
    setMathAnswer(e.target.value);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("contactForm.errorNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("contactForm.errorNameTooShort");
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t("contactForm.errorPhoneRequired");
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = t("contactForm.errorPhoneInvalid");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("contactForm.errorEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contactForm.errorEmailInvalid");
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("contactForm.errorMessageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contactForm.errorMessageTooShort");
    }

    // Extra key validation (honeypot)
    if (formData.extra_key && formData.extra_key.trim() !== "") {
      newErrors.extra_key = t("contactForm.errorInvalidSubmission");
    }

    // Math answer validation
    if (!mathAnswer.trim()) {
      newErrors.mathAnswer = t("contactForm.errorMathRequired");
    } else if (parseInt(mathAnswer) !== correctAnswer) {
      newErrors.mathAnswer = t("contactForm.errorMathIncorrect");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("contactForm.errorValidation"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting form data:", { ...formData, extra_key: null });

      const response = await submitContactForm(formData);

      console.log("API Response:", response);

      if (response.ok) {
        toast.success(t("contactForm.successMessage"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          extra_key: "",
        });
        setMathAnswer("");
        setErrors({});
        // Generate new math question
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operations = ["+", "-", "*"];
        const operation =
          operations[Math.floor(Math.random() * operations.length)];
        let question, answer;
        switch (operation) {
          case "+":
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
          case "-":
            question = `${num1} - ${num2} = ?`;
            answer = num1 - num2;
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
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      let errorMessage = t("contactForm.errorGeneral");

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        errorMessage = errorData.message || t("contactForm.errorGeneral");
      }

      toast.error(errorMessage, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="py-16  px-4 md:px-8">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Image on the left */}
            <div className="hidden md:block">
              <img
                src={contactImage.src || contactImage}
                alt="Contact us"
                className="rounded-3xl w-full h-full object-cover "
              />
            </div>
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl  p-8 md:p-12 border border-gray-100 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaUser className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelName")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderName")}
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <FaPhone className="text-primary" />
                      <span className={isRTL ? "text-right" : "text-left"}>
                        {t("contactForm.labelPhone")}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderPhone")}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p
                        className={`text-red-500 text-sm mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <FaEnvelope className="text-primary" />
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelEmail")}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderEmail")}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <FaCommentDots className="text-primary" />
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelMessage")}
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo resize-vertical ${
                      errors.message
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMessage")}
                    disabled={isLoading}
                  />
                  {errors.message && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Extra Key (Honeypot) */}
                <div className="hidden">
                  <label htmlFor="extra_key">
                    {t("contactForm.honeypotLabel")}
                  </label>
                  <input
                    type="text"
                    id="extra_key"
                    name="extra_key"
                    value={formData.extra_key}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                  {errors.extra_key && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.extra_key}
                    </p>
                  )}
                </div>

                {/* Math CAPTCHA */}
                <div className="space-y-2">
                  <label
                    htmlFor="mathAnswer"
                    className={`flex items-center gap-3 text-lg font-semibold text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  >
                    <span className={isRTL ? "text-right" : "text-left"}>
                      {t("contactForm.labelMath")} ({mathQuestion})
                    </span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="mathAnswer"
                    name="mathAnswer"
                    value={mathAnswer}
                    onChange={handleMathAnswerChange}
                    className={`w-full px-4 py-4 border-2 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-baseTwo/20 focus:border-baseTwo ${
                      errors.mathAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMath")}
                    disabled={isLoading}
                  />
                  {errors.mathAnswer && (
                    <p
                      className={`text-red-500 text-sm mt-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {errors.mathAnswer}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-baseTwo to-primary text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t("contactForm.buttonSending")}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        {t("contactForm.buttonSend")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
