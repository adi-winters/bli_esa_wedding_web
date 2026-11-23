(() => {
  const galleryImages = Array.from(
    document.querySelectorAll('.gallery-grid img, .collage-grid img')
  ).filter((image) => image.src);
  const lightbox = document.getElementById('gallery-lightbox');

  if (!galleryImages.length || !lightbox) return;

  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-previous');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  let activeThumbnail = null  ;
  let touchStart = null;
  let changeTimer;
  let previousBodyOverflow = '';
  let previousBodyPaddingRight = '';

  const setImage = (index, animate = true) => {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const source = galleryImages[currentIndex];

    window.clearTimeout(changeTimer);
    if (!animate) {
      lightboxImage.src = source.currentSrc || source.src;
      lightboxImage.alt = source.alt;
      return;
    }

    lightboxImage.classList.add('is-changing');
    changeTimer = window.setTimeout(() => {
      lightboxImage.src = source.currentSrc || source.src;
      lightboxImage.alt = source.alt;
      lightboxImage.classList.remove('is-changing');
    }, 100);
  };

  const openLightbox = (index, thumbnail) => {
    activeThumbnail = thumbnail;
    setImage(index, false);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    closeButton.focus();
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains('is-open')) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
    activeThumbnail?.focus();
  };

  galleryImages.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');
    image.setAttribute('aria-label', `${image.alt || 'Foto'} - buka tampilan penuh`);
    image.addEventListener('click', () => openLightbox(index, image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index, image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => setImage(currentIndex - 1));
  nextButton.addEventListener('click', () => setImage(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightboxImage.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  lightboxImage.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    setImage(currentIndex + (deltaX < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setImage(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setImage(currentIndex + 1);
    } else if (event.key === 'Tab') {
      const controls = [closeButton, previousButton, nextButton];
      const firstControl = controls[0];
      const lastControl = controls[controls.length - 1];

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl.focus();
      }
    }
  });
})();
