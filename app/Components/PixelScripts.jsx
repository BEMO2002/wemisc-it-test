"use client";
import { useState, useEffect } from "react";
import { fetchPixelsScripts } from "../lib/server-api";
import { useInjectScripts } from "../Components/useInjectScripts.js";
import { usePathname } from "next/navigation";

const PixelScripts = () => {
  const pathname = usePathname();
  const [pixelsData, setPixelsData] = useState([]);

  useEffect(() => {
    const getPixels = async () => {
      try {
        const data = await fetchPixelsScripts();
        setPixelsData(data);
      } catch (err) {
        console.error("Error fetching scripts:", err);
      }
    };
    getPixels();
  }, [pathname]);

  useInjectScripts(pixelsData);
  return null;
};

export default PixelScripts;
