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
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 shadow-xl rounded-full flex items-center px-6 py-3 w-full max-w-xl',
        className
      )}
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-lg px-2"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="ml-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
};
