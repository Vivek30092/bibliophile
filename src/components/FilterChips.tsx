import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FilterChipsProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedAvailability: string;
  onSelectAvailability: (availability: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  genres,
  selectedGenre,
  onSelectGenre,
  selectedAvailability,
  onSelectAvailability,
  onClearAll,
  hasActiveFilters,
  totalFilteredCount
}) => {
  const availabilityOptions = [
    { id: 'all', label: 'All Availability' },
    { id: 'Available', label: 'Available Now' },
    { id: 'Coming Soon', label: 'Coming Soon' },
    { id: 'Rented', label: 'Rented' }
  ];

  return (
    <div className="space-y-4 my-6">
      
      {/* Availability row + Clear All button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 mr-1">
            Status:
          </span>
          {availabilityOptions.map((opt) => {
            const isActive = selectedAvailability === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectAvailability(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent text-stone-950 font-semibold shadow-sm shadow-accent/20'
                    : 'bg-deep text-stone-300 hover:bg-white/5 border border-white/5'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-accent transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Genre row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
        <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 mr-1">
          Genre:
        </span>
        <button
          onClick={() => onSelectGenre('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            selectedGenre === 'all'
              ? 'bg-stone-200 text-stone-950 font-semibold'
              : 'bg-deep text-stone-400 hover:text-stone-200 border border-white/5'
          }`}
        >
          All Genres
        </button>

        {genres.map((genre) => {
          const isActive = selectedGenre.toLowerCase() === genre.toLowerCase();
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-accent text-stone-950 font-semibold'
                  : 'bg-deep text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-white/5'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Count summary */}
      <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
        <span>Showing {totalFilteredCount} {totalFilteredCount === 1 ? 'book' : 'books'}</span>
      </div>

    </div>
  );
};
