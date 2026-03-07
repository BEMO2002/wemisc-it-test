import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import aboutImage from "../../public/Home/faq_2_1.png";
import wave from "../../public/Home/footer_shape_1.png";
import spinImage from "../../public/Home/spin (1).webp";
import bounceImage from "../../public/Home/bounce.webp";

const AboutTwo = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const features = [
    {
      id: 1,
      textKey: "aboutTwo.feature1",
    },
    {
      id: 2,
      textKey: "aboutTwo.feature2",
    },
    {
      id: 3,
      textKey: "aboutTwo.feature3",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Custom Animations */}
      <style>
        {`
          @keyframes slowSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes smoothBounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          .animate-slow-spin {
            animation: slowSpin 20s linear infinite;
          }
          
          .animate-smooth-bounce {
            animation: smoothBounce 3s ease-in-out infinite;
          }
        `}
      </style>

      <img
        src={wave.src}
        alt="download"
        className="absolute top-0 left-0   w-[700px]  object-contain  "
      />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
            isRTL ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Section - Left Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              {/* Main Image */}
              <img
                src={aboutImage.src}
                alt={t("aboutTwo.imageAlt")}
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />

              {/* Spinning Image - Top Right */}
              <img
                src={spinImage.src}
                alt="Spinning decoration"
                className="absolute -top-10 -right-0 w-20 h-20 md:w-32 md:h-32 object-contain animate-slow-spin"
              />

              {/* Bouncing Image - Bottom Left */}
              <img
                src={bounceImage.src}
                alt="Bouncing decoration"
                className="absolute -bottom-5 -left-5 w-20 h-20 md:w-28 md:h-28 object-contain animate-smooth-bounce"
              />
            </div>
          </div>

          {/* Content Section - Right Side */}
          <div className="w-full lg:w-1/2">
            {/* Tag */}
            <p className="text-primary text-sm md:text-base font-semibold tracking-wider mb-4 uppercase">
              {t("aboutTwo.tag")}
            </p>

            {/* Title */}
            <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t("aboutTwo.title")}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              {t("aboutTwo.description")}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base md:text-lg font-medium">
                    {t(feature.textKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group relative bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-primary/50 hover:scale-105 overflow-hidden">
              {/* Wave Effect on Hover */}
              <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out"></span>

              <span className="relative z-10">{t("aboutTwo.button")}</span>
              {isRTL ? (
                <FaArrowLeft className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
              ) : (
                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTwo;
