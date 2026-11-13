/**
 * FITNESS & SPORTS - Main JavaScript Interactive Suite
 * Handles navigation, filter tabs, sticky header, accordions,
 * modal lightbox for 8 placeholders, form validation & notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initBackToTop();
  initProgramFilters();
  initFaqAccordion();
  initGalleryLightbox();
  initEnquiryForm();
  initContactForm();
  initAnimatedCounters();
});

/* 1. Sticky Header with Scroll Detection */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* 2. Responsive Mobile Navigation Menu & Dropdown Interaction */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Handle dropdown toggle for click/touch (both mobile and desktop support)
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      // Close any other open dropdowns
      dropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });

      dropdown.classList.toggle('open', !isOpen);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(d => d.classList.remove('open'));
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      dropdowns.forEach(d => d.classList.remove('open'));
      document.body.style.overflow = '';
    });
  });
}

/* 3. Back-to-Top Button */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 4. Fitness Program Category Filters */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card-item');

  if (!filterBtns.length || !programCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      programCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* 5. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle clicked item
      item.classList.toggle('active', !isActive);
    });
  });
}

/* 6. Gallery Lightbox supporting real images and placeholders */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBody = document.getElementById('lightboxBody');
  const closeBtn = document.getElementById('lightboxClose');

  if (!galleryItems.length || !lightboxModal || !lightboxBody) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const mediaElement = item.querySelector('.media-container') || item.querySelector('.img-placeholder') || item.querySelector('img');
      if (mediaElement) {
        const clone = mediaElement.cloneNode(true);
        lightboxBody.innerHTML = '';
        lightboxBody.appendChild(clone);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* 7. Membership Enquiry Form Validation & Frontend Demo Notification */
function initEnquiryForm() {
  const form = document.getElementById('membershipEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullName"]')?.value.trim();
    const phone = form.querySelector('[name="phoneNumber"]')?.value.trim();
    const email = form.querySelector('[name="emailAddress"]')?.value.trim();
    const program = form.querySelector('[name="program"]')?.value;
    const plan = form.querySelector('[name="membershipPlan"]')?.value;

    if (!name || !phone || !email || !program || !plan) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Basic phone validation (10 digits approx)
    const phonePattern = /^[0-9+\s-]{8,15}$/;
    if (!phonePattern.test(phone)) {
      showToast('Please enter a valid phone number (e.g. +91 90000 00000).', 'error');
      return;
    }

    // Success response for demonstration
    showToast(`Thank you, ${name}! [DEMO ONLY] Your enquiry for ${program} (${plan}) was simulated successfully. No actual transmission occurred.`, 'success');
    form.reset();
  });
}

/* 8. Contact Form Validation */
function initContactForm() {
  const form = document.getElementById('contactQuickForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all contact fields.', 'error');
      return;
    }

    showToast(`Thank you, ${name}! [DEMO ONLY] Message received in prototype mode.`, 'success');
    form.reset();
  });
}

/* 9. Animated Counter for Illustrative Stats */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let started = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = Math.ceil(target / 40);

      if (count < target) {
        counter.innerText = Math.min(count + increment, target);
        setTimeout(countUp, 35);
      } else {
        counter.innerText = target + (counter.getAttribute('data-suffix') || '');
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        countUp();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* Toast Message Display Utility */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.style.borderColor = type === 'error' ? '#ef4444' : '#39ff14';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
