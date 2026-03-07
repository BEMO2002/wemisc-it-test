"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "../../i18n/routing";
import { useCart } from "../Context/CartContextBase";
import { FaRegTrashAlt } from "react-icons/fa";

const Cart = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { items, updateAttendees, removeItem, subTotal } = useCart();

  const handleChangeAttendees = (itemId, value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      updateAttendees(itemId, 1);
    } else {
      updateAttendees(itemId, parsed);
    }
  };

  const isEmpty = !items || items.length === 0;

  return (
    <div className=" pt-10 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-primary">
          {t("cart.title")}
        </h1>

        {isEmpty ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">{t("cart.empty")}</p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition"
            >
              {t("cart.browseServices")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const unitPrice = Number(item.price || 0);
                const attendees = Number(item.attendees || 0);
                const rowTotal = unitPrice * attendees;
                const title =
                  locale === "ar"
                    ? item.title_ar || item.title_en
                    : item.title_en || item.title_ar;
                const banner =
                  locale === "ar"
                    ? item.banner_ar || item.banner_en
                    : item.banner_en || item.banner_ar;

                return (
                  <div
                    key={item.item_id}
                    className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {banner ? (
                        <img
                          src={banner}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          {t("cart.noImage")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {t("cart.pricePerPerson")}:{" "}
                        <span className="font-semibold">
                          {unitPrice} {t("courses.currency")}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center justify-around gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {t("cart.attendees")}:
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={attendees}
                            onChange={(e) =>
                              handleChangeAttendees(
                                item.item_id,
                                e.target.value,
                              )
                            }
                            className="w-20 border border-gray-300 rounded-lg py-1 px-2 text-center text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.item_id)}
                          className="text-sm text-red-600 cursor-pointer hover:text-red-600"
                        >
                          <FaRegTrashAlt className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{t("cart.total")}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {rowTotal} {t("courses.currency")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-32">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-primary">
                  {t("cart.summary")}
                </h3>
                <div className="flex justify-between items-center mb-6 py-4 border-y border-gray-100">
                  <span className="text-gray-600 font-medium">
                    {t("cart.subTotal")}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {subTotal} {t("courses.currency")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  disabled={isEmpty}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                    isEmpty
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {t("cart.goToCheckout")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
