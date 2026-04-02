/* ============================================
   ACCO CAIXAS – BULLETPROOF GSAP ARCHITECTURE
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// 1. SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. TEXT SPLITTING UTILS
function splitText() {
  document.querySelectorAll('.reveal-text span').forEach(el => {
    // Basic inner wrapper logic for clean splitting
    const text = el.innerText.trim();
    el.setAttribute('data-text', text);
    el.innerText = '';
  });
}

// 3. LOADER
function initLoader() {
  gsap.to('.loader-bar', { width: '100%', duration: 1.2, ease: 'power2.inOut' });
  
  gsap.to('.loader', {
    yPercent: -100, duration: 1, delay: 1.2, ease: 'expo.inOut',
    onComplete: () => {
      document.body.classList.remove('loading-state');
      initAnimations();
    }
  });
}

// 4. MAIN ANIMATIONS
function initAnimations() {
  
  // Hero Image 
  gsap.to('.hero-prod-img', { opacity: 1, scale: 1, duration: 1.5, ease: 'expo.out' });
  
  // Hero Text
  document.querySelectorAll('.reveal-text span').forEach((span, i) => {
    gsap.to(span, {
      duration: 1.2,
      delay: 0.3 + (i * 0.1),
      ease: 'expo.out',
      css: { '::after': { transform: 'translateY(0%)' } } // Fallback, simpler to animate inner element
    });
    // Alternative method for before/after pseudoelements not supported directly in CSS plugin often:
    span.innerHTML = `<span style="display:block; transform:translateY(110%);" class="inner">${span.getAttribute('data-text')}</span>`;
    gsap.to(span.querySelector('span'), { y: '0%', duration: 1.2, delay: 0.3 + (i * 0.1), ease: 'expo.out' });
  });

  // Infinite Marquee
  if(document.querySelector('.marquee-content')) {
    gsap.to('.marquee-content', {
      xPercent: -50,
      repeat: -1,
      duration: 35,
      ease: 'none'
    });
  }

  // Audience Swiper
  if(document.querySelector('.aud-swiper')) {
    new Swiper('.aud-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      initialSlide: 1,
      loop: false,
      speed: 800,
      watchSlidesProgress: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 20,
        depth: 200,
        modifier: 1,
        slideShadows: false,
      },
      pagination: {
        el: '.aud-pagination',
        clickable: true,
      }
    });
  }

  // Hero Faders
  gsap.to('.hero-fader', {
    scrollTrigger: { trigger: '.section-hero', start: 'top top', end: 'bottom top', scrub: true },
    opacity: 1, ease: 'none'
  });

  // Standard Fade In Up (All generic sections)
  gsap.utils.toArray('.fade-in-up').forEach(elem => {
    gsap.from(elem, {
      scrollTrigger: { trigger: elem, start: 'top 85%' },
      y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
  });

  // Stagger Grids (Tech Fischer)
  gsap.from('.fade-stagger', {
    scrollTrigger: { trigger: '.tech-grid', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
  });

  // Compare Cards
  gsap.utils.toArray('.compare-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%' },
      y: 50, scale: 0.95, opacity: 0, duration: 1, ease: 'expo.out'
    });
  });

  // Stats Counters
  document.querySelectorAll('.counter').forEach(counter => {
    ScrollTrigger.create({
      trigger: counter,
      start: "top 80%",
      once: true,
      onEnter: () => {
        let target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out"
        });
      }
    });
  });
}

// 5. BOOT
window.onload = () => {
  splitText();
  initLoader();
};
