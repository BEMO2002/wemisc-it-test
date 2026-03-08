
import { useEffect } from "react";

const useInjectScripts = (scriptsObj) => {
  useEffect(() => {
    if (!scriptsObj) return;

    Object.entries(scriptsObj).forEach(([key, code]) => {

      if (!code || typeof code !== "string") return;

      const scriptId = `dynamic-pixel-${key}`;

      if (document.getElementById(scriptId)) return;

      const srcMatch = code.match(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/i);
      if (srcMatch) {
        const srcScript = document.createElement("script");
        srcScript.id = scriptId;
        srcScript.src = srcMatch[1];
        srcScript.async = true;
        document.head.appendChild(srcScript);
      }

      const inlineMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (inlineMatch) {
        const inlineScript = document.createElement("script");
        inlineScript.id = `${scriptId}-inline`; 
        inlineScript.text = inlineMatch[1];
        document.head.appendChild(inlineScript);
      }
      

      const noscriptMatch = code.match(/<noscript[^>]*>([\s\S]*?)<\/noscript>/i);
      if (noscriptMatch) {
        const noscriptElement = document.createElement("noscript");
        noscriptElement.innerHTML = noscriptMatch[1];
        document.body.appendChild(noscriptElement); 
      }
    });

  }, [scriptsObj]);
};

export { useInjectScripts };
