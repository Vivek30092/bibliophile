import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Book } from '../types/book';
import { Hero } from '../components/Hero';
import { StatsStrip } from '../components/StatsStrip';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { BookCard } from '../components/BookCard';
import { FeaturedBook } from '../components/FeaturedBook';
import { HowItWorks } from '../components/HowItWorks';
import { RentalRules } from '../components/RentalRules';
import { ReadersCorner } from '../components/ReadersCorner';
import { BookOpen, SearchX, RotateCcw } from 'lucide-react';

export const CataloguePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state with URL params
  const searchQuery = searchParams.get('q') || '';
  const selectedGenre = searchParams.get('genre') || 'all';
  const selectedAvailability = searchParams.get('status') || 'all';

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await bookService.getBooks();
        if (isMounted) {
          setBooks(data);
        }
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle focusSearch URL parameter from navbar
  useEffect(() => {
    if (searchParams.get('focusSearch') === 'true') {
      const el = document.getElementById('catalogue');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 400);
      }
      // Remove the flag from URL cleanly
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('focusSearch');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    updateParam('q', val);
  };

  const handleGenreChange = (genre: string) => {
    updateParam('genre', genre);
  };

  const handleAvailabilityChange = (status: string) => {
    updateParam('status', status);
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Derive all unique genres dynamically from loaded books
  const uniqueGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach((b) => {
      if (b.genre) {
        // Genres might be formatted like "Romance / Fiction"
        const parts = b.genre.split('/').map((p) => p.trim());
        parts.forEach((p) => {
          if (p) genreSet.add(p);
        });
      }
    });
    return Array.from(genreSet).sort();
  }, [books]);

  // Featured book
  const featuredBook = useMemo(() => {
    return books.find((b) => b.featured) || books[0];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      // 1. Text Search (title & author)
      if (cleanSearch) {
        const titleMatch = book.title.toLowerCase().includes(cleanSearch);
        const authorMatch = book.author.toLowerCase().includes(cleanSearch);
        const genreMatch = book.genre.toLowerCase().includes(cleanSearch);
        if (!titleMatch && !authorMatch && !genreMatch) {
          return false;
        }
      }

      // 2. Genre Filter
      if (selectedGenre !== 'all') {
        const bookGenres = book.genre.toLowerCase();
        if (!bookGenres.includes(selectedGenre.toLowerCase())) {
          return false;
        }
      }

      // 3. Availability Filter
      if (selectedAvailability !== 'all') {
        if (selectedAvailability === 'Available' && book.availability !== 'Available') {
          return false;
        }
        if (selectedAvailability === 'Coming Soon' && !book.availability.toLowerCase().includes('coming')) {
          return false;
        }
        if (selectedAvailability === 'Rented' && book.availability !== 'Rented') {
          return false;
        }
      }

      return true;
    });
  }, [books, searchQuery, selectedGenre, selectedAvailability]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedGenre !== 'all' || selectedAvailability !== 'all'
  );

  const scrollToCatalogue = () => {
    const el = document.getElementById('catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* 1. Hero */}
      <Hero onExploreClick={scrollToCatalogue} />

      {/* 2. Stats Strip */}
      <StatsStrip />

      {/* 3. Featured Book of the Week */}
      {!loading && featuredBook && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedBook book={featuredBook} />
        </div>
      )}

      {/* 4. Book Catalogue Section */}
      <section id="catalogue" className="pt-16 pb-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Curated Shelves
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-stone-100 mt-2">
              Explore the Collection
            </h2>
            <p className="text-stone-400 text-sm sm:text-base font-light mt-3">
              Browse our library collection. Tap any book to inspect details or enquire for instant local rental.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              inputRef={searchInputRef}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Dynamic Filters */}
          <FilterChips
            genres={uniqueGenres}
            selectedGenre={selectedGenre}
            onSelectGenre={handleGenreChange}
            selectedAvailability={selectedAvailability}
            onSelectAvailability={handleAvailabilityChange}
            onClearAll={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            totalFilteredCount={filteredBooks.length}
          />

          {/* Book Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-stone-800/60" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 bg-stone-700/60 rounded" />
                    <div className="h-4 w-full bg-stone-700/60 rounded" />
                    <div className="h-3 w-24 bg-stone-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-4 glass-panel rounded-3xl border border-white/5 my-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 mx-auto mb-4">
                <SearchX className="w-8 h-8 text-accent/80" />
              </div>
              <h3 className="font-display font-semibold text-xl text-stone-200">
                No matching books found
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-sm mx-auto font-light leading-relaxed">
                We couldn't find any books matching your current search or filter combination.
              </p>
              <div className="pt-6">
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-accent text-stone-950 hover:bg-accent-light transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Rental Rules */}
      <RentalRules />

      {/* 7. Reader's Corner */}
      <ReadersCorner />

      {/* 8. About Section */}
      <section id="about" className="py-20 border-t border-white/5 bg-deep/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Our Story
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold text-stone-100">
                A small home library with a big heart.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
                Bibliophile Vibes started the way many good things do — with a shelf of beloved books, a genuine passion for reading, and a simple idea: what if the neighbourhood could share these stories?
              </p>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light">
                We are a homegrown, community-first library located in Sukhliya, Indore. Every title in our collection is curated with love so readers can enjoy great books without paying full bookstore retail prices.
              </p>
              <div className="pt-2">
                <a
                  href="/Terms%20%26%20Conditions%20_%20Bibliophile.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-accent hover:underline font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read our Rental Terms & Conditions (PDF)</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center max-w-sm space-y-4">
                <span className="text-5xl block">📚</span>
                <blockquote className="font-display italic text-xl text-stone-200">
                  "Borrow stories, not shelves."
                </blockquote>
                <p className="text-xs text-stone-400 font-sans">
                  — Bibliophile Vibes, Indore
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
