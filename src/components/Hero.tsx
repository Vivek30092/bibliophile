import React from 'react';
import { ArrowRight, BookMarked, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="ambient-glow-1 -top-20 -left-20" />
      <div className="ambient-glow-2 top-40 -right-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent-light">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Local Homegrown Book Rental Library</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-stone-100 tracking-tight leading-[1.1]">
              Biblio<em className="text-accent font-normal italic">phile</em> Vibes
            </h1>

            <p className="font-display italic text-xl sm:text-2xl text-accent-light/90 font-light">
              A little library, waiting for your next story.
            </p>

            <p className="text-base sm:text-lg text-stone-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Discover books, borrow your favourites, and keep the stories moving. A curated home library in Indore for readers who love great books without the cost of owning them all.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm bg-accent text-stone-950 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <BookMarked className="w-4 h-4 text-accent" />
                <span>How It Works</span>
              </a>
            </div>
          </div>

          {/* Right Floating Books Presentation */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96">
              
              {/* Back book 1 */}
              <div className="absolute -left-6 top-8 w-44 sm:w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden -rotate-12 opacity-75 border border-white/10 animate-float-delayed">
                <img
                  src="https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg"
                  alt="The Alchemist"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Back book 2 */}
              <div className="absolute -right-6 top-12 w-44 sm:w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden rotate-12 opacity-80 border border-white/10 animate-float">
                <img
                  src="https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg"
                  alt="Pride and Prejudice"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Center Main Book */}
              <div className="absolute inset-x-6 top-0 w-52 sm:w-56 mx-auto aspect-[2/3] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] overflow-hidden border border-accent/40 z-20 group hover:scale-105 transition-transform duration-300">
                <img
                  src="https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"
                  alt="Atomic Habits"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-accent font-medium">Curated Top Pick</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
