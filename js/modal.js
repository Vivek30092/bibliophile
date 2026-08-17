/* ============================================================
   BIBLIOPHILE VIBES — MODAL.JS
   Book detail modal, image carousel, WhatsApp CTA
   ============================================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '917828659551'; 
  const overlay = document.getElementById('book-modal-overlay');
  const modalContent = document.getElementById('book-modal-content');
  const closeBtn = document.getElementById('modal-close-btn');

  let currentImages = [];
  let currentImageIndex = 0;

  // ── Open modal ───────────────────────────────────────────
  function openModal(book) {
    if (!overlay) return;

    // Populate images
    currentImages = [book.cover1, book.cover2, book.cover3]
      .filter(url => url && url.trim() !== '');
    if (currentImages.length === 0) currentImages = [''];
    currentImageIndex = 0;

    // Populate content
    renderModalContent(book);

    // Show
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trap focus
    setTimeout(() => {
      closeBtn && closeBtn.focus();
    }, 100);
  }

  // ── Close modal ──────────────────────────────────────────
  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Render modal HTML ────────────────────────────────────
  function renderModalContent(book) {
    if (!modalContent) return;

    const availClass = getAvailabilityClass(book.availability);
    const availLabel = getAvailabilityLabel(book.availability);
    const isAvailable = book.availability === 'Available';

    const waMessage = encodeURIComponent(
      `Hi Bibliophile Vibes! I'd like to rent "${book.title}" by ${book.author}. Is it available?`
    );
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

    const thumbsHTML = currentImages.length > 1
      ? `<div class="modal-thumbs" id="modal-thumbs">
          ${currentImages.map((img, i) => `
            <div class="modal-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
              ${img
                ? `<img src="${img}" alt="Cover ${i + 1}" loading="lazy">`
                : '<div style="width:100%;height:100%;background:var(--bg-deeper)"></div>'
              }
            </div>
          `).join('')}
        </div>`
      : '';

    const mainImgHTML = currentImages[0]
      ? `<img id="modal-main-img-el" src="${currentImages[0]}" alt="${book.title} cover">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--bg-deeper);font-size:4rem;">📚</div>`;

    const rentBtnHTML = isAvailable
      ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
           </svg>
           Rent This Book
         </a>`
      : `<button class="btn-secondary" disabled style="opacity:0.6;cursor:not-allowed;">
           ${availLabel}
         </button>`;

    modalContent.innerHTML = `
      <button class="modal-close" id="modal-close-btn" aria-label="Close book details">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <div class="modal-grid">
        <!-- Gallery -->
        <div class="modal-gallery">
          <div class="modal-main-img" id="modal-main-img">
            ${mainImgHTML}
          </div>
          ${thumbsHTML}
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="modal-genre-row">
            <span class="badge-genre">${book.genre}</span>
            <span class="badge ${availClass}">${availLabel}</span>
          </div>

          <div>
            <h2 class="modal-title">${book.title}</h2>
            <p class="modal-author">by ${book.author}</p>
          </div>

          <div class="modal-specs">
            <div class="modal-spec">
              <span class="modal-spec-label">Pages</span>
              <span class="modal-spec-value">${book.pages || '—'}</span>
            </div>
            <div class="modal-spec">
              <span class="modal-spec-label">Condition</span>
              <span class="modal-spec-value">${book.condition || 'Good'}</span>
            </div>
            <div class="modal-spec">
              <span class="modal-spec-label">Duration</span>
              <span class="modal-spec-value">${book.rentalDuration || 7} days</span>
            </div>
          </div>

          <p class="modal-description">${book.description || 'No description available.'}</p>

          <div class="modal-price-row">
            <div>
              <div class="modal-price">₹${book.rentalPrice} <small>/ ${book.rentalDuration || 7} days</small></div>
            </div>
            <div class="modal-deposit">
              Security deposit: <strong>₹${book.securityDeposit || 100}</strong>
              <br><small style="color:var(--text-muted)">Refunded on return</small>
            </div>
          </div>

          <div class="modal-actions">
            ${rentBtnHTML}
            <button class="btn-secondary btn-sm" onclick="window.bibliophileModal.closeModal()">
              Back to Collection
            </button>
          </div>
        </div>
      </div>
    `;

    // Re-attach close button handler
    const newCloseBtn = document.getElementById('modal-close-btn');
    if (newCloseBtn) {
      newCloseBtn.addEventListener('click', closeModal);
    }

    // Thumbnail carousel
    const thumbs = document.querySelectorAll('.modal-thumb');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        setModalImage(index);
        thumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  function setModalImage(index) {
    currentImageIndex = index;
    const imgEl = document.getElementById('modal-main-img');
    if (!imgEl) return;
    const url = currentImages[index];
    if (url) {
      imgEl.innerHTML = `<img src="${url}" alt="Book cover" style="width:100%;height:100%;object-fit:cover;">`;
    }
  }

  // ── Helpers ──────────────────────────────────────────────
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
      'Rented':      'Currently Rented',
      'Reserved':    'Reserved',
      'Coming Soon': 'Coming Soon'
    };
    return map[availability] || availability;
  }

  // ── Event listeners ──────────────────────────────────────
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeModal();
    }
    if (e.key === 'ArrowRight' && overlay && overlay.classList.contains('open')) {
      if (currentImages.length > 1) {
        const nextIndex = (currentImageIndex + 1) % currentImages.length;
        setModalImage(nextIndex);
        const thumbs = document.querySelectorAll('.modal-thumb');
        thumbs.forEach(t => t.classList.remove('active'));
        if (thumbs[nextIndex]) thumbs[nextIndex].classList.add('active');
      }
    }
    if (e.key === 'ArrowLeft' && overlay && overlay.classList.contains('open')) {
      if (currentImages.length > 1) {
        const prevIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        setModalImage(prevIndex);
        const thumbs = document.querySelectorAll('.modal-thumb');
        thumbs.forEach(t => t.classList.remove('active'));
        if (thumbs[prevIndex]) thumbs[prevIndex].classList.add('active');
      }
    }
  });

  // ── Public API ───────────────────────────────────────────
  window.bibliophileModal = {
    openModal,
    closeModal
  };

})();
