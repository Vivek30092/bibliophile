   # Bibliophile — Website Setup & Deployment Guide

## 📁 Project Structure

```
bibliophile book point/
├── index.html              ← Main website (open this in a browser)
├── css/
│   ├── base.css            ← Design tokens, typography, fonts
│   ├── layout.css          ← Grids, containers, spacing
│   ├── components.css      ← All UI components
│   ├── animations.css      ← Keyframes & scroll reveals
│   └── responsive.css      ← Mobile breakpoints
├── js/
│   ├── data.js             ← Book data + Google Sheets fetch
│   ├── catalogue.js        ← Book grid, search, filter
│   ├── modal.js            ← Book detail modal
│   ├── nav.js              ← Navbar + hamburger menu
│   └── animations.js       ← Scroll animations
├── assets/
│   └── favicon.svg
└── README.md               ← This file
```

---

## ✅ Quick Start: Run Locally

Just open `index.html` in any browser. No build step required.

> **Note**: Google Sheets fetch requires a web server due to browser CORS policy.  
> For local development with Google Sheets, use a simple local server:
> ```bash
> # Python (built-in)
> python -m http.server 8080
> # Then open: http://localhost:8080
> ```

---

## 🔧 Step 1 — Update Your WhatsApp Number

Search for `TODO` in the codebase and update the WhatsApp number:

**Files to update:**
- `js/modal.js` → line ~6: `const WHATSAPP_NUMBER = '919999999999';`
- `js/catalogue.js` → line ~6: `const WHATSAPP_NUMBER = '919999999999';`
- `index.html` → every `wa.me/919999999999` link

**Format:** Country code + number, no `+`, no spaces.  
Example for India: `919876543210`

---

## 🔧 Step 2 — Update Instagram Handle

In `index.html`, search for `bibliophile.books` and replace with your Instagram handle.

---

## 🔧 Step 3 — Update Location

In `index.html`, search for `your city` and replace with your city or neighbourhood.

---

## 🔧 Step 4 — Create Google Form for Book Requests

1. Go to [Google Forms](https://forms.google.com)
2. Create a form with fields:
   - Name
   - Book title
   - Author
   - Phone/WhatsApp
   - Message (optional)
3. Copy the form URL
4. In `index.html`, replace `https://forms.google.com` with your form URL

---

## 🔧 Step 5 — Connect Google Sheets (Inventory)

### Create the Sheet

1. Open [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named `Bibliophile Inventory`
3. Add these exact column headers in Row 1:

```
id | title | author | genre | description | pages | condition | rentalPrice | rentalDuration | securityDeposit | availability | cover1 | cover2 | cover3 | featured
```

### Column reference

| Column | Field | Example values |
|--------|-------|----------------|
| A | `id` | 001, 002, 003… |
| B | `title` | The Alchemist |
| C | `author` | Paulo Coelho |
| D | `genre` | Fiction, Romance, Mystery, Thriller, Fantasy, Self-Help, Biography, Non-Fiction |
| E | `description` | Short synopsis (2–4 sentences) |
| F | `pages` | 208 |
| G | `condition` | Like New / Very Good / Good |
| H | `rentalPrice` | 30 |
| I | `rentalDuration` | 7 |
| J | `securityDeposit` | 100 |
| K | `availability` | Available / Rented / Reserved / Coming Soon |
| L | `cover1` | Full image URL (see below) |
| M | `cover2` | Optional second image URL |
| N | `cover3` | Optional third image URL |
| O | `featured` | TRUE or FALSE (only one book should be TRUE) |

### Getting book cover images

Use the Open Library API (free, no API key needed):
```
https://covers.openlibrary.org/b/isbn/[ISBN]-L.jpg
```

Example:
```
https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg
```

Or use any direct image URL (Google Drive: share → copy link → convert to direct link).

### Publish the Sheet

1. In Google Sheets: **File → Share → Publish to web**
2. Select your sheet tab (not "Entire document")
3. Choose **Comma-separated values (.csv)**
4. Click **Publish**
5. Copy the URL (looks like: `https://docs.google.com/spreadsheets/d/.../pub?gid=...&single=true&output=csv`)

### Connect to the website

In `js/data.js`, find line 22:
```javascript
const SHEETS_CSV_URL = '';
```

Paste your CSV URL:
```javascript
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv';
```

### How to update availability

1. Open your Google Sheet
2. Change the value in the `availability` column to:
   - `Available` — book is ready to rent
   - `Rented` — currently rented out
   - `Reserved` — reserved by someone
   - `Coming Soon` — not yet available
3. **That's it.** The website reflects changes within 5 minutes automatically.

> **Note**: Availability changes appear within 5 minutes due to browser caching.  
> To force an immediate update, a visitor can open the site in a new private/incognito window.

---

## 🎨 Customisation

### Change the tagline
In `index.html`, find:
```html
A little library, waiting for your next story.
```
Replace with your preferred tagline.

### Change stats
In `index.html`, find the `stats-grid` section and update the numbers and labels.

### Change colours
In `css/base.css`, update the CSS custom properties under `:root`.

### Add more genre filters
In `index.html`, find the `filter-chips` section and add new buttons:
```html
<button class="filter-chip" data-filter="your-genre">Your Genre</button>
```

---

## 🚀 Deployment

### GitHub Pages (Free)
1. Create a free GitHub account and repository
2. Upload all project files
3. Go to Settings → Pages → Source: main branch
4. Your site will be live at `https://yourusername.github.io/bibliophile`

### Netlify (Free, Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder onto the Netlify dashboard
3. Done — your site is live instantly with a free URL
4. Optional: Connect a custom domain (e.g., `bibliophile.in`)

### Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository or upload files
3. Instant deployment

---

## 📱 Private Inventory Sheet

**Never expose customer data publicly.**

Create a **second, private** Google Sheet for rental management:

| Field | Description |
|-------|-------------|
| Book ID | Matches the public sheet |
| Customer Name | Renter's name |
| Phone/WhatsApp | Contact number |
| Rental Date | When rented |
| Due Date | When to return |
| Security Deposit | Amount collected |
| Payment | Rental payment received |
| Return Status | Returned / Pending |
| Notes | Any notes |

Keep this sheet **never published**. Only you should have access.

---

## 🔒 Privacy Notes

- The public Google Sheet contains **no customer information**
- Never add customer names, phone numbers, or addresses to the public inventory sheet
- Do not expose your home address publicly — use "Message us on WhatsApp for pickup location"

---

## 📊 Future Upgrades (V2 ideas)

- Backend API (Node.js / Supabase)
- User accounts and rental tracking
- Online payment (Razorpay)
- Customer reservations
- Admin dashboard
- Automated overdue reminders
- Wishlist and personalised recommendations

---

## 📬 Need Help?

All `TODO` comments in the code mark placeholders you need to update.  
Search for `TODO` in any code editor to find them all at once.
