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

window.addEventListener('pagehide', () => window.clearTimeout(wordTimer));