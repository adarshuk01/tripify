import { useNavigate } from 'react-router-dom';
import {
  HiChevronRight, HiLogout, HiUser, HiShieldCheck,
  HiCreditCard, HiLink, HiColorSwatch, HiChartBar,
  HiQuestionMarkCircle, HiViewGrid
} from 'react-icons/hi';
import { MdStar, MdAdminPanelSettings } from 'react-icons/md';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import TripifyLogo from '../components/common/TripifyLogo';

const settingsItems = [
  { icon: HiViewGrid,           label: 'Travel Preferences', path: '/profile', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { icon: HiUser,               label: 'Personal Info',       path: '/profile', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  { icon: HiShieldCheck,        label: 'Account & Security',  path: null,       color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  { icon: MdStar,               label: 'Billing & Subscriptions', path: null,   color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  { icon: HiCreditCard,         label: 'Payment Methods',     path: null,       color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
  { icon: HiLink,               label: 'Linked Accounts',     path: null,       color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
  { icon: HiColorSwatch,        label: 'App Appearance',      path: null,       color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
  { icon: HiChartBar,           label: 'Data & Analytics',    path: null,       color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  { icon: HiQuestionMarkCircle, label: 'Help & Support',      path: null,       color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();

  const isAdmin = user?.role === 'admin';

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TripifyLogo size={28} />
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Admin panel banner — only visible to admins */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full mb-4 bg-purple-600 hover:bg-purple-700 rounded-2xl p-4 flex items-center justify-between transition-colors shadow-lg shadow-purple-500/25 overflow-hidden relative">
          <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
              <MdAdminPanelSettings className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-white text-sm leading-tight">Admin Panel</p>
              <p className="text-purple-200 text-xs mt-0.5">Manage users and roles</p>
            </div>
          </div>
          <HiChevronRight className="w-5 h-5 text-white/70 flex-shrink-0 relative z-10" />
        </button>
      )}

      {/* Upgrade banner */}
      <div className="bg-primary-500 rounded-2xl p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 overflow-hidden relative">
        <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-16 top-0 w-8 h-8 rounded-full bg-white/10" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
            <MdStar className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">Upgrade Plan to Unlock More!</p>
            <p className="text-primary-100 text-xs mt-0.5">Enjoy all the benefits and explore more possibilities</p>
          </div>
        </div>
        <HiChevronRight className="w-5 h-5 text-white/70 flex-shrink-0 relative z-10" />
      </div>

      {/* All settings items */}
      <div className="card mb-4 divide-y divide-gray-100 dark:divide-gray-800">
        {settingsItems.map(({ icon: Icon, label, path, color }) => (
          <button key={label}
            onClick={() => path && navigate(path)}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl text-left">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{label}</span>
            </div>
            <HiChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Dark mode toggle */}
      <div className="card mb-4">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Dark Mode</span>
          </div>
          <button
            onClick={toggle}
            className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${isDark ? 'bg-primary-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <HiLogout className="w-5 h-5 text-red-500" />
        </div>
        <span className="font-bold text-sm">Logout</span>
      </button>
    </div>
  );
}
