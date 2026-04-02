/* ============================================================
   ROBERT ANKARA PORTFOLIO — script.js
   ============================================================ */

/* ---- 1. ANIMATED BACKGROUND (elegant floating orbs + grid) ---- */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, orbs;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildParticles();
    buildOrbs();
  }

  function buildParticles() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.2 + 0.3,
    }));
  }

  function buildOrbs() {
    orbs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 180 + Math.random() * 220,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      hue: i % 2 === 0 ? '56,189,248' : '129,140,248',
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw soft glowing orbs
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.hue},0.06)`);
      g.addColorStop(1, `rgba(${o.hue},0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
      if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;
    });

    // Draw lines between nearby particles
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.globalAlpha = (1 - dist / 120) * 0.35;
          ctx.strokeStyle = 'rgba(56,189,248,1)';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    ctx.globalAlpha = 1;
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56,189,248,0.55)';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ---- 2. NAVIGATION — show/hide sections ---- */
(function initNav() {
  const navLinks   = document.querySelectorAll('.nav-link, .mob-link');
  const sections   = document.querySelectorAll('.section');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function showSection(id) {
    sections.forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    const target = document.getElementById(id);
    if (target) {
      target.style.display = id === 'home' ? 'flex' : 'block';
      // Force reflow for animation restart
      void target.offsetWidth;
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav state
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.section === id);
    });

    // Trigger section-specific animations
    if (id === 'skills')     animateSkillBars();
    if (id === 'experience') animateTimeline();

    // Close mobile menu
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.dataset
        ? this.dataset.section
        : this.getAttribute('href').replace('#', '');
      const section = target || this.getAttribute('href').replace('#', '');
      showSection(section);
    });
  });

  // Handle href-only mob-links
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const section = this.getAttribute('href').replace('#', '');
      showSection(section);
    });
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Also handle hero CTA buttons that are nav-link
  document.querySelectorAll('a.nav-link').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const sec = this.dataset.section || this.getAttribute('href').replace('#','');
      if (sec) showSection(sec);
    });
  });
})();


/* ---- 3. TYPEWRITER EFFECT ---- */
(function initTyper() {
  const el      = document.getElementById('typedText');
  const phrases = [
    '.NET Backend Engineer',
    'C# Software Engineer',
    'ASP.NET Web API Developer',
    'Microservices Architect',
    'RESTful API Specialist',
    'SQL Server & EF Core',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 90);
  }
  tick();
})();


/* ---- 4. SKILL BARS ANIMATION ---- */
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach((bar, i) => {
    const fill  = bar.querySelector('.fill');
    const level = bar.dataset.level || 80;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = level + '%';
    }, 100 + i * 60);
  });
}


/* ---- 5. TIMELINE ANIMATION ---- */
function animateTimeline() {
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.classList.remove('visible');
    setTimeout(() => {
      item.classList.add('visible');
    }, 150 + i * 180);
  });
}


/* ---- 6. CONTACT FORM ---- */
(function initForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      note.textContent = '⚠️ Please fill in all fields.';
      note.style.color = '#f59e0b';
      return;
    }

    // Simulate send (replace with real email service like EmailJS or Formspree)
    note.textContent = '✅ Message sent! I\'ll get back to you soon.';
    note.style.color = '#10b981';
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 5000);
  });
})();
