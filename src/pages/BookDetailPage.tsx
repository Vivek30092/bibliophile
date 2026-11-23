import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Book } from '../types/book';
import { getAvailabilityBadge } from '../components/BookCard';
import { generateBookWhatsAppLink } from '../utils/whatsapp';
import {
  ArrowLeft,
  Calendar,
  Shield,
  BookOpen,
  FileText,
  Barcode,
  Sparkles,
  MessageCircle,
  Share2,
  Check
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadBook() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await bookService.getBookById(id);
        if (isMounted) {
          setBook(data);
          if (data?.cover_image) {
            setActiveImage(data.cover_image);
          }
        }
      } catch (err) {
        console.error('Error fetching book detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadBook();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // CRITICAL NAVIGATION: Safe Back-Button Handler
  const handleBack = () => {
    // If the user arrived from within the app and history exists, go back to restore catalogue state
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Fallback safe navigation to catalogue
      navigate('/');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title || 'Bibliophile Vibes Book',
          text: `Check out "${book?.title}" by ${book?.author} on Bibliophile Vibes!`,
          url: window.location.href
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto animate-pulse space-y-8">
        <div className="h-6 w-36 bg-stone-800 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 aspect-[2/3] bg-stone-800 rounded-2xl" />
          <div className="md:col-span-7 space-y-4">
            <div className="h-4 w-24 bg-stone-800 rounded" />
            <div className="h-8 w-3/4 bg-stone-800 rounded" />
            <div className="h-4 w-1/2 bg-stone-800 rounded" />
            <div className="h-24 w-full bg-stone-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 mb-4">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-stone-100">
          Book Not Found
        </h2>
        <p className="text-stone-400 text-sm mt-2 max-w-sm">
          The book you are looking for does not exist or may have been archived.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-accent text-stone-950 hover:bg-accent-light transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Book Catalogue</span>
        </button>
      </div>
    );
  }

  const badge = getAvailabilityBadge(book.availability);
  const waLink = generateBookWhatsAppLink(book);
  const allImages = [book.cover_image, ...(book.cover_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar / Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-deep hover:bg-white/10 text-stone-300 hover:text-stone-100 border border-white/10 transition-all cursor-pointer group"
            aria-label="Back to Catalogue"
          >
            <ArrowLeft className="w-4 h-4 text-accent group-hover:-translate-x-1 transition-transform" />
            <span>Back to Catalogue</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-deep hover:bg-white/10 text-stone-300 border border-white/10 transition-all"
            title="Share Book Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-stone-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden glass-card border border-white/10 shadow-2xl">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 flex items-center justify-center font-display text-4xl text-accent">
                  📚
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-md ${badge.classes}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Thumbnail selector if secondary covers exist */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-accent shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Full Details */}
          <div className="md:col-span-7 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-light mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{book.genre || 'General Fiction'}</span>
                <span className="text-stone-600">&bull;</span>
                <span className="text-stone-400 font-mono text-[11px]">ID: {book.id}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-semibold text-stone-100 leading-tight">
                {book.title}
              </h1>

              <p className="font-display italic text-lg sm:text-xl text-stone-300 mt-1">
                by <span className="text-accent-light font-medium">{book.author}</span>
              </p>
            </div>

            {/* Pricing Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-display text-3xl sm:text-4xl font-bold text-stone-100">
                    ₹{book.rental_price}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-400 ml-1.5 font-light">
                    for {book.rental_duration || 7} days rental
                  </span>
                </div>

                {book.mrp && (
                  <div className="text-xs text-stone-500">
                    Original MRP: <span className="line-through">₹{book.mrp}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security Deposit: <strong className="text-stone-100">₹{book.security_deposit}</strong> (Refundable)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Rental CTA */}
            <div className="space-y-3 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-base bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Rent This Book on WhatsApp</span>
              </a>

              <p className="text-center text-[11px] text-stone-500">
                Direct chat with Bibliophile Vibes Indore &bull; Fast confirmation &bull; No upfront sign-up required
              </p>
            </div>

            {/* Synopsis */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h3 className="font-display text-xl font-semibold text-stone-200">
                Synopsis
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                {book.description || 'No detailed synopsis provided for this book yet. Contact us on WhatsApp for reading recommendations and book condition notes!'}
              </p>
            </div>

            {/* Book Meta Specifications */}
            <div className="pt-6 border-t border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
                Book Specifications
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>Duration</span>
                  </div>
                  <div className="text-xs font-medium text-stone-200">
                    {book.rental_duration || 7} Days
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span>Pages</span>
                  </div>
                  <div className="text-xs font-medium text-stone-200">
                    {book.pages ? `${book.pages} pages` : 'Standard'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-stone-500">
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Condition</span>
                  </div>
                  <div className="text-xs font-medium text-stone-200">
                    {book.condition || 'Good'}
                  </div>
                </div>

                {book.isbn && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <Barcode className="w-3.5 h-3.5 text-accent" />
                      <span>ISBN</span>
                    </div>
                    <div className="text-xs font-mono font-medium text-stone-200 truncate">
                      {book.isbn}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
