const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://dashboard.wemisc.net/public/api/v1";
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "13";
const apiKey =
  process.env.NEXT_PUBLIC_API_KEY || "P4OIp8prRKBeO0kogfGViTNzmAT8UnzL";

/**
 * Fetch generic global website settings from backend
 */
export async function fetchSettings() {
  try {
    const res = await fetch(`${baseUrl}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      // Cache the response and revalidate every 60 seconds natively through Next.js Cache
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchSettings Error:", err);
    return null;
  }
}

/**
 * Fetch sliders data from backend
 */
export async function fetchSliders() {
  try {
    const res = await fetch(`${baseUrl}/sliders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchSliders Error:", err);
    return [];
  }
}

/**
 * Fetch course categories (item types)
 */
export async function fetchItemTypes() {
  try {
    const res = await fetch(`${baseUrl}/item-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.data || [];
  } catch (err) {
    console.error("fetchItemTypes Error:", err);
    return [];
  }
}

/**
 * Fetch items (courses) with search and pagination support
 */
export async function fetchItems(params = {}) {
  try {
    const url = new URL(`${baseUrl}/items`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchItems Error:", err);
    return null;
  }
}

/**
 * Fetch specific item details by slug (as shown in user photo)
 */
export async function fetchItemDetails(slug) {
  if (!slug) return null;

  // Ensure we handle URL-encoded slugs (especially for Arabic)
  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetch(`${baseUrl}/item/${decodedSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(
        `fetchItemDetails failed: ${res.status} for ${decodedSlug}`,
      );
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchItemDetails Error:", err);
    return null;
  }
}

/**
 * Fetch items belonging to a specific type
 */
export async function fetchItemTypeItems(typeId, params = {}) {
  try {
    const url = new URL(`${baseUrl}/item-type-items/${typeId}`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchItemTypeItems Error:", err);
    return null;
  }
}
/**
 * Fetch blogs with search and pagination support
 */
export async function fetchBlogs(params = {}) {
  try {
    const url = new URL(`${baseUrl}/blogs`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchBlogs Error:", err);
    return null;
  }
}

/**
 * Fetch specific blog details by slug
 */
export async function fetchBlogDetails(slug) {
  if (!slug) return null;

  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetch(`${baseUrl}/blog/${decodedSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(
        `fetchBlogDetails failed: ${res.status} for ${decodedSlug}`,
      );
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchBlogDetails Error:", err);
    return null;
  }
}

/**
 * Fetch blog categories
 */
export async function fetchBlogCategories() {
  try {
    const res = await fetch(`${baseUrl}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    // Categories are often wrapped in data.data or data
    const list = json?.data?.data || json?.data || [];
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error("fetchBlogCategories Error:", err);
    return [];
  }
}

/**
 * Fetch blogs belonging to a specific category
 */
export async function fetchCategoryBlogs(categoryId, params = {}) {
  try {
    const url = new URL(`${baseUrl}/category-blogs/${categoryId}`);
    Object.keys(params).forEach((key) => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchCategoryBlogs Error:", err);
    return null;
  }
}

/**
 * Submit contact form data
 */
export async function submitContactForm(formData) {
  try {
    const res = await fetch(`${baseUrl}/contact-us`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ ...formData, extra_key: null }),
    });

    return res;
  } catch (err) {
    console.error("submitContactForm Error:", err);
    throw err;
  }
}

/**
 * Newsletter subscription
 */
export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${baseUrl}/subscribes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ email: email.trim(), extra_key: null }),
    });

    return res;
  } catch (err) {
    console.error("subscribeNewsletter Error:", err);
    throw err;
  }
}

/**
 * Check coupon validity
 */
export async function checkCoupon(couponCode, items) {
  try {
    const res = await fetch(`${baseUrl}/check-coupon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        coupon_code: couponCode.trim(),
        items: items.map((it) => ({
          item_id: Number(it.item_id),
          attendees: Number(it.attendees),
        })),
      }),
    });

    return res;
  } catch (err) {
    console.error("checkCoupon Error:", err);
    throw err;
  }
}

/**
 * Create checkout/order
 */
export async function createCheckout(payload) {
  try {
    const res = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    return res;
  } catch (err) {
    console.error("createCheckout Error:", err);
    throw err;
  }
}

/**
 * Upload receipt image
 */
export async function uploadReceipt(formData) {
  try {
    const res = await fetch(`${baseUrl}/upload-receipt`, {
      method: "POST",
      headers: {
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      body: formData,
    });

    return res;
  } catch (err) {
    console.error("uploadReceipt Error:", err);
    throw err;
  }
}

/**
 * Fetch available payment methods
 */
export async function fetchPaymentMethods() {
  try {
    const res = await fetch(`${baseUrl}/payment-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchPaymentMethods Error:", err);
    return [];
  }
}

/**
 * Fetch pixels and scripts from backend
 */
export async function fetchPixelsScripts() {
  try {
    const res = await fetch(`${baseUrl}/pixels-scripts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (err) {
    console.error("fetchPixelsScripts Error:", err);
    return [];
  }
}

/**
 * Fetch order details by ID
 */
export async function fetchOrderDetails(orderId) {
  try {
    const res = await fetch(`${baseUrl}/order/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("fetchOrderDetails Error:", err);
    return null;
  }
}
/**
 * Fetch raw sitemap XML from backend
 */
export async function fetchSitemapRaw() {
  try {
    const res = await fetch(`${baseUrl}/generate-sitemap`, {
      method: "GET",
      headers: {
        "X-Tenant-ID": tenantId,
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 3600 }, // Cache sitemap for 1 hour
    });

    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error("fetchSitemapRaw Error:", err);
    return null;
  }
}
