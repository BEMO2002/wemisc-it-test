"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";
import { ApiAuthContext } from "../../AuthContext";
import { useCart } from "../Context/CartContextBase";
import { useRouter, Link } from "../../i18n/routing";
import toast from "react-hot-toast";
import instapay from "../../public/Home/InstaPay_Logo.png";
const Checkout = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { XTenantID, XApiKey, baseUrl } = useContext(ApiAuthContext);
  const { items, subTotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    payment_method_code: "",
    coupon_code: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [couponResult, setCouponResult] = useState(null);

  const [showInstapayModal, setShowInstapayModal] = useState(false);
  const [instapayData, setInstapayData] = useState(null);
  const [selectedReceiptFile, setSelectedReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const isCartEmpty = !items || items.length === 0;

  const headers = useMemo(
    () => ({
      "X-Tenant-ID": XTenantID,
      "X-API-KEY": XApiKey,
    }),
    [XTenantID, XApiKey],
  );

  // Redirect if cart is empty
  useEffect(() => {
    if (isCartEmpty) {
      // Check localStorage to avoid redirecting while context is initializing from storage
      const stored = localStorage.getItem("wemisk_cart");
      let hasStoredItems = false;
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            hasStoredItems = true;
          }
        }
      } catch (e) {
        // ignore error
      }

      if (!hasStoredItems) {
        router.replace("/", { locale });
        toast.error(t("checkout.emptyCart", "Your cart is empty"));
      }
    }
  }, [isCartEmpty, router, t]);

  useEffect(() => {
    const fetchMethods = async () => {
      setLoadingMethods(true);
      try {
        const res = await axios.get(`${baseUrl}/payment-methods`, {
          headers,
        });
        // Filter only active payment methods (status === 1)
        const allMethods = res.data?.data || [];
        const activeMethods = allMethods.filter(
          (method) => method.status === 1,
        );
        setPaymentMethods(activeMethods);
        // Set default payment method if available
        if (activeMethods.length > 0) {
          setForm((prev) => {
            if (!prev.payment_method_code) {
              return {
                ...prev,
                payment_method_code: activeMethods[0].code,
              };
            }
            // Ensure selected method is still active
            const isStillActive = activeMethods.some(
              (m) => m.code === prev.payment_method_code,
            );
            if (!isStillActive) {
              return {
                ...prev,
                payment_method_code: activeMethods[0].code,
              };
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Failed to load payment methods", e);
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchMethods();
  }, [baseUrl, headers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!form.coupon_code?.trim()) {
      toast.error(t("checkout.couponRequired", "Please enter a coupon code"));
      return;
    }
    try {
      const res = await axios.post(
        `${baseUrl}/check-coupon`,
        {
          coupon_code: form.coupon_code.trim(),
          items: items.map((it) => ({
            item_id: Number(it.item_id),
            attendees: Number(it.attendees),
          })),
        },
        { headers },
      );

      // Check if response is successful (code 200)
      if (res.data?.code === 200 && res.data?.data) {
        setCouponResult(res.data.data);
        toast.success(
          t("checkout.couponApplied", "Coupon applied successfully"),
        );
      } else {
        // If code is not 200, treat as error
        setCouponResult(null);
        const errorMsg =
          res.data?.coupon_code ||
          t("checkout.couponError", "Invalid coupon code");
        toast.error(errorMsg);
      }
    } catch (e) {
      console.error("Failed to apply coupon", e);
      setCouponResult(null);

      // Handle validation errors (422)
      if (e.response?.status === 422) {
        const validationErrors = e.response?.data?.data || {};
        const errorMessages = Object.values(validationErrors).flat();
        const errorMessage =
          errorMessages.join(", ") ||
          t("checkout.couponError", "Invalid coupon code");
        toast.error(errorMessage);
      } else {
        toast.error(t("checkout.couponError", "Invalid coupon code"));
      }
    }
  };

  const finalTotals = useMemo(() => {
    if (couponResult) {
      return {
        subTotal: couponResult.sub_total,
        discount: couponResult.discount,
        total: couponResult.total_amount,
      };
    }
    return {
      subTotal,
      discount: 0,
      total: subTotal,
    };
  }, [couponResult, subTotal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCartEmpty) {
      toast.error(t("checkout.emptyCart", "Your cart is empty"));
      return;
    }
    if (!form.payment_method_code) {
      toast.error(
        t("checkout.selectPaymentMethod", "Please select a payment method"),
      );
      return;
    }
    if (items.some((it) => !it.item_id || !it.attendees)) {
      toast.error(t("checkout.invalidItems", "Invalid items in cart"));
      return;
    }
    setSubmitting(true);
    try {
      // Ensure payment_method_code is valid and trimmed
      const selectedMethod = paymentMethods.find(
        (m) => m.code === form.payment_method_code?.trim(),
      );
      if (!selectedMethod) {
        toast.error(
          t("checkout.invalidPaymentMethod", "Invalid payment method selected"),
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        payment_method_code: selectedMethod.code.trim(),
        coupon_code: form.coupon_code?.trim() || null,
        items: items.map((it) => ({
          item_id: Number(it.item_id),
          attendees: Number(it.attendees),
        })),
      };

      console.log("Checkout payload:", payload);
      console.log("Selected payment method:", selectedMethod);

      const res = await axios.post(`${baseUrl}/checkout`, payload, {
        headers,
      });

      const data = res.data?.data;
      if (!data) {
        throw new Error("No data in checkout response");
      }

      const { order_id, transaction_token, payment_method, status, action } =
        data;

      // Special handling for credit card payment (HTML in transfer_details)
      if (payment_method === "creditcard" && data.transfer_details) {
        const html = data.transfer_details;
        if (typeof html === "string" && html.toLowerCase().includes("<html")) {
          // Replace current document with the HTML from backend (go to payment page)
          document.open();
          document.write(html);
          document.close();
          return;
        }
      }

      if (payment_method === "instapay" && action === "upload_receipt") {
        setInstapayData({
          order_id,
          transaction_token,
          transfer_details: data.transfer_details,
        });
        setShowInstapayModal(true);
        toast.success(
          t(
            "checkout.instapayInstructions",
            "Please complete the transfer then upload the receipt.",
          ),
        );
      } else if (status === "paid") {
        clearCart();
        router.push(`/invoice/${order_id}`);
      } else if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.success(res.data?.message || "Order created");
      }
    } catch (error) {
      console.error("Checkout error", error);
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.data || {};
        const errorMessages = Object.values(validationErrors).flat();
        const errorMessage =
          errorMessages.join(", ") ||
          t("checkout.validationError", "Validation error");
        toast.error(errorMessage);
      } else {
        toast.error(t("checkout.error", "Failed to create order"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedReceiptFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!instapayData || !selectedReceiptFile) return;

    setUploadingReceipt(true);
    const formData = new FormData();
    formData.append("order_id", instapayData.order_id);
    formData.append("transaction_token", instapayData.transaction_token);
    formData.append("receipt", selectedReceiptFile);

    try {
      const res = await axios.post(`${baseUrl}/upload-receipt`, formData, {
        headers,
      });
      toast.success(
        res.data?.message ||
          t("checkout.receiptUploaded", "Receipt uploaded successfully"),
      );
      setShowInstapayModal(false);
      setSelectedReceiptFile(null);
      setReceiptPreview(null);
      clearCart();
      router.push(`/invoice?order_id=${instapayData.order_id}`);
    } catch (e) {
      console.error("Upload receipt error", e);
      toast.error(
        t("checkout.uploadError", "Failed to upload payment receipt"),
      );
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className=" bg-gray-50 py-30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t("checkout.title", "Checkout")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white  rounded-2xl shadow-sm p-6 lg:col-span-2 space-y-10"
          >
            <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("checkout.name", "Full name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("checkout.email", "Email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("checkout.phone", "Phone")}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("checkout.coupon", "Coupon code")}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="coupon_code"
                  value={form.coupon_code}
                  onChange={(e) => {
                    handleChange(e);
                    // Clear coupon result when user changes the coupon code
                    if (couponResult) {
                      setCouponResult(null);
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={t(
                    "checkout.couponPlaceholder",
                    "Enter coupon code (optional)",
                  )}
                />
                {couponResult ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCouponResult(null);
                      setForm((prev) => ({ ...prev, coupon_code: "" }));
                      toast.success(
                        t("checkout.couponRemoved", "Coupon removed"),
                      );
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                  >
                    {t("checkout.removeCoupon", "Remove")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
                  >
                    {t("checkout.applyCoupon", "Apply")}
                  </button>
                )}
              </div>
              {couponResult && (
                <p className="mt-2 text-sm text-green-600">
                  {t(
                    "checkout.couponAppliedSuccess",
                    "Coupon applied successfully! Discount:",
                  )}{" "}
                  {couponResult.discount} {t("courses.currency", "EGP")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                submitting ||
                isCartEmpty ||
                !form.payment_method_code ||
                loadingMethods
              }
              className={`w-full py-3 rounded-full font-semibold mt-4 ${
                submitting ||
                isCartEmpty ||
                !form.payment_method_code ||
                loadingMethods
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              } transition`}
            >
              {submitting
                ? t("checkout.submitting", "Processing...")
                : t("checkout.submit", "Place order")}
            </button>
          </form>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("checkout.orderSummary", "Order summary")}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("checkout.subTotal", "Subtotal")}</span>
                  <span>
                    {finalTotals.subTotal} {t("courses.currency", "EGP")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("checkout.discount", "Discount")}</span>
                  <span>
                    {finalTotals.discount} {t("courses.currency", "EGP")}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>{t("checkout.total", "Total")}</span>
                  <span>
                    {finalTotals.total} {t("courses.currency", "EGP")}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("checkout.paymentMethods", "Available payment methods")}
              </h3>
              {loadingMethods ? (
                <p className="text-sm text-gray-500">
                  {t("checkout.loadingMethods", "Loading payment methods...")}
                </p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.payment_method_code === method.code
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="payment_method_code"
                        value={method.code}
                        checked={form.payment_method_code === method.code}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm((prev) => ({
                              ...prev,
                              payment_method_code: method.code,
                            }));
                          }
                        }}
                        className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                      />
                      {method.banner_en || method.banner_ar ? (
                        <img
                          src={
                            locale === "ar"
                              ? method.banner_ar || method.banner_en
                              : method.banner_en || method.banner_ar
                          }
                          alt={method.title_en}
                          className="w-16 h-16 object-contain"
                        />
                      ) : null}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {locale === "ar"
                            ? method.title_ar || method.title_en
                            : method.title_en || method.title_ar}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInstapayModal && instapayData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {t("checkout.instapayTitle", "InstaPay payment")}
              </h3>
              <img
                src={instapay}
                alt="instapay"
                className="w-30 h-30 object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {t(
                "checkout.instapayText",
                "Please use the following link to complete the transfer, then upload the payment receipt.",
              )}
            </p>
            <a
              href={instapayData.transfer_details}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-600 underline break-all mb-6 hover:text-blue-700"
            >
              {instapayData.transfer_details}
            </a>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("checkout.uploadReceipt", "Upload payment receipt")}
              </label>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedReceiptFile
                        ? selectedReceiptFile.name
                        : t("checkout.selectImage", "Click to select an image")}
                    </p>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {receiptPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t("checkout.preview", "Preview")}
                  </p>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReceiptFile(null);
                        setReceiptPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
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
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowInstapayModal(false);
                  setSelectedReceiptFile(null);
                  setReceiptPreview(null);
                }}
              >
                {t("common.close", "Close")}
              </button>
              <button
                type="button"
                onClick={handleUploadReceipt}
                disabled={!selectedReceiptFile || uploadingReceipt}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  !selectedReceiptFile || uploadingReceipt
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {uploadingReceipt
                  ? t("checkout.uploading", "Uploading...")
                  : t("checkout.send", "Send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
