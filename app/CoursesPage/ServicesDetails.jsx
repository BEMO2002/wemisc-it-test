"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, Link } from "../../i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { fetchItemDetails } from "../lib/server-api";
import { useCart } from "../Context/CartContextBase";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
// import Image1 from "../assets/Home/preloader-icon.png";
// import Image2 from "../assets/Home/bulb-shape.webp";
const ServicesDetails = ({ initialData }) => {
  const params = useParams();
  const slug = params?.slug ? decodeURIComponent(params.slug) : ""; // Decode immediately

  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { addItem } = useCart();

  // Initialize with initialData if it matches the current slug to avoid flicker
  const isInitialMatch =
    initialData &&
    (decodeURIComponent(initialData.slug_en) === slug ||
      decodeURIComponent(initialData.slug_ar) === slug);

  const [course, setCourse] = useState(isInitialMatch ? initialData : null);
  const [loading, setLoading] = useState(!isInitialMatch);
  const [error, setError] = useState(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(1);

  const isRTL = locale === "ar";
  const currentLang = locale;

  useEffect(() => {
    let isMounted = true;

    const syncCourse = async () => {
      if (!slug) return;

      // 1. Check if we already have the correct data (initialData or state)
      const currentMatch = course;
      const isCurrentMatch =
        currentMatch &&
        (decodeURIComponent(currentMatch.slug_en) === slug ||
          decodeURIComponent(currentMatch.slug_ar) === slug);

      if (isCurrentMatch) {
        setLoading(false);
        return;
      }

      // 2. If no match in state, check if initialData matches the NEW slug (navigation case)
      const isNewInitialMatch =
        initialData &&
        (decodeURIComponent(initialData.slug_en) === slug ||
          decodeURIComponent(initialData.slug_ar) === slug);

      if (isNewInitialMatch) {
        setCourse(initialData);
        setLoading(false);
        return;
      }

      // 3. Only if no matches found at all, we fetch
      setLoading(true);
      try {
        const data = await fetchItemDetails(slug);
        if (isMounted) {
          if (data) {
            setCourse(data);
            setError(null);
          } else {
            setError(
              t.has("courses.notFound")
                ? t("courses.notFound")
                : "Course not found",
            );
          }
        }
      } catch (e) {
        if (isMounted)
          setError(
            t.has("courses.detailsLoadError")
              ? t("courses.detailsLoadError")
              : "Failed to load",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    syncCourse();
    return () => {
      isMounted = false;
    };
  }, [slug, initialData, t, course]); // Added 'course' to dependencies for more accurate state checks

  useEffect(() => {
    if (loading || !course || !slug) return;

    const correctSlug = locale === "ar" ? course.slug_ar : course.slug_en;
    // Standardize both for comparison
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    if (decodedCorrect && decodedCorrect !== slug) {
      router.replace(`/courses/${correctSlug}`, { scroll: false });
    }
  }, [course, slug, locale, loading, router]);

  const computed = useMemo(() => {
    if (!course) return null;
    const title = currentLang === "ar" ? course.title_ar : course.title_en;
    const banner = currentLang === "ar" ? course.banner_ar : course.banner_en;
    const shortDesc =
      currentLang === "ar"
        ? course.short_description_ar
        : course.short_description_en;
    const desc =
      currentLang === "ar" ? course.description_ar : course.description_en;
    const typeTitle =
      currentLang === "ar"
        ? course.item_type?.title_ar
        : course.item_type?.title_en;
    const priceValue = Number(course?.price);
    const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
    const priceLabel = hasPrice
      ? `${priceValue} ${t.has("courses.currency") ? t("courses.currency") : "EGP"} `
      : t.has("courses.free")
        ? t("courses.free")
        : "Free";

    return {
      title,
      banner,
      shortDesc,
      desc,
      typeTitle,
      priceLabel,
      priceValue,
    };
  }, [course, currentLang, t]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 pt-30 pb-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs Skeleton */}
          <div className="flex gap-2 mb-8">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2">
              <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-8" />

              <div className="rounded-2xl bg-gray-200 animate-pulse h-[400px] mb-10" />

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="mb-8">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-6 mb-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="h-14 w-full bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course || !computed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.has("courses.notFound")
              ? t("courses.notFound")
              : "Course not found"}
          </h2>
          <p className="text-gray-600 mb-6">{error || ""}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <FaArrowLeft
              className={`${isRTL ? "ml-2 rotate-180" : "mr-2"} w-4 h-4`}
            />
            {t.has("courses.back") ? t("courses.back") : "Back"}
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t.has("navbar.home") ? t("navbar.home") : "Home", path: "/" },
    {
      label: t.has("navbar.services") ? t("navbar.services") : "Services",
      path: "/courses",
    },
    { label: computed.title, path: null },
  ];

  return (
    <>
      <div
        className="min-h-screen bg-gray-50 pt-30 pb-12"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-8 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.path ? (
                  <Link
                    href={crumb.path}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {computed.title}
              </h1>

              {computed.shortDesc && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {computed.shortDesc}
                </p>
              )}

              <div className="rounded-2xl overflow-hidden shadow-sm mb-10 h-[400px]">
                <img
                  src={computed.banner}
                  alt={computed.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {t.has("courses.overview")
                    ? t("courses.overview")
                    : "Service Overview"}
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: computed.desc || "" }}
                />
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-8">
                {/* Price / Action Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 font-semibold mb-2 uppercase tracking-wider">
                      {t.has("courses.price")
                        ? t("courses.price")
                        : "Starting Price"}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {computed.priceLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          {t.has("courses.timeline")
                            ? t("courses.timeline")
                            : "Timeline"}
                        </p>
                        <p className="text-gray-600">
                          {t.has("courses.timelineValue")
                            ? t("courses.timelineValue")
                            : "4-6 Weeks"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          {t.has("courses.availability")
                            ? t("courses.availability")
                            : "Availability"}
                        </p>
                        <p className="text-gray-600">
                          {t.has("courses.availabilityValue")
                            ? t("courses.availabilityValue")
                            : "Starting Next Month"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          {t.has("courses.guarantee")
                            ? t("courses.guarantee")
                            : "Guarantee"}
                        </p>
                        <p className="text-gray-600">
                          {t.has("courses.guaranteeValue")
                            ? t("courses.guaranteeValue")
                            : "1 Year Maintenance"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAttendeesCount(1);
                        setIsCartModalOpen(true);
                      }}
                      className="w-full bg-green-500 text-white font-bold py-4 rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      {t.has("cart.addToCart")
                        ? t("cart.addToCart")
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              {t.has("cart.attendeesTitle")
                ? t("cart.attendeesTitle")
                : "Number of attendees"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t.has("cart.attendeesDescription")
                ? t("cart.attendeesDescription")
                : "Please choose how many people will attend this course."}
            </p>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl"
                onClick={() =>
                  setAttendeesCount((prev) => (prev > 1 ? prev - 1 : 1))
                }
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={attendeesCount}
                onChange={(e) =>
                  setAttendeesCount(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-20 text-center border border-gray-300 rounded-lg py-2"
              />
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl"
                onClick={() => setAttendeesCount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setIsCartModalOpen(false)}
              >
                {t.has("cart.cancel") ? t("cart.cancel") : "Cancel"}
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                onClick={() => {
                  if (!course || !computed) return;
                  addItem({
                    item_id: course.id,
                    attendees: attendeesCount,
                    price: computed.priceValue,
                    title_en: course.title_en,
                    title_ar: course.title_ar,
                    banner_en: course.banner_en,
                    banner_ar: course.banner_ar,
                  });
                  setIsCartModalOpen(false);
                  toast.success(
                    t.has("cart.added")
                      ? t("cart.added")
                      : "Course added to cart successfully",
                  );
                }}
              >
                {t.has("cart.confirm") ? t("cart.confirm") : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesDetails;
