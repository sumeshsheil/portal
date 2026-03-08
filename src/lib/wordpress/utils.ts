import { Post } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80";

/**
 * Extract a valid image URL from a WordPress post's embedded featured media.
 * Handles the non-standard case where source_url is an array [url, w, h, crop]
 * instead of a plain string (common with AI-generated Hostinger setups).
 */
export function extractFeaturedImage(post: Post): string {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return FALLBACK_IMAGE;

  const raw = media.source_url;

  // Handle array format: ["https://...", 530, 250, ["center","center"]]
  if (Array.isArray(raw)) {
    const url = raw[0];
    return typeof url === "string" && url.length > 0 ? url : FALLBACK_IMAGE;
  }

  // Handle normal string format
  if (typeof raw === "string" && raw.length > 0) {
    return raw;
  }

  return FALLBACK_IMAGE;
}

/**
 * Decode HTML entities in a string.
 * This is a lightweight alternative to using a full library for common entities
 * found in WordPress content (apostrophes, quotes, ellipses, etc.).
 */
export function decodeHtmlEntities(html: string): string {
  if (!html) return "";

  const namedEntities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&hellip;": "…",
    "&#8211;": "–",
    "&#8212;": "—",
    "&#8216;": "‘",
    "&#8217;": "’",
    "&#8220;": "“",
    "&#8221;": "”",
    "&#8230;": "…",
    "&#038;": "&",
    "&#039;": "'",
    "&#38;": "&",
  };

  // First replace named and manually handle known common entities
  let decoded = html.replace(/&[a-zA-Z0-9#]+;/g, (match) => namedEntities[match] || match);

  // Then handle all numeric decimal entities (e.g., &#8217;)
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return `&#${dec};`;
    }
  });

  // Then handle all numeric hex entities (e.g., &#x2019;)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return `&#x${hex};`;
    }
  });

  return decoded;
}
