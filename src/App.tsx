import React, { useEffect, useRef, useState } from 'react';
import { NavBar } from './components/NavBar';
import { ModalProvider } from './components/ModalContext';
import { GlobalModal } from './components/GlobalModal';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { ProductsPage } from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import { SonnerGlobal } from './components/modern-ui/sonner';
import loadingVideo from './assets/Loading_chatbot.webm';

const AppContent: React.FC = () => {
  const [active, setActive] = useState<'login' | 'signup'>('login');
  const { user, profile, loading, signOut } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [view, setView] = useState<'home' | 'dashboard' | 'destinations' | 'profile' | 'products'>(() => {
    if (typeof window === 'undefined') return 'home';
    const stored = window.localStorage.getItem('elakbay:view');
    if (
      stored === 'home' ||
      stored === 'dashboard' ||
      stored === 'destinations' ||
      stored === 'profile' ||
      stored === 'products'
    ) {
      return stored;
    }
    return 'home';
  });
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('elakbay:profileId');
  });
  const lastScrollKeyRef = useRef<string | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const scrollAttemptRef = useRef(0);

  useEffect(() => {
    if (!user && view === 'dashboard') {
      setView('home');
    }
    if (view === 'profile' && !selectedProfileId) {
      setView('home');
    }
  }, [user, view, selectedProfileId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('elakbay:view', view);
  }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedProfileId) {
      window.localStorage.setItem('elakbay:profileId', selectedProfileId);
    } else {
      window.localStorage.removeItem('elakbay:profileId');
    }
  }, [selectedProfileId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextKey = `${view}:${selectedProfileId ?? ''}`;
    if (lastScrollKeyRef.current !== nextKey) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      lastScrollKeyRef.current = nextKey;
    }
  }, [view, selectedProfileId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 640);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (view !== 'home' || !pendingScrollId) return;

    const tryScroll = () => {
      const target = document.getElementById(pendingScrollId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPendingScrollId(null);
        scrollAttemptRef.current = 0;
        return;
      }

      if (scrollAttemptRef.current < 10) {
        scrollAttemptRef.current += 1;
        window.setTimeout(tryScroll, 120);
      } else {
        setPendingScrollId(null);
        scrollAttemptRef.current = 0;
      }
    };

    window.setTimeout(tryScroll, 0);
  }, [view, pendingScrollId]);

  const handleJumpToSection = (sectionId: string) => {
    if (view !== 'home') {
      setView('home');
    }
    setPendingScrollId(sectionId);
  };

  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col">
        <div className="relative">
          <NavBar
            active={active}
            onActiveChange={setActive}
            isAuthenticated={Boolean(user)}
            profile={profile}
            onDashboard={() => setView('dashboard')}
            onLogout={signOut}
            onHome={() => setView('home')}
            onJumpToSection={handleJumpToSection}
          />
          {user && view === 'dashboard' ? (
            <DashboardPage profile={profile} />
          ) : view === 'profile' && selectedProfileId ? (
            <ProfilePage
              profileId={selectedProfileId}
              onBackHome={() => setView('home')}
            />
          ) : view === 'destinations' ? (
            <DestinationsPage
              onBackHome={() => setView('home')}
              onViewProfile={(profileId) => {
                setSelectedProfileId(profileId);
                setView('profile');
              }}
            />
          ) : view === 'products' ? (
            <ProductsPage
              onBackHome={() => setView('home')}
              onViewProfile={(profileId) => {
                setSelectedProfileId(profileId);
                setView('profile');
              }}
            />
          ) : (
            <HomePage
              onViewDestinations={() => setView('destinations')}
              onViewProducts={() => setView('products')}
              onViewProfile={(profileId) => {
                setSelectedProfileId(profileId);
                setView('profile');
              }}
            />
          )}
        </div>
        <GlobalModal onModeChange={setActive} />
      </div>
      <SonnerGlobal />
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
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
