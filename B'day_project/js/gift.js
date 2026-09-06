/* ============================================
   GIFT.JS — Gift Box Open Animation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Doodle system
  const ds = new DoodleSystem();
  ds.createDots(20);
  ds.createScribbles(5);
  ds.start();

  // ---------- Gift Box ----------
  const wrapper = document.querySelector('.gift-box-wrapper');
  const surprise = document.querySelector('.gift-surprise');
  const clickHint = document.querySelector('.gift-click-hint');
  let isOpened = false;

  if (wrapper) {
    wrapper.addEventListener('click', () => {
      if (isOpened) return;
      isOpened = true;

      // Trigger opening
      wrapper.classList.add('opened');
      if (clickHint) clickHint.style.opacity = '0';

      // Paper scrap burst from gift box position
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.3;

      // Burst paper scraps
      ds.burstPaperScraps(centerX, centerY, 80);

      // Show surprise after animation
      setTimeout(() => {
        if (surprise) {
          surprise.classList.add('revealed');
          surprise.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // More celebration
        setTimeout(() => {
          ds.burstPaperScraps(window.innerWidth * 0.3, window.innerHeight * 0.5, 25);
          ds.burstPaperScraps(window.innerWidth * 0.7, window.innerHeight * 0.5, 25);
        }, 300);
      }, 800);
    });
  }
});
