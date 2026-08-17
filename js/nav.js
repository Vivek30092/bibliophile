/* ============================================================
   BIBLIOPHILE VIBES — NAV.JS
   Scroll-aware navbar, hamburger menu, search overlay
   ============================================================ */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const mobileLinks = document.querySelectorAll('#nav-mobile-menu a');
  const searchBtn = document.getElementById('nav-search-btn');
  const searchOverlay = document.getElementById('nav-search-overlay');
  const searchInput = document.getElementById('nav-search-input');
  const searchClose = document.getElementById('nav-search-close');
  const mainSearchInput = document.getElementById('book-search');

  // ── Scroll-aware navbar ──────────────────────────────────
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.remove('at-top');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('at-top');
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  // Initial state
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Hamburger menu ───────────────────────────────────────
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ── Search overlay ───────────────────────────────────────
  function openSearch() {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Sync nav search → main catalogue search
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      if (mainSearchInput) {
        mainSearchInput.value = this.value;
        mainSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
      if (e.key === 'Enter') {
        closeSearch();
        // Scroll to collection
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
          collectionSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Close overlay on backdrop click
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height'));
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  // ── Active nav link highlight ─────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

})();
