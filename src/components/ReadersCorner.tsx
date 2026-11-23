import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

export const ReadersCorner: React.FC = () => {
  return (
    <section id="readers-corner" className="py-20 border-t border-white/5 bg-darkest/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Community & Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-100 mt-2">
            Reader's Corner
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light mt-3">
            Quotes, recommendations, and literary musings from our bookshelf.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Currently reading sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-4">
                Currently Reading at Library
              </span>
              <div className="flex items-center gap-4">
                <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-md">
                  <img
                    src="https://covers.openlibrary.org/b/isbn/9781447233749-L.jpg"
                    alt="Meet me under the clock"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                    Staff Pick
                  </span>
                  <h4 className="font-display font-semibold text-base text-stone-100 mt-0.5">
                    Meet me under the clock
                  </h4>
                  <p className="text-xs text-stone-400">Annie Murray</p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                Reading Pairings
              </span>
              <p className="text-xs text-stone-300 font-display italic leading-relaxed">
                "If you loved <strong className="text-stone-100 not-italic">Atomic Habits</strong>, pair it with <strong className="text-stone-100 not-italic">Ikigai</strong> — small daily routines paired with deep soulful purpose."
              </p>
            </div>
          </div>

          {/* Quotes and recommendations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Featured Quote */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-accent relative overflow-hidden">
              <Quote className="w-12 h-12 text-accent/15 absolute right-4 top-4" />
              <blockquote className="font-display italic text-lg sm:text-2xl text-stone-200 leading-snug">
                "A reader lives a thousand lives before he dies. The man who never reads lives only one."
              </blockquote>
              <footer className="mt-3 text-xs sm:text-sm text-accent font-sans">
                — George R.R. Martin
              </footer>
            </div>

            {/* Grid of short recs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-accent-light font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Emotional Drama</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  "<strong>The Kite Runner</strong> is one of those rare novels that stays with you for months after the final page."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-accent-light font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gripping Thriller</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  "Looking for something addictive? Pick up <strong>The Silent Patient</strong> on a Friday night."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
