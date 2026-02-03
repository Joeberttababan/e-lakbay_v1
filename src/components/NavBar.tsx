import React from 'react';
import { Button } from './modern-ui/button';
import { cn } from '../lib/utils';
import { useModal } from './ModalContext';
import logo from '../assets/E-lakbay_Logo.svg';

interface NavBarProps {
  active: 'login' | 'signup';
  onActiveChange: (active: 'login' | 'signup') => void;
}

export const NavBar: React.FC<NavBarProps> = ({ active, onActiveChange }) => {
  const { openModal } = useModal();
  return (
    <nav className="absolute top-0 left-0 z-20 w-full flex items-center justify-between px-8 py-4 text-white pb-8">
      {/* Logo */}
      <div className="select-none">
        <img 
          src={logo} 
          alt="E-Lakbay" 
          className="h-8 md:h-13 w-auto opacity-75"
        />
      </div>
      {/* Navigation Items */}
      <div className="flex items-center gap-6">
        <span className=" cursor-pointer hover:text-black transition-colors">Destinations</span>
        <span className=" cursor-pointer hover:text-black transition-colors">Municipalities</span>
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
