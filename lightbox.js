// ===== Lightbox Gallery =====
let currentIndex = 0;
window.lightboxData = window.lightboxData || [];

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(index) {
  if (!window.lightboxData.length) return;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = window.lightboxData[currentIndex];
  if (!item) return;
  lightboxImg.src = item.src;
  lightboxCaption.textContent = item.caption || '';
  lightboxCounter.textContent = (currentIndex + 1) + ' / ' + window.lightboxData.length;
}

function prevPhoto() {
  currentIndex = (currentIndex - 1 + window.lightboxData.length) % window.lightboxData.length;
  updateLightbox();
}

function nextPhoto() {
  currentIndex = (currentIndex + 1) % window.lightboxData.length;
  updateLightbox();
}

// Events
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', prevPhoto);
document.getElementById('lightboxNext').addEventListener('click', nextPhoto);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevPhoto();
  if (e.key === 'ArrowRight') nextPhoto();
});

// Also support static galleries (article.html)
document.addEventListener('DOMContentLoaded', () => {
  const staticPhotos = document.querySelectorAll('.article-gallery .gallery-photo');
  if (staticPhotos.length && !window.lightboxData.length) {
    window.lightboxData = [];
    staticPhotos.forEach((el, i) => {
      const img = el.querySelector('img');
      if (img) {
        window.lightboxData.push({
          src: img.src,
          caption: el.querySelector('.gallery-caption')?.textContent || ''
        });
        el.addEventListener('click', () => openLightbox(i));
      }
    });
  }
});
