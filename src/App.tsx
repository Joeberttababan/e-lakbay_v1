import React, { useEffect, useState } from 'react';
import { NavBar } from './components/NavBar';
import { ModalProvider } from './components/ModalContext';
import { GlobalModal } from './components/GlobalModal';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import loadingVideo from './assets/Loading_chatbot.webm';

const AppContent: React.FC = () => {
  const [active, setActive] = useState<'login' | 'signup'>('login');
  const { user, profile, loading, signOut } = useAuth();
  const [view, setView] = useState<'home' | 'dashboard'>('home');

  useEffect(() => {
    if (user) {
      setView('dashboard');
    } else {
      setView('home');
    }
  }, [user]);

  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="relative">
          <NavBar
            active={active}
            onActiveChange={setActive}
            isAuthenticated={Boolean(user)}
            profile={profile}
            onDashboard={() => setView('dashboard')}
            onLogout={signOut}
            onHome={() => setView('home')}
          />
          {user && view === 'dashboard' ? <DashboardPage profile={profile} /> : <HomePage />}
        </div>
        <GlobalModal onModeChange={setActive} />
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <video
            src={loadingVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-40 w-40 sm:h-52 sm:w-52"
          />
        </div>
      )}
    </ModalProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
