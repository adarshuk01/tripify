import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { MdRestaurant, MdLocationOn } from 'react-icons/md';
import PlaceCard from './PlaceCard';
import HotelCard from './HotelCard';
import { UnsplashImage } from './PlaceCard';

function FoodStopCard({ stop }) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {stop.imageQuery && (
        <UnsplashImage
          query={stop.imageQuery}
          alt={stop.name}
          className="w-full h-32"
        />
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MdRestaurant className="w-4 h-4 text-orange-500" />
              <h5 className="font-display font-bold text-sm text-gray-900 dark:text-white">{stop.name}</h5>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {stop.type && (
                <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                  {stop.type}
                </span>
              )}
              {stop.cuisine && (
                <span className="text-xs text-gray-500">{stop.cuisine}</span>
              )}
              {stop.priceRange && (
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{stop.priceRange}</span>
              )}
            </div>
          </div>
          {stop.mapsLink && (
            <a
              href={stop.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-500 flex items-center gap-0.5 flex-shrink-0"
            >
              <MdLocationOn className="w-3.5 h-3.5" />
              Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DayAccordion({ day, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card">
      <button
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-display font-bold text-lg shadow-md shadow-primary-500/30">
            {day.day}
          </div>
          <div>
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Day {day.day}</span>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight">
              {day.title || `Day ${day.day} Activities`}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-gray-400 hidden sm:block">{day.activities?.length || 0} places</span>
          <HiChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-800 animate-fade-in">
          {/* Activities */}
          {day.activities?.length > 0 && (
            <div className="p-4 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Places to Visit</p>
              {day.activities.map((activity, i) => (
                <PlaceCard key={i} activity={activity} />
              ))}
            </div>
          )}

          {/* Food Stops */}
          {day.foodStops?.length > 0 && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Food & Dining</p>
              <div className="grid grid-cols-1 gap-3">
                {day.foodStops.map((stop, i) => (
                  <FoodStopCard key={i} stop={stop} />
                ))}
              </div>
            </div>
          )}

          {/* Hotel */}
          {day.hotel && (
            <div className="px-4 pb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Stay Tonight</p>
              <HotelCard hotel={day.hotel} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
