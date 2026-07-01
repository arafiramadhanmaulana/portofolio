/* ============================================================
   PORTFOLIO — Premium Interactive Script
   GSAP 3.12 · ScrollTrigger · Lenis · Lucide · Canvas Particles
   ============================================================ */

// ── Global: Contact Form Handler (Web3Forms) ─────────────────
async function handleContactSubmit(e) {
  if (e) e.preventDefault();

  const name    = document.getElementById('c-name')?.value.trim()    || '';
  const email   = document.getElementById('c-email')?.value.trim()   || '';
  const message = document.getElementById('c-message')?.value.trim() || '';

  const services = [];
  const checkboxes = [
    { id: 'look-website',     label: 'Website' },
    { id: 'look-webapp',      label: 'Web App' },
    { id: 'look-datascience', label: 'Data Science' },
    { id: 'look-ml',          label: 'Machine Learning' },
    { id: 'look-consult',     label: 'Consultation' },
    { id: 'look-other',       label: 'Other' },
  ];
  checkboxes.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (el && el.checked) services.push(label);
  });

  const submitBtn = document.getElementById('c-submitBtn');
  const feedback  = document.getElementById('c-feedback');

  if (submitBtn) {
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-bottom-color:transparent; border-radius:50%; animation:spin 1s linear infinite; margin-right:8px;"></span> Mengirim...';
  }
  if (feedback) {
    feedback.style.display = 'none';
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '5aee78ef-4f0a-4d63-a215-1cb29de8b51d',
        subject: 'Pesan Baru dari Portofolio - ' + name,
        from_name: name,
        email: email,
        layanan_diminati: services.length > 0 ? services.join(', ') : 'Tidak ada',
        message: message
      })
    });

    const result = await response.json();

    if (response.status === 200) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.color = 'var(--success, #10b981)';
        feedback.textContent = '✅ Pesan berhasil dikirim! Arafi akan segera membalas email Anda.';
      }
      document.getElementById('contact-form')?.reset();
    } else {
      throw new Error(result.message || 'Gagal mengirim pesan');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.color = '#ef4444';
      feedback.textContent = '❌ Terjadi kesalahan. Silakan coba lagi.';
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = 'Kirim Pesan <span class="btn-plane"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></span>';
    }
  }
}


// ── Main: DOMContentLoaded ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1 · Lucide Icons
  ---------------------------------------------------------- */
  if (typeof lucide !== 'undefined') lucide.createIcons();


  /* ----------------------------------------------------------
     2 · Enhanced Particle Canvas Background (120 colored particles)
  ---------------------------------------------------------- */
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let w, h;
    const PARTICLE_COUNT   = 120;
    const CONNECTION_DIST  = 140;
    const MOUSE_RADIUS     = 200;
    const particles = [];
    let mousePos = { x: -999, y: -999 };
    const COLORS = [
      'rgba(129,140,248,',  // primary indigo
      'rgba(34,211,238,',   // secondary cyan
      'rgba(244,114,182,',  // accent pink
      'rgba(255,255,255,',  // white
    ];

    function resizeCanvas() {
      w = particleCanvas.width  = window.innerWidth;
      h = particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.x  = Math.random() * w;
        this.y  = Math.random() * h;
        this.r  = Math.random() * 1.5 + 0.5;
        this.baseO = Math.random() * 0.35 + 0.08;
        this.o  = this.baseO;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.pulse = Math.random() * Math.PI * 2; // phase offset for pulsing
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0)  this.x = w;
        if (this.x > w)  this.x = 0;
        if (this.y < 0)  this.y = h;
        if (this.y > h)  this.y = 0;

        // Pulse glow
        this.pulse += 0.02;
        this.o = this.baseO + Math.sin(this.pulse) * 0.1;

        // Mouse repulsion
        const dx = this.x - mousePos.x;
        const dy = this.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.5;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }

        // Speed dampening
        this.vx *= 0.99;
        this.vy *= 0.99;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.max(0, this.o).toFixed(2) + ')';
        ctx.fill();
        // Glow
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color + '0.3)';
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawConnections() {
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  /* ----------------------------------------------------------
     3 · Custom Cursor
  ---------------------------------------------------------- */
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');

  if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top  = `${mouseY}px`;
    });

    // Follower lerp via gsap ticker
    gsap.ticker.add(() => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top  = `${followerY}px`;
    });

    // Hover interactions
    const hoverTargets = document.querySelectorAll(
      'a, button, input, textarea, .skill-card, .project-card, .timeline-card'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  /* ----------------------------------------------------------
     4 · Preloader
  ---------------------------------------------------------- */
  const preloader        = document.getElementById('preloader');
  const preloaderBar     = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');

  if (preloader) {
    let progress = 0;

    const loadInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 7) + 6;   // 6‑12
      if (progress > 100) progress = 100;

      if (preloaderBar)     preloaderBar.style.width    = `${progress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(loadInterval);
        exitPreloader();
      }
    }, 70);

    function exitPreloader() {
      const tl = gsap.timeline({
        onComplete: () => {
          preloader.style.display = 'none';
          triggerHeroEntrance();
          ScrollTrigger.refresh();
        }
      });

      tl.to('.preloader-content', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.out',
      })
      .to('.preloader-left', {
        xPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
      }, '-=0.1')
      .to('.preloader-right', {
        xPercent: 100,
        duration: 1.1,
        ease: 'power4.inOut',
      }, '<');                                            // same start
    }
  } else {
    // No preloader — fire hero immediately
    triggerHeroEntrance();
  }


  /* ----------------------------------------------------------
     5 · Native Smooth Scroll
  ---------------------------------------------------------- */
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile nav if open
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) mobileNav.classList.remove('active');
      }
    });
  });


  /* ----------------------------------------------------------
     6 · Navigation Pill Tracker
  ---------------------------------------------------------- */
  const desktopLinks = document.querySelectorAll('.desktop-nav a');
  const mobileLinks  = document.querySelectorAll('.mobile-nav a');
  const navPill      = document.getElementById('nav-pill');
  const mobilePill   = document.getElementById('mobile-pill');

  function movePill(pill, link) {
    if (!pill || !link) return;
    const rect   = link.getBoundingClientRect();
    const parent = pill.parentElement.getBoundingClientRect();
    gsap.to(pill, {
      left:     rect.left - parent.left,
      width:    rect.width,
      duration: 0.35,
      ease:     'power2.out',
    });
  }

  function setActiveNav(id) {
    desktopLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      if (l.classList.contains('active')) movePill(navPill, l);
    });
    mobileLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      if (l.classList.contains('active')) movePill(mobilePill, l);
    });
  }

  // IntersectionObserver for active section
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  // Initial pill position
  const initialActive = document.querySelector('.desktop-nav a.active');
  if (initialActive) movePill(navPill, initialActive);

  window.addEventListener('resize', () => {
    const active = document.querySelector('.desktop-nav a.active');
    if (active) movePill(navPill, active);
    const mActive = document.querySelector('.mobile-nav a.active');
    if (mActive) movePill(mobilePill, mActive);
  });


  /* ----------------------------------------------------------
     7 · Hero Entrance Animation
  ---------------------------------------------------------- */
  function triggerHeroEntrance() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      // Manual text splitting — preserve <br> and child elements
      const children = Array.from(heroTitle.childNodes);
      heroTitle.innerHTML = '';

      children.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          heroTitle.appendChild(document.createElement('br'));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Wrap the inner text of child elements (e.g. <span class="accent">)
          const wrapper = node.cloneNode(false);
          const text = node.textContent;
          text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.display = 'inline-block';
            wrapper.appendChild(span);
          });
          heroTitle.appendChild(wrapper);
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.display = 'inline-block';
            heroTitle.appendChild(span);
          });
        }
      });

      // Animate characters
      gsap.from('.hero-title .char', {
        opacity:  0,
        y:        '100%',
        rotateX:  -90,
        stagger:  0.03,
        duration: 0.8,
        ease:     'back.out(1.7)',
        clearProps: 'all',
      });
    }

    // Supporting elements
    const tl = gsap.timeline({ delay: 0.4 });
    tl.from('.hero-tagline', { opacity: 0, y: 30, duration: 0.6, clearProps: 'all' })
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6, clearProps: 'all' }, '-=0.3')
      .from('.hero-actions',  { opacity: 0, y: 30, duration: 0.6, clearProps: 'all' }, '-=0.3')
      .from('.hero-socials',  { opacity: 0, y: 30, duration: 0.6, clearProps: 'all' }, '-=0.3');

    // Hero visual
    gsap.from('.hero-visual', {
      scale:    0.8,
      opacity:  0,
      duration: 1.5,
      ease:     'elastic.out(1,0.5)',
      delay:    0.6,
      clearProps: 'all',
    });

    // Header
    gsap.from('header', {
      opacity:  0,
      y:        -20,
      duration: 0.8,
      delay:    0.3,
      clearProps: 'all',
    });
  }


  /* ----------------------------------------------------------
     8 · ScrollTrigger Reveals
  ---------------------------------------------------------- */

  // — Flow sections —
  gsap.utils.toArray('.flow-header').forEach(el => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.flow-content').forEach(container => {
    const kids = container.children;
    if (kids.length) {
      gsap.from(kids, {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', clearProps: 'all',
        scrollTrigger: { trigger: container, start: 'top 85%' },
      });
    }
  });

  gsap.utils.toArray('.flow-perk-card, .value-item, .stat-item-flow').forEach((el, i) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // — Stat counter animation —
  gsap.utils.toArray('.stat-num-flow').forEach(el => {
    const raw    = el.getAttribute('data-target') || el.textContent;
    const suffix = raw.replace(/[\d.]/g, '');                    // e.g. "+"
    const target = parseFloat(raw);
    const isDecimal = raw.includes('.');
    const decimals  = isDecimal ? (raw.split('.')[1] || '').replace(/\D/g, '').length : 0;

    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start:   'top 85%',
      once:    true,
      onEnter: () => {
        gsap.to(obj, {
          val:      target,
          duration: 2,
          ease:     'power1.out',
          snap:     isDecimal ? { val: 1 / Math.pow(10, decimals) } : { val: 1 },
          onUpdate: () => {
            el.textContent = isDecimal
              ? obj.val.toFixed(decimals) + suffix
              : Math.floor(obj.val) + suffix;
          },
        });
      },
    });
  });

  // — Skills grid —
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 20, scale: 0.9, duration: 0.5,
      delay: i * 0.04, ease: 'back.out(1.4)', clearProps: 'all',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
  });

  // — Timeline cards —
  gsap.utils.toArray('.timeline-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      x:        i % 2 === 0 ? -40 : 40,
      duration: 0.7,
      delay:    i * 0.08,
      ease:     'power3.out',
      clearProps: 'all',
      scrollTrigger: { trigger: card, start: 'top 85%' },
    });
  });

  // — Project cards —
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 50, scale: 0.95, duration: 0.7,
      delay: i * 0.06, ease: 'back.out(1.2)', clearProps: 'all',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
  });

  // — Award cards —
  gsap.utils.toArray('.award-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 30, duration: 0.6,
      delay: i * 0.1, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
  });

  // — Contact section —
  const contactTitle = document.querySelector('.contact-title');
  if (contactTitle) {
    gsap.from(contactTitle, {
      opacity: 0, x: -30, duration: 0.7, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: contactTitle, start: 'top 85%' },
    });
  }

  const contactForm = document.querySelector('.contact-form-card');
  if (contactForm) {
    gsap.from(contactForm, {
      opacity: 0, x: 30, duration: 0.7, ease: 'power3.out', clearProps: 'all',
      scrollTrigger: { trigger: contactForm, start: 'top 85%' },
    });
  }

  // — Footer giant text parallax —
  const footerText = document.querySelector('.footer-giant-text');
  if (footerText) {
    gsap.to(footerText, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: footerText,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   true,
      },
    });
  }


  /* ----------------------------------------------------------
     9 · Magnetic Button Effect
  ---------------------------------------------------------- */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = e.clientX - (rect.left + rect.width  / 2);
      const dy   = e.clientY - (rect.top  + rect.height / 2);
      gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
    });
  });


  /* ----------------------------------------------------------
     10 · Contact Form Binding
  ---------------------------------------------------------- */
  const contactFormEl = document.getElementById('contact-form');
  if (contactFormEl) {
    contactFormEl.addEventListener('submit', handleContactSubmit);
  }


  /* ----------------------------------------------------------
     11 · Marquee Continuous Scroll
  ---------------------------------------------------------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    const kids = Array.from(track.children);
    if (kids.length && track.scrollWidth <= window.innerWidth * 2) {
      kids.forEach(child => track.appendChild(child.cloneNode(true)));
    }
  });


  /* ----------------------------------------------------------
     12 · Mobile Nav Toggle (bonus utility)
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNavEl = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNavEl) {
    menuToggle.addEventListener('click', () => {
      mobileNavEl.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }


  /* ----------------------------------------------------------
     13 · Scroll Progress Bar
  ---------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    gsap.to(scrollProgress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }


  /* ----------------------------------------------------------
     14 · Section Title Reveal Animation
  ---------------------------------------------------------- */
  document.querySelectorAll('.section-header .title, .flow-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        once: true
      }
    });
  });


  /* ----------------------------------------------------------
     15 · Hero Image Parallax Tilt on Mouse
  ---------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero-visual');
  const heroWrapper = document.querySelector('.visual-image-wrapper');
  if (heroVisual && heroWrapper) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 12;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 12;
      gsap.to(heroWrapper, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });
    heroVisual.addEventListener('mouseleave', () => {
      gsap.to(heroWrapper, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  }


  /* ----------------------------------------------------------
     16 · Typewriter Effect on Hero Tagline
  ---------------------------------------------------------- */
  const taglineEl = document.querySelector('.hero-tagline');
  if (taglineEl) {
    const fullText = taglineEl.textContent;
    taglineEl.textContent = '';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typewriter-cursor';
    taglineEl.appendChild(cursorSpan);

    function typeWriter(text, i) {
      if (i < text.length) {
        taglineEl.insertBefore(document.createTextNode(text.charAt(i)), cursorSpan);
        setTimeout(() => typeWriter(text, i + 1), 25);
      } else {
        // Remove cursor after a delay
        setTimeout(() => cursorSpan.remove(), 2000);
      }
    }

    // Will be called by triggerHeroEntrance, but we delay it
    const originalTrigger = window._heroTypewrite;
    window._heroTypewrite = () => typeWriter(fullText, 0);
  }


  /* ----------------------------------------------------------
     17 · 3D Hover on Project Cards
  ---------------------------------------------------------- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 600,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });


  /* ----------------------------------------------------------
     18 · Floating Cards Parallax on Scroll
  ---------------------------------------------------------- */
  document.querySelectorAll('.floating-overlay-card').forEach((card, i) => {
    gsap.to(card, {
      y: i % 2 === 0 ? -40 : 40,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });


  /* ----------------------------------------------------------
     19 · Skill Cards Wave Animation
  ---------------------------------------------------------- */
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      // Ripple: animate adjacent cards
      const allCards = gsap.utils.toArray('.skill-card');
      allCards.forEach((otherCard, j) => {
        const distance = Math.abs(i - j);
        if (distance > 0 && distance <= 3) {
          gsap.to(otherCard, {
            y: -4 * (4 - distance),
            duration: 0.3,
            delay: distance * 0.05,
            ease: 'power2.out',
          });
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.utils.toArray('.skill-card').forEach(c => {
        gsap.to(c, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      });
    });
  });


  /* ----------------------------------------------------------
     20 · Preloader Safety Timeout (max 3 seconds)
  ---------------------------------------------------------- */
  setTimeout(() => {
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl && preloaderEl.style.display !== 'none') {
      console.warn('Preloader safety timeout — force dismissing');
      preloaderEl.style.display = 'none';
      triggerHeroEntrance();
      ScrollTrigger.refresh();
    }
  }, 3000);


  /* ----------------------------------------------------------
     21 · Start Typewriter after Hero Entrance
  ---------------------------------------------------------- */
  setTimeout(() => {
    if (window._heroTypewrite) window._heroTypewrite();
  }, 2500);


  /* ----------------------------------------------------------
     22 · Header Hide on Scroll Down, Show on Scroll Up
  ---------------------------------------------------------- */
  let lastScrollY = 0;
  const headerEl = document.querySelector('header');
  if (headerEl) {
    const onScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      if (currentY > lastScrollY && currentY > 100) {
        gsap.to(headerEl, { y: -100, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(headerEl, { y: 0, duration: 0.3, ease: 'power2.out' });
      }
      lastScrollY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ----------------------------------------------------------
     23 · Gallery Lightbox
  ---------------------------------------------------------- */
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption');
      if (img && lightboxOverlay && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = caption || '';
        }
        lightboxOverlay.classList.add('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay) {
      lightboxOverlay.classList.remove('active');
    }
  });

});
