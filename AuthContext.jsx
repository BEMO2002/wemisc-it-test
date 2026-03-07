"use client";
import React, { createContext, useState, useEffect } from "react";

export const ApiAuthContext = createContext(0);

export default function ApiAuthContextProvider({ children }) {
  const [XTenantID, setXTenantID] = useState(13);
  const [XApiKey, setXApiKey] = useState("P4OIp8prRKBeO0kogfGViTNzmAT8UnzL");
  const [baseUrl, setBaseUrl] = useState(
    "https://dashboard.wemisc.net/public/api/v1",
  );
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <ApiAuthContext.Provider
      value={{
        XTenantID,
        setXTenantID,
        XApiKey,
        setXApiKey,
        baseUrl,
        setBaseUrl,
        token,
        setToken,
      }}
    >
      {children}
    </ApiAuthContext.Provider>
  );
}
