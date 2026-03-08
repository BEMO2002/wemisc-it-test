import { fetchSitemapRaw } from "../lib/server-api";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const xml = await fetchSitemapRaw();

  if (!xml) {
    return new Response("Sitemap not found", { status: 404 });
  }

  // Ensure consistent XML content type for browser rendering
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
