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
      initAnimations();
    }, 500);
  });
  document.body.style.overflow = 'hidden';
})();

// ===== Header: Sticky + Shrink =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Burger Menu =====
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

// ===== Modals =====
function openModal(id) {
  const overlay = document.getElementById('modal-' + id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(overlay) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.modal);
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.closest('.modal-overlay'));
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
  }
});

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn--submit');
  const text = btn.querySelector('.btn-text');
  text.textContent = 'Отправлено!';
  btn.style.background = '#22C55E';
  setTimeout(() => {
    text.textContent = 'Отправить заявку';
    btn.style.background = '';
    e.target.reset();
  }, 2000);
});

// ===== GSAP Animations =====
gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
  // --- Hero Lights (factory sparkles) ---
  createHeroLights();

  // --- Hero Glow (planet pulsation) ---
  const heroGlow = document.getElementById('heroGlow');
  if (heroGlow) {
    gsap.set(heroGlow, { transformOrigin: 'center center' });
    gsap.to(heroGlow, {
      scale: 1.4,
      opacity: 0.6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    // Secondary glow layer
    gsap.to(heroGlow, {
      x: 15,
      y: -10,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  // --- Hero Content fade-in from bottom ---
  const heroTl = gsap.timeline();
  heroTl.from('.hero-tag', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' })
    .from('.hero-title', { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.hero-ctas', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  // --- Section titles: animated underline ---
  document.querySelectorAll('.section-title').forEach(title => {
    ScrollTrigger.create({
      trigger: title,
      start: 'top 85%',
      onEnter: () => title.classList.add('animated'),
      once: true
    });
  });

  // --- Cards fade-in on scroll ---
  animateCards('.card');
  animateCards('.solution-card');
  animateCards('.news-card');

  // --- CTA animated gradient ---
  animateCTAGradient();

  // --- CTA content fade-in ---
  gsap.from('.cta-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 75%',
      once: true
    }
  });

  // --- CTA decorative circles float ---
  gsap.utils.toArray('.cta-deco').forEach((deco, i) => {
    gsap.to(deco, {
      y: -20 + i * 10,
      x: 10 - i * 5,
      duration: 4 + i,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  // --- Form fields animation on scroll ---
  gsap.from('.form-box', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.form-box',
      start: 'top 85%',
      once: true
    }
  });

  // --- Footer content fade-in ---
  gsap.from('.footer-top', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      once: true
    }
  });

  // --- Partners marquee pause on hover ---
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const marquee = marqueeTrack.closest('.marquee');
    marquee.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marquee.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // --- Solution card features check marks ---
  document.querySelectorAll('.solution-features li').forEach(li => {
    ScrollTrigger.create({
      trigger: li,
      start: 'top 90%',
      onEnter: () => {
        gsap.from(li, { x: -15, opacity: 0, duration: 0.4, ease: 'power2.out' });
      },
      once: true
    });
  });
}

// ===== Hero Lights =====
function createHeroLights() {
  const container = document.getElementById('heroLights');
  if (!container) return;
  const lightCount = 25;

  for (let i = 0; i < lightCount; i++) {
    const light = document.createElement('div');
    light.className = 'hero-light';
    // Position lights in the lower-right area (factory zone)
    light.style.left = (35 + Math.random() * 60) + '%';
    light.style.top = (25 + Math.random() * 65) + '%';
    const size = (2 + Math.random() * 5) + 'px';
    light.style.width = size;
    light.style.height = size;

    // Color variety — warm factory lights
    const colors = [
      'rgba(255, 215, 0, 0.8)',   // gold
      'rgba(255, 180, 50, 0.7)',  // orange
      'rgba(255, 255, 200, 0.9)', // warm white
      'rgba(255, 140, 50, 0.6)',  // deep orange
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    light.style.background = color;
    light.style.boxShadow = '0 0 ' + (4 + Math.random() * 8) + 'px 2px ' + color;

    container.appendChild(light);

    // Random animation: some flicker, some breathe
    if (Math.random() > 0.5) {
      // Flicker — rapid blinking
      gsap.fromTo(light,
        { opacity: 0.3 + Math.random() * 0.5 },
        {
          opacity: Math.random() * 0.3 + 0.1,
          duration: 0.08 + Math.random() * 0.25,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: Math.random() * 4
        }
      );
    } else {
      // Breathe — slow pulse
      gsap.fromTo(light,
        { opacity: 0.6 + Math.random() * 0.4, scale: 1 },
        {
          opacity: 0.05,
          scale: 0.4,
          duration: 1.5 + Math.random() * 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 4
        }
      );
    }
  }
}

// ===== CTA Animated Gradient =====
function animateCTAGradient() {
  const ctaBg = document.querySelector('.cta-bg');
  if (!ctaBg) return;

  let angle = 180;
  let direction = 1;
  const color1Start = { r: 11, g: 12, b: 115 };  // #0B0C73
  const color2Start = { r: 26, g: 54, b: 131 };   // #1A3683
  const color1End = { r: 20, g: 30, b: 140 };
  const color2End = { r: 50, g: 80, b: 180 };

  const anim = { t: 0 };
  gsap.to(anim, {
    t: 1,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    onUpdate: () => {
      const r1 = Math.round(color1Start.r + (color1End.r - color1Start.r) * anim.t);
      const g1 = Math.round(color1Start.g + (color1End.g - color1Start.g) * anim.t);
      const b1 = Math.round(color1Start.b + (color1End.b - color1Start.b) * anim.t);
      const r2 = Math.round(color2Start.r + (color2End.r - color2Start.r) * anim.t);
      const g2 = Math.round(color2Start.g + (color2End.g - color2Start.g) * anim.t);
      const b2 = Math.round(color2Start.b + (color2End.b - color2Start.b) * anim.t);
      const a = 180 + Math.sin(anim.t * Math.PI) * 30;
      ctaBg.style.background = `linear-gradient(${a}deg, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}))`;
    }
  });
}

// ===== Cards Fade-In on Scroll =====
function animateCards(selector) {
  document.querySelectorAll(selector).forEach(card => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      },
      once: true
    });
    // Set initial state
    gsap.set(card, { opacity: 0, y: 30 });
  });
}
