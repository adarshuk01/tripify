const express = require('express');
const router  = express.Router();
const axios   = require('axios');

// ─── Wikipedia helpers ─────────────────────────────────────────────────────────

const WIKI_SEARCH  = 'https://en.wikipedia.org/w/api.php';
const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary';

// Common noise words that the AI appends to imageQuery — strip them before
// sending to Wikipedia so we get the actual article, not a search miss.
const NOISE = [
  'photography', 'exterior', 'food', 'dining', 'landmark', 'travel',
  'view', 'photo', 'image', 'picture', 'restaurant', 'hotel', 'building',
  'india', 'aerial', 'scenic', 'beautiful', 'famous', 'popular',
];

/**
 * Cleans up an AI-generated imageQuery into a short Wikipedia-friendly title.
 * e.g. "Taj Mahal Agra photography" → "Taj Mahal Agra"
 *      "Radisson Blu Hotel Goa exterior" → "Radisson Blu Hotel Goa"
 */
function cleanQuery(raw) {
  return raw
    .split(/\s+/)
    .filter(w => !NOISE.includes(w.toLowerCase()))
    .join(' ')
    .trim();
}

/**
 * Searches Wikipedia and returns an array of candidate article titles
 * (up to 5) for the given query.
 */
async function wikiSearch(query) {
  const { data } = await axios.get(WIKI_SEARCH, {
    params: {
      action  : 'query',
      list    : 'search',
      srsearch: query,
      srlimit : 5,
      srprop  : 'snippet',
      format  : 'json',
      origin  : '*',
    },
    headers : { 'User-Agent': 'Tripify/2.0 (travel planner app)' },
    timeout : 8000,
  });
  return (data?.query?.search || []).map(r => r.title);
}

/**
 * Fetches the Wikipedia REST summary for a given page title.
 * Returns the page data (with thumbnail / originalimage) or null.
 */
async function wikiSummary(title) {
  try {
    const encoded = encodeURIComponent(title.replace(/ /g, '_'));
    const { data } = await axios.get(`${WIKI_SUMMARY}/${encoded}`, {
      headers : { 'User-Agent': 'Tripify/2.0 (travel planner app)' },
      timeout : 8000,
    });
    return data;
  } catch {
    return null;
  }
}

/**
 * Core logic: given a raw imageQuery, try multiple Wikipedia strategies and
 * return the best image URL found, or null.
 *
 * Strategy order:
 *   1. Search with full cleaned query  → pick first result that has a thumbnail
 *   2. If nothing, try just first 3 words of the cleaned query
 *   3. Fall back to null (frontend shows gradient placeholder)
 */
async function resolveImageUrl(rawQuery) {
  const cleaned  = cleanQuery(rawQuery);
  const short    = cleaned.split(' ').slice(0, 3).join(' ');

  for (const searchTerm of [cleaned, short]) {
    if (!searchTerm) continue;

    let titles;
    try { titles = await wikiSearch(searchTerm); }
    catch { continue; }

    for (const title of titles) {
      const page = await wikiSummary(title);
      if (!page) continue;

      // Prefer originalimage (full-res), fall back to thumbnail
      const url =
        page.originalimage?.source ||
        page.thumbnail?.source     ||
        null;

      if (url) return url;  // ← first hit wins
    }
  }

  return null;
}

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/place/photo?query=...
 *
 * Returns place image from Wikipedia — completely free, no API key needed.
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     imageUrl: "https://upload.wikimedia.org/...",
 *     title:    "Taj Mahal",           // matched Wikipedia article
 *     source:   "wikipedia"
 *   }
 * }
 */
router.get('/photo', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'query param is required' });
    }

    const imageUrl = await resolveImageUrl(query);

    // Even if imageUrl is null the response is 200 — the frontend will show
    // its own gradient fallback; no need to 404 here.
    return res.json({
      success: true,
      data: {
        imageUrl,
        source: 'wikipedia',
      },
    });

  } catch (err) {
    console.error('[place/photo]', err.message);
    // Return a soft failure so the frontend can still show a fallback image
    return res.json({ success: true, data: { imageUrl: null, source: 'wikipedia' } });
  }
});

module.exports = router;
