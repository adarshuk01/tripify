/**
 * googleMapsPhoto.js
 *
 * Fetches a photo URL for a given text query using:
 *   1. Google Maps Places API (New) directly from the browser
 *      – requires VITE_GOOGLE_MAPS_API_KEY in your frontend .env
 *   2. Falls back to the Tripify backend proxy (/api/place/photo)
 *      – requires GOOGLE_API_KEY in your backend .env
 *
 * Results are cached in-memory so the same query never hits the network twice.
 */

const FRONTEND_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BACKEND_URL  = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// In-memory cache: query → url | null
const cache = new Map();

/**
 * Try to resolve a photo URL directly via the Places API (New).
 * Returns a URL string or null.
 */
async function fetchViaGoogleDirect(query, maxWidth = 800, maxHeight = 600) {
  if (!FRONTEND_KEY) return null;

  const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': FRONTEND_KEY,
      'X-Goog-FieldMask': 'places.photos',
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
  });

  if (!searchRes.ok) return null;

  const json = await searchRes.json();
  const photoName = json.places?.[0]?.photos?.[0]?.name;
  if (!photoName) return null;

  return (
    `https://places.googleapis.com/v1/${photoName}/media` +
    `?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${FRONTEND_KEY}`
  );
}

/**
 * Try to resolve a photo URL via the Tripify backend proxy.
 * Returns a URL string or null.
 */
async function fetchViaBackendProxy(query) {
  const res = await fetch(
    `${BACKEND_URL}/place/photo?query=${encodeURIComponent(query)}`,
    { credentials: 'include' }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.imageUrl || null;
}

/**
 * Main export – returns a photo URL for the given text query, or null.
 *
 * Strategy:
 *   • If a Google API key is available in the frontend env → use direct API (faster, no backend round-trip)
 *   • Otherwise → call the backend proxy
 *   • Results are cached per-query
 *
 * @param {string}  query      – e.g. "Eiffel Tower Paris landmark"
 * @param {number}  maxWidth   – pixel width  (default 800)
 * @param {number}  maxHeight  – pixel height (default 600)
 * @returns {Promise<string|null>}
 */
export async function getGoogleMapsPhotoUrl(query, maxWidth = 800, maxHeight = 600) {
  if (!query) return null;

  const cacheKey = `${query}::${maxWidth}::${maxHeight}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    let url = null;

    if (FRONTEND_KEY) {
      url = await fetchViaGoogleDirect(query, maxWidth, maxHeight);
    }

    // Fallback to backend proxy if direct call failed or no key
    if (!url) {
      url = await fetchViaBackendProxy(query);
    }

    cache.set(cacheKey, url);
    return url;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}
