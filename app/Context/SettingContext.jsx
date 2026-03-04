"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const SettingsContext = createContext({
  settings: null,
  loading: false,
  error: null,
});

export const SettingsProvider = ({ children, initialSettings }) => {
  // initialSettings comes directly from the Server Component (layout.js)
  // This completely eliminates redundant network requests from the browser!
  const [settings, setSettings] = useState(initialSettings || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If the server passes new initialSettings (e.g., during navigation), update our state
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsProvider;
