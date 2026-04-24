import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-tripify-dark flex flex-col">
      <div className="relative bg-primary-500 pt-14 pb-20 px-6 overflow-hidden flex-shrink-0">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10" />
        <div className="absolute top-6 left-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 right-16 w-32 h-32 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-2xl flex items-center justify-center mb-4">
            <TripifyLogo size={52} />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Join Tripify</h1>
          <p className="text-primary-100 text-sm mt-1">Start planning smarter journeys</p>
        </div>
      </div>

      <div className="flex-1 -mt-8 bg-white dark:bg-tripify-dark rounded-t-3xl px-6 pt-8 pb-10 shadow-[0_-4px_30px_rgba(0,0,0,0.08)] max-w-md mx-auto w-full">
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Create account ✨</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-7">Your adventure starts here</p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" name="name" className="input-field pl-12" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" name="email" className="input-field pl-12" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPwd ? 'text' : 'password'} name="password" className="input-field pl-12 pr-12"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
                {showPwd ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base mt-2">
            {isLoading ? <Loader size="sm" color="white" /> : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
