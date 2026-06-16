/* ============================================================
   MSR SOFTWARE SOLUTIONS — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky Nav ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ---- Mobile Nav ---- */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  function openMobileNav() {
    mobileNav && mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', openMobileNav);
  mobileClose && mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileNav);

  /* ---- Scroll-reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ---- Animated Counters ---- */
  function animateCounter(el, target, duration = 1800) {
    const isDecimal = target % 1 !== 0;
    const suffix = el.dataset.suffix || '';
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * target;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---- Active nav link highlighting ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
  });

  /* ---- Contact form submit ---- */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      const data = {
        id: Date.now(),
        type: 'contact',
        date: new Date().toISOString(),
        firstName: contactForm.firstName?.value || '',
        lastName: contactForm.lastName?.value || '',
        email: contactForm.email?.value || '',
        phone: contactForm.phone?.value || '',
        organization: contactForm.organization?.value || '',
        service: contactForm.service?.value || '',
        budget: contactForm.budget?.value || '',
        message: contactForm.message?.value || '',
        status: 'new'
      };

      const existing = JSON.parse(localStorage.getItem('msr_submissions') || '[]');
      existing.unshift(data);
      localStorage.setItem('msr_submissions', JSON.stringify(existing));

      setTimeout(() => {
        contactForm.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.style.display = 'block';
      }, 1200);
    });
  }

  /* ---- Schedule Call form submit ---- */
  const scheduleForm = document.querySelector('#scheduleForm');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      btn.textContent = 'Scheduling…';
      btn.disabled = true;

      const data = {
        id: Date.now(),
        type: 'schedule',
        date: new Date().toISOString(),
        name: scheduleForm.schedName?.value || '',
        email: scheduleForm.schedEmail?.value || '',
        phone: scheduleForm.schedPhone?.value || '',
        preferredDate: scheduleForm.schedDate?.value || '',
        preferredTime: scheduleForm.schedTime?.value || '',
        topic: scheduleForm.schedTopic?.value || '',
        status: 'new'
      };

      const existing = JSON.parse(localStorage.getItem('msr_submissions') || '[]');
      existing.unshift(data);
      localStorage.setItem('msr_submissions', JSON.stringify(existing));

      setTimeout(() => {
        const wrap = document.querySelector('#scheduleFormWrap');
        if (wrap) wrap.innerHTML = '<div style="text-align:center;padding:40px 20px"><div style="font-size:2rem;margin-bottom:12px">✅</div><h4 style="font-size:1.1rem;font-weight:700;margin-bottom:8px">Call Scheduled!</h4><p style="color:#94a3b8;font-size:0.88rem">We\'ll confirm your slot within a few hours.</p></div>';
      }, 1000);
    });
  }

  /* ---- Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Parallax hero bg (subtle) ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }, { passive: true });
  }

});
