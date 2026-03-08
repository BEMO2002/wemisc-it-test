"use client";
import React, { useState, useEffect } from "react";
import { useSettings } from "../Context/SettingContext";
import ParticleNetwork from "./ParticleNetwork";
import "./Loader.css";

const Loader = () => {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "unset";
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className="loader-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <ParticleNetwork />
      <div className="macbook">
        <div className="mac-inner">
          <div className="mac-screen">
            <div className="screen-face">
              <div className="camera" />
              <div className="mac-display">
                <div className="display-shade" />
                {settings?.main_logo_dark && (
                  <img
                    src={settings.main_logo_dark}
                    alt="Company Logo"
                    className="logo-display w-[70%] h-auto max-h-[50%] object-contain relative z-[2]"
                  />
                )}
              </div>
              <span className="absolute top-[255px] md:top-[255px] left-1/2 -translate-x-1/2 text-sm font-medium text-gray-400 whitespace-nowrap">
                Loading...
              </span>
            </div>
            <div className="apple-logo">
              {/* Added explicit width/height to avoid giant flash before CSS loads */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="40"
                height="40"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </div>
          </div>
          <div className="macbody">
            <div className="body-face">
              <div className="mac-touchpad" />
              <div className="mac-keyboard">
                {[...Array(59)].map((_, i) => (
                  <div
                    key={i}
                    className={`mac-key ${i === 5 ? "space" : ""}`}
                  />
                ))}
                {[...Array(16)].map((_, i) => (
                  <div key={i + 100} className="mac-key f" />
                ))}
              </div>
            </div>
            <div className="mac-pad one" />
            <div className="mac-pad two" />
            <div className="mac-pad three" />
            <div className="mac-pad four" />
          </div>
        </div>
        <div className="loader-shadow" />
      </div>
    </div>
  );
};

export default Loader;
