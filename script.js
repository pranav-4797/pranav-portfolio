// ===== TYPED TEXT EFFECT =====
class TypedEffect {
  constructor(element, strings, options = {}) {
    this.element = element;
    this.strings = strings;
    this.typeSpeed = options.typeSpeed || 55;
    this.deleteSpeed = options.deleteSpeed || 30;
    this.pauseTime = options.pauseTime || 2000;
    this.currentString = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.start();
  }

  start() { this.tick(); }

  tick() {
    const current = this.strings[this.currentString];
    if (this.isDeleting) { this.currentChar--; } else { this.currentChar++; }
    this.element.textContent = current.substring(0, this.currentChar);
    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
    if (!this.isDeleting && this.currentChar === current.length) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentString = (this.currentString + 1) % this.strings.length;
      delay = 400;
    }
    setTimeout(() => this.tick(), delay);
  }
}

// ===== SUBTLE PARTICLE CANVAS =====
class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.init();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  init() {
    this.resize();
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 22000), 50);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.2 + 0.3,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.25 + 0.05,
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animate());
  }
}

// ===== HELPERS =====
const isMobile = () => window.innerWidth <= 768;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // --- Typed Effect ---
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    new TypedEffect(typedEl, [
      'AI-Focused Full-Stack Developer',
      'Python & JavaScript Engineer',
      'Building Intelligent Applications',
    ]);
  }

  // --- Particle Canvas ---
  const canvas = document.getElementById('hero-canvas');
  if (canvas) new ParticleField(canvas);

  // --- Navbar Scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });

  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const skillFills = entry.target.querySelectorAll('.skill-fill');
          skillFills.forEach((fill) => {
            const width = fill.getAttribute('data-width');
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Certificate Card Effects ---
  const certCards = document.querySelectorAll('.cert-card');

  // Cursor-follow glow + parallax tilt (desktop only)
  certCards.forEach((card) => {
    const glow = card.querySelector('.cert-card-glow');

    card.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move glow to cursor position
      if (glow) {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }

      // Subtle parallax tilt (max 6px)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -3;
      const tiltY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-4px) scale(1.03) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Certificate Filter ---
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      let visibleIndex = 0;
      certCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          const delay = visibleIndex * 50;
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          }, delay);
          visibleIndex++;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- Certificate Detail Modal ---
  const certModal = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalIssuer = document.getElementById('modal-issuer');
  const modalDate = document.getElementById('modal-date');
  const modalCategoryBadge = document.getElementById('modal-category-badge');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const modalSkills = document.getElementById('modal-skills');
  const certModalClose = document.getElementById('cert-modal-close');

  const categoryLabels = {
    ai: 'AI & ML',
    programming: 'Programming',
    tools: 'AI Tools',
    professional: 'Professional',
  };

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      // Click feedback — scale down briefly
      card.classList.add('pressing');
      setTimeout(() => card.classList.remove('pressing'), 120);

      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer');
      const date = card.getAttribute('data-date');
      const category = card.getAttribute('data-category');
      const desc = card.getAttribute('data-desc');
      const skills = card.getAttribute('data-skills');
      const imgSrc = card.querySelector('.cert-image img').src;

      // Populate modal
      modalTitle.textContent = title;
      modalIssuer.textContent = issuer;
      modalDate.textContent = date;
      modalImg.src = imgSrc;
      modalImg.alt = title;
      modalDesc.textContent = desc;

      // Category badge
      modalCategoryBadge.textContent = categoryLabels[category] || category;
      modalCategoryBadge.className = 'meta-badge cert-category-badge ' + category;

      // Skills
      modalSkills.innerHTML = '';
      if (skills) {
        skills.split(',').forEach((skill) => {
          const tag = document.createElement('span');
          tag.className = 'cert-modal-skill-tag';
          tag.textContent = skill.trim();
          modalSkills.appendChild(tag);
        });
      }

      // Open modal with slight delay for click feedback
      setTimeout(() => {
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 80);
    });
  });

  const closeModal = () => {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  certModalClose.addEventListener('click', closeModal);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Contact Form ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = '#22C55E';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 2500);
    });
  }
});
