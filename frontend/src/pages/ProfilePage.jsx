import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiCamera, HiCheck } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { profileService } from '../services/profileService';
import useAuthStore from '../store/authStore';
import Loader from '../components/common/Loader';

const COUNTRIES = [
  'India', 'United States America', 'United Kingdom', 'Australia', 'Canada',
  'Germany', 'France', 'Japan', 'Singapore', 'UAE', 'South Africa', 'Brazil', 'Other',
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', country: '', gender: '', avatar: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await profileService.get();
      const p = data.data;
      setProfile(p);
      setForm({ name: p.name || '', phone: p.phone || '', country: p.country || '', gender: p.gender || '', avatar: p.avatar || '' });
    } catch { setError('Failed to load profile.'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setError(''); setSaved(false); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await profileService.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const initials = form.name
    ? form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-tripify-dark pb-28">
      {/* Header */}
      <div className="bg-white dark:bg-tripify-card border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2">
            <HiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white flex-1 text-center">Personal Info</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shadow-xl ring-4 ring-white dark:ring-gray-800">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-3xl text-primary-600 dark:text-primary-400">{initials}</span>
              )}
            </div>
            <button className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
              <HiCamera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
        {saved && (
          <div className="mb-5 p-3.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <HiCheck className="w-4 h-4" /> Profile saved successfully!
          </div>
        )}

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Full Name</p>
            <input type="text" name="name" className="input-field bg-gray-50 dark:bg-gray-800"
              value={form.name} onChange={handleChange} placeholder="Your full name" />
          </div>

          {/* Email — readonly */}
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Email</p>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" className="input-field pl-11 opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                value={profile?.email || ''} readOnly tabIndex={-1} />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-1">Email cannot be changed</p>
          </div>

          {/* Country */}
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Country</p>
            <div className="relative">
              <select name="country" className="input-field appearance-none pr-10 bg-gray-50 dark:bg-gray-800"
                value={form.country} onChange={handleChange}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm">▼</span>
            </div>
          </div>

          {/* Phone */}
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Phone Number</p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 flex-shrink-0 min-w-[72px]">
                <span className="text-base">🌍</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <input type="tel" name="phone" className="input-field flex-1 bg-gray-50 dark:bg-gray-800"
                value={form.phone} onChange={handleChange} placeholder="+91 000 000 0000" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Gender</p>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map((g) => (
                <button key={g}
                  onClick={() => { setForm((f) => ({ ...f, gender: g })); setSaved(false); }}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.gender === g
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Avatar URL input */}
        <div className="mt-5">
          <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">Profile Photo URL</p>
          <input type="url" name="avatar" className="input-field bg-gray-50 dark:bg-gray-800"
            value={form.avatar} onChange={handleChange} placeholder="https://..." />
          <p className="text-xs text-gray-400 mt-1.5 ml-1">Paste any image URL</p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4 text-base mt-8">
          {saving ? <Loader size="sm" color="white" /> : saved ? '✓ Saved!' : 'Save'}
        </button>
      </div>
    </div>
  );
}
