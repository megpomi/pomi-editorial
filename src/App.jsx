import { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { applyThemePreference, readThemePreference } from '@/lib/theme';
import ConsentBanner from '@/components/consent/ConsentBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Start from '@/pages/Start';
import Upgrade from '@/pages/Upgrade';
import CycleCalendar from '@/pages/CycleCalendar';
import LogPeriod from '@/pages/LogPeriod';
import CauseDetail from '@/pages/CauseDetail';
import Profile from '@/pages/Profile';
import Privacy from '@/pages/Privacy';
import DataExport from '@/pages/DataExport';
import ThankYou from '@/pages/ThankYou';
import Mission from '@/pages/Mission';
import Donations from '@/pages/Donations';
import InTheNews from '@/pages/InTheNews';
import LogToday from '@/pages/LogToday';
import DeleteAccount from '@/pages/DeleteAccount';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Unsubscribe from '@/pages/Unsubscribe';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/ThankYou" element={<ThankYou />} />
      <Route path="/" element={<Start />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/unsubscribe" element={<Unsubscribe />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/calendar" element={<CycleCalendar />} />
        <Route path="/log-period" element={<LogPeriod />} />
        <Route path="/log-today" element={<LogToday />} />
        <Route path="/causes/:causeValue" element={<CauseDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/request-data" element={<DataExport />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/news" element={<InTheNews />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


// Follow the phone's own light or dark setting until a choice is made in the
// profile, which is then kept on the device.
const useSystemTheme = () => {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => applyThemePreference(readThemePreference());
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
};

function App() {
  useSystemTheme();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <ConsentBanner />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App