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
