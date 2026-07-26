/**
 * Returns an optimised Supabase image URL with width transform applied.
 * If the URL is not a Supabase storage URL (or is empty), the original is returned as-is.
 *
 * @param {string|null|undefined} url - Original image URL
 * @param {number} [width=400] - Desired image width for the transform
 * @returns {string} - Transformed or original URL
 */
export function getOptimizedImageUrl(url, width = 400) {
  if (!url) return "/20.jpg";

  // Supabase storage URLs support the `width` transform query param
  if (url.includes("/storage/v1/object/public/")) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("width", String(width));
      parsed.searchParams.set("quality", "80");
      parsed.searchParams.set("format", "webp");
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}
