import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff, HiArrowLeft } from 'react-icons/hi';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import useAuthStore from '../store/authStore';
import TripifyLogo from '../components/common/TripifyLogo';
import Loader from '../components/common/Loader';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    clearError();
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
  };

  const perks = [
    { icon: '🗺️', text: 'AI-powered itineraries' },
    { icon: '💾', text: 'Save & revisit trips' },
    { icon: '✈️', text: 'Smart travel planning' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-tripify-dark">
      {/* Decorative top section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-primary-500 to-primary-600 pt-12 pb-24 px-6 flex-shrink-0">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute top-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-20 w-40 h-40 rounded-full bg-black/10" />
        <div className="absolute bottom-4 left-8 w-16 h-16 rounded-full bg-white/10" />

        {/* Logo + headline */}
        <div className="relative z-10 flex flex-col items-center text-center mt-4">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl shadow-black/20 flex items-center justify-center mb-5">
            <TripifyLogo size={52} />
          </div>
          <h1 className="font-display font-bold text-4xl text-white tracking-tight">Join Tripify</h1>
          <p className="text-white/70 text-sm mt-2 font-medium">Your adventure starts here</p>
        </div>
      </div>

      {/* Form card - overlaps hero */}
      <div className="flex-1 relative -mt-10 z-10">
        <div className="bg-white dark:bg-tripify-dark rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] px-6 pt-8 pb-12 max-w-md mx-auto w-full min-h-full">

          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Create account ✨</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 mb-5">It's free, forever.</p>

          {/* Perks */}
          <div className="flex gap-3 mb-6">
            {perks.map(({ icon, text }) => (
              <div key={text} className="flex-1 bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-2.5 text-center">
                <div className="text-lg mb-1">{icon}</div>
                <p className="text-[10px] font-semibold text-primary-700 dark:text-primary-400 leading-tight">{text}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <MdPerson className="w-5 h-5 text-primary-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl pl-16 pr-4 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <MdEmail className="w-5 h-5 text-primary-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl pl-16 pr-4 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <MdLock className="w-5 h-5 text-primary-500" />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl pl-16 pr-14 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm font-medium"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                >
                  {showPwd ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {isLoading ? <Loader size="sm" color="white" /> : (
                <>
                  <span>Create Account</span>
                  <span className="text-xl">🚀</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <span className="text-xs text-gray-300 dark:text-gray-600 font-semibold tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          {/* Login link */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="inline-block mt-1 text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
