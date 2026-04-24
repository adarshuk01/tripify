import { useState, useEffect, useCallback } from 'react';
import {
  HiUsers, HiShieldCheck, HiSearch, HiTrash, HiChartBar,
  HiArrowLeft, HiRefresh, HiUserAdd,
} from 'react-icons/hi';
import { MdAdminPanelSettings, MdBlock, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Loader from '../components/common/Loader';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user: me } = useAuthStore();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // id of user being mutated
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch { /* silent */ }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search, page, limit: 15 } });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setActionId(u._id);
    try {
      await api.patch(`/admin/users/${u._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, role: newRole } : x));
      showToast(`${u.name} is now ${newRole}`);
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error');
    } finally { setActionId(null); }
  };

  const handleStatusToggle = async (u) => {
    const newStatus = !u.isActive;
    setActionId(u._id + 'status');
    try {
      await api.patch(`/admin/users/${u._id}/status`, { isActive: newStatus });
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, isActive: newStatus } : x));
      showToast(`${u.name} ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally { setActionId(null); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    setActionId(u._id + 'del');
    try {
      await api.delete(`/admin/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      setTotal((t) => t - 1);
      showToast(`${u.name} deleted`);
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally { setActionId(null); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-tripify-dark pb-28">
      {/* Header */}
      <div className="bg-white dark:bg-tripify-card border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <HiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <MdAdminPanelSettings className="w-6 h-6 text-primary-500" />
          <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white flex-1">Admin Panel</h1>
          <button onClick={() => { fetchStats(); fetchUsers(); }}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
            <HiRefresh className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all
            ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {toast.msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={HiUsers}      label="Total Users"    value={stats?.totalUsers}   color="text-blue-500 bg-blue-50 dark:bg-blue-900/20" />
          <StatCard icon={HiShieldCheck} label="Admins"        value={stats?.adminCount}   color="text-purple-500 bg-purple-50 dark:bg-purple-900/20" />
          <StatCard icon={HiChartBar}   label="Active"         value={stats?.activeCount}  color="text-green-500 bg-green-50 dark:bg-green-900/20" />
          <StatCard icon={HiUserAdd}    label="New This Month" value={stats?.newThisMonth} color="text-amber-500 bg-amber-50 dark:bg-amber-900/20" />
        </div>

        {/* Search */}
        <div className="relative">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="input-field pl-12"
          />
        </div>

        {/* Users table */}
        <div className="card divide-y divide-gray-100 dark:divide-gray-800 overflow-visible">
          {loading ? (
            <div className="flex justify-center py-12"><Loader size="lg" /></div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">No users found</div>
          ) : (
            users.map((u) => (
              <div key={u._id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow
                  ${u.role === 'admin' ? 'bg-purple-500' : 'bg-primary-500'}`}>
                  {u.avatar
                    ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full" />
                    : u.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{u.name}</p>
                    {u.role === 'admin' && (
                      <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        ADMIN
                      </span>
                    )}
                    {!u.isActive && (
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                {u._id !== me?.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Toggle admin */}
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={actionId === u._id}
                      title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      className={`p-2 rounded-xl transition-colors disabled:opacity-50
                        ${u.role === 'admin'
                          ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100'
                          : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}>
                      {actionId === u._id ? <Loader size="sm" /> : <HiShieldCheck className="w-4 h-4" />}
                    </button>

                    {/* Toggle active */}
                    <button
                      onClick={() => handleStatusToggle(u)}
                      disabled={actionId === u._id + 'status'}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                      className={`p-2 rounded-xl transition-colors disabled:opacity-50
                        ${u.isActive
                          ? 'text-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100'
                          : 'text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100'}`}>
                      {actionId === u._id + 'status' ? <Loader size="sm" /> :
                        u.isActive ? <MdCheckCircle className="w-4 h-4" /> : <MdBlock className="w-4 h-4" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={actionId === u._id + 'del'}
                      title="Delete user"
                      className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                      {actionId === u._id + 'del' ? <Loader size="sm" /> : <HiTrash className="w-4 h-4" />}
                    </button>
                  </div>
                )}
                {u._id === me?.id && (
                  <span className="text-xs text-gray-400 italic flex-shrink-0">You</span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pb-4">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">← Prev</button>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
