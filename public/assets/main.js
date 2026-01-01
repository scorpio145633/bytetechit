/**
 * BYTEtech - Main JavaScript
 * Mobile menu, active nav, back-to-top, form validation
 */

(function() {
  'use strict';

  // DOM Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.querySelector('.back-to-top');
  const contactForm = document.getElementById('contact-form');

  // Store last focused element before opening menu
  let lastFocusedElement = null;

  /**
   * Mobile Menu Functions
   */
  function openMobileMenu() {
    lastFocusedElement = document.activeElement;
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first link in mobile menu
    const firstLink = mobileMenu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  function closeMobileMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleMobileMenu() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // Focus trap for mobile menu
  function handleFocusTrap(e) {
    if (!mobileMenu.classList.contains('active')) return;

    const focusableElements = mobileMenu.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }

  // Event Listeners for Mobile Menu
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
    if (e.key === 'Tab' && mobileMenu && mobileMenu.classList.contains('active')) {
      handleFocusTrap(e);
    }
  });

  // Close mobile menu when clicking a link
  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /**
   * Active Navigation Highlighting
   */
  function setActiveNav() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === pageName || 
          (pageName === '' && href === 'index.html') ||
          (pageName === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  setActiveNav();

  /**
   * Back to Top Button
   */
  function handleScroll() {
    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.addEventListener('scroll', handleScroll);

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  /**
   * Contact Form Validation
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorEl = formGroup.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
  }

  function clearAllErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));
  }

  function showAlert(type, message) {
    const alertEl = document.querySelector(`.alert-${type}`);
    if (alertEl) {
      alertEl.textContent = message;
      alertEl.classList.add('show');
      
      // Auto hide after 5 seconds
      setTimeout(() => {
        alertEl.classList.remove('show');
      }, 5000);
    }
  }

  function validateForm(form) {
    let isValid = true;
    clearAllErrors();

    // Name validation
    const nameInput = form.querySelector('#name');
    if (nameInput && !nameInput.value.trim()) {
      showError(nameInput, 'Name is required');
      isValid = false;
    }

    // Email validation
    const emailInput = form.querySelector('#email');
    if (emailInput) {
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Message validation
    const messageInput = form.querySelector('#message');
    if (messageInput && !messageInput.value.trim()) {
      showError(messageInput, 'Message is required');
      isValid = false;
    }

    return isValid;
  }

  if (contactForm) {
    // Real-time validation on blur
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          showError(this, `${this.previousElementSibling.textContent.replace(' *', '')} is required`);
        } else if (this.type === 'email' && this.value.trim() && !validateEmail(this.value.trim())) {
          showError(this, 'Please enter a valid email address');
        } else {
          clearError(this);
        }
      });

      input.addEventListener('input', function() {
        clearError(this);
      });
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (validateForm(this)) {
        // Show success message
        showAlert('success', "Thank you! We'll get back to you.");
        
        // Clear form
        this.reset();
        clearAllErrors();
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /**
   * Services page - highlight active section in sidebar
   */
  function highlightActiveSection() {
    const sections = document.querySelectorAll('.service-section');
    const sidebarLinks = document.querySelectorAll('.services-nav a');
    
    if (sections.length === 0 || sidebarLinks.length === 0) return;

    const navHeight = document.querySelector('.nav').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // Check if we're on services page
  if (document.querySelector('.services-nav')) {
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
  }

})();
