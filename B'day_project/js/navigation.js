/* ============================================
   NAVIGATION.JS — Nav menu, paper transitions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Page Transition ----------
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    requestAnimationFrame(() => {
      overlay.classList.add('hidden');
    });
  }

  // Intercept all internal links for smooth transitions
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (overlay) {
          overlay.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = href;
          }, 400);
        } else {
          window.location.href = href;
        }
      });
    }
  });

  // ---------- Nav Scroll Effect ----------
  const nav = document.querySelector('.main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---------- Hamburger Menu ----------
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav-overlay');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Intersection Observer for Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  // ---------- Active Nav Link Highlight ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
});
