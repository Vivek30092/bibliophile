/**
 * Programmatic migration script to push inventory directly to Supabase.
 * Usage:
 *   node scripts/import-to-supabase.js
 * Requires environment variables:
 *   SUPABASE_URL (or VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY, or VITE_SUPABASE_ANON_KEY)
 */

const fs = require('fs');
const path = require('path');

// Try to load from .env if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.replace(/^["'](.*)["']$/, '$1');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('------------------------------------------------------------');
  console.log('NOTE: SUPABASE_URL and SUPABASE_KEY not found in environment.');
  console.log('You can also apply schema and seed directly via Supabase SQL Editor:');
  console.log('  1. supabase/schema.sql');
  console.log('  2. supabase/seed.sql');
  console.log('------------------------------------------------------------');
  process.exit(0);
}

const initialBooksPath = path.join(__dirname, '..', 'src', 'data', 'initialBooks.json');
if (!fs.existsSync(initialBooksPath)) {
  console.error('initialBooks.json not found. Run scripts/migrate-inventory.js first.');
  process.exit(1);
}

const books = JSON.parse(fs.readFileSync(initialBooksPath, 'utf8'));

async function importBooks() {
  console.log(`Uploading ${books.length} books to ${supabaseUrl}...`);
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/books`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(books)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    console.log(`Successfully migrated ${books.length} books to Supabase!`);
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

importBooks();
