/* ==========================================
   INTERACTIVE LOGIC & ADVANCED GSAP
   Portfolio: Arafi Ramadhan Maulana
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Custom Interactive Cursor
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instant placement for central cursor dot
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    // Animate follow circle with interpolation (lag effect)
    gsap.to({}, {
      duration: 0.016,
      repeat: -1,
      onRepeat: () => {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        gsap.set(follower, { x: followerX, y: followerY });
      }
    });

    // Hover scale bindings for active items
    const hoverElements = document.querySelectorAll("a, button, input, textarea, label.checkbox-option-wrapper, .tech-skill-card, .project-card-premium, .timeline-node-card");
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  // 3. Preloader Progress Gate Exit
  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloader-bar");
  const preloaderContent = document.getElementById("preloader-content");
  const doorLeft = document.getElementById("preloader-left");
  const doorRight = document.getElementById("preloader-right");
  let progress = 0;

  const simulateLoading = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(simulateLoading);
      triggerPreloaderExit();
    }
    if (preloaderBar) preloaderBar.style.width = progress + "%";
  }, 70);

  function triggerPreloaderExit() {
    if (!preloader) return;

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = "none";
        triggerHeroEntrance();
        setTimeout(() => {
          if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
          }
        }, 100);
      }
    });

    // Fade logo & bar
    tl.to(preloaderContent, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: "power2.out"
    });

    // Slide doors apart
    tl.to(doorLeft, {
      xPercent: -100,
      duration: 1.1,
      ease: "power4.inOut"
    }, "-=0.3");

    tl.to(doorRight, {
      xPercent: 100,
      duration: 1.1,
      ease: "power4.inOut"
    }, "-=1.1");
  }

  // 4. Lenis Smooth Scrolling
  let lenis;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor smooth links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: -70,
            duration: 1.2,
            immediate: false
          });
        }
      });
    });
  }

  // 5. Active Magnetic Nav Indicators (Pill Tracker)
  const navLinks = document.querySelectorAll(".desktop-nav a");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const navPill = document.getElementById("nav-pill");
  const mobilePill = document.getElementById("mobile-pill");

  function alignNavPill(activeLink) {
    if (!activeLink || !navPill) return;
    const rect = activeLink.getBoundingClientRect();
    const parentRect = activeLink.parentElement.getBoundingClientRect();
    
    gsap.to(navPill, {
      left: rect.left - parentRect.left + "px",
      width: rect.width + "px",
      duration: 0.4,
      ease: "power3.out"
    });
  }

  function alignMobilePill(activeLink) {
    if (!activeLink || !mobilePill) return;
    const rect = activeLink.getBoundingClientRect();
    const parentRect = activeLink.parentElement.getBoundingClientRect();
    
    gsap.to(mobilePill, {
      left: rect.left - parentRect.left + "px",
      width: rect.width + "px",
      duration: 0.4,
      ease: "power3.out"
    });
  }

  // Handle window resizing alignment
  window.addEventListener("resize", () => {
    const activeLink = document.querySelector(".desktop-nav a.active");
    const activeMobLink = document.querySelector(".mobile-nav a.active");
    if (activeLink) alignNavPill(activeLink);
    if (activeMobLink) alignMobilePill(activeMobLink);
  });

  // Section observer to update navigation
  const obsOptions = {
    root: null,
    rootMargin: "-45% 0px -45% 0px", // Active at viewport middle
    threshold: 0
  };

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let id = entry.target.getAttribute("id");
        
        // Match project subsections to works link
        if (id === "projects") {
          id = "projects";
        }

        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
            alignNavPill(link);
          } else {
            link.classList.remove("active");
          }
        });

        mobileLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
            alignMobilePill(link);
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, obsOptions);

  document.querySelectorAll("section[id], div[id='about']").forEach((sec) => {
    activeObserver.observe(sec);
  });

  // 6. GSAP Load Entrance Timeline (For Hero Section elements)
  function triggerHeroEntrance() {
    const heroTl = gsap.timeline();
    
    heroTl.to("header", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(".hero-title", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
      .to(".hero-actions", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5")
      .to(".hero-socials", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .to(".hero-visual", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.8");
    
    // Animate Header Items
    gsap.to(".header-item", {
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out"
    });
  }

  // 7. GSAP ScrollTrigger reveals (Premium, highly professional)
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in flow-section headers
    document.querySelectorAll(".flow-header").forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power2.out"
      });
    });

    // Fade reveal flow-section content titles
    document.querySelectorAll(".flow-content").forEach((content) => {
      gsap.from(content.children, {
        scrollTrigger: {
          trigger: content,
          start: "top 75%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    // Flow perk-cards stagger
    document.querySelectorAll(".flow-grid-perks").forEach((grid) => {
      gsap.from(grid.children, {
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out"
      });
    });

    // Skills grid stagger
    gsap.from(".skills-grid-wrapper .tech-skill-card", {
      scrollTrigger: {
        trigger: ".skills-grid-wrapper",
        start: "top 95%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 15,
      stagger: 0.01,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "all"
    });

    // Timeline column headers
    gsap.from(".timeline-flow-col-title", {
      scrollTrigger: {
        trigger: "#experience",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.7,
      ease: "power2.out"
    });

    // Timeline cards entry (Premium WOW effect)
    gsap.from(".timeline-node-card", {
      scrollTrigger: {
        trigger: ".timeline-flow-grid",
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: -30,
      scale: 0.95,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.2)"
    });

    // Project cards reveal (Premium WOW effect, with clearProps to avoid filter bug)
    gsap.from(".project-card-premium", {
      scrollTrigger: {
        trigger: ".works-grid-wrapper",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      scale: 0.9,
      stagger: 0.05,
      duration: 0.8,
      ease: "back.out(1.2)",
      clearProps: "all"
    });

    // Contact visual reveals
    gsap.from(".contact-huge-title", {
      scrollTrigger: {
        trigger: "#contact",
        start: "top 75%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(".contact-form-glass-card", {
      scrollTrigger: {
        trigger: ".contact-layout-grid",
        start: "top 70%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: "power3.out"
    });

    // Footer brand logo & giant typography reveal
    gsap.from(".footer-giant-text", {
      scrollTrigger: {
        trigger: "footer",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: "power3.out"
    });
  }
});

// 8. Contact Form Submit and Formatted WhatsApp Redirection
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("c-name").value;
  const email = document.getElementById("c-email").value;
  const message = document.getElementById("c-message").value;
  const submitBtn = document.getElementById("c-submitBtn");
  const feedback = document.getElementById("c-feedback");

  // Collect checkboxes for "I'm looking for..."
  const lookingFor = [];
  if (document.getElementById("look-website").checked) lookingFor.push("Website");
  if (document.getElementById("look-webapp").checked) lookingFor.push("Web App");
  if (document.getElementById("look-datascience").checked) lookingFor.push("Data Science");
  if (document.getElementById("look-ml").checked) lookingFor.push("AI / ML Model");
  if (document.getElementById("look-consult").checked) lookingFor.push("Consulting");
  if (document.getElementById("look-other").checked) lookingFor.push("Other");

  // Set loading state
  if (submitBtn) {
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width:16px;"></i> Sending...';
    if (typeof lucide !== "undefined") lucide.createIcons();
    submitBtn.disabled = true;
  }

  // Simulate server post delay (1.5 seconds)
  setTimeout(() => {
    if (feedback) {
      feedback.style.display = "block";
      feedback.style.opacity = "1";
      feedback.innerHTML = `Terima kasih <strong>${name}</strong>, pesan Anda berhasil diproses!`;
      
      // Auto fade feedback
      gsap.to(feedback, {
        delay: 5,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          feedback.style.display = "none";
        }
      });
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<i data-lucide="check" style="width:16px;"></i> Sent!';
      if (typeof lucide !== "undefined") lucide.createIcons();
      
      setTimeout(() => {
        submitBtn.innerHTML = 'Send Message <i data-lucide="send" style="width:16px;"></i>';
        if (typeof lucide !== "undefined") lucide.createIcons();
        submitBtn.disabled = false;
      }, 3000);
    }

    // Reset Form Fields
    event.target.reset();

    // Construct a beautiful WhatsApp API message text
    const interestString = lookingFor.length > 0 ? lookingFor.join(", ") : "Diskusi Umum";
    const waText = encodeURIComponent(
      `Halo Arafi, saya ${name} (${email}).\n\n` +
      `Kebutuhan Proyek: ${interestString}\n` +
      `Pesan: ${message}`
    );
    const waUrl = `https://wa.me/6289515928647?text=${waText}`;

    // Launch WhatsApp
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1200);

  }, 1500);
}

// 9. Works/Projects Category Filtering Logic
function filterWorks(category) {
  const buttons = document.querySelectorAll(".works-filter .filter-btn");
  const cards = document.querySelectorAll("#works-grid-inventory .project-card-premium");

  buttons.forEach((btn) => {
    if (btn.getAttribute("data-filter") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Beautiful GSAP grid filtering
  const fadeOutTimeline = gsap.timeline({
    onComplete: () => {
      cards.forEach((card) => {
        const categories = card.getAttribute("data-category") ? card.getAttribute("data-category").split(" ") : [];
        if (category === "all" || categories.includes(category)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
      
      // Fade matching elements back in
      gsap.fromTo("#works-grid-inventory .project-card-premium[style*='display: flex']", 
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.04, 
          duration: 0.4, 
          ease: "power2.out",
          onComplete: () => {
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.refresh();
            }
          }
        }
      );
    }
  });

  // Fade everything out first
  fadeOutTimeline.to(cards, {
    opacity: 0,
    y: -10,
    duration: 0.25,
    stagger: 0.02,
    ease: "power2.in"
  });
}


