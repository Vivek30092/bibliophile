import { supabase, isSupabaseConfigured } from './supabase';
import { Book } from '../types/book';
import initialBooksData from '../data/initialBooks.json';

const LOCAL_STORAGE_KEY = 'bibliophile_local_books_v1';

// In-memory or localStorage cache for fallback mode
function getLocalFallbackBooks(): Book[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return initialBooksData as Book[];
}

function saveLocalFallbackBooks(books: Book[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
  } catch {
    // ignore
  }
}

export const bookService = {
  async getBooks(): Promise<Book[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('is_archived', false)
          .order('id', { ascending: true });

        if (error) {
          console.warn('Supabase query error, falling back to local dataset:', error.message);
          return getLocalFallbackBooks().filter(b => !b.is_archived);
        }
        if (data && data.length > 0) {
          return data as Book[];
        }
      } catch (err) {
        console.warn('Network error reaching Supabase, using fallback data:', err);
      }
    }
    return getLocalFallbackBooks().filter(b => !b.is_archived);
  },

  async getAllBooksAdmin(): Promise<Book[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Book[];
        }
      } catch (err) {
        console.warn('Error fetching admin books:', err);
      }
    }
    return getLocalFallbackBooks();
  },

  async getBookById(id: string): Promise<Book | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data as Book;
        }
      } catch (err) {
        console.warn('Error fetching book by id:', err);
      }
    }
    const local = getLocalFallbackBooks().find(b => b.id.toLowerCase() === id.toLowerCase());
    return local || null;
  },

  async createBook(book: Omit<Book, 'created_at' | 'updated_at'>): Promise<Book> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('books')
        .insert([{
          ...book,
          is_archived: false
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Book;
    }

    // Local fallback creation
    const localBooks = getLocalFallbackBooks();
    const newBook: Book = {
      ...book,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localBooks.unshift(newBook);
    saveLocalFallbackBooks(localBooks);
    return newBook;
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('books')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Book;
    }

    // Local fallback update
    const localBooks = getLocalFallbackBooks();
    const idx = localBooks.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Book not found');
    const updated = {
      ...localBooks[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    localBooks[idx] = updated;
    saveLocalFallbackBooks(localBooks);
    return updated;
  },

  async archiveBook(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('books')
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw new Error(error.message);
      return;
    }

    const localBooks = getLocalFallbackBooks();
    const idx = localBooks.findIndex(b => b.id === id);
    if (idx !== -1) {
      localBooks[idx].is_archived = true;
      saveLocalFallbackBooks(localBooks);
    }
  },

  async uploadCoverImage(file: File): Promise<string> {
    if (isSupabaseConfigured() && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      return data.publicUrl;
    }

    // Local Fallback: Convert to Base64 Data URL for preview/development
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
};
