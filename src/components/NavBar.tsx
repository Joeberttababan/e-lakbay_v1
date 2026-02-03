import React from 'react';
import { Button } from './modern-ui/button';
import { cn } from '../lib/utils';
import { useModal } from './ModalContext';

interface NavBarProps {
  active: 'login' | 'signup';
  onActiveChange: (active: 'login' | 'signup') => void;
}

export const NavBar: React.FC<NavBarProps> = ({ active, onActiveChange }) => {
  const { openModal } = useModal();
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="font-bold text-xl select-none">E-Lakbay</div>
      {/* Navigation Items */}
      <div className="flex items-center gap-6">
        <span className="text-gray-700 cursor-pointer hover:text-black transition-colors">Destinations</span>
        <span className="text-gray-700 cursor-pointer hover:text-black transition-colors">Municipalities</span>
        <Button
          variant={active === 'login' ? 'default' : 'outline'}
          className={cn('rounded-full px-5 py-2 font-medium transition-colors', active === 'login' ? 'shadow-md' : '')}
          onClick={() => {
            onActiveChange('login');
            openModal('login');
          }}
        >
          Log In
        </Button>
        <Button
          variant={active === 'signup' ? 'default' : 'outline'}
          className={cn('rounded-full px-5 py-2 font-medium transition-colors', active === 'signup' ? 'shadow-md' : '')}
          onClick={() => {
            onActiveChange('signup');
            openModal('signup');
          }}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};
