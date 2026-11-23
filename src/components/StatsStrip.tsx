import React from 'react';
import { BookOpen, IndianRupee, MapPin } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  return (
    <section className="relative z-10 -mt-4 mb-12 sm:mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          
          <div className="flex items-center gap-4 pt-2 sm:pt-0 sm:px-4 first:pt-0 first:px-0">
            <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-stone-100">
                50+ Books
              </div>
              <div className="text-xs sm:text-sm text-stone-400">
                In active collection & growing
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-stone-100">
                ₹30+ Affordable
              </div>
              <div className="text-xs sm:text-sm text-stone-400">
                Rental rate per 7 days
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-stone-100">
                Indore Library
              </div>
              <div className="text-xs sm:text-sm text-stone-400">
                Home library in Sukhliya
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
