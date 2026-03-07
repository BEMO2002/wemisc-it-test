import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  RiSecurePaymentLine,
  RiHome4Line,
  RiShoppingBagLine,
} from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";

const PaymentCanceled = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(10);
  const toastIdRef = useRef(null);
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Initial Toast
    toastIdRef.current = toast(
      (t_obj) => (
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <RiSecurePaymentLine className="text-red-500" size={22} />
          <div className="text-sm font-medium">
            {t("payment.toast_msg", { count: 10 })}
          </div>
        </div>
      ),
      { id: "payment-cancel-toast", duration: 10000 }
    );

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;

        if (next <= 0 && !redirectedRef.current) {
          redirectedRef.current = true;
          navigate("/Checkout", { replace: true });
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      toast.dismiss("payment-cancel-toast");
    };
  }, [navigate, t, isRTL]);

  // Update toast text when secondsLeft changes
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
            {t("payment.toast_msg", { count: Math.max(secondsLeft, 0) })}
          </div>
        </div>
      ),
      { id: "payment-cancel-toast" }
    );
  }, [secondsLeft, t, isRTL]);

  return (
    <div
      className="min-h-[80vh] px-4 py-12 mt-30 flex items-center justify-center bg-gray-50/50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 10) * 100}%` }}
          />
        </div>

        <div className="p-8 sm:p-12 text-center">
          {/* Icon Header */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <MdOutlineCancel className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t("payment.canceled_title")}
          </h1>

          <p className="text-gray-500 leading-relaxed mb-8">
            {t("payment.canceled_desc")}
          </p>

          {/* Timer Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">
              {t("payment.redirect_text")}{" "}
              <span className="text-red-600 font-bold">
                {secondsLeft}
                {t("payment.seconds")}
              </span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/services")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              <RiShoppingBagLine className="text-lg" />
              {t("payment.btn_browse")}
            </button>

            <button
              onClick={() => navigate("/", { replace: true })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]"
            >
              <RiHome4Line className="text-lg" />
              {t("payment.btn_home")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceled;
