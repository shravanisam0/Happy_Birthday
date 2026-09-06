/* ============================================
   HOME.JS — Hand-Drawn Welcome Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize doodle system
  const ds = new DoodleSystem();
  ds.createDots(35);
  ds.createScribbles(6);
  ds.start();

  // Stagger card reveal with stickyDrop feel
  const cards = document.querySelectorAll('.surprise-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transition = `opacity 0.5s ease ${0.1 * i + 0.6}s, transform 0.15s ease`;

    // Keep the rotation on the element but start invisible
    const origTransform = card.style.transform || '';
    card.style.transform = origTransform + ' translateY(20px)';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = origTransform;
    }, 100 * i + 800);
  });

  // Observe surprise grid for staggered reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.surprise-card');
          items.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              // Restore original rotation
              const rot = card.getAttribute('style')?.match(/rotate\([^)]+\)/)?.[0] || '';
              card.style.transform = rot;
            }, 100 * i);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const grid = document.querySelector('.surprise-grid');
  if (grid) observer.observe(grid);

  // CTA scroll to grid
  const ctaBtn = document.getElementById('open-surprise-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Paper scrap burst from button position
      const rect = ctaBtn.getBoundingClientRect();
      ds.burstPaperScraps(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

      const section = document.querySelector('.surprise-section');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  }
});
