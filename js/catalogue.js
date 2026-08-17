/* ============================================================
   BIBLIOPHILE VIBES — CATALOGUE.JS
   Render book cards, search, filter, featured book, coming soon
   ============================================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '+917828659551'; 
  const catalogueGrid = document.getElementById('catalogue-grid');
  const searchInput = document.getElementById('book-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const featuredContainer = document.getElementById('featured-book-container');
  const comingSoonGrid = document.getElementById('coming-soon-grid');
  const comingSoonSection = document.getElementById('coming-soon-section');

  let allBooks = [];
  let currentFilter = 'all';
  let currentSearch = '';

  // ── Availability helpers ─────────────────────────────────
  function getAvailabilityClass(availability) {
    const map = {
      'Available':   'badge-available',
      'Rented':      'badge-rented',
      'Reserved':    'badge-reserved',
      'Coming Soon': 'badge-coming-soon'
    };
    return map[availability] || 'badge-available';
  }

  function getAvailabilityLabel(availability) {
    const map = {
      'Available':   'Available',
      'Rented':      'Rented',
      'Reserved':    'Reserved',
      'Coming Soon': 'Coming Soon'
    };
    return map[availability] || availability;
  }

  // ── Book card HTML ───────────────────────────────────────
  function renderBookCard(book) {
    const availClass = getAvailabilityClass(book.availability);
    const availLabel = getAvailabilityLabel(book.availability);
    const coverHTML = book.cover1
      ? `<img class="book-cover-img" src="${book.cover1}" alt="Cover of ${book.title}" loading="lazy" decoding="async">`
      : `<div class="book-cover-placeholder">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
             <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
             <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
           </svg>
         </div>`;

    const card = document.createElement('article');
    card.className = 'book-card reveal';
    card.setAttribute('data-id', book.id);
    card.setAttribute('aria-label', `${book.title} by ${book.author}`);
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="book-cover-wrap">
        ${coverHTML}
        ${book.availability !== 'Available'
          ? `<div class="book-cover-overlay">
               <span class="badge ${availClass}" style="font-size:0.65rem;">${availLabel}</span>
             </div>`
          : ''
        }
      </div>
      <div class="book-card-body">
        <div class="book-card-genre">
          <span class="badge-genre">${book.genre}</span>
        </div>
        <h3 class="book-card-title">${book.title}</h3>
        <p class="book-card-author">by ${book.author}</p>
        <div class="book-card-footer">
          <div>
            <div class="book-price">₹${book.rentalPrice} <span>/ ${book.rentalDuration || 7} days</span></div>
            <span class="badge ${availClass}" style="margin-top:4px;">${availLabel}</span>
          </div>
          <button class="book-card-btn" aria-label="View details for ${book.title}">
            View
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    // Click / keyboard to open modal
    function openBook() {
      if (window.bibliophileModal) {
        window.bibliophileModal.openModal(book);
      }
    }
    card.addEventListener('click', openBook);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBook();
      }
    });

    return card;
  }

  // ── Pagination state ─────────────────────────────────────
  const PAGE_SIZE = 12;
  let currentPage = 1;

  // ── Filter & search ──────────────────────────────────────
  function getFilteredBooks() {
    return allBooks
      .filter(b => b.availability !== 'Coming Soon')
      .filter(b => {
        if (currentFilter === 'all') return true;
        // Normalise both sides: lowercase + strip spaces/hyphens
        // Then check if book genre *includes* the filter token
        // e.g. filter="mystery" matches genre="Mystery/Thriller"
        const normFilter = currentFilter.toLowerCase().replace(/[\s-]/g, '');
        const normGenre  = (b.genre || '').toLowerCase().replace(/[\s-]/g, '');
        return normGenre.includes(normFilter);
      })
      .filter(b => {
        if (!currentSearch.trim()) return true;
        const q = currentSearch.toLowerCase();
        return b.title.toLowerCase().includes(q) ||
               b.author.toLowerCase().includes(q) ||
               (b.genre || '').toLowerCase().includes(q);
      });
  }

  // ── Render catalogue ─────────────────────────────────────
  function renderCatalogue() {
    if (!catalogueGrid) return;

    const filtered = getFilteredBooks();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    // Clamp currentPage
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageBooks = filtered.slice(start, start + PAGE_SIZE);

    catalogueGrid.innerHTML = '';

    if (filtered.length === 0) {
      catalogueGrid.innerHTML = `
        <div class="catalogue-empty">
          <div class="catalogue-empty-icon">📖</div>
          <h3 class="heading-3" style="margin-bottom:8px;">No books found</h3>
          <p class="body-md text-muted">Try a different search or filter.</p>
        </div>
      `;
      renderPagination(0, 1);
      return;
    }

    pageBooks.forEach(book => {
      const card = renderBookCard(book);
      catalogueGrid.appendChild(card);
    });

    renderPagination(filtered.length, totalPages);

    // Trigger animations on newly added cards
    if (window.bibliophileObserveReveal) {
      window.bibliophileObserveReveal();
    }
    // Attach 3D tilt reset on newly rendered cards
    if (window.bibliophileAttachTilt) {
      catalogueGrid.querySelectorAll('.book-card').forEach(window.bibliophileAttachTilt);
    }
  }

  // ── Pagination UI ────────────────────────────────────────
  function renderPagination(totalBooks, totalPages) {
    let paginationEl = document.getElementById('catalogue-pagination');
    if (!paginationEl) {
      paginationEl = document.createElement('div');
      paginationEl.id = 'catalogue-pagination';
      paginationEl.className = 'catalogue-pagination';
      catalogueGrid.parentNode.insertBefore(paginationEl, catalogueGrid.nextSibling);
    }

    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
      return;
    }

    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end   = Math.min(currentPage * PAGE_SIZE, totalBooks);

    paginationEl.innerHTML = `
      <div class="pagination-info">Showing ${start}–${end} of ${totalBooks} books</div>
      <div class="pagination-controls">
        <button class="pagination-btn" id="pg-prev" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">
          ← Prev
        </button>
        <div class="pagination-pages">
          ${Array.from({ length: totalPages }, (_, i) => i + 1)
            .map(p => `<button class="pagination-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}" aria-label="Page ${p}" aria-current="${p === currentPage ? 'page' : 'false'}">${p}</button>`)
            .join('')}
        </div>
        <button class="pagination-btn" id="pg-next" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">
          Next →
        </button>
      </div>
    `;

    document.getElementById('pg-prev').addEventListener('click', () => {
      currentPage--;
      renderCatalogue();
      catalogueGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('pg-next').addEventListener('click', () => {
      currentPage++;
      renderCatalogue();
      catalogueGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    paginationEl.querySelectorAll('.pagination-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.getAttribute('data-page'));
        renderCatalogue();
        catalogueGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ── Featured book ────────────────────────────────────────
  function renderFeaturedBook(book) {
    if (!featuredContainer || !book) return;

    const availClass = getAvailabilityClass(book.availability);
    const availLabel = getAvailabilityLabel(book.availability);
    const isAvailable = book.availability === 'Available';

    const waMessage = encodeURIComponent(
      `Hi Bibliophile! I'd like to rent "${book.title}" by ${book.author}. Is it available?`
    );
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

    const rentHTML = isAvailable
      ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
           </svg>
           Rent This Book
         </a>`
      : `<button class="btn-secondary" disabled style="opacity:0.65;cursor:not-allowed;">${availLabel}</button>`;

    featuredContainer.innerHTML = `
      <div class="featured-card reveal">
        <div class="featured-cover-wrap">
          ${book.cover1
            ? `<img class="featured-cover-img" src="${book.cover1}" alt="Cover of ${book.title}">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-deeper);font-size:6rem;">📚</div>`
          }
          <div class="featured-cover-glow"></div>
        </div>
        <div class="featured-body">
          <div class="featured-meta">
            <span class="badge-genre">${book.genre}</span>
            <span class="badge ${availClass}">${availLabel}</span>
          </div>
          <h3 class="featured-title">${book.title}</h3>
          <p class="featured-author">by ${book.author}</p>
          <div class="featured-details-row">
            <div class="featured-detail">
              <span class="featured-detail-label">Pages</span>
              <span class="featured-detail-value">${book.pages || '—'}</span>
            </div>
            <div class="featured-detail">
              <span class="featured-detail-label">Condition</span>
              <span class="featured-detail-value">${book.condition || 'Good'}</span>
            </div>
            <div class="featured-detail">
              <span class="featured-detail-label">Duration</span>
              <span class="featured-detail-value">${book.rentalDuration || 7} days</span>
            </div>
          </div>
          <p class="featured-description">${book.description || ''}</p>
          <div class="featured-price">₹${book.rentalPrice} <small>/ ${book.rentalDuration || 7} days</small></div>
          <div class="featured-actions">
            ${rentHTML}
            <button class="btn-secondary" onclick="window.bibliophileModal && window.bibliophileModal.openModal(window.bibliophileData.books.find(b=>b.id==='${book.id}'))">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Coming soon ──────────────────────────────────────────
  function renderComingSoon(books) {
    if (!comingSoonGrid) return;
    const csBooks = books.filter(b => b.availability === 'Coming Soon');

    if (csBooks.length === 0) {
      if (comingSoonSection) comingSoonSection.style.display = 'none';
      return;
    }

    comingSoonGrid.innerHTML = '';
    csBooks.forEach(book => {
      const card = document.createElement('article');
      card.className = 'coming-soon-card reveal';
      card.style.cssText = 'aspect-ratio:2/3;position:relative;overflow:hidden;border-radius:var(--radius-lg);';
      card.innerHTML = `
        <div class="book-cover-wrap" style="width:100%;height:100%;">
          ${book.cover1
            ? `<img class="book-cover-img" src="${book.cover1}" alt="Coming soon: ${book.title}" loading="lazy" style="filter:blur(5px) brightness(0.65);">`
            : `<div style="width:100%;height:100%;background:var(--bg-deeper);"></div>`
          }
        </div>
        <div class="coming-soon-overlay">
          <span class="badge badge-coming-soon">Coming Soon</span>
          <p class="coming-title">${book.title}</p>
          <p class="coming-author">by ${book.author}</p>
        </div>
      `;
      comingSoonGrid.appendChild(card);
    });
  }

  // ── Event listeners ──────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentSearch = this.value;
      renderCatalogue();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', function () {
      filterChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      currentPage = 1; // reset to first page on filter change
      renderCatalogue();
    });
  });

  if (searchInput) {
    // Also reset page on new search (overrides the earlier listener)
    searchInput.addEventListener('input', () => { currentPage = 1; });
  }

  // ── Init ─────────────────────────────────────────────────
  async function init() {
    // Show loading state
    if (catalogueGrid) {
      catalogueGrid.innerHTML = `<div class="catalogue-loading"><div class="spinner"></div></div>`;
    }

    try {
      allBooks = await loadBooks();
    } catch (e) {
      console.error('Failed to load books', e);
      allBooks = SAMPLE_BOOKS || [];
    }

    // Store globally for modal access
    window.bibliophileData.books = allBooks;
    window.bibliophileData.loaded = true;

    // Render sections
    const featuredBook = getFeaturedBook(allBooks);
    renderFeaturedBook(featuredBook);
    renderCatalogue();
    renderComingSoon(allBooks);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
