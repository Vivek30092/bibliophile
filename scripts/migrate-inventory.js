const fs = require('fs');
const path = require('path');

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function normalizeAvailability(val) {
  if (!val) return 'Available';
  const clean = val.trim().toLowerCase();
  if (clean.includes('comming') || clean.includes('coming')) return 'Coming Soon';
  if (clean.includes('unavail')) return 'Unavailable';
  if (clean.includes('rent')) return 'Rented';
  if (clean.includes('reserve')) return 'Reserved';
  return 'Available';
}

function extractISBN(coverUrl) {
  if (!coverUrl) return null;
  const match = coverUrl.match(/\/isbn\/([0-9Xx]+)-/i);
  return match ? match[1] : null;
}

function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function processInventory() {
  const csvPath = path.join(__dirname, '..', 'existing_inventory.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('File existing_inventory.csv not found at', csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    console.error('Inventory CSV has no rows');
    process.exit(1);
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);
  console.log('Headers:', headers);

  const books = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (!row[0] || !row[1]) continue;

    const rawId = row[0].trim();
    const rawTitle = row[1].trim();
    const rawAuthor = row[2] ? row[2].trim() : 'Unknown';
    const rawGenre = row[3] ? row[3].trim() : 'General';
    const rawDesc = row[4] ? row[4].trim() : '';
    const rawPages = parseInt(row[5], 10) || 0;
    const rawCondition = row[6] ? row[6].trim() : 'Good';
    const rawRentalPrice = parseFloat(row[7]) || 30;
    const rawRentalDuration = parseInt(row[8], 10) || 7;
    const rawSecurityDeposit = parseFloat(row[9]) || 100;
    const rawAvailability = normalizeAvailability(row[10]);
    const rawCover1 = row[11] ? row[11].trim() : '';
    const rawCover2 = row[12] ? row[12].trim() : '';
    const rawCover3 = row[13] ? row[13].trim() : '';
    const rawFeatured = row[14] ? row[14].trim().toUpperCase() === 'TRUE' : false;
    const rawMrp = row[15] ? parseFloat(row[15]) : null;

    const secondaryCovers = [rawCover2, rawCover3].filter(c => c && c.length > 0);
    const isbn = extractISBN(rawCover1);

    books.push({
      id: rawId,
      title: rawTitle,
      author: rawAuthor,
      genre: rawGenre,
      description: rawDesc,
      isbn: isbn,
      pages: rawPages,
      condition: rawCondition,
      rental_price: rawRentalPrice,
      rental_duration: rawRentalDuration,
      security_deposit: rawSecurityDeposit,
      availability: rawAvailability,
      cover_image: rawCover1,
      cover_images: secondaryCovers,
      featured: rawFeatured,
      mrp: rawMrp,
      is_archived: false
    });
  }

  console.log(`Successfully parsed ${books.length} books.`);

  // 1. Output src/data/initialBooks.json
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const jsonOutPath = path.join(dataDir, 'initialBooks.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(books, null, 2), 'utf8');
  console.log('Saved JSON data to:', jsonOutPath);

  // 2. Output supabase/seed.sql
  const seedSqlRows = books.map(b => {
    const coverImagesSQL = b.cover_images.length > 0 
      ? `ARRAY[${b.cover_images.map(img => escapeSQL(img)).join(', ')}]::TEXT[]`
      : `'{}'::TEXT[]`;

    return `(
    ${escapeSQL(b.id)},
    ${escapeSQL(b.title)},
    ${escapeSQL(b.author)},
    ${escapeSQL(b.genre)},
    ${escapeSQL(b.description)},
    ${escapeSQL(b.isbn)},
    ${b.pages},
    ${escapeSQL(b.condition)},
    ${b.rental_price},
    ${b.rental_duration},
    ${b.security_deposit},
    ${escapeSQL(b.availability)},
    ${escapeSQL(b.cover_image)},
    ${coverImagesSQL},
    ${b.featured ? 'TRUE' : 'FALSE'},
    ${b.mrp ? b.mrp : 'NULL'},
    FALSE
  )`;
  });

  const seedSql = `-- ============================================================
-- BIBLIOPHILE VIBES — INITIAL INVENTORY SEED
-- ${books.length} Books migrated from existing inventory
-- ============================================================

INSERT INTO public.books (
  id,
  title,
  author,
  genre,
  description,
  isbn,
  pages,
  condition,
  rental_price,
  rental_duration,
  security_deposit,
  availability,
  cover_image,
  cover_images,
  featured,
  mrp,
  is_archived
)
VALUES
${seedSqlRows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  genre = EXCLUDED.genre,
  description = EXCLUDED.description,
  isbn = EXCLUDED.isbn,
  pages = EXCLUDED.pages,
  condition = EXCLUDED.condition,
  rental_price = EXCLUDED.rental_price,
  rental_duration = EXCLUDED.rental_duration,
  security_deposit = EXCLUDED.security_deposit,
  availability = EXCLUDED.availability,
  cover_image = EXCLUDED.cover_image,
  cover_images = EXCLUDED.cover_images,
  featured = EXCLUDED.featured,
  mrp = EXCLUDED.mrp,
  is_archived = EXCLUDED.is_archived,
  updated_at = TIMEZONE('utc'::text, NOW());
`;

  const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
  fs.writeFileSync(seedPath, seedSql, 'utf8');
  console.log('Saved SQL seed to:', seedPath);
}

processInventory();
