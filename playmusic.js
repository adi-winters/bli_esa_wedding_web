(() => {
  const audio = document.getElementById('background-music');
  const button = document.getElementById('music-toggle');

  if (!audio || !button) return;

  const setPlaybackState = (isPlaying) => {
    button.setAttribute('aria-pressed', String(isPlaying));
    const label = isPlaying ? 'Pause background music' : 'Play background music';
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  button.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setPlaybackState(false);
      button.title = 'Music could not play. Check the audio file or autoplay settings.';
    }
  });

  audio.addEventListener('play', () => setPlaybackState(true));
  audio.addEventListener('pause', () => setPlaybackState(false));
  audio.addEventListener('ended', () => setPlaybackState(false));

  let autoPlayAttempted = false;

  const setButtonVisible = (isVisible) => {
    if (isVisible) {
      button.classList.remove('is-hiding');
      button.classList.add('is-visible');
    } else if (button.classList.contains('is-visible')) {
      button.classList.remove('is-visible');
      button.classList.add('is-hiding');
    }

    button.setAttribute('aria-hidden', String(!isVisible));
    button.tabIndex = isVisible ? 0 : -1;
  };

  button.addEventListener('animationend', (event) => {
    if (event.animationName === 'music-button-fade-out') {
      button.classList.remove('is-hiding');
    }
  });

  const startMusicOnce = () => {
    if (autoPlayAttempted) return;
    autoPlayAttempted = true;

    audio.play().catch(() => {
      if (audio.paused) {
        setPlaybackState(false);
        button.title = 'Click to start music if autoplay is blocked.';
      }
    });
  };

  const coverSection = document.querySelector('.cover-section');
  if ('IntersectionObserver' in window && coverSection) {
    const coverObserver = new IntersectionObserver(([entry]) => {
      const coverFillsScreen = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      setButtonVisible(!coverFillsScreen);

      if (!coverFillsScreen) startMusicOnce();
    }, { threshold: [0, 0.5] });

    coverObserver.observe(coverSection);
  } else {
    setButtonVisible(true);
  }
})();
