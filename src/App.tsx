import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { ModalProvider } from './components/ModalContext';
import { GlobalModal } from './components/GlobalModal';

const App: React.FC = () => {
  const [active, setActive] = useState<'login' | 'signup'>('login');

  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar
          active={active}
          onActiveChange={setActive}
        />
        <HeroSection>
          <SearchBar />
        </HeroSection>
        <GlobalModal />
      </div>
    </ModalProvider>
  );
};

export default App;
