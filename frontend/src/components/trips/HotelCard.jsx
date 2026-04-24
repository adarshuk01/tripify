import { HiStar, HiLocationMarker, HiExternalLink } from 'react-icons/hi';
import { MdHotel } from 'react-icons/md';
import { GooglePlaceImage } from './PlaceCard';

export default function HotelCard({ hotel }) {
  if (!hotel) return null;

  const stars = parseFloat(hotel.rating) || 4;
  const fullStars = Math.floor(stars);

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl overflow-hidden">
      {/* Hotel image via Google Maps Photos */}
      {hotel.imageQuery && (
        <GooglePlaceImage
          query={hotel.imageQuery}
          alt={hotel.name}
          className="w-full h-44"
          fallbackEmoji="🏨"
          gradientIndex={2}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <MdHotel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-gray-900 dark:text-white">{hotel.name}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-3.5 h-3.5 ${i < fullStars ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1">({hotel.rating})</span>
              </div>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {String(hotel.price || '').replace(/\$/g, '₹')}
              </span>
            </div>

            {hotel.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{hotel.description}</p>
            )}

            {hotel.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hotel.amenities.slice(0, 5).map((a, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    {a}
                  </span>
                ))}
              </div>
            )}

            {hotel.mapsLink && (
              <a
                href={hotel.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 mt-3 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <HiLocationMarker className="w-4 h-4" />
                View on Google Maps
                <HiExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
