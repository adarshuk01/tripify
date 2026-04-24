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
import SavedTripsPage from './pages/SavedTripsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Only blocks access if not logged in
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

// Redirects logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/" replace />;
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
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        <Route path="/" element={<Layout />}>
          {/* Public routes - accessible without login */}
          <Route index element={<HomePage />} />
          <Route path="planner" element={<PlannerPage />} />
          {/* Protected routes - require login */}
          <Route path="itinerary/:id" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
          <Route path="saved" element={<ProtectedRoute><SavedTripsPage /></ProtectedRoute>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
