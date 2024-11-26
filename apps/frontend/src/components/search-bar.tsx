import { type ChangeEvent, type FC, type FormEvent, useState } from 'react';

interface SearchBarProperties {
  className?: string;
  onSearch?: (search: string) => void;
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProperties> = ({ 
  placeholder = "Rechercher...",
  onSearch = () => {},
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`relative max-w-2xl w-full ${className}`}
    >
      <div className={`
        flex items-center rounded-lg border w-full
        ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}
        bg-white transition-all duration-200
      `}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M16.65 9.35A7.35 7.35 0 1 1 9.35 2a7.35 7.35 0 0 1 7.3 7.35z"
          />
        </svg>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 pr-3 pl-10 outline-none placeholder:text-gray-400 text-gray-500"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 hover:text-gray-600"
            aria-label="Effacer la recherche"
          >
            {/* Icône X en Unicode */}
            <span className="text-gray-400">&#10005;</span>
          </button>
        )}
      </div>
    </form>
  );
};