import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiSun, HiMoon } from 'react-icons/hi';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';
import TripifyLogo from '../common/TripifyLogo';

const titles = {
  '/': 'Tripify',
  '/planner': 'Plan Trip',
  '/saved': 'Saved Trips',
  '/settings': 'Settings',
  '/profile': 'Personal Info',
};

export default function Navbar() {
  const { isDark, toggle } = useThemeStore();
  const { user, token } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const title = titles[pathname] || (pathname.startsWith('/itinerary') ? 'Itinerary' : 'Tripify');
  const isItinerary = pathname.startsWith('/itinerary');

  if (isItinerary) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-tripify-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <TripifyLogo size={28} />
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white hidden sm:block">Tripify</span>
        </Link>

        <span className="sm:hidden font-display font-bold text-lg text-gray-900 dark:text-white absolute left-1/2 -translate-x-1/2">
          {title}
        </span>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
            {isDark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
          </button>

          {token && user ? (
            <button
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold hover:bg-primary-600 transition-colors"
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
