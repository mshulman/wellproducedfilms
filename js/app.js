document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 0. Password Gate Speedbump
  // =========================================================================
  const gateOverlay = document.getElementById('gate-overlay');
  const gateForm = document.getElementById('gate-form');
  const gatePassword = document.getElementById('gate-password');
  const gateError = document.getElementById('gate-error');
  const CORRECT_PASSWORD = 'orlawpf';

  if (gateOverlay && gateForm && gatePassword) {
    const isAuth = sessionStorage.getItem('orla_gate_auth') === 'true';
    if (!isAuth) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => gatePassword.focus(), 100);
    } else {
      gateOverlay.classList.add('unlocked');
      document.body.style.overflow = '';
    }

    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = (gatePassword.value || '').trim();
      if (entered.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
        sessionStorage.setItem('orla_gate_auth', 'true');
        gateOverlay.classList.add('unlocked');
        document.body.style.overflow = '';
        if (gateError) gateError.textContent = '';
        gatePassword.classList.remove('input-error');
      } else {
        if (gateError) gateError.textContent = 'Incorrect password. Please try again.';
        gatePassword.classList.remove('input-error');
        void gatePassword.offsetWidth;
        gatePassword.classList.add('input-error');
        gatePassword.select();
      }
    });

    gatePassword.addEventListener('input', () => {
      if (gatePassword.classList.contains('input-error')) {
        gatePassword.classList.remove('input-error');
        if (gateError) gateError.textContent = '';
      }
    });
  }

  // =========================================================================
  // 1. Header Scroll Spy & Active States
  // =========================================================================
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy
    let currentActive = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentActive = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize on load

  // =========================================================================
  // 2. Mobile Navigation Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 3. Characters Accordion / Modal Box Setup
  // =========================================================================
  const charactersData = {
    orla: {
      name: "Orla",
      role: "",
      img: "https://img1.wsimg.com/isteam/ip/25c80e0c-0757-4c39-a570-2e290b42bc79/Orla.png",
      desc: "Orla is a very smart but deeply troubled 14 year old girl who has recently lost her mother. She finds it impossible to settle into her home and school life with this new reality. She believes if she can escape to Ireland, her birth place, she will find comfort and solace with her relatives. She works day and night to put everything in place for her journey."
    },
    stranger: {
      name: "Stranger",
      role: "",
      img: "images/character_stranger.jpg",
      desc: "The stranger is a mysterious dark skinned, dark haired refugee in his early 30’s. He has recently arrived in the county after being the sole survivor of terrible accident at sea. A stranger in a strange land, he is searching for his community and his audience. Orla believes that she sees him perform miracles."
    },
    dad: {
      name: "Orla's Dad",
      role: "",
      img: "images/orlas_dad.jpg",
      desc: "Dad is barely holding it together. Recently widowed and grieving deeply, Dad has the responsibility of caring for his two daughters, Orla, 14, and Lily, 2yo. By day his is trying to be a good dad, but by night the sadness moves in and he drinks to ease his profound sorrow."
    },
    lilly: {
      name: "Lilly, Orla's younger sister",
      role: "",
      img: "https://img1.wsimg.com/isteam/ip/25c80e0c-0757-4c39-a570-2e290b42bc79/Gemini_Generated_Image_8emp9r8emp9r8emp.jpeg",
      desc: "Lily is the bridge between Orla and Dad, who while complete at odds with one another, they both agree that Lily needs their loving care."
    },
    mom: {
      name: "Orla’s Mum",
      role: "",
      img: "images/orlas_mom.jpg",
      desc: "Mum comes to the story only through Orla’s memory of her, yet she is a pivotal character to Orla’s conflict, and ultimately to her redemption."
    },
    fantasmo: {
      name: "Fantasmo the Elephant",
      role: "",
      img: "https://img1.wsimg.com/isteam/ip/25c80e0c-0757-4c39-a570-2e290b42bc79/blob-c914b8c.png",
      desc: "Fantasmo the Elephant becomes a magical force in Orla’s life, as she sees part of herself in the eyes of this magnificent animal, and wants  to liberate her from the chains that bind her."
    }
  };

  const charModal = document.getElementById('char-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const charCards = document.querySelectorAll('.character-card');

  const openModal = (charKey) => {
    const char = charactersData[charKey];
    if (!char) return;

    let imageHtml = '';
    if (char.isPlaceholder) {
      imageHtml = `<div class="modal-char-img char-placeholder ${char.bgClass}"><span>${char.name}</span></div>`;
    } else {
      imageHtml = `<img src="${char.img}" alt="${char.name}" class="modal-char-img">`;
    }

    modalBody.innerHTML = `
      <div class="modal-char-layout">
        <div class="modal-visual-wrapper">
          ${imageHtml}
        </div>
        <div class="modal-text-wrapper">
          <h3 class="modal-char-title">${char.name}</h3>
          ${char.role ? `<span class="modal-char-role">${char.role}</span>` : ''}
          <p class="modal-char-desc">${char.desc}</p>
        </div>
      </div>
    `;

    charModal.classList.add('open');
    charModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Disable page scroll
  };

  const closeModal = () => {
    charModal.classList.remove('open');
    charModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Re-enable scroll
  };

  charCards.forEach(card => {
    card.addEventListener('click', () => {
      const charKey = card.getAttribute('data-char');
      openModal(charKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close modal on Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && charModal.classList.contains('open')) {
      closeModal();
    }
  });

  // =========================================================================
  // 4. Praise Slider / Testimonial Carousel
  // =========================================================================
  const slides = document.querySelectorAll('.praise-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-quote');
  const nextBtn = document.getElementById('next-quote');
  let currentSlide = 0;
  let autoPlayTimer = null;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 6000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-slide'), 10);
      showSlide(index);
      resetAutoPlay();
    });
  });

  // Initialize Carousel AutoPlay
  if (slides.length > 0) {
    startAutoPlay();
  }

  // =========================================================================
  // 5. Accordions (Bios Info Expand/Collapse)
  // =========================================================================
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(trigger.id.replace('trigger', 'panel'));
      
      // Close other accordions
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(otherTrigger.id.replace('trigger', 'panel'));
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            otherPanel.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        panel.setAttribute('aria-hidden', 'true');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // =========================================================================
  // 6. Contact Form Submissions Handlers
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Disable submit button while submitting
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let resJson = await response.json();
        if (response.status === 200) {
          // Show success message with dynamic visual class
          formSuccess.classList.add('active');
          contactForm.reset();
        } else {
          console.error(response);
          alert(resJson.message || "Form submission failed. Please try again.");
        }
      })
      .catch(error => {
        console.error(error);
        alert("Failed to send message. Please check your internet connection.");
      })
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('active');
        }, 5000);
      });
    });
  }
});
