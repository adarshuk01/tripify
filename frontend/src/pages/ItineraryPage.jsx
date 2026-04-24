import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft, HiRefresh, HiDownload, HiTrash,
  HiLocationMarker, HiCalendar, HiUsers,
  HiLightBulb, HiShare, HiDotsVertical, HiStar, HiClock,
  HiChevronDown, HiChevronUp, HiExternalLink
} from 'react-icons/hi';
import {
  MdFlight, MdDirectionsCar, MdDirectionsBus, MdTrain, MdTwoWheeler,
  MdRestaurant, MdHotel
} from 'react-icons/md';
import { tripService } from '../services/tripService';
import { GeneratingLoader, SkeletonCard } from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { downloadTripPDF } from '../utils/pdfExport';
import { getGoogleMapsPhotoUrl } from '../utils/googleMapsPhoto';

const modeIcons = {
  Flight: MdFlight, Car: MdDirectionsCar, Bus: MdDirectionsBus,
  Train: MdTrain, Bike: MdTwoWheeler,
};

const typeColors = {
  sightseeing: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  food: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  adventure: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  culture: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  relaxation: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  nature: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const typeEmojis = {
  sightseeing: '🗺️', food: '🍽️', adventure: '🏕️',
  culture: '🏛️', relaxation: '🌊', nature: '🌿',
};

const FALLBACK_GRADIENTS = [
  'from-primary-400 to-primary-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-purple-400 to-indigo-600',
  'from-rose-400 to-pink-600',
  'from-sky-400 to-blue-600',
];

function FallbackImage({ label, emoji, className, gradientIndex = 0 }) {
  const grad = FALLBACK_GRADIENTS[gradientIndex % FALLBACK_GRADIENTS.length];
  return (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br ${grad} ${className}`}>
      <span className="text-3xl mb-1 drop-shadow">{emoji || '📍'}</span>
      {label && (
        <span className="text-white text-xs font-semibold text-center px-2 leading-tight drop-shadow line-clamp-2 max-w-[90%]">
          {label}
        </span>
      )}
    </div>
  );
}

function PlaceImage({ query, alt, className, fallbackEmoji, fallbackGradientIndex = 0 }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetching(true); setSrc(null); setLoaded(false); setImgError(false);
    if (!query) { setFetching(false); setImgError(true); return; }
    getGoogleMapsPhotoUrl(query).then((url) => {
      if (!cancelled) { url ? setSrc(url) : setImgError(true); setFetching(false); }
    }).catch(() => { if (!cancelled) { setImgError(true); setFetching(false); } });
    return () => { cancelled = true; };
  }, [query]);

  const showFallback = !fetching && (imgError || !src);

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {fetching && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />}
      {src && !imgError && (
        <>
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />}
          <img src={src} alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)} onError={() => setImgError(true)} />
        </>
      )}
      {showFallback && (
        <FallbackImage label={alt} emoji={fallbackEmoji} gradientIndex={fallbackGradientIndex}
          className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
}

function HeroImage({ destination }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    getGoogleMapsPhotoUrl(`${destination} travel landmark`, 800, 600).then((url) => {
      url ? setSrc(url) : setImgError(true);
    });
  }, [destination]);

  return (
    <div className="relative w-full h-72 sm:h-96 bg-gray-200 dark:bg-gray-800">
      {!loaded && !imgError && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary-200 to-primary-400" />}
      {imgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center">
          <span className="text-7xl opacity-30">🌏</span>
        </div>
      )}
      {src && (
        <img src={src} alt={destination}
          className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)} onError={() => setImgError(true)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
    </div>
  );
}

function RupeeBadge({ amount, className = '' }) {
  if (!amount) return null;
  const inr = String(amount).replace(/\$/g, '₹');
  return <span className={`font-semibold text-primary-600 dark:text-primary-400 ${className}`}>{inr}</span>;
}

function ActivityCard({ activity, index }) {
  const colorClass = typeColors[activity.type] || typeColors.sightseeing;
  const emoji = typeEmojis[activity.type] || '📍';
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
      {activity.imageQuery && (
        <PlaceImage query={activity.imageQuery} alt={activity.place}
          className="w-full h-44 rounded-none" fallbackEmoji={emoji} fallbackGradientIndex={index} />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-primary-500 font-display font-bold text-sm flex-shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
              {activity.place}
            </h4>
          </div>
          {activity.type && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${colorClass}`}>
              {activity.type}
            </span>
          )}
        </div>
        {activity.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">{activity.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {activity.time && (
            <span className="flex items-center gap-1 font-medium">
              <HiClock className="w-3.5 h-3.5" />
              {activity.time}{activity.duration && ` · ${activity.duration}`}
            </span>
          )}
          {activity.cost && <RupeeBadge amount={activity.cost} className="text-xs" />}
        </div>
        {activity.mapsLink && (
          <a href={activity.mapsLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            <HiLocationMarker className="w-3.5 h-3.5" /> View on Google Maps <HiExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function FoodCard({ stop, index }) {
  return (
    <div className="flex gap-3 items-start bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-3 border border-orange-100 dark:border-orange-900/30">
      {stop.imageQuery && (
        <PlaceImage query={stop.imageQuery} alt={stop.name}
          className="w-16 h-16 rounded-xl flex-shrink-0" fallbackEmoji="🍽️" fallbackGradientIndex={index + 1} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <MdRestaurant className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{stop.type}</span>
        </div>
        <h5 className="font-display font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{stop.name}</h5>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {stop.cuisine && <span className="text-xs text-gray-500 dark:text-gray-400">{stop.cuisine}</span>}
          {stop.priceRange && <RupeeBadge amount={stop.priceRange} className="text-xs" />}
        </div>
        {stop.mapsLink && (
          <a href={stop.mapsLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 mt-1 hover:underline">
            <HiLocationMarker className="w-3 h-3" /> Maps
          </a>
        )}
      </div>
    </div>
  );
}

function HotelCard({ hotel }) {
  if (!hotel) return null;
  const stars = Math.round(parseFloat(hotel.rating) || 4);
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl overflow-hidden border border-amber-100 dark:border-amber-900/30">
      {hotel.imageQuery && (
        <PlaceImage query={hotel.imageQuery} alt={hotel.name}
          className="w-full h-44 rounded-none" fallbackEmoji="🏨" fallbackGradientIndex={2} />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <MdHotel className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm truncate">{hotel.name}</h4>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <HiStar key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({hotel.rating})</span>
            </div>
          </div>
          <RupeeBadge amount={hotel.price} className="text-sm font-bold flex-shrink-0" />
        </div>
        {hotel.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{hotel.description}</p>
        )}
        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 5).map((a, i) => (
              <span key={i} className="text-xs bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>
        )}
        {hotel.mapsLink && (
          <a href={hotel.mapsLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold mt-3 hover:underline">
            <HiLocationMarker className="w-3.5 h-3.5" /> View on Google Maps <HiExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function DaySection({ day, defaultOpen, startDate }) {
  const [open, setOpen] = useState(defaultOpen);
  const dayLabel = (() => {
    if (!startDate) return `Day ${day.day}`;
    const d = new Date(startDate);
    d.setDate(d.getDate() + (day.day - 1));
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  })();
  return (
    <div className="mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white dark:bg-tripify-card border border-gray-100 dark:border-gray-800 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
            {day.day}
          </div>
          <div className="text-left">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">{dayLabel}</p>
            <p className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight">{day.title || `Day ${day.day}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">{day.activities?.length || 0} stops</span>
          {open ? <HiChevronUp className="w-5 h-5 text-gray-400" /> : <HiChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="mt-3 space-y-4 animate-fade-in pl-2">
          {day.activities?.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Activities</p>
              {day.activities.map((act, i) => <ActivityCard key={i} activity={act} index={i} />)}
            </div>
          )}
          {day.foodStops?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Food & Dining</p>
              {day.foodStops.map((stop, i) => <FoodCard key={i} stop={stop} index={i} />)}
            </div>
          )}
          {day.hotel && (
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mb-2">Stay Tonight</p>
              <HotelCard hotel={day.hotel} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const dayRefs = useRef([]);
  const menuRef = useRef(null);

  useEffect(() => { fetchTrip(); }, [id]);
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const fetchTrip = async () => {
    try { setLoading(true); const { data } = await tripService.getById(id); setTrip(data.data); }
    catch { setError('Failed to load trip.'); } finally { setLoading(false); }
  };

  const handleRegenerate = async () => {
    setRegenerating(true); setProgress(10); setError(''); setShowMenu(false);
    const timer = setInterval(() => {
      setProgress((p) => { if (p >= 88) { clearInterval(timer); return 88; } return p + Math.floor(Math.random() * 12) + 4; });
    }, 1500);
    try {
      const { data } = await tripService.regenerate(id);
      clearInterval(timer); setProgress(100);
      setTimeout(() => { setTrip(data.data); setRegenerating(false); setProgress(0); }, 500);
    } catch (err) {
      clearInterval(timer); setRegenerating(false); setProgress(0);
      setError(err.response?.data?.message || 'Failed to regenerate.');
    }
  };

  const handleDelete = async () => {
    try { await tripService.delete(id); navigate('/saved', { replace: true }); }
    catch { setError('Failed to delete trip.'); setShowDeleteModal(false); }
  };

  const scrollToDay = (i) => { setActiveDay(i); dayRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  if (loading) {
    return (
      <div>
        <div className="skeleton h-72 rounded-none" />
        <div className="page-container space-y-4 mt-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="page-container text-center py-16">
        <span className="text-5xl">😕</span>
        <p className="font-display font-bold text-xl text-gray-900 dark:text-white mt-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6 mx-auto">Go Home</button>
      </div>
    );
  }

  if (!trip) return null;

  const { itinerary } = trip;
  const ModeIcon = modeIcons[trip.travelMode] || MdFlight;
  const startDate = trip.startDate || null;

  const getDayTabLabel = (i) => {
    if (!startDate) return `Day ${i + 1}`;
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pb-28">
      {regenerating && <GeneratingLoader progress={progress} />}

      <div className="relative">
        <HeroImage destination={trip.destination} />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-5">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <HiArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
          <div className="flex gap-2" ref={menuRef}>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: trip.destination, url: window.location.href }); }}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <HiShare className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <HiDotsVertical className="w-5 h-5 text-gray-700 dark:text-white" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-12 bg-white dark:bg-tripify-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 w-48 z-50 animate-fade-in">
                  <button onClick={handleRegenerate} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                    <HiRefresh className="w-4 h-4" /> Generate Again
                  </button>
                  <button onClick={() => { downloadTripPDF(trip); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                    <HiDownload className="w-4 h-4" /> Download PDF
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                  <button onClick={() => { setShowMenu(false); setShowDeleteModal(true); }} className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <HiTrash className="w-4 h-4" /> Delete Trip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="font-display font-bold text-3xl text-white drop-shadow-lg">{trip.destination}</h1>
          <p className="text-white/80 text-sm mt-0.5">{trip.travelParty} · {trip.budget}</p>
        </div>
      </div>

      {/* Info chips */}
      <div className="bg-white dark:bg-tripify-card border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {[
            { icon: ModeIcon, label: trip.travelMode, bg: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' },
            { icon: HiCalendar, label: `${trip.duration} days`, bg: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
            { icon: HiUsers, label: `${trip.numberOfPeople} traveler${trip.numberOfPeople > 1 ? 's' : ''}`, bg: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
            itinerary?.totalEstimatedCost ? { rupee: true, label: String(itinerary.totalEstimatedCost).replace(/\$/g, '₹'), bg: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' } : null,
            itinerary?.bestTimeToVisit ? { icon: HiCalendar, label: itinerary.bestTimeToVisit, bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' } : null,
          ].filter(Boolean).map(({ icon: Icon, rupee, label, bg }, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${bg}`}>
              {rupee ? <span className="font-bold">₹</span> : Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Date range strip */}
      {trip.startDate && trip.endDate && (
        <div className="bg-primary-50 dark:bg-primary-900/10 border-b border-primary-100 dark:border-primary-900/30 px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400 font-medium">
            <HiCalendar className="w-4 h-4 flex-shrink-0" />
            <span>
              {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' '}→{' '}
              {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      )}

      {/* Day tabs */}
      {itinerary?.days?.length > 1 && (
        <div className="bg-white dark:bg-tripify-card border-b border-gray-100 dark:border-gray-800 sticky top-16 z-30">
          <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 py-2.5">
            {itinerary.days.map((_, i) => (
              <button key={i} onClick={() => scrollToDay(i)}
                className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeDay === i ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                {getDayTabLabel(i)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4">
        {itinerary?.summary && (
          <div className="mt-5 mb-5">
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{itinerary.summary}</p>
          </div>
        )}

        {itinerary?.travelTips?.length > 0 && (
          <div className="card mb-5 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => setShowTips(!showTips)}>
              <div className="flex items-center gap-2">
                <HiLightBulb className="w-5 h-5 text-amber-500" />
                <span className="font-display font-semibold text-gray-900 dark:text-white">Travel Tips</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">{itinerary.travelTips.length}</span>
              </div>
              {showTips ? <HiChevronUp className="w-4 h-4 text-gray-400" /> : <HiChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showTips && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in">
                {itinerary.travelTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500 font-bold flex-shrink-0">{i + 1}.</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {itinerary?.days?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">Day-wise Itinerary</h3>
            {itinerary.days.map((day, i) => (
              <div key={day.day} ref={(el) => (dayRefs.current[i] = el)}>
                <DaySection day={day} defaultOpen={i === 0} startDate={startDate} />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>
        )}

        <div className="flex gap-3 pb-4">
          <button onClick={handleRegenerate} disabled={regenerating} className="btn-outline flex-1">
            <HiRefresh className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} /> Generate Again
          </button>
          <button onClick={() => downloadTripPDF(trip)} className="btn-secondary flex-1">
            <HiDownload className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Trip" size="sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Are you sure you want to delete your trip to <strong>{trip.destination}</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowDeleteModal(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-2xl transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
