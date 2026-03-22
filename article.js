// ===== Initialize Lucide Icons =====
lucide.createIcons();

// ===== Loader =====
(function () {
  const loader = document.getElementById('loader');
  const bar = loader.querySelector('.loader-bar');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 90) progress = 90;
    bar.style.width = progress + '%';
  }, 100);
  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initArticleAnimations();
    }, 500);
  });
  document.body.style.overflow = 'hidden';
})();

// ===== Header =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Burger =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Scroll to Top =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== GSAP =====
gsap.registerPlugin(ScrollTrigger);

function initArticleAnimations() {
  // Article hero fade in
  gsap.from('.article-hero-inner', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Article content sections fade in on scroll
  gsap.utils.toArray('.article-main > *').forEach(el => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true
      }
    });
  });

  // Sidebar cards fade in
  gsap.utils.toArray('.sidebar-card').forEach((card, i) => {
    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        once: true
      }
    });
  });
}
