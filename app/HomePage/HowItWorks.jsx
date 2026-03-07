import React from "react";
import { useTranslations, useLocale } from "next-intl";
import selectImage from "../../public/Home/select .png";
import projectImage from "../../public/Home/project.png";
import planImage from "../../public/Home/plan.png";
import deliverImage from "../../public/Home/Deliver.png";

const HowItWorks = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const steps = [
    {
      id: 1,
      image: selectImage,
      titleKey: "howItWorks.step1.title",
      descKey: "howItWorks.step1.description",
      defaultTitle: "Select a project",
      defaultDesc:
        "Continua scale empowered metrics with cost effective innovation.",
    },
    {
      id: 2,
      image: projectImage,
      titleKey: "howItWorks.step2.title",
      descKey: "howItWorks.step2.description",
      defaultTitle: "Project analysis",
      defaultDesc:
        "Continua scale empowered metrics with cost effective innovation.",
    },
    {
      id: 3,
      image: planImage,
      titleKey: "howItWorks.step3.title",
      descKey: "howItWorks.step3.description",
      defaultTitle: "Plan Execute",
      defaultDesc:
        "Continua scale empowered metrics with cost effective innovation.",
    },
    {
      id: 4,
      image: deliverImage,
      titleKey: "howItWorks.step4.title",
      descKey: "howItWorks.step4.description",
      defaultTitle: "Deliver result",
      defaultDesc:
        "Continua scale empowered metrics with cost effective innovation.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-wider mb-3 uppercase">
            {t("howItWorks.tag", "WORK PROCESS")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("howItWorks.title1", "How To Work")}{" "}
            <span className="text-primary">
              {t("howItWorks.title2", "It!")}
            </span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 h-full flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="mb-6 relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <img
                        src={step.image.src}
                        alt={t(step.titleKey, step.defaultTitle)}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                    {t(step.titleKey, step.defaultTitle)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t(step.descKey, step.defaultDesc)}
                  </p>

                  {/* Hover Effect Border */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Dot */}
        <div className="flex justify-center mt-12">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
