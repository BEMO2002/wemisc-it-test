import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  HiOutlineDesktopComputer,
  HiOutlineCloud,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { RiSettings4Line, RiCodeSSlashLine } from "react-icons/ri";
import { MdOutlineNetworkCheck } from "react-icons/md";
import wave from "../../public/Home/footer_shape_2.png";
const SpecialServices = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const services = [
    {
      id: 1,
      number: "01.",
      icon: HiOutlineDesktopComputer,
      titleKey: "specialServices.managedIT.title",
      descKey: "specialServices.managedIT.description",
    },
    {
      id: 2,
      number: "02.",
      icon: HiOutlineCloud,
      titleKey: "specialServices.cloudComputing.title",
      descKey: "specialServices.cloudComputing.description",
    },
    {
      id: 3,
      number: "03.",
      icon: HiOutlineShieldCheck,
      titleKey: "specialServices.cybersecurity.title",
      descKey: "specialServices.cybersecurity.description",
    },
    {
      id: 4,
      number: "04.",
      icon: RiSettings4Line,
      titleKey: "specialServices.itConsulting.title",
      descKey: "specialServices.itConsulting.description",
    },
    {
      id: 5,
      number: "05.",
      icon: RiCodeSSlashLine,
      titleKey: "specialServices.softwareDev.title",
      descKey: "specialServices.softwareDev.description",
    },
    {
      id: 6,
      number: "06.",
      icon: MdOutlineNetworkCheck,
      titleKey: "specialServices.networkInfra.title",
      descKey: "specialServices.networkInfra.description",
    },
  ];

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-16 relative">
      <img
        src={wave.src}
        alt="download"
        className="absolute right-0  w-[700px] h-full    object-contain  "
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <p className="text-primary text-sm md:text-base font-semibold tracking-wider mb-3 uppercase">
              {t("specialServices.subtitle")}
            </p>
            <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-4xl font-bold leading-tight">
              {t("specialServices.title1")}{" "}
              <span className="text-primary">
                {t("specialServices.titleHighlight")}
              </span>
            </h2>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-md hover:shadow-xl"
              >
                {/* Number Badge */}
                <div
                  className={
                    isRTL
                      ? "absolute top-6 left-6 text-gray-300 text-lg font-bold"
                      : "absolute top-6 right-6 text-gray-300 text-lg font-bold"
                  }
                >
                  {service.number}
                </div>

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-gray-900 text-xl md:text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                    {t(service.descKey)}
                  </p>
                </div>

                {/* Bottom Glow Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialServices;
