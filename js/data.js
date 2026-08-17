/* ============================================================
   BIBLIOPHILE VIBES — DATA.JS
   Book data, Google Sheets fetch, local fallback
   ============================================================ */

/**
 * CONFIGURATION
 * ─────────────
 * To connect your Google Sheet:
 * 1. Open your Google Sheet
 * 2. File → Share → Publish to web
 * 3. Select the inventory sheet tab
 * 4. Choose "Comma-separated values (.csv)"
 * 5. Click Publish and copy the URL
 * 6. Paste it below as SHEETS_CSV_URL
 *
 * The sheet columns must match this order:
 * id | title | author | genre | description | pages | condition |
 * rentalPrice | rentalDuration | securityDeposit | availability |
 * cover1 | cover2 | cover3 | featured
 */

const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSH44jl6UoFDQM4lFv6V06qxbHIemiFwhRbLXbkpJZrEfUFE1QsdfUKMR3rwhv504hPDn0IdzPThZTD/pub?gid=1984210831&single=true&output=csv';

// Cache key for sessionStorage
const CACHE_KEY = 'bibliophile_books_cache';

// ── Fallback Sample Data ──────────────────────────────────────
// Used when Google Sheets is not configured or fetch fails.
// Open Library cover API: https://covers.openlibrary.org/b/isbn/[ISBN]-L.jpg
const SAMPLE_BOOKS = [
  {
    id: '001',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    description: 'A magical tale of Santiago, an Andalusian shepherd boy who yearns to travel the world. His quest will lead him to riches far different from what he ever imagined. A timeless story about the essential wisdom of listening to your heart.',
    pages: 208,
    condition: 'Very Good',
    rentalPrice: 30,
    rentalDuration: 7,
    securityDeposit: 100,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    cover2: '',
    cover3: '',
    featured: true
  },
  {
    id: '002',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description: 'Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviours that lead to remarkable results.',
    pages: 320,
    condition: 'Like New',
    rentalPrice: 40,
    rentalDuration: 14,
    securityDeposit: 150,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '003',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'The story of the Bennet family and particularly the relationship between Elizabeth Bennet and the proud Mr. Darcy. A sparkling tale of love, society, and the ironies of the English countryside. One of the most beloved novels in the English language.',
    pages: 432,
    condition: 'Good',
    rentalPrice: 25,
    rentalDuration: 7,
    securityDeposit: 80,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '004',
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    genre: 'Fiction',
    description: 'A sweeping story of fathers and sons, of friendship and betrayal, and of the possibility of redemption, set against the tumultuous events of Afghanistan\'s recent history. A profoundly moving novel that remains with you long after the final page.',
    pages: 372,
    condition: 'Very Good',
    rentalPrice: 35,
    rentalDuration: 7,
    securityDeposit: 120,
    availability: 'Rented',
    cover1: 'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '005',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    description: 'Alicia Berenson\'s life is seemingly perfect — until the day she shoots her husband five times and then stops speaking. Theo Faber is determined to uncover the truth behind her silence. A gripping psychological thriller that keeps you guessing until the final, shocking twist.',
    pages: 336,
    condition: 'Like New',
    rentalPrice: 40,
    rentalDuration: 7,
    securityDeposit: 150,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '006',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    description: 'A brief history of humankind — from the Stone Age to Silicon Age. How did our species come to dominate the planet? How have empires, religions, and trade shaped our world? A thrilling narrative of humanity\'s creation and destruction that challenges everything we thought we knew.',
    pages: 443,
    condition: 'Good',
    rentalPrice: 45,
    rentalDuration: 14,
    securityDeposit: 180,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '007',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Mystery',
    description: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne\'s fifth wedding anniversary. But Amy has mysteriously vanished. Is Nick the killer? Is Amy a victim? Or is nothing what it seems? A compulsively readable psychological mystery thriller.',
    pages: 422,
    condition: 'Very Good',
    rentalPrice: 35,
    rentalDuration: 7,
    securityDeposit: 120,
    availability: 'Reserved',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '008',
    title: 'Ikigai',
    author: 'Héctor García & Francesc Miralles',
    genre: 'Self-Help',
    description: 'The Japanese secret to a long and happy life. Ikigai — your reason for being — is the key to happiness and longevity. Residents of Okinawa, Japan\'s "Village of Longevity", live extraordinarily long lives. Their secret? Finding their ikigai. A wonderful, soulful read.',
    pages: 208,
    condition: 'Like New',
    rentalPrice: 30,
    rentalDuration: 7,
    securityDeposit: 100,
    availability: 'Available',
    cover1: 'https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  },
  {
    id: '009',
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    genre: 'Romance',
    description: 'A brave and heartbreaking novel that digs its claws into you and doesn\'t let go. Lily hasn\'t always had it easy, but when she meets Ryle, she can\'t help wondering what the future might hold. A powerful story about love, difficult choices, and the courage to choose yourself.',
    pages: 384,
    condition: 'Good',
    rentalPrice: 30,
    rentalDuration: 7,
    securityDeposit: 100,
    availability: 'Coming Soon',
    cover1: 'https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg',
    cover2: '',
    cover3: '',
    featured: false
  }
];

// ── CSV Parser ────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    // Handle quoted fields with commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj = {};
    headers.forEach((header, i) => {
      let val = (values[i] || '').replace(/^"|"$/g, '').trim();
      // Type coercions
      if (['pages', 'rentalPrice', 'rentalDuration', 'securityDeposit'].includes(header)) {
        obj[header] = parseInt(val) || 0;
      } else if (header === 'featured') {
        obj[header] = val.toLowerCase() === 'true';
      } else {
        obj[header] = val;
      }
    });
    return obj;
  }).filter(book => book.id && book.title);
}

// ── Main Data Loader ──────────────────────────────────────────
async function loadBooks() {
  // 1. Try sessionStorage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        console.log('📚 Bibliophile: Loaded books from cache');
        return data;
      }
    }
  } catch (e) { /* ignore */ }

  // 2. Try Google Sheets if URL is configured
  if (SHEETS_CSV_URL && SHEETS_CSV_URL.trim() !== '') {
    try {
      const response = await fetch(SHEETS_CSV_URL, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const books = parseCSV(text);
      if (books.length > 0) {
        // Cache result
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data: books,
            timestamp: Date.now()
          }));
        } catch (e) { /* quota exceeded, skip */ }
        console.log(`📚 Bibliophile: Loaded ${books.length} books from Google Sheets`);
        return books;
      }
    } catch (err) {
      console.warn('📚 Bibliophile: Google Sheets fetch failed, using sample data.', err);
    }
  }

  // 3. Fallback to sample data
  console.log('📚 Bibliophile: Using sample book data');
  return SAMPLE_BOOKS;
}

// ── Helpers ───────────────────────────────────────────────────
function getFeaturedBook(books) {
  return books.find(b => b.featured === true || b.featured === 'TRUE') || books[0];
}

function getComingSoon(books) {
  return books.filter(b => b.availability === 'Coming Soon');
}

function getCatalogueBooks(books) {
  return books.filter(b => b.availability !== 'Coming Soon');
}

// Global books store
window.bibliophileData = {
  books: [],
  loaded: false
};
