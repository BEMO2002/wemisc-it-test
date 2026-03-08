"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { Link } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { fetchOrderDetails } from "../lib/server-api";
import { useCart } from "../Context/CartContextBase";

const Invoice = () => {
  const { orderId: paramOrderId } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Get order_id from URL params or query string
      const queryOrderId =
        searchParams.get("order_id") || searchParams.get("orderId");
      const orderId = paramOrderId || queryOrderId;

      if (!orderId) {
        setError(t("invoice.noOrderId", "No order ID provided"));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const orderData = await fetchOrderDetails(orderId);
        setOrder(orderData);

        // Clear cart after successful order load (for credit card payments)
        if (orderData) {
          clearCart();
        }
      } catch (e) {
        console.error("Failed to load order", e);
        setError(t("invoice.error", "Failed to load order details"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [paramOrderId, searchParams, t, clearCart]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid" || statusLower === "completed") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (statusLower === "failed" || statusLower === "cancelled") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-30 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
          <div className="text-gray-500">
            {t("invoice.loading", "Loading...")}
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-30 pb-12 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-6 text-lg font-semibold">{error}</p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            {t("invoice.backHome", "Back to home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-shadow {
            box-shadow: none !important;
          }
        }
      `}</style>

      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-30 pb-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Action Buttons - Hidden on Print */}
          <div className="no-print flex justify-end gap-3 mb-6">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              {t("invoice.print", "Print Invoice")}
            </button>
          </div>

          {/* Invoice Content */}
          <div
            id="invoice-content"
            className="bg-white rounded-2xl shadow-lg print-shadow overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {t("invoice.title", "Order Invoice")}
                  </h1>
                  <p className="text-green-100 text-sm">
                    {t("invoice.orderId", "Order ID")}: #{order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-sm mb-2">
                    {order.created_at}
                  </p>
                  <span
                    className={`inline-flex px-4 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.payment_status,
                    )}`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Customer & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {t("invoice.customer", "Customer Details")}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 font-semibold">
                      {order.name}
                    </p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {t("invoice.payment", "Payment")}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">
                        {t("invoice.method", "Method")}:
                      </span>{" "}
                      <span className="text-gray-600">
                        {order.payment_method}
                      </span>
                    </p>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">
                        {t("invoice.token", "Transaction Token")}:
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 break-all font-mono bg-white px-2 py-1 rounded border border-gray-200">
                      {order.transaction_token}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t("invoice.orderItems", "Order Items")}
                </h2>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className={`py-3 px-4 ${
                            isRTL ? "text-right" : "text-left"
                          } text-xs font-bold text-gray-700 uppercase tracking-wider`}
                        >
                          {t("invoice.item", "Item")}
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {t("invoice.attendees", "Attendees")}
                        </th>
                        <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {t("invoice.pricePerUnit", "Price / Attendee")}
                        </th>
                        <th
                          className={`py-3 px-4 ${
                            isRTL ? "text-left" : "text-right"
                          } text-xs font-bold text-gray-700 uppercase tracking-wider`}
                        >
                          {t("invoice.total", "Total")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items?.map((orderItem, index) => {
                        const item = orderItem.item;
                        const title =
                          locale === "ar"
                            ? item?.title_ar || item?.title_en
                            : item?.title_en || item?.title_ar;
                        return (
                          <tr
                            key={orderItem.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td
                              className={`py-3 px-4 text-sm text-gray-900 font-medium ${
                                isRTL ? "text-right" : "text-left"
                              }`}
                            >
                              {title}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">
                              {orderItem.attendees_count}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700 text-center">
                              {orderItem.price_per_unit}{" "}
                              {t("courses.currency", "EGP")}
                            </td>
                            <td
                              className={`py-3 px-4 text-sm text-gray-900 font-semibold ${
                                isRTL ? "text-left" : "text-right"
                              }`}
                            >
                              {orderItem.total} {t("courses.currency", "EGP")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t("invoice.subTotal", "Subtotal")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {order.sub_total} {t("courses.currency", "EGP")}
                      </span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t("invoice.discount", "Discount")}
                        </span>
                        <span className="font-semibold text-green-600">
                          -{order.discount_amount}{" "}
                          {t("courses.currency", "EGP")}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold text-gray-900">
                          {t("invoice.total", "Total")}
                        </span>
                        <span className="font-bold text-green-600">
                          {order.total_amount} {t("courses.currency", "EGP")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {t("invoice.thankYou", "Thank you for your order!")}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button - Hidden on Print */}
          <div className="no-print mt-6 flex justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t("invoice.backToServices", "Back to Services")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
