/* ============================================
   GALLERY.JS — Lightbox, Hover, Timeline
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Doodle system
  const ds = new DoodleSystem();
  ds.createDots(25);
  ds.createScribbles(5);
  ds.start();

  // ---------- Lightbox ----------
  const lightbox = document.querySelector('.lightbox-overlay');
  const lightboxImg = lightbox?.querySelector('.lightbox-image');
  const lightboxVideo = lightbox?.querySelector('.lightbox-video');
  const lightboxPlaceholder = lightbox?.querySelector('.lightbox-placeholder');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  const polaroids = document.querySelectorAll('.polaroid');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing video
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  }

  function updateLightbox() {
    const polaroid = polaroids[currentIndex];
    const img = polaroid.querySelector('.polaroid-image, .polaroid-img');
    const caption = polaroid.querySelector('.polaroid-caption');
    const videoSrc = polaroid.dataset.video;

    // Pause any previously playing video
    if (lightboxVideo) {
      lightboxVideo.pause();
    }

    if (videoSrc) {
      // It's a video polaroid
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxPlaceholder) lightboxPlaceholder.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.src = videoSrc;
        lightboxVideo.style.display = 'block';
        lightboxVideo.play().catch(() => {});
      }
    } else if (img && img.tagName === 'IMG') {
      // It's a photo polaroid
      if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = '';
      }
      if (lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.display = 'block';
      }
      if (lightboxPlaceholder) lightboxPlaceholder.style.display = 'none';
    } else {
      // Placeholder
      if (lightboxImg) lightboxImg.style.display = 'none';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = '';
      }
      if (lightboxPlaceholder) lightboxPlaceholder.style.display = 'flex';
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = caption ? caption.textContent : '';
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % polaroids.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + polaroids.length) % polaroids.length;
    updateLightbox();
  }

  polaroids.forEach((p, i) => {
    p.addEventListener('click', () => openLightbox(i));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // ---------- Timeline Reveal ----------
  const timelineItems = document.querySelectorAll('.timeline-item');
  const tlObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          tlObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  timelineItems.forEach(item => {
    item.classList.add('reveal');
    tlObserver.observe(item);
  });
});
