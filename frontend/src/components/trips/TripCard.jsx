import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiCalendar, HiUsers, HiCurrencyDollar, HiTrash,
  HiLocationMarker, HiBookmark,
} from 'react-icons/hi';
import { MdFlight, MdDirectionsCar, MdDirectionsBus, MdTrain, MdTwoWheeler } from 'react-icons/md';
import { GooglePlaceImage } from './PlaceCard';
import { tripService } from '../../services/tripService';

const modeIcons = {
  Flight: MdFlight,
  Car: MdDirectionsCar,
  Bus: MdDirectionsBus,
  Train: MdTrain,
  Bike: MdTwoWheeler,
};

const budgetColors = {
  Low:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Luxury: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function TripCard({ trip, onDelete, onSaveToggle }) {
  const navigate = useNavigate();
  const ModeIcon = modeIcons[trip.travelMode] || MdFlight;
  const [saved, setSaved] = useState(trip.isSaved ?? false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(trip._id);
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    try {
      const { data } = await tripService.toggleSaved(trip._id);
      setSaved(data.isSaved);
      if (onSaveToggle) onSaveToggle(trip._id, data.isSaved);
    } catch {
      // silent fail — no toast needed
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group overflow-hidden"
      onClick={() => navigate(`/itinerary/${trip._id}`)}
    >
      {/* Hero image */}
      <div className="relative">
        <GooglePlaceImage
          query={`${trip.destination} travel landmark`}
          alt={trip.destination}
          className="w-full h-36"
          fallbackEmoji="🌏"
          gradientIndex={trip.destination?.length % 6}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Bottom bar: title + actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <HiLocationMarker className="w-4 h-4 text-white/90 flex-shrink-0" />
            <h3 className="font-display font-bold text-white text-base leading-tight drop-shadow-md truncate">
              {trip.destination}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
            {/* Bookmark — always visible when saved, hover-only when not */}
            <button
              onClick={handleBookmark}
              disabled={toggling}
              title={saved ? 'Remove from saved' : 'Save trip'}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200
                ${saved
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-black/30 text-white/70 hover:bg-primary-500/90 hover:text-white opacity-0 group-hover:opacity-100'
                }`}
            >
              <HiBookmark className={`w-4 h-4 ${toggling ? 'animate-pulse' : ''}`} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              title="Delete trip"
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-red-400 hover:bg-red-900/40 transition-colors opacity-0 group-hover:opacity-100"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meta chips */}
      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${budgetColors[trip.budget] || budgetColors.Medium}`}>
            <HiCurrencyDollar className="w-3 h-3" />{trip.budget}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <HiCalendar className="w-3 h-3" />{trip.duration}d
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <HiUsers className="w-3 h-3" />{trip.numberOfPeople}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
            <ModeIcon className="w-3 h-3" />{trip.travelMode}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {new Date(trip.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
