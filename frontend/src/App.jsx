import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import MyTripsPage from './pages/MyTripsPage';
import SavedTripsPage from './pages/SavedTripsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { initAuth } = useAuthStore();
  const { init } = useThemeStore();

  useEffect(() => {
    initAuth();
    init();
  }, [initAuth, init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/admin"    element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<HomePage />} />
          <Route path="planner"       element={<PlannerPage />} />
          <Route path="itinerary/:id" element={<ItineraryPage />} />
          <Route path="trips"         element={<MyTripsPage />} />
          <Route path="saved"         element={<SavedTripsPage />} />
          <Route path="settings"      element={<SettingsPage />} />
          <Route path="profile"       element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
