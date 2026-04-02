/* ============================================
   ACCO CAIXAS – GSAP ANIMATIONS
   Professional ScrollTrigger + Timeline Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ---------- LOADER ----------
const loaderTL = gsap.timeline({
  onComplete: () => {
    document.getElementById('loader').style.pointerEvents = 'none';
    initAnimations();
  }
});

loaderTL
  .to('.loader-logo-img', {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
  .to('.loader-bar-fill', {
    width: '100%',
    duration: 1.2,
    ease: 'power2.inOut'
  }, '-=0.2')
  .to('.loader-logo-img', {
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.in'
  })
  .to('#loader', {
    yPercent: -100,
    duration: 0.8,
    ease: 'power3.inOut'
  })
  .set('#loader', { display: 'none' });


// ---------- MAIN INIT ----------
function initAnimations() {
  heroAnimations();
  comparativeAnimations();
  fischerAnimations();
  audienceAnimations();
  aboutAnimations();
  marcasAnimations();
  ctaPulse();
  phoneMask();
}


// ---------- HERO ----------
function heroAnimations() {
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Logo
  heroTL.to('.hero-logo', {
    opacity: 1,
    y: 0,
    duration: 0.8,
  });

  // Title lines - stagger reveal
  heroTL.from('.hero-title-line', {
    y: 80,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out'
  }, '-=0.4');

  // Subtitle
  heroTL.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.7,
  }, '-=0.4');

  // Badges - stagger up
  heroTL.to('.badge', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.4)',
  }, '-=0.3');

  // Initial badge position
  gsap.set('.badge', { y: 30 });

  // Form card - slide in from right with elastic
  heroTL.to('.form-card', {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.6)',
  }, '-=1');

  // Initial form card position
  gsap.set('.form-card', { x: 60 });

  // Scroll indicator
  heroTL.to('.hero-scroll-indicator', {
    opacity: 1,
    duration: 0.6,
  }, '-=0.5');

  // Background parallax
  gsap.to('.hero-bg-img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Pattern parallax
  gsap.to('.hero-pattern', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Fade hero on scroll
  gsap.to('.hero-content', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: 1,
    }
  });
}


// ---------- COMPARATIVO ----------
function comparativeAnimations() {
  // Section header
  gsap.from('.section-comparativo .section-tag', {
    scrollTrigger: {
      trigger: '.section-comparativo .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
  });

  gsap.from('.section-comparativo .section-title', {
    scrollTrigger: {
      trigger: '.section-comparativo .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.15,
  });

  gsap.from('.section-comparativo .section-desc', {
    scrollTrigger: {
      trigger: '.section-comparativo .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 0.3,
  });

  // Concrete column slides from left
  gsap.from('.comparison-col-bad', {
    scrollTrigger: {
      trigger: '.comparison-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    x: -80,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  // VS badge
  gsap.from('.comparison-vs', {
    scrollTrigger: {
      trigger: '.comparison-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    scale: 0,
    opacity: 0,
    duration: 0.6,
    delay: 0.4,
    ease: 'back.out(2)',
  });

  // Acco column slides from right
  gsap.from('.comparison-col-good', {
    scrollTrigger: {
      trigger: '.comparison-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    x: 80,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  // Bad items stagger
  gsap.to('.comparison-item-bad', {
    scrollTrigger: {
      trigger: '.comparison-col-bad .comparison-list',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
  });
  gsap.set('.comparison-item-bad', { x: -20 });

  // Good items stagger
  gsap.to('.comparison-item-good', {
    scrollTrigger: {
      trigger: '.comparison-col-good .comparison-list',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out',
    delay: 0.3,
  });
  gsap.set('.comparison-item-good', { x: 20 });
}


// ---------- FISCHER ----------
function fischerAnimations() {
  // Image parallax
  gsap.from('.fischer-img', {
    scrollTrigger: {
      trigger: '.section-fischer',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 60,
    opacity: 0,
    scale: 0.9,
    duration: 1,
    ease: 'power3.out',
  });

  // Glow pulse
  gsap.to('.fischer-img-glow', {
    scale: 1.2,
    opacity: 0.6,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Right side content
  gsap.from('.fischer-right .section-tag', {
    scrollTrigger: {
      trigger: '.fischer-right',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.5,
  });

  gsap.from('.fischer-right .section-title', {
    scrollTrigger: {
      trigger: '.fischer-right',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.1,
  });

  gsap.from('.fischer-right .section-desc', {
    scrollTrigger: {
      trigger: '.fischer-right',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
  });

  gsap.from('.fischer-logo-wrap', {
    scrollTrigger: {
      trigger: '.fischer-right',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.5,
    delay: 0.3,
  });

  // Specs stagger
  gsap.to('.fischer-spec', {
    scrollTrigger: {
      trigger: '.fischer-specs',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'back.out(1.2)',
  });
  gsap.set('.fischer-spec', { y: 30 });

  // Image parallax on scroll
  gsap.to('.fischer-img', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-fischer',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });
}


// ---------- PÚBLICO-ALVO ----------
function audienceAnimations() {
  // Section header
  gsap.from('.section-publico .section-tag', {
    scrollTrigger: {
      trigger: '.section-publico .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
  });

  gsap.from('.section-publico .section-title', {
    scrollTrigger: {
      trigger: '.section-publico .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.15,
  });

  // Cards stagger with scale
  gsap.to('.audience-card', {
    scrollTrigger: {
      trigger: '.audience-grid',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    stagger: 0.15,
    ease: 'back.out(1.4)',
  });
  gsap.set('.audience-card', { y: 50, scale: 0.9 });
}


// ---------- SOBRE / TIMELINE ----------
function aboutAnimations() {
  // Section header
  gsap.from('.section-sobre .section-tag', {
    scrollTrigger: {
      trigger: '.section-sobre .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
  });

  gsap.from('.section-sobre .section-title', {
    scrollTrigger: {
      trigger: '.section-sobre .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.15,
  });

  gsap.from('.sobre-intro', {
    scrollTrigger: {
      trigger: '.section-sobre .section-header',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    delay: 0.3,
  });

  // Timeline cards stagger
  gsap.to('.timeline-card', {
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
  });
  gsap.set('.timeline-card', { y: 40 });

  // Timeline dots
  gsap.from('.timeline-dot', {
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    scale: 0,
    duration: 0.5,
    stagger: 0.2,
    ease: 'back.out(3)',
    delay: 0.2,
  });
}


// ---------- MARCAS ----------
function marcasAnimations() {
  gsap.from('.marca-img', {
    scrollTrigger: {
      trigger: '.section-marcas',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
  });
}


// ---------- CTA PULSE ----------
function ctaPulse() {
  // Subtle pulse on all section CTAs
  document.querySelectorAll('.section-cta-wrap .btn-cta').forEach(btn => {
    gsap.to(btn, {
      boxShadow: `0 12px 40px ${getComputedStyle(document.documentElement).getPropertyValue('--cta-green-glow')}`,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}


// ---------- PHONE MASK ----------
function phoneMask() {
  const phoneInput = document.getElementById('form-phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 7) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    e.target.value = val;
  });
}


// ---------- FORM SUBMISSION ----------
document.getElementById('leadForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = e.target.querySelector('.btn-cta-form');
  const originalHTML = btn.innerHTML;

  // Success animation
  gsap.to(btn, {
    scale: 0.95,
    duration: 0.1,
    onComplete: () => {
      btn.innerHTML = '<span>✓ Proposta Solicitada!</span>';
      btn.style.background = '#1a8a1a';

      gsap.to(btn, {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });

      // Create confetti-like particles
      createSuccessParticles(btn);

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        e.target.reset();
      }, 3000);
    }
  });
});


// ---------- SUCCESS PARTICLES ----------
function createSuccessParticles(target) {
  const rect = target.getBoundingClientRect();
  const colors = ['#2eb42e', '#3a7bd5', '#ffffff', '#5b9ae8'];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
    `;
    document.body.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200 - 50,
      opacity: 0,
      scale: 0,
      duration: 0.8 + Math.random() * 0.5,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    });
  }
}

// ---------- SMOOTH ANCHOR SCROLLING ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 20 },
        ease: 'power3.inOut',
      });
    }
  });
});
