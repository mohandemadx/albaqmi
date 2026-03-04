/* =============================================
   Al-Buqami Engineering Consultancy — JS
   ============================================= */

// WhatsApp number — update here if it changes
const WA_NUMBER = '966500111809';

// ══════════════════════════════════════════════
// Navbar — Sticky + Mobile Toggle
// ══════════════════════════════════════════════
function initNavbar() {
  const navbar   = document.querySelector('.navbar');
  const toggle   = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Mark active page link
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });
}

// ══════════════════════════════════════════════
// Hero Slider
// ══════════════════════════════════════════════
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

  // Touch/swipe
  let touchX = 0;
  const sliderEl = document.querySelector('.hero-slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
    });
  }

  goTo(0);
  startTimer();
}

// ══════════════════════════════════════════════
// Contact Form → WhatsApp
// ══════════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('[name="fullname"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const type    = form.querySelector('[name="ptype"]').value;
    const city    = form.querySelector('[name="city"]').value.trim();
    const details = form.querySelector('[name="details"]').value.trim();
    const msg     = form.querySelector('[name="message"]').value.trim();

    // Validate required fields
    if (!name || !phone || !type) {
      showFormError(form, 'Please fill in all required fields (Name, Phone, Project Type).');
      return;
    }

    // Build structured WhatsApp message
    let text = `Hello, I would like to inquire about your engineering services.\n\n`;
    text += `👤 Full Name: ${name}\n`;
    text += `📱 Phone: ${phone}\n`;
    text += `🏗️ Project Type: ${type}\n`;
    if (city)    text += `📍 City: ${city}\n`;
    if (details) text += `📋 Project Details: ${details}\n`;
    if (msg)     text += `💬 Message: ${msg}\n`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    // Show success message
    const successEl = form.querySelector('.success-msg');
    if (successEl) successEl.classList.add('show');

    // Open WhatsApp after short delay so user sees confirmation
    setTimeout(() => { window.open(url, '_blank'); }, 400);
  });
}

function showFormError(form, msg) {
  let err = form.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#e53e3e;font-size:.84rem;margin-top:.5rem;font-weight:600;';
    form.querySelector('.form-submit').before(err);
  }
  err.textContent = msg;
  setTimeout(() => { if (err.parentNode) err.remove(); }, 4000);
}

// ══════════════════════════════════════════════
// Calculator Logic
// ══════════════════════════════════════════════
const BASE_PRICES = {
  'Residential':    900,
  'Commercial':    1200,
  'Administrative':1100,
  'Villa':         1000,
  'Building':       950,
  'Compound':      1500,
  'Other':         1000,
};

const SERVICE_ADDONS = {
  'Architectural Design':    0.05,
  'Engineering Supervision': 0.07,
  'Plan Approval':           0.03,
  'Licensing Procedures':    0.02,
};

function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const ptype   = form.querySelector('[name="calc_type"]').value;
    const area    = parseFloat(form.querySelector('[name="calc_area"]').value);
    const floors  = parseInt(form.querySelector('[name="calc_floors"]').value) || 1;
    const checked = [...form.querySelectorAll('[name="calc_services"]:checked')].map(c => c.value);

    if (!ptype || !area || area <= 0) {
      alert('Please select a project type and enter the area.');
      return;
    }

    const base   = BASE_PRICES[ptype] || 1000;
    let estimate = area * base * floors;

    let addonPct = 0;
    checked.forEach(s => { addonPct += SERVICE_ADDONS[s] || 0; });
    const addonAmt = estimate * addonPct;
    estimate += addonAmt;

    displayCalcResult({ ptype, area, floors, base, estimate, addonAmt, addonPct, checked });
  });

  // Static book/review buttons (before result is shown)
  document.querySelectorAll('.book-consult').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello, I would like to book a free engineering consultation.')}`, '_blank');
    });
  });
}

function displayCalcResult({ ptype, area, floors, base, estimate, addonAmt, addonPct, checked }) {
  const resultEl = document.getElementById('calcResult');
  if (!resultEl) return;

  const fmt = n => Math.round(n).toLocaleString('en-US');
  const baseTotal      = area * base * floors;
  const servicesLabel  = checked.length ? checked.join(', ') : '—';

  resultEl.innerHTML = `
    <div class="result-amount">
      <p class="result-label">Preliminary Cost Estimate</p>
      <div class="result-value">SAR ${fmt(estimate)}</div>
      <p class="result-suffix">Saudi Riyal</p>
    </div>

    <div class="result-breakdown">
      <div class="breakdown-row"><span>Project Type</span><span>${ptype}</span></div>
      <div class="breakdown-row"><span>Area</span><span>${area.toLocaleString()} m²</span></div>
      <div class="breakdown-row"><span>Floors</span><span>${floors}</span></div>
      <div class="breakdown-row"><span>Base Price / m²</span><span>SAR ${base.toLocaleString()}</span></div>
      <div class="breakdown-row"><span>Base Total</span><span>SAR ${fmt(baseTotal)}</span></div>
      <div class="breakdown-row"><span>Services Add-on (${Math.round(addonPct * 100)}%)</span><span>+ SAR ${fmt(addonAmt)}</span></div>
      <div class="breakdown-row"><span>Selected Services</span><span>${servicesLabel}</span></div>
    </div>

    <div class="result-note">
      ⚠️ This is a preliminary estimate and requires review with our engineering team. Actual costs vary based on location, soil conditions, and project specifics.
    </div>

    <div class="result-actions">
      <button class="btn btn-primary review-estimate">Review Estimate With Us</button>
      <button class="btn btn-outline book-consult-result">Book Free Consultation 🟢</button>
    </div>
  `;

  // Email fallback (mailto)
  // ← Replace 'office@example.com' below with the real office email address
  const OFFICE_EMAIL = 'office@example.com';
  const subject = encodeURIComponent('New Project Estimate Request');
  const body    = encodeURIComponent(
    `Project Type: ${ptype}\nArea: ${area} m²\nFloors: ${floors}\nServices: ${servicesLabel}\nEstimated Cost: SAR ${Math.round(estimate).toLocaleString()}`
  );
  const emailBtn = document.createElement('a');
  emailBtn.href = `mailto:${OFFICE_EMAIL}?subject=${subject}&body=${body}`;
  emailBtn.className = 'btn btn-outline btn-sm';
  emailBtn.style.justifyContent = 'center';
  emailBtn.textContent = '📧 Send Estimate by Email';
  resultEl.querySelector('.result-actions').appendChild(emailBtn);

  // Wire up dynamic buttons
  resultEl.querySelector('.review-estimate').addEventListener('click', () => {
    const text = `Hello, I would like to review my project estimate.\nType: ${ptype} | Area: ${area} m² | Floors: ${floors} | Estimated: SAR ${Math.round(estimate).toLocaleString()}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  });
  resultEl.querySelector('.book-consult-result').addEventListener('click', () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello, I would like to book a free engineering consultation.')}`, '_blank');
  });

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ══════════════════════════════════════════════
// Scroll to Top
// ══════════════════════════════════════════════
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => { btn.classList.toggle('show', window.scrollY > 400); });
  btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// ══════════════════════════════════════════════
// Smooth Anchor Scroll
// ══════════════════════════════════════════════
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
}

// ══════════════════════════════════════════════
// Animate on Scroll
// ══════════════════════════════════════════════
function initAnimations() {
  const els = document.querySelectorAll(
    '.activity-card, .service-card, .dept-card, .why-card, .project-row, .vm-card'
  );
  if (!window.IntersectionObserver) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.transition = `opacity .5s ease ${(i % 4) * 0.08}s, transform .5s ease ${(i % 4) * 0.08}s`;
    obs.observe(el);
  });
}

// ══════════════════════════════════════════════
// Language Toggle → switches to Arabic version
// ══════════════════════════════════════════════
function initLangToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Navigate to the Arabic version (parent folder)
      const currentPath = window.location.pathname;
      // If inside /en/ subfolder, go up one level to Arabic version
      const arabicPath = currentPath.includes('/en/')
        ? currentPath.replace('/en/', '/')
        : currentPath.replace(/([^/]+\.html)$/, '../$1');
      window.location.href = arabicPath;
    });
  });
}

// ══════════════════════════════════════════════
// Init
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlider();
  initContactForm();
  initScrollTop();
  initAnchorScroll();
  initAnimations();
  initCalculator();
  initLangToggle();
  document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });
});
