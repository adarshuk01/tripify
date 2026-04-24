import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiLocationMarker } from 'react-icons/hi';
import { MdExplore } from 'react-icons/md';
import useAuthStore from '../store/authStore';
import { tripService } from '../services/tripService';
import TripCard from '../components/trips/TripCard';
import { SkeletonCard } from '../components/common/Loader';

const popularDestinations = [
  { name: 'Munnar', country: 'India', emoji: '🌿', desc: 'Tea gardens & misty hills' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌺', desc: 'Temples & tropical paradise' },
  { name: 'Paris', country: 'France', emoji: '🗼', desc: 'Art, romance & cuisine' },
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️', desc: 'Ancient temples & cherry blossoms' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await tripService.getAll({ limit: 3 });
        setRecentTrips(data.data || []);
      } catch (err) {
        console.error('Failed to fetch trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/planner?dest=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await tripService.delete(id);
      setRecentTrips((t) => t.filter((trip) => trip._id !== id));
    } catch (err) {
      console.error('Delete failed');
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-container">
      {/* Greeting */}
      <div className="mb-6 animate-slide-up">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{greeting()},</p>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
          {user?.name?.split(' ')[0]} ✈️
        </h1>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="input-field pl-12 pr-12 py-4 rounded-2xl shadow-sm"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
              <HiArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </form>

      {/* AI Plan CTA */}
      <div
        className="mb-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-5 text-white cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 animate-slide-up"
        style={{ animationDelay: '0.15s' }}
        onClick={() => navigate('/planner')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Powered by AI</p>
            <h2 className="font-display font-bold text-xl mt-1">Plan Your Dream Trip</h2>
            <p className="text-primary-100 text-sm mt-1 leading-relaxed">
              Personalized itineraries tailored to your preferences
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center ml-4">
            <MdExplore className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-4 text-sm font-semibold">
          Start Planning <HiArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Popular Destinations */}
      <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Popular Destinations
          </h2>
          <button
            onClick={() => navigate('/planner')}
            className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1"
          >
            View All <HiArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/planner?dest=${encodeURIComponent(dest.name)}`)}
              className="card p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-3xl">{dest.emoji}</span>
              <h3 className="font-display font-semibold text-gray-900 dark:text-white mt-2">
                {dest.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <HiLocationMarker className="w-3 h-3" />
                {dest.country}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dest.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trips */}
      <section className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Recent Trips
          </h2>
          {recentTrips.length > 0 && (
            <button
              onClick={() => navigate('/trips')}
              className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1"
            >
              See All <HiArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : recentTrips.length > 0 ? (
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} onDelete={handleDeleteTrip} onSaveToggle={(id, isSaved) => setRecentTrips((prev) => prev.map((t) => t._id === id ? { ...t, isSaved } : t))} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <span className="text-4xl">🗺️</span>
            <p className="font-display font-semibold text-gray-900 dark:text-white mt-3">
              No trips yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
              Create your first AI-powered travel plan
            </p>
            <button onClick={() => navigate('/planner')} className="btn-primary mx-auto">
              Plan a Trip
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
