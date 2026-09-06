/* ============================================
   REASONS.JS — Card Flips & Random Reason
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Doodle system
  const ds = new DoodleSystem();
  ds.createDots(25);
  ds.createScribbles(6);
  ds.start();

  // ---------- Reasons Data ----------
  const reasons = [
    { emoji: '✨', text: 'You’re the reason I laugh at the dumbest things.' },
    { emoji: '💪', text: 'Your strength and resilience inspire everyone around you every single day.' },
    { emoji: '🎨', text: 'You’re proof that real friendship is rare and precious.' },
    { emoji: '💫', text: 'You make ordinary moments feel extraordinary just by being there.' },
    { emoji: '🌻', text: 'Your kindness is like sunshine — it reaches everyone without effort.' },
    { emoji: '🎭', text: 'You’re my safe place, no matter what’s happening around me.' },
    { emoji: '🌙', text: 'You have an incredible ability to make people feel truly seen and heard.' },
    { emoji: '🦋', text: 'The way you keep growing and evolving is nothing short of beautiful.' },
    { emoji: '🎶', text: 'You’re the one I trust with everything — my secrets are safest with you.' },
    { emoji: '🌈', text: 'You’re the reason I believe true friendship exists.' },
    { emoji: '💝', text: 'The love you give so freely comes back to you tenfold. You deserve it all.' },
    { emoji: '🔥', text: 'Your passion for the things you care about is absolutely contagious.' },
  ];

  // ---------- Flip Cards ----------
  const flipCards = document.querySelectorAll('.flip-card');
  let flippedCount = 0;
  const totalCards = flipCards.length;
  const progressCount = document.querySelector('.reasons-progress .count');

  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCount++;
        if (progressCount) {
          progressCount.textContent = flippedCount;
        }
      } else {
        card.classList.remove('flipped');
        flippedCount--;
        if (progressCount) {
          progressCount.textContent = flippedCount;
        }
      }
    });
  });

  // ---------- Random Reason ----------
  const randomBtn = document.getElementById('random-reason-btn');
  const randomModal = document.querySelector('.random-modal-overlay');
  const randomEmoji = randomModal?.querySelector('.reason-emoji');
  const randomText = randomModal?.querySelector('.reason-text');
  const closeModalBtn = randomModal?.querySelector('.close-modal-btn');

  function showRandomReason() {
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    if (randomEmoji) randomEmoji.textContent = reason.emoji;
    if (randomText) randomText.textContent = reason.text;
    randomModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Paper scrap burst
    ds.burstPaperScraps(window.innerWidth / 2, window.innerHeight / 2, 30);
  }

  function closeModal() {
    randomModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  randomBtn?.addEventListener('click', showRandomReason);
  closeModalBtn?.addEventListener('click', closeModal);
  randomModal?.addEventListener('click', (e) => {
    if (e.target === randomModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && randomModal?.classList.contains('active')) closeModal();
  });

  // Stagger card reveal
  flipCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          obs.unobserve(card);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(card);
  });
});
