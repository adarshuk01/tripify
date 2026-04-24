import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome, HiBookmark, HiCog } from 'react-icons/hi';
import { MdAddCircle } from 'react-icons/md';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/',        icon: HiHome,     label: 'Home'    },
  { to: '/saved',   icon: HiBookmark, label: 'Saved'   },
  { to: '/planner', icon: null,       label: 'Plan', isCenter: true },
  { to: '/settings',icon: HiCog,      label: 'Settings'},
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleSaved = (e) => {
    if (!token) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-tripify-card border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label, isCenter }) => {
          if (isCenter) {
            return (
              <button key="plan" onClick={() => navigate('/planner')}
                className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-xl shadow-primary-500/40 hover:bg-primary-600 transition-colors active:scale-95">
                  <MdAddCircle className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 font-medium">{label}</span>
              </button>
            );
          }
          return (
            <NavLink key={to + label} to={to} end={to === '/'}
              onClick={to === '/saved' ? handleSaved : undefined}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                  isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}>
              {({ isActive }) => (
                <>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : ''}`} />
                  <span className="text-xs font-medium">{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
