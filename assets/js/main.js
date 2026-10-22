const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const word = document.querySelector('[data-word]');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const words = ['RESPONDE', 'ACELERA', 'CONECTA', 'SURPREENDE'];
let wordIndex = 0;
let wordTimer;

window.addEventListener('load', () => {
  window.setTimeout(() => body.classList.add('loaded'), 350);
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !isOpen);
    body.classList.toggle('menu-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
      body.classList.remove('menu-open');
    });
  });
}

if (word && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const changeWord = () => {
    word.classList.add('is-changing');
    wordTimer = window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      word.textContent = words[wordIndex];
      word.classList.remove('is-changing');
    }, 220);
  };
  window.setInterval(changeWord, 2200);
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 90}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('.photo[data-full]').forEach((photo) => {
  photo.addEventListener('click', () => {
    lightboxImage.src = photo.dataset.full;
    lightboxImage.alt = photo.querySelector('img').alt;
    lightbox.showModal();
    body.classList.add('dialog-open');
  });
});

const closeLightbox = () => {
  lightbox.close();
  body.classList.remove('dialog-open');
};

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener('close', () => body.classList.remove('dialog-open'));

const cursor = document.querySelector('.cursor');
if (window.matchMedia('(pointer: fine)').matches && cursor) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('is-visible');
  });
  document.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
    item.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
}

const music = document.querySelector('.site-music');
const musicToggle = document.querySelector('.music-float');
if (music && musicToggle) {
  const unlockEvents = ['pointerdown', 'keydown', 'touchstart'];
  let userMuted = false;
  try {
    userMuted = localStorage.getItem('siddd-music-muted') === 'true';
  } catch (error) {}

  const saveMuted = (value) => {
    userMuted = value;
    try {
      localStorage.setItem('siddd-music-muted', String(value));
    } catch (error) {}
  };

  const updateMusicButton = () => {
    const isPlaying = !music.paused;
    musicToggle.classList.toggle('is-playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Tocar música');
  };

  const removeUnlock = () => unlockEvents.forEach((name) => document.removeEventListener(name, unlockMusic));

  const playMusic = () => music.play().then(removeUnlock).catch(() => {});

  // Navegadores bloqueiam som automático: tenta de novo na primeira interação.
  function unlockMusic(event) {
    if (musicToggle.contains(event.target) || userMuted) return;
    playMusic();
  }

  music.volume = 0.6;
  music.addEventListener('play', updateMusicButton);
  music.addEventListener('pause', updateMusicButton);

  musicToggle.addEventListener('click', () => {
    if (music.paused) {
      saveMuted(false);
      playMusic();
    } else {
      saveMuted(true);
      music.pause();
    }
  });

  if (!userMuted) {
    unlockEvents.forEach((name) => document.addEventListener(name, unlockMusic));
    playMusic();
  }
}

window.addEventListener('pagehide', () => window.clearTimeout(wordTimer));