/* ============================================
   CELEBRATION.JS — Doodle Bursts, Countdown
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Doodle system with full effects
  const ds = new DoodleSystem();
  ds.createDots(40);
  ds.createScribbles(8);
  ds.createDoodleHearts(6);
  ds.start();

  // Launch doodle bursts periodically
  function launchDoodleBursts() {
    ds.launchDoodleBurst();
    setTimeout(() => ds.launchDoodleBurst(), 300);
    setTimeout(() => ds.launchDoodleBurst(), 700);
  }

  // Initial burst
  setTimeout(launchDoodleBursts, 500);

  // Periodic doodle bursts
  setInterval(() => {
    launchDoodleBursts();
  }, 5000);

  // Paper scrap rain
  ds.startConfettiRain();

  // ---------- Word-by-Word Reveal ----------
  const words = document.querySelectorAll('.celebration-hero h1 .word');
  words.forEach((word, i) => {
    word.style.animationDelay = `${0.1 * i + 0.3}s`;
  });

  // ---------- Countdown Timer ----------
  // Birthday: September 7
  const birthdayMonth = 8; // 0-indexed: 8 = September
  const birthdayDay = 7;

  function getNextBirthday() {
    const now = new Date();
    let year = now.getFullYear();
    let birthday = new Date(year, birthdayMonth, birthdayDay);

    // If birthday has passed this year, use next year
    if (now > birthday) {
      birthday = new Date(year + 1, birthdayMonth, birthdayDay);
    }

    return birthday;
  }

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');

  function updateCountdown() {
    const now = new Date();
    const birthday = getNextBirthday();
    const diff = birthday - now;

    if (diff <= 0) {
      // It's their birthday!
      if (daysEl) daysEl.textContent = '🎂';
      if (hoursEl) hoursEl.textContent = '🎉';
      if (minsEl) minsEl.textContent = '🥳';
      if (secsEl) secsEl.textContent = '💖';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
