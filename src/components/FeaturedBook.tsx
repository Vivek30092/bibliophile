import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types/book';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { generateBookWhatsAppLink } from '../utils/whatsapp';

interface FeaturedBookProps {
  book: Book;
}

export const FeaturedBook: React.FC<FeaturedBookProps> = ({ book }) => {
  return (
    <section className="my-16">
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-accent/30 p-6 sm:p-10">
        
        {/* Ambient Glow */}
        <div className="ambient-glow-1 -top-10 -right-10 opacity-70" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Cover image */}
          <div className="md:col-span-4 flex justify-center">
            <Link
              to={`/books/${book.id}`}
              className="relative w-48 sm:w-56 aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden border border-white/10 group block"
            >
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 flex items-center justify-center font-display text-accent">
                  📚
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent text-stone-950 shadow-md">
                  Book of the Week
                </span>
              </div>
            </Link>
          </div>

          {/* Details */}
          <div className="md:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Featured Spotlight</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-semibold text-stone-100">
              {book.title}
            </h2>

            <p className="text-sm sm:text-base text-accent-light font-display italic">
              by {book.author} &bull; <span className="font-sans text-xs uppercase tracking-wider text-stone-400 not-italic">{book.genre}</span>
            </p>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light line-clamp-3 sm:line-clamp-4">
              {book.description || 'A timeless, captivating story carefully curated from our collection. Available for local rental in Indore.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="text-sm">
                <span className="text-xl sm:text-2xl font-bold text-stone-100">₹{book.rental_price}</span>
                <span className="text-xs text-stone-400 ml-1">/ {book.rental_duration || 7} days rental</span>
              </div>

              {book.security_deposit && (
                <span className="text-xs text-stone-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                  Deposit: ₹{book.security_deposit} (Refundable)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to={`/books/${book.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-accent text-stone-950 hover:bg-accent-light transition-all"
              >
                <span>Read Full Synopsis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={generateBookWhatsAppLink(book)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Rent via WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
