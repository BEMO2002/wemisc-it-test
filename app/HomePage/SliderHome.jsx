"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useTranslations, useLocale } from "next-intl";
import "swiper/css";
import "swiper/css/pagination";

const SliderHome = ({ initialSliders = [] }) => {
  const t = useTranslations();
  const locale = useLocale();

  const isRTL = locale === "ar";
  const sliders = initialSliders;

  const handleSlideClick = (link) => {
    if (link) {
      window.open(link, "_self");
    }
  };

  if (sliders.length === 0) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-third/10">
        <div className="text-center text-baseTwo">
          <h2 className="text-2xl font-bold mb-4">
            {t("slider.error", "No Sliders Available")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Slider Component */}
      <div className="relative pt-32 md:pt-10 h-screen overflow-hidden">
        <img
          src="/Home/about_4_3.png"
          alt="spinner"
          className="absolute bottom-10 left-5 w-40 h-40 object-contain hidden md:block"
        />
        <img
          src="/Home/about_4_2.png"
          alt="spinner"
          className="absolute top-30 right-5 w-60 h-60 object-contain hidden md:block"
        />

        <img
          src="/Home/hero_shape_1_3.svg"
          alt="wave"
          className="absolute top-0 left-0 w-[1200px] object-contain"
        />

        <Swiper
          key="main-slider"
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
          dir="ltr"
        >
          {sliders.map((slider) => (
            <SwiperSlide key={slider.id}>
              <div className="relative h-full w-full max-w-[1600px] mx-auto">
                <div className="h-full flex flex-col lg:flex-row gap-4 items-center justify-start lg:justify-center pt-4 md:pt-0">
                  {/* Text Content - Left Side */}
                  <div
                    className={`flex items-center justify-center p-8 lg:p-12 ${
                      isRTL ? "lg:order-1" : "lg:order-1"
                    }`}
                  >
                    <div
                      className={`md:max-w-2xl max-w-full ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {/* Title */}
                      <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-baseTwo mb-4 leading-tight">
                        <span className="">
                          {isRTL ? slider.title_ar : slider.title_en}
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="text-gray-500 text-base md:text-xl mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">
                        {isRTL
                          ? slider.meta_description_ar
                          : slider.meta_description_en}
                      </p>

                      {/* Action Button */}
                      {slider.link && (
                        <div
                          className={`flex gap-2 ${
                            isRTL ? "justify-end" : "justify-start"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSlideClick(slider.link);
                            }}
                            className="group/btn cursor-pointer inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-baseTwo to-primary hover:from-baseTwo hover:to-primary text-white font-semibold rounded-full transition-all duration-300 transform hover:shadow-2xl"
                          >
                            <span>{t("slider.learnMore", "Learn More")}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image/Video Content - Right Side */}
                  <div
                    className={`flex items-center justify-center p-4 lg:p-5 ${
                      isRTL ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="relative w-full h-[35vh] lg:h-[560px] lg:max-h-full">
                      {/* Check if banner is video or image */}
                      {(() => {
                        const bannerUrl = isRTL
                          ? slider.banner_ar
                          : slider.banner_en;
                        const isVideo =
                          bannerUrl?.toLowerCase().endsWith(".mp4") ||
                          bannerUrl?.toLowerCase().endsWith(".webm") ||
                          bannerUrl?.toLowerCase().endsWith(".mov");

                        if (isVideo) {
                          return (
                            <video
                              src={bannerUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-contain rounded-lg"
                            />
                          );
                        } else {
                          return (
                            <img
                              src={bannerUrl}
                              alt={isRTL ? slider.title_ar : slider.title_en}
                              className="w-full h-full object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Pagination */}
        <div className="swiper-pagination !bottom-8 !left-1/2 !-translate-x-1/2"></div>
      </div>
    </>
  );
};

export default SliderHome;
