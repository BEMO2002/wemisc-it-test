import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { PiCodeLight } from "react-icons/pi";
const StarIcon = () => <PiCodeLight className="text-yellow-600" size={30} />;

const InfinitySlider = () => {
  const t = useTranslations();
  const locale = useLocale();

  const items = t.raw("infinitySlider.items", { returnObjects: true });
  const words = typeof items === "object" ? Object.values(items) : [];

  const loopWords = [...words, ...words, ...words, ...words];

  const isRTL = locale === "ar";

  return (
    <div className="relative w-full overflow-hidden py-20 bg-white" dir="ltr">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
            will-change: transform;
          }
          .animate-infinite-scroll:hover {
             animation-play-state: paused;
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center">
        {/* Background Layer (Orange) */}
        <div className="absolute w-full h-16 md:h-20 bg-primary -rotate-1 transform origin-center shadow-lg" />

        {/* Foreground Layer (White) */}
        <div className="relative w-full bg-white py-4 md:py-6 -rotate-5 flex items-center shadow-lg transform origin-center border-y border-black/10">
          <div className="animate-infinite-scroll flex items-center">
            {loopWords.map((word, index) => (
              <div key={index} className="flex items-center">
                <span className="text-black text-xl md:text-xl font-bold uppercase whitespace-nowrap tracking-tight px-4">
                  {word}
                </span>
                <StarIcon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfinitySlider;
