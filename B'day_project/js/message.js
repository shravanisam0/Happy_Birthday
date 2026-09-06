/* ============================================
   MESSAGE.JS — Typewriter, Candle, Hidden Msg
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Doodle system
  const ds = new DoodleSystem();
  ds.createDots(25);
  ds.createScribbles(5);
  ds.start();

  // ---------- Typewriter Letter ----------
  const letterLines = document.querySelectorAll('.letter-line');
  const signature = document.querySelector('.letter-signature');
  let currentLine = 0;

  function revealNextLine() {
    if (currentLine >= letterLines.length) {
      // Show signature after all lines
      if (signature) {
        setTimeout(() => {
          signature.classList.add('visible');
        }, 300);
      }
      return;
    }

    const line = letterLines[currentLine];
    line.classList.add('visible');
    currentLine++;

    setTimeout(revealNextLine, 600);
  }

  // Start typewriter when letter card comes into view
  const letterCard = document.querySelector('.letter-card');
  if (letterCard) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(revealNextLine, 500);
          obs.unobserve(letterCard);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(letterCard);
  }

  // ---------- Candle Blowing (Hold Spacebar) ----------
  const candles = document.querySelectorAll('.candle');
  let candlesBlown = 0;
  const totalCandles = candles.length;
  let blowInterval = null;
  let isBlowing = false;

  function blowNextCandle() {
    // Find the next lit candle
    for (let i = 0; i < candles.length; i++) {
      const flame = candles[i].querySelector('.candle-flame');
      const smoke = candles[i].querySelector('.candle-smoke');

      if (flame && !flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out');
        if (smoke) {
          smoke.classList.add('active');
          setTimeout(() => smoke.classList.remove('active'), 1000);
        }
        candlesBlown++;

        // Check if all candles blown
        if (candlesBlown === totalCandles) {
          stopBlowing();
          const wishMsg = document.querySelector('.wish-message');
          const instruction = document.querySelector('.cake-instruction');
          if (wishMsg) {
            setTimeout(() => {
              wishMsg.classList.add('visible');
              // Paper scrap burst celebration
              ds.burstPaperScraps(window.innerWidth / 2, window.innerHeight * 0.4, 60);
            }, 500);
          }
          if (instruction) instruction.classList.add('hidden');
        }
        return; // Only blow one candle per tick
      }
    }
  }

  function startBlowing() {
    if (isBlowing || candlesBlown >= totalCandles) return;
    isBlowing = true;

    // Add flickering class to all lit flames
    candles.forEach(candle => {
      const flame = candle.querySelector('.candle-flame');
      if (flame && !flame.classList.contains('blown-out')) {
        flame.classList.add('blowing');
      }
    });

    // Blow out one candle every 400ms while holding
    blowNextCandle(); // Blow the first one immediately
    blowInterval = setInterval(blowNextCandle, 400);
  }

  function stopBlowing() {
    isBlowing = false;
    if (blowInterval) {
      clearInterval(blowInterval);
      blowInterval = null;
    }

    // Remove flickering class from remaining flames
    candles.forEach(candle => {
      const flame = candle.querySelector('.candle-flame');
      if (flame) flame.classList.remove('blowing');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      startBlowing();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      stopBlowing();
    }
  });

  // ---------- Hidden Message ----------
  const revealBtn = document.getElementById('reveal-hidden-btn');
  const hiddenMsg = document.querySelector('.hidden-message');

  if (revealBtn && hiddenMsg) {
    revealBtn.addEventListener('click', () => {
      hiddenMsg.classList.add('revealed');
      revealBtn.style.display = 'none';
      // Small paper burst
      const rect = revealBtn.getBoundingClientRect();
      ds.burstPaperScraps(rect.left + rect.width / 2, rect.top, 30);
    });
  }
});
