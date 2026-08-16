/* ============================================================
   BIBLIOPHILE — ANIMATIONS.JS
   IntersectionObserver scroll reveals, parallax, counters
   ============================================================ */

(function () {
  'use strict';

  // ── Respect prefers-reduced-motion ──────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Immediately reveal all elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
      .forEach(el => {
        el.classList.add('revealed');
      });
    return;
  }

  // ── Intersection Observer ────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  // Observe all reveal elements
  function observeRevealElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
      .forEach(el => revealObserver.observe(el));
  }

  // Run on load, and expose for dynamic content
  observeRevealElements();
  window.bibliophileObserveReveal = observeRevealElements;

  // ── Animated counters ────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || el.textContent);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  // ── Hero parallax (subtle, desktop only) ─────────────────
  if (window.innerWidth > 768) {
    const heroBooks = document.querySelectorAll('.hero-book');
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroBooks.forEach((book, i) => {
            const speed = 0.08 + i * 0.04;
            // Don't override the float animation transform — add to it via CSS variable
            book.style.setProperty('--parallax-y', `${scrollY * speed}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Card tilt on hover (desktop) ─────────────────────────
  if (window.innerWidth > 768 && !prefersReducedMotion) {
    // Use event delegation on document for mousemove
    document.addEventListener('mousemove', function (e) {
      // e.target may be a child element (e.g. img inside card)
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      const card = target.closest('.book-card, .hero-book');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    // Reset tilt when mouse leaves a card — attach per card
    function attachTiltReset(card) {
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }

    // Attach to existing cards
    document.querySelectorAll('.book-card, .hero-book').forEach(attachTiltReset);

    // Also expose so dynamically rendered cards can be attached
    window.bibliophileAttachTilt = attachTiltReset;
  }

})();
