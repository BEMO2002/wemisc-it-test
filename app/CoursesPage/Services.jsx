"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import { useSettings } from "../Context/SettingContext";
import {
  fetchItems,
  fetchItemTypes,
  fetchItemTypeItems,
} from "../lib/server-api";
const Services = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [itemTypes, setItemTypes] = useState([]);
  const initialTypeId = parseInt(searchParams.get("type")) || null;
  const [selectedTypeId, setSelectedTypeId] = useState(initialTypeId);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const initialPage = parseInt(searchParams.get("p")) || 1;
  const [page, setPage] = useState(initialPage);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10,
  });

  const isRTL = locale === "ar";
  const currentLang = locale || "en";

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await fetchItemTypes();
        const sorted = (Array.isArray(typesData) ? typesData : [])
          .slice()
          .sort((a, b) => {
            const aOrder = Number(
              a?.order ?? a?.feature_order ?? a?.priority ?? Infinity,
            );
            const bOrder = Number(
              b?.order ?? b?.feature_order ?? b?.priority ?? Infinity,
            );
            if (aOrder !== bOrder) return aOrder - bOrder;
            const aDate = new Date(a?.created_at ?? 0).getTime();
            const bDate = new Date(b?.created_at ?? 0).getTime();
            return bDate - aDate;
          });

        setItemTypes(sorted);
      } catch (err) {
        console.error("Error fetching item types:", err);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = (searchInput || "").trim();
      if (next !== searchQuery) {
        setSearchQuery(next);
        setPage(1);
      }
    }, 450);

    return () => clearTimeout(handle);
  }, [searchInput, searchQuery]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setItems([]); // Clear current items to trigger skeleton loader for a smoother transition
      setError(null);
      try {
        const params = { search: searchQuery, page };
        const data = selectedTypeId
          ? await fetchItemTypeItems(selectedTypeId, params)
          : await fetchItems(params);

        // The endpoint /item-type-items/{id} has a slightly different structure in data.items
        const itemsPagination = data?.items || null;

        const list = Array.isArray(itemsPagination?.data)
          ? itemsPagination.data
          : [];

        const sorted = list.slice().sort((a, b) => {
          const aOrder = Number(
            a?.order ?? a?.feature_order ?? a?.priority ?? Infinity,
          );
          const bOrder = Number(
            b?.order ?? b?.feature_order ?? b?.priority ?? Infinity,
          );
          if (aOrder !== bOrder) return aOrder - bOrder;
          const aDate = new Date(a?.created_at ?? 0).getTime();
          const bDate = new Date(b?.created_at ?? 0).getTime();
          return bDate - aDate;
        });

        setItems(sorted);

        if (itemsPagination && typeof itemsPagination === "object") {
          setPagination({
            current_page: Number(itemsPagination.current_page || page || 1),
            last_page: Number(itemsPagination.last_page || 1),
            from: Number(itemsPagination.from || 0),
            to: Number(itemsPagination.to || 0),
            total: Number(itemsPagination.total || sorted.length || 0),
            per_page: Number(itemsPagination.per_page || 10),
          });
        } else {
          setPagination({
            current_page: 1,
            last_page: 1,
            from: sorted.length ? 1 : 0,
            to: sorted.length,
            total: sorted.length,
            per_page: sorted.length,
          });
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(
          t.has("courses.loadError")
            ? t("courses.loadError")
            : "Failed to load courses",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchQuery, page, selectedTypeId]);

  // Sync state to URL
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (page > 1) nextParams.set("p", page.toString());
    else nextParams.delete("p");

    if (selectedTypeId) nextParams.set("type", selectedTypeId.toString());
    else nextParams.delete("type");

    if (searchQuery) nextParams.set("q", searchQuery);
    else nextParams.delete("q");

    // In Next.js App Router, we trigger a soft navigation
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [page, selectedTypeId, searchQuery, pathname, router]);

  // Sync URL to state (for browser back/forward)
  useEffect(() => {
    const p = parseInt(searchParams.get("p")) || 1;
    if (p !== page) setPage(p);

    const type = parseInt(searchParams.get("type")) || null;
    if (type !== selectedTypeId) setSelectedTypeId(type);

    const q = searchParams.get("q") || "";
    if (q !== searchInput) setSearchInput(q);
  }, [searchParams]);

  const displayItems = items;

  return (
    <>
      <section className="relative  pt-16 px-4 md:px-8 min-h-screen overflow-hidden  py-10">
        {/* Animated Particle Network Background */}
        {/* <ParticleNetwork /> */}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-4xl text-primary md:text-5xl font-bold mb-2">
              {t("headServices.title", "Our Services")}
            </h2>

            <div className="w-32 md:w-48 text-primary">
              <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 10 Q12.5 0 25 10 T50 10 T75 10 T100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div> */}

          {/* Filter Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className={`w-full md:w-[360px] ${isRTL ? "" : ""}`}>
              <div className="relative">
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    t.has("courses.searchPlaceholder")
                      ? t("courses.searchPlaceholder")
                      : "Search Courses..."
                  }
                  className={`w-full rounded-xl border placeholder:text-primary border-primary bg-[#f5f5f5] px-4 py-3 text-sm md:text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    isRTL ? "pr-12" : "pl-12"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-primary ${
                    isRTL ? "right-4" : "left-4"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
              </div>
            </div>
            <div
              className={`text-sm hidden md:block md:text-base font-medium text-gray-700 ${
                isRTL ? "" : ""
              }`}
            >
              {t.has("courses.showing") ? t("courses.showing") : "Showing"}{" "}
              {pagination.from}-{pagination.to}{" "}
              {t.has("courses.of") ? t("courses.of") : "Of"} {pagination.total}{" "}
              {t.has("courses.results") ? t("courses.results") : "Results"}
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center gap-3 mb-10 ${
              isRTL ? "" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedTypeId(null);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
                selectedTypeId === null
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200 hover:border-primary"
              }`}
            >
              {t.has("headServices.all") ? t("headServices.all") : "All"}
            </button>

            {itemTypes.map((type) => {
              const typeId = type?.id;
              const typeTitle =
                currentLang === "ar" ? type?.title_ar : type?.title_en;

              if (!typeId) return null;

              return (
                <button
                  key={typeId}
                  type="button"
                  onClick={() => {
                    setSelectedTypeId(typeId);
                    setPage(1);
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
                    selectedTypeId === typeId
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  {typeTitle}
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          {error ? (
            <div className="text-center font-bold text-xl my-8 text-red-600">
              {error}
            </div>
          ) : loading && items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }, (_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 animate-pulse"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200" />
                  <div className="p-6">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center font-medium text-gray-600">
              {t.has("courses.noCourses")
                ? t("courses.noCourses")
                : "No courses found"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayItems.map((item) => {
                const title =
                  currentLang === "ar" ? item.title_ar : item.title_en;
                const shortDesc =
                  currentLang === "ar"
                    ? item.short_description_ar
                    : item.short_description_en;
                const typeTitle =
                  currentLang === "ar"
                    ? item.item_type?.title_ar
                    : item.item_type?.title_en;

                const slug = currentLang === "ar" ? item.slug_ar : item.slug_en;

                const priceValue = Number(item?.price);
                const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
                const priceLabel = hasPrice
                  ? `${priceValue} ${t.has("courses.currency") ? t("courses.currency") : "EGP"} `
                  : t.has("courses.free")
                    ? t("courses.free")
                    : "Free";

                return (
                  <Link
                    href={`/courses/${slug}`}
                    key={item.id}
                    className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-primary/20"
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={
                          currentLang === "ar" ? item.banner_ar : item.banner_en
                        }
                        alt={title}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                        loading="lazy"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Category Badge - Top Left */}
                      <div
                        className={`absolute top-4 ${
                          isRTL ? "right-4" : "left-4"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            <path d="M2 12a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
                          </svg>
                          {typeTitle}
                        </span>
                      </div>

                      {/* Price Badge - Top Right */}
                      <div
                        className={`absolute top-4 ${
                          isRTL ? "left-4" : "right-4"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2 text-xs font-extrabold text-white shadow-xl">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {priceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/50">
                      {/* Title with Gradient on Hover */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                        {shortDesc}
                      </p>

                      {/* Footer with Animated Button */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium mb-1">
                              {t("courses.viewDetails", "View Details")}
                            </span>
                            <span className="text-primary font-extrabold text-lg">
                              {priceLabel}
                            </span>
                          </div>

                          {/* Animated Arrow Button */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white group-hover:scale-110 group-hover:rotate-45 transition-all duration-300 shadow-md group-hover:shadow-lg">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accent Border on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"></div>
                  </Link>
                );
              })}
            </div>
          )}

          {pagination.last_page > 1 ? (
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
              >
                {t.has("courses.prev") ? t("courses.prev") : "Previous"}
              </button>

              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter((p) => {
                  if (pagination.last_page <= 7) return true;
                  if (p === 1 || p === pagination.last_page) return true;
                  return Math.abs(p - pagination.current_page) <= 2;
                })
                .reduce((acc, p, idx, arr) => {
                  const prev = arr[idx - 1];
                  if (idx > 0 && prev && p - prev > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      type="button"
                      onClick={() => setPage(Number(p))}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                        pagination.current_page === p
                          ? "bg-primary text-white border-primary"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                type="button"
                onClick={() => {
                  setPage((p) => Math.min(pagination.last_page, p + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
              >
                {t.has("courses.next") ? t("courses.next") : "Next"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default Services;
