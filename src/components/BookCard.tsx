import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookAvailability } from '../types/book';
import { Book as BookIcon, ChevronRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const getAvailabilityBadge = (status: BookAvailability) => {
  switch (status) {
    case 'Available':
      return {
        label: 'Available',
        classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      };
    case 'Rented':
      return {
        label: 'Rented',
        classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      };
    case 'Reserved':
      return {
        label: 'Reserved',
        classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      };
    case 'Coming Soon':
      return {
        label: 'Coming Soon',
        classes: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
      };
    case 'Unavailable':
    default:
      return {
        label: 'Unavailable',
        classes: 'bg-stone-500/15 text-stone-400 border-stone-500/30'
      };
  }
};

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(!book.cover_image);

  const badge = getAvailabilityBadge(book.availability);

  return (
    <Link
      to={`/books/${book.id}`}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group relative transition-all duration-300 hover:-translate-y-1"
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[2/3] w-full bg-stone-900 overflow-hidden flex items-center justify-center">
        {!imageError && book.cover_image ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-stone-900/60 animate-pulse flex items-center justify-center">
                <BookIcon className="w-8 h-8 text-stone-700" />
              </div>
            )}
            <img
              src={book.cover_image}
              alt={book.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-900 border-b border-white/5">
            <BookIcon className="w-10 h-10 text-stone-600 mb-2" />
            <span className="font-display font-medium text-xs text-stone-400 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        {/* Status Badge overlay */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={`inline-block px-2 py-0.5 text-[11px] font-medium tracking-wide rounded-full border backdrop-blur-md shadow-sm ${badge.classes}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Featured Star if marked */}
        {book.featured && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-accent/90 text-stone-950 shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Book Information Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Genre tag */}
          <span className="text-[10px] sm:text-xs font-medium text-accent-light tracking-wide uppercase">
            {book.genre || 'General'}
          </span>

          {/* Title */}
          <h3 className="font-display font-semibold text-base sm:text-lg text-stone-100 group-hover:text-accent transition-colors line-clamp-1 leading-snug mt-0.5">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs sm:text-sm text-stone-400 line-clamp-1 font-light">
            by {book.author}
          </p>
        </div>

        {/* Footer info: Rental price & arrow */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between mt-auto">
          <div>
            <span className="text-sm sm:text-base font-semibold text-stone-200">
              ₹{book.rental_price}
            </span>
            <span className="text-[11px] text-stone-400 font-light ml-1">
              / {book.rental_duration || 7} days
            </span>
          </div>

          <span className="inline-flex items-center text-xs text-accent font-medium group-hover:translate-x-0.5 transition-transform">
            View
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
