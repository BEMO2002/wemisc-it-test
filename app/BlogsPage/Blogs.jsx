"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import { useSettings } from "../Context/SettingContext";
import { motion } from "framer-motion";
import {
  fetchBlogs,
  fetchBlogCategories,
  fetchCategoryBlogs,
} from "../lib/server-api";

const toSlug = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

const Blogs = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
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
  const currentLang = locale;

  const selectedCategorySlug = (searchParams.get("category") || "").trim();

  const selectedCategory = useMemo(() => {
    if (!selectedCategorySlug) return null;
    return (
      categories.find(
        (c) =>
          c?.slug_en === selectedCategorySlug ||
          c?.slug_ar === selectedCategorySlug,
      ) || null
    );
  }, [categories, selectedCategorySlug]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await fetchBlogCategories();
        const sorted = (Array.isArray(list) ? list : [])
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

        const withSlugs = sorted.map((c) => ({
          ...c,
          slug_en: c?.slug_en || toSlug(c?.name_en),
          slug_ar: c?.slug_ar || toSlug(c?.name_ar),
        }));

        setCategories(withSlugs);
      } catch (err) {
        console.error("Error fetching blog categories:", err);
      }
    };

    fetchCats();
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
      setBlogs([]); // Trigger skeleton loader
      setError(null);
      try {
        const params = { search: searchQuery, page };
        const data = selectedCategory?.id
          ? await fetchCategoryBlogs(selectedCategory.id, params)
          : await fetchBlogs(params);

        const blogsPagination = data?.blogs || null;
        const list = (
          Array.isArray(blogsPagination?.data)
            ? blogsPagination.data
            : Array.isArray(data?.blogs)
              ? data.blogs
              : []
        )
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

        setBlogs(list);

        if (blogsPagination && typeof blogsPagination === "object") {
          setPagination({
            current_page: Number(blogsPagination.current_page || page || 1),
            last_page: Number(blogsPagination.last_page || 1),
            from: Number(blogsPagination.from || 0),
            to: Number(blogsPagination.to || 0),
            total: Number(blogsPagination.total || list.length || 0),
            per_page: Number(blogsPagination.per_page || 10),
          });
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("blogs.loadError");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [searchQuery, page, selectedCategory?.id]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (page > 1) nextParams.set("p", page.toString());
    else nextParams.delete("p");

    if (searchQuery) nextParams.set("q", searchQuery);
    else nextParams.delete("q");

    if (selectedCategorySlug) nextParams.set("category", selectedCategorySlug);
    else nextParams.delete("category");

    const searchString = nextParams.toString();
    const query = searchString ? `?${searchString}` : "";
    if (searchString !== searchParams.toString()) {
      router.replace(`${pathname}${query}`, { scroll: false });
    }
  }, [page, searchQuery, selectedCategorySlug, pathname, router, searchParams]);

  useEffect(() => {
    const p = parseInt(searchParams.get("p")) || 1;
    if (p !== page) setPage(p);

    const q = searchParams.get("q") || "";
    if (q !== searchInput) setSearchInput(q);
  }, [searchParams]);

  const displayBlogs = blogs;

  return (
    <section className="pt-24 py-10 px-4 md:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl text-primary md:text-5xl font-bold mb-2">
            {t("blogs.title2")}
          </h2>

          <div className="w-32 md:w-48 mx-auto text-primary overflow-hidden">
            <motion.svg
              viewBox="0 0 100 20"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ x: "-20%" }}
              animate={{ x: "20%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <path
                d="M0 10 Q12.5 0 25 10 T50 10 T75 10 T100 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </motion.svg>
          </div>
        </div>

        {/* Search and Pagination Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div
            className={`text-sm md:text-base font-medium text-gray-700 ${isRTL ? "text-right order-2 md:order-2" : "text-left order-1 md:order-1"}`}
          >
            {t("blogs.showing")} {pagination.from}-{pagination.to}{" "}
            {t("blogs.of")} {pagination.total} {t("blogs.results")}
          </div>
          <div
            className={`w-full md:w-[360px] ${isRTL ? "order-1 md:order-1" : "order-2 md:order-2"}`}
          >
            <div className="relative">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("blogs.searchPlaceholder")}
                className={`w-full rounded-xl border border-gray-200 bg-[#f5f5f5] px-4 py-3 text-sm md:text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${isRTL ? "pr-12 text-right" : "pl-12 text-left"}`}
              />
              <span
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? "right-4" : "left-4"}`}
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
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.delete("category");
              router.replace(
                `${pathname}${next.toString() ? "?" + next.toString() : ""}`,
                { scroll: false },
              );
              setPage(1);
            }}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors border ${!selectedCategorySlug ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:border-primary"}`}
          >
            {t("blogs.all")}
          </button>

          {categories.map((category) => {
            const categoryId = category?.id;
            const categoryTitle =
              currentLang === "ar" ? category?.name_ar : category?.name_en;
            const displaySlug =
              currentLang === "ar" ? category?.slug_ar : category?.slug_en;

            if (!categoryId) return null;

            const isActive = selectedCategory?.id === categoryId;

            return (
              <button
                key={categoryId}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("category", displaySlug);
                  router.replace(`${pathname}?${next.toString()}`, {
                    scroll: false,
                  });
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors border ${isActive ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-200 hover:border-primary"}`}
              >
                {categoryTitle}
              </button>
            );
          })}
        </div>

        {/* Blogs Grid */}
        {error ? (
          <div className="text-center font-bold text-xl my-8 text-red-600">
            {t(error)}
          </div>
        ) : loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, idx) => (
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
        ) : blogs.length === 0 ? (
          <div className="text-center font-medium text-gray-600">
            {t("blogs.noBlogs")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const title =
                currentLang === "ar" ? blog.title_ar : blog.title_en;
              const shortDesc =
                currentLang === "ar"
                  ? blog.short_description_ar
                  : blog.short_description_en;
              const categoryTitle =
                currentLang === "ar"
                  ? blog.category?.name_ar
                  : blog.category?.name_en;
              const slug = currentLang === "ar" ? blog.slug_ar : blog.slug_en;

              return (
                <Link
                  href={`/blogs/${slug}`}
                  key={blog.id}
                  className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-primary/20"
                >
                  <div className="relative aspect-[3/3] overflow-hidden">
                    <img
                      src={
                        currentLang === "ar" ? blog.banner_ar : blog.banner_en
                      }
                      alt={title}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div
                      className={`absolute top-4 ${isRTL ? "right-4" : "left-4"}`}
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
                        {categoryTitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                      {shortDesc}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                        <span className="text-md text-gray-500 font-medium">
                          {t("blogs.viewDetails")}
                        </span>
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
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.current_page <= 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
            >
              {t("blogs.prev")}
            </button>

            {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
              .filter((p) => {
                if (pagination.last_page <= 7) return true;
                if (p === 1 || p === pagination.last_page) return true;
                return Math.abs(p - pagination.current_page) <= 2;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const needsDots = idx > 0 && prev && p - prev > 1;
                return (
                  <React.Fragment key={`page-${p}`}>
                    {needsDots && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${pagination.current_page === p ? "bg-primary text-white border-primary" : "border-gray-200 hover:border-primary"}`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.last_page, p + 1))
              }
              disabled={pagination.current_page >= pagination.last_page}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary"
            >
              {t("blogs.next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
