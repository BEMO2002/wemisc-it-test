"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, Link } from "../../i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { fetchBlogDetails } from "../lib/server-api";
import { FaArrowLeft } from "react-icons/fa";

const BlogsDetails = ({ initialData }) => {
  const { slug } = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const [blog, setBlog] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  const isRTL = locale === "ar";
  const currentLang = locale;

  const fetchBlogBySlug = useCallback(async (slugToFetch) => {
    if (!slugToFetch) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogDetails(slugToFetch);
      if (data) {
        setBlog(data);
      } else {
        setError("blogs.notFound");
      }
    } catch (e) {
      console.error("Error fetching blog details:", e);
      setError("blogs.detailsLoadError");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const syncBlog = async () => {
      if (!slug) return;

      const decodedSlug = decodeURIComponent(slug);

      // If we have initialData and it matches the current slug, don't fetch
      if (initialData) {
        const matchesAr = initialData.slug_ar === decodedSlug;
        const matchesEn = initialData.slug_en === decodedSlug;
        if (matchesAr || matchesEn) {
          if (isMounted) {
            setBlog(initialData);
            setLoading(false);
          }
          return;
        }
      }

      // If state 'blog' already matches, don't fetch
      if (blog) {
        const matchesAr = blog.slug_ar === decodedSlug;
        const matchesEn = blog.slug_en === decodedSlug;
        if (matchesAr || matchesEn) {
          if (isMounted) setLoading(false);
          return;
        }
      }

      await fetchBlogBySlug(decodedSlug);
    };

    syncBlog();
    return () => {
      isMounted = false;
    };
  }, [slug, initialData, fetchBlogBySlug, blog]);

  useEffect(() => {
    if (loading || !blog || !slug) return;

    const correctSlug = locale === "ar" ? blog.slug_ar : blog.slug_en;
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(slug);

    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/blogs/${correctSlug}`, { scroll: false });
    }
  }, [blog, slug, locale, loading, router]);

  const computed = useMemo(() => {
    if (!blog) return null;
    const title = currentLang === "ar" ? blog.title_ar : blog.title_en;
    const banner = currentLang === "ar" ? blog.banner_ar : blog.banner_en;
    const shortDesc =
      currentLang === "ar"
        ? blog.short_description_ar
        : blog.short_description_en;
    const desc =
      currentLang === "ar" ? blog.description_ar : blog.description_en;
    const categoryTitle =
      currentLang === "ar" ? blog.category?.name_ar : blog.category?.name_en;

    return {
      title,
      banner,
      shortDesc,
      desc,
      categoryTitle,
    };
  }, [blog, currentLang]);

  if (loading && !blog) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="relative h-[50vh] overflow-hidden">
          <div className="md:w-[70%] w-full mx-auto h-full bg-gray-200 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-10 w-2/3 bg-white/20 rounded-lg animate-pulse mb-4" />
              <div className="h-6 w-1/2 bg-white/20 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog || !computed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("blogs.notFound")}
          </h2>
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <FaArrowLeft
              className={`${isRTL ? "ml-2 rotate-180" : "mr-2"} w-4 h-4`}
            />
            {t("blogs.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={computed.banner}
          alt={computed.title}
          className="md:w-[70%] w-full mx-auto h-full object-cover object-center "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/blogs"
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors duration-200"
              >
                <FaArrowLeft
                  className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
                />
                {t("blogs.backToBlogs")}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              {computed.categoryTitle ? (
                <span className="inline-block px-3 py-1 text-sm font-bold text-primary bg-white/90 backdrop-blur-sm rounded-full">
                  {computed.categoryTitle}
                </span>
              ) : null}
            </div>

            <h1
              className={`text-4xl md:text-5xl font-bold text-white mb-4 ${isRTL ? "text-right" : "text-left"}`}
            >
              {computed.title}
            </h1>

            {computed.shortDesc ? (
              <p
                className={`text-white/90 text-lg max-w-4xl ${isRTL ? "text-right" : "text-left"}`}
              >
                {computed.shortDesc}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2
                className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("blogs.overview")}
              </h2>
              <div
                className={`prose prose-lg max-w-none ${isRTL ? "text-right" : "text-left"}`}
                dangerouslySetInnerHTML={{ __html: computed.desc || "" }}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-32">
              <h3
                className={`text-xl font-bold text-gray-900 mb-6 ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("blogs.details")}
              </h3>
              <div className="space-y-4">
                {computed.categoryTitle ? (
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">
                      {t("blogs.category")}
                    </p>
                    <p className="text-gray-900 font-bold">
                      {computed.categoryTitle}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsDetails;
