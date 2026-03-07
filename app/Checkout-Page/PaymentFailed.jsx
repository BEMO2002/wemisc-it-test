import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  RiSecurePaymentLine,
  RiRefreshLine,
  RiShoppingBagLine,
} from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";

const PaymentFailed = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const redirectPath = "/checkout";
  const [secondsLeft, setSecondsLeft] = useState(10);
  const toastIdRef = useRef(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Initial Toast setup
    toastIdRef.current = toast(
      () => (
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <RiSecurePaymentLine className="text-red-500" size={22} />
          <div className="text-sm font-medium">
            {t("payment_failed.toast_msg", { count: 10 })}
          </div>
        </div>
      ),
      { id: "payment-failed-toast", duration: 10000 }
    );

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !redirectedRef.current) {
          redirectedRef.current = true;
          navigate(redirectPath, { replace: true });
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      toast.dismiss("payment-failed-toast");
    };
  }, [navigate, t, isRTL]);

  // Sync Toast with countdown
  useEffect(() => {
    toast(
      () => (
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <RiSecurePaymentLine className="text-red-500" size={22} />
          <div className="text-sm">
            {t("payment_failed.toast_msg", { count: Math.max(secondsLeft, 0) })}
          </div>
        </div>
      ),
      { id: "payment-failed-toast" }
    );
  }, [secondsLeft, t, isRTL]);

  return (
    <div
      className="min-h-[80vh] px-4 py-12 mt-30 flex items-center justify-center bg-gray-50/30"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/40">
        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div
            className="h-full bg-red-600 transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 10) * 100}%` }}
          />
        </div>

        <div className="p-8 sm:p-12 text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <MdErrorOutline className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t("payment_failed.title")}
          </h1>

          <p className="text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
            {t("payment_failed.desc")}
          </p>

          {/* Countdown Indicator */}
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50/50 border border-red-100 px-4 py-2 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-sm font-medium text-gray-800">
              {t("payment_failed.redirect_text")}{" "}
              <span className="text-red-600 font-bold">
                {secondsLeft}
                {t("payment_failed.seconds")}
              </span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(redirectPath)}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              <RiRefreshLine className="text-lg animate-spin-hover group-hover:rotate-180 transition-transform duration-500" />
              {t("payment_failed.btn_retry")}
            </button>

            <button
              onClick={() => navigate("/services")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
            >
              <RiShoppingBagLine className="text-lg" />
              {t("payment_failed.btn_browse")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
