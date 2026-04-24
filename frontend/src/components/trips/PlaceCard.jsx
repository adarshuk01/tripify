import { useState, useEffect } from 'react';
import { HiClock, HiLocationMarker, HiExternalLink, HiCurrencyDollar } from 'react-icons/hi';
import { MdHiking, MdRestaurant, MdMuseum, MdBeachAccess, MdNaturePeople, MdStar, MdCamera } from 'react-icons/md';
import { getGoogleMapsPhotoUrl } from '../../utils/googleMapsPhoto';

const typeConfig = {
  sightseeing: { icon: MdStar,        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  food:        { icon: MdRestaurant,  color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  adventure:   { icon: MdHiking,     color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  culture:     { icon: MdMuseum,     color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  relaxation:  { icon: MdBeachAccess,color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  nature:      { icon: MdNaturePeople,color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

// ─── Shared image component ────────────────────────────────────────────────────
// Uses the Google Maps Places (New) API via googleMapsPhoto.js utility.
// Shows a shimmer skeleton while loading and a gradient fallback on error.
const GRADIENTS = [
  'from-primary-400 to-primary-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-purple-400 to-indigo-600',
  'from-rose-400 to-pink-600',
  'from-sky-400 to-blue-600',
];

function FallbackPlaceholder({ label, emoji = '📍', gradientIndex = 0, className }) {
  const grad = GRADIENTS[gradientIndex % GRADIENTS.length];
  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${grad} ${className}`}>
      <span className="text-3xl mb-1 drop-shadow">{emoji}</span>
      {label && (
        <span className="text-white text-xs font-semibold text-center px-2 leading-tight drop-shadow line-clamp-2 max-w-[90%]">
          {label}
        </span>
      )}
    </div>
  );
}

export function GooglePlaceImage({ query, alt, className, fallbackEmoji = '📍', gradientIndex = 0 }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetching(true); setSrc(null); setLoaded(false); setError(false);
    if (!query) { setFetching(false); setError(true); return; }

    getGoogleMapsPhotoUrl(query).then((url) => {
      if (cancelled) return;
      if (url) { setSrc(url); } else { setError(true); }
      setFetching(false);
    }).catch(() => {
      if (!cancelled) { setError(true); setFetching(false); }
    });

    return () => { cancelled = true; };
  }, [query]);

  const showFallback = !fetching && (error || !src);

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {/* Shimmer skeleton while fetching */}
      {fetching && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}

      {/* Actual image */}
      {src && !error && (
        <>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </>
      )}

      {/* Gradient fallback when no image is available */}
      {showFallback && (
        <FallbackPlaceholder
          label={alt}
          emoji={fallbackEmoji}
          gradientIndex={gradientIndex}
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}

// Keep legacy export name so any other import of UnsplashImage keeps working
export { GooglePlaceImage as UnsplashImage };

// ─── PlaceCard ────────────────────────────────────────────────────────────────
export default function PlaceCard({ activity, index = 0 }) {
  const config = typeConfig[activity.type] || typeConfig.sightseeing;
  const Icon = config.icon;
  const emoji = { sightseeing: '🗺️', food: '🍽️', adventure: '🏕️', culture: '🏛️', relaxation: '🌊', nature: '🌿' }[activity.type] || '📍';

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Hero image via Google Maps Photos */}
      {activity.imageQuery && (
        <GooglePlaceImage
          query={activity.imageQuery}
          alt={activity.place}
          className="w-full h-44"
          fallbackEmoji={emoji}
          gradientIndex={index}
        />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
              {activity.place}
            </h4>
          </div>
          {activity.time && (
            <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
              <HiClock className="w-3 h-3" />
              {activity.time}
            </span>
          )}
        </div>

        {activity.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            {activity.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          {activity.duration && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              ⏱ {activity.duration}
            </span>
          )}
          {activity.cost && (
            <span className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1 font-semibold">
              {String(activity.cost).replace(/\$/g, '₹')}
            </span>
          )}
          {activity.mapsLink && (
            <a
              href={activity.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <HiLocationMarker className="w-3.5 h-3.5" />
              View on Maps
              <HiExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
