import React, { useState } from 'react';
import { Book, BookAvailability } from '../types/book';
import { bookService } from '../services/bookService';
import { X, Upload, AlertCircle } from 'lucide-react';

interface AdminBookModalProps {
  book?: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (book: Book) => void;
}

export const AdminBookModal: React.FC<AdminBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaved
}) => {
  const isEditing = Boolean(book);

  const [id, setId] = useState(book?.id || `BK${Math.floor(Math.random() * 900 + 100)}`);
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [genre, setGenre] = useState(book?.genre || 'Fiction');
  const [description, setDescription] = useState(book?.description || '');
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [pages, setPages] = useState<number>(book?.pages || 250);
  const [condition, setCondition] = useState(book?.condition || 'Good');
  const [rentalPrice, setRentalPrice] = useState<number>(book?.rental_price || 30);
  const [rentalDuration, setRentalDuration] = useState<number>(book?.rental_duration || 7);
  const [securityDeposit, setSecurityDeposit] = useState<number>(book?.security_deposit || 100);
  const [availability, setAvailability] = useState<BookAvailability>(book?.availability || 'Available');
  const [coverImage, setCoverImage] = useState(book?.cover_image || '');
  const [featured, setFeatured] = useState(book?.featured || false);
  const [mrp, setMrp] = useState<number | ''>(book?.mrp || '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const url = await bookService.uploadCoverImage(file);
      setCoverImage(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Upload failed: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload: Omit<Book, 'created_at' | 'updated_at'> = {
        id: id.trim(),
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        description: description.trim(),
        isbn: isbn.trim() || null,
        pages: Number(pages) || 0,
        condition: condition.trim(),
        rental_price: Number(rentalPrice) || 30,
        rental_duration: Number(rentalDuration) || 7,
        security_deposit: Number(securityDeposit) || 100,
        availability,
        cover_image: coverImage.trim(),
        featured,
        mrp: mrp ? Number(mrp) : null,
        is_archived: false
      };

      let result: Book;
      if (isEditing && book) {
        result = await bookService.updateBook(book.id, payload);
      } else {
        result = await bookService.createBook(payload);
      }

      onSaved(result);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save book.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-deep rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="font-display font-semibold text-2xl text-stone-100">
            {isEditing ? 'Edit Book Details' : 'Add New Book to Inventory'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Book ID *
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="BK055"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Availability Status *
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as BookAvailability)}
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Reserved">Reserved</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Alchemist"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Author *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Paulo Coelho"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Genre *
              </label>
              <input
                type="text"
                required
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Fiction / Adventure"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Rental Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={rentalPrice}
                onChange={(e) => setRentalPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={rentalDuration}
                onChange={(e) => setRentalDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Security Deposit (₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Condition
              </label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Like New / Good"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Pages
              </label>
              <input
                type="number"
                min="0"
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                placeholder="250"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="9780062315007"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="399"
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Cover Image (Upload file or direct URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://covers.openlibrary.org/b/isbn/..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
                />
                <label className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                  <Upload className="w-4 h-4 text-accent" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {coverImage && (
                <div className="mt-3 flex items-center gap-3 p-2 bg-base rounded-xl border border-white/5">
                  <img src={coverImage} alt="Cover preview" className="w-12 h-16 object-cover rounded" />
                  <span className="text-xs text-stone-400 truncate max-w-sm">{coverImage}</span>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Description / Synopsis
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short synopsis of the book..."
                className="w-full px-3.5 py-2 rounded-xl bg-base border border-white/10 text-stone-100 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-accent bg-base border-white/10 focus:ring-accent"
              />
              <label htmlFor="featured-check" className="text-xs text-stone-300 font-medium cursor-pointer">
                Feature as "Book of the Week" on the homepage
              </label>
            </div>

          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-100 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-accent text-stone-950 hover:bg-accent-light transition-all disabled:opacity-50 shadow-md"
            >
              {saving ? 'Saving Book...' : isEditing ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
