import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiPlus, HiBookmark, HiOutlineBookmark, HiTrash } from 'react-icons/hi';
import { tripService } from '../services/tripService';
import TripCard from '../components/trips/TripCard';
import { SkeletonCard } from '../components/common/Loader';
import Modal from '../components/common/Modal';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      // All trips — no saved filter
      const { data } = await tripService.getAll();
      setTrips(data.data || []);
    } catch {
      setError('Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await tripService.delete(deleteId);
      setTrips((t) => t.filter((trip) => trip._id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Failed to delete trip.');
      setDeleteId(null);
    }
  };

  // When user toggles save on a card, update isSaved in local state
  const handleSaveToggle = (id, isSaved) => {
    setTrips((prev) => prev.map((t) => t._id === id ? { ...t, isSaved } : t));
  };

  const filtered = trips.filter((t) =>
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            My Trips
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <button onClick={() => navigate('/planner')} className="btn-primary py-2 px-4 text-sm">
          <HiPlus className="w-4 h-4" />
          New Trip
        </button>
      </div>

      {trips.length > 0 && (
        <div className="relative mb-6">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" className="input-field pl-12" placeholder="Search destinations..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3 animate-fade-in">
          {filtered.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={(id) => setDeleteId(id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="card p-10 text-center animate-fade-in">
          <span className="text-5xl">🗺️</span>
          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mt-4">
            No trips yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
            Plan your first adventure with AI
          </p>
          <button onClick={() => navigate('/planner')} className="btn-primary mx-auto">
            Plan a Trip
          </button>
        </div>
      ) : (
        <div className="card p-8 text-center animate-fade-in">
          <span className="text-4xl">🔍</span>
          <p className="font-display font-semibold text-gray-900 dark:text-white mt-3">
            No results for "{search}"
          </p>
          <button onClick={() => setSearch('')} className="text-sm text-primary-600 dark:text-primary-400 mt-2">
            Clear search
          </button>
        </div>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Trip" size="sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Are you sure you want to delete this trip? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-2xl transition-colors">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
