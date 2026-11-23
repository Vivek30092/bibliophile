import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabase';
import { Book } from '../types/book';
import { AdminBookModal } from '../components/AdminBookModal';
import { getAvailabilityBadge } from '../components/BookCard';
import {
  Shield,
  LogOut,
  Plus,
  Search,
  Edit2,
  Archive,
  BookOpen,
  CheckCircle,
  Clock,
  Layers,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    async function checkAuth() {
      const { user } = await authService.getSession();
      if (!user) {
        navigate('/admin/login', { replace: true });
      }
    }
    checkAuth();
  }, [navigate]);

  // Load books
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooksAdmin();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load admin books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    navigate('/admin/login');
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleArchiveBook = async (id: string) => {
    try {
      await bookService.archiveBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setConfirmArchiveId(null);
    } catch (err) {
      console.error('Failed to archive book:', err);
    }
  };

  const handleBookSaved = (saved: Book) => {
    setBooks((prev) => {
      const idx = prev.findIndex((b) => b.id === saved.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  // Inventory Statistics
  const stats = useMemo(() => {
    const total = books.length;
    const available = books.filter((b) => b.availability === 'Available').length;
    const rented = books.filter((b) => b.availability === 'Rented').length;
    const comingSoon = books.filter((b) => b.availability === 'Coming Soon').length;
    return { total, available, rented, comingSoon };
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((book) => {
      if (q) {
        const titleMatch = book.title.toLowerCase().includes(q);
        const authorMatch = book.author.toLowerCase().includes(q);
        const idMatch = book.id.toLowerCase().includes(q);
        if (!titleMatch && !authorMatch && !idMatch) return false;
      }
      if (statusFilter !== 'all' && book.availability !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [books, search, statusFilter]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-stone-100">
              Inventory Dashboard
            </h1>
            <p className="text-xs text-stone-400">
              Bibliophile Vibes Management Portal {!isSupabaseConfigured() && '(Local Storage Mode)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-stone-100 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={handleAddBook}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent text-stone-950 hover:bg-accent-light shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-medium">Total Books</div>
            <div className="font-display text-2xl font-bold text-stone-100">{stats.total}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-medium">Available</div>
            <div className="font-display text-2xl font-bold text-emerald-400">{stats.available}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-medium">Rented</div>
            <div className="font-display text-2xl font-bold text-rose-400">{stats.rented}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-medium">Coming Soon</div>
            <div className="font-display text-2xl font-bold text-sky-400">{stats.comingSoon}</div>
          </div>
        </div>

      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-deep border border-white/10 text-stone-100 text-xs focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['all', 'Available', 'Rented', 'Coming Soon'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-accent text-stone-950 font-semibold'
                  : 'bg-deep text-stone-300 hover:bg-white/5 border border-white/5'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Responsive Cards */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            Loading inventory records...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            No matching books found in inventory.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4 hidden md:table-cell">Genre</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Rental</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Deposit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {filteredBooks.map((b) => {
                  const badge = getAvailabilityBadge(b.availability);
                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded bg-stone-900 overflow-hidden shrink-0 border border-white/5">
                            {b.cover_image ? (
                              <img src={b.cover_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">📚</div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-100 text-sm line-clamp-1">{b.title}</div>
                            <div className="text-stone-400 text-xs">by {b.author}</div>
                            <div className="font-mono text-[10px] text-accent/80">{b.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell text-stone-400">
                        {b.genre}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-200">
                        ₹{b.rental_price} <span className="text-stone-400 text-[10px]">/{b.rental_duration || 7}d</span>
                      </td>

                      <td className="py-3 px-4 hidden sm:table-cell text-stone-400">
                        ₹{b.security_deposit}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => window.open(`/books/${b.id}`, '_blank')}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/5"
                            title="View Book Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEditBook(b)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-accent hover:bg-white/5"
                            title="Edit Book"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {confirmArchiveId === b.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleArchiveBook(b.id)}
                                className="px-2 py-1 rounded bg-rose-500 text-stone-950 font-bold text-[10px]"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmArchiveId(null)}
                                className="px-1.5 py-1 text-stone-400 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmArchiveId(b.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/5"
                              title="Archive Book"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add / Edit Book */}
      <AdminBookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleBookSaved}
      />

    </div>
  );
};
