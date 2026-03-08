"use client";
import React, { useEffect, useState } from "react";
import { GrLinkTop } from "react-icons/gr";

export const Top = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const radius = 20; 
  const circumference = 2 * Math.PI * radius; 

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsVisible(scrollY > 400);


      const currentProgress = (scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 flex items-center justify-center w-14 h-14 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <svg className="absolute transform -rotate-90 w-full h-full">

        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#e2e8f0" 
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor" 
          strokeWidth="4"
          fill="transparent"
          className="text-primary transition-all duration-150 ease-out" 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      <GrLinkTop className="relative z-10 text-primary text-xl" />
    </button>
  );
};
