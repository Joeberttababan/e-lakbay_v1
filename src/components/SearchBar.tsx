import React from 'react';
import { cn } from '../lib/utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className, placeholder = 'Search...', onSearch }) => {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'glass-secondary shadow-xl rounded-full flex items-center px-6 py-2 w-full max-w-xl text-white',
        className
      )}
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-lg px-2 text-white placeholder:text-white/70"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="ml-4 px-6 py-2 rounded-full bg-hero-gradient text-white font-semibold transition-colors hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
};
