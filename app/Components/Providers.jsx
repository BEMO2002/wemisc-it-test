"use client";

import { Toaster } from "react-hot-toast";
import ApiAuthContextProvider from "../Context/AuthContext";
import { CartProvider } from "../Context/CartContext";
import SettingsProvider from "../Context/SettingContext";

export default function Providers({ children, initialSettings }) {
  return (
    <ApiAuthContextProvider>
      <SettingsProvider initialSettings={initialSettings}>
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4ade80",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </CartProvider>
      </SettingsProvider>
    </ApiAuthContextProvider>
  );
}
