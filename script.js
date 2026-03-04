/* =============================================
   مكتب المهندس عبدالله مطر البقمي - الجافاسكريبت
   ============================================= */

// رقم الواتساب — غيّره هنا إذا احتجت لتعديله
const WA_NUMBER = '966500111809';

// ══════════════════════════════════════════════
// الناف بار: Sticky + Mobile Toggle
// ══════════════════════════════════════════════
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  // Scrolled class
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // Mobile toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
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
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  // Dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Arrow buttons
  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  prevBtn && prevBtn.addEventListener('click', () => { prev(); startTimer(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); startTimer(); });

  // Swipe support
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

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = form.querySelector('[name="fullname"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const type    = form.querySelector('[name="ptype"]').value;
    const city    = form.querySelector('[name="city"]').value.trim();
    const details = form.querySelector('[name="details"]').value.trim();
    const msg     = form.querySelector('[name="message"]').value.trim();

    // التحقق من الحقول الإلزامية
    if (!name || !phone || !type) {
      showFormError(form, 'يرجى تعبئة جميع الحقول الإلزامية (الاسم، الجوال، نوع المشروع).');
      return;
    }

    // بناء الرسالة
    let text = `مرحباً، أود الاستفسار عن خدماتكم الهندسية.\n\n`;
    text += `👤 الاسم: ${name}\n`;
    text += `📱 الجوال: ${phone}\n`;
    text += `🏗️ نوع المشروع: ${type}\n`;
    if (city)    text += `📍 المدينة: ${city}\n`;
    if (details) text += `📋 تفاصيل المشروع: ${details}\n`;
    if (msg)     text += `💬 رسالة: ${msg}\n`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

    // رسالة نجاح
    const successEl = form.querySelector('.success-msg');
    if (successEl) { successEl.classList.add('show'); }

    // فتح واتساب
    setTimeout(() => { window.open(url, '_blank'); }, 400);
  });
}

function showFormError(form, msg) {
  let err = form.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#e53e3e;font-size:.85rem;margin-top:.5rem;font-weight:600;';
    form.querySelector('.form-submit').before(err);
  }
  err.textContent = msg;
  setTimeout(() => { if (err.parentNode) err.remove(); }, 4000);
}

// ══════════════════════════════════════════════
// Scroll to Top
// ══════════════════════════════════════════════
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
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
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ══════════════════════════════════════════════
// Intersection Observer: Animate on Scroll
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
  }, { threshold: 0.12 });

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .5s ease ${(i % 4) * 0.08}s, transform .5s ease ${(i % 4) * 0.08}s`;
    obs.observe(el);
  });
}

// ══════════════════════════════════════════════
// Calculator Logic
// ══════════════════════════════════════════════
// أسعار أساسية لكل متر مربع (تقديرية)
const BASE_PRICES = {
  'سكني':    900,
  'تجاري':  1200,
  'إداري':  1100,
  'فيلا':   1000,
  'عمارة':   950,
  'كمبوند': 1500,
  'أخرى':   1000,
};

// نسب الإضافة للخدمات
const SERVICE_ADDONS = {
  'تصميم':              0.05,
  'إشراف هندسي':        0.07,
  'اعتماد مخططات':     0.03,
  'استخراج رخص':        0.02,
};

function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const ptype   = form.querySelector('[name="calc_type"]').value;
    const area    = parseFloat(form.querySelector('[name="calc_area"]').value);
    const floors  = parseInt(form.querySelector('[name="calc_floors"]').value) || 1;
    const checked = [...form.querySelectorAll('[name="calc_services"]:checked')].map(c => c.value);

    if (!ptype || !area || area <= 0) {
      alert('يرجى اختيار نوع المشروع وإدخال المساحة.');
      return;
    }

    const base   = BASE_PRICES[ptype] || 1000;
    let estimate = area * base * floors;

    // إضافة نسب الخدمات
    let addonPct = 0;
    checked.forEach(s => { addonPct += (SERVICE_ADDONS[s] || 0); });
    const addonAmt = estimate * addonPct;
    estimate += addonAmt;

    displayCalcResult({ ptype, area, floors, base, estimate, addonAmt, addonPct, checked });
  });

  // زر حجز استشارة → واتساب
  document.querySelectorAll('.book-consult').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('مرحباً، أود حجز استشارة مجانية مع الفريق الهندسي.')}`;
      window.open(url, '_blank');
    });
  });

  // زر مراجعة التقدير → واتساب
  document.querySelectorAll('.review-estimate').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('مرحباً، أود مراجعة التقدير الأولي لمشروعي مع الفريق الهندسي.')}`;
      window.open(url, '_blank');
    });
  });
}

function displayCalcResult({ ptype, area, floors, base, estimate, addonAmt, addonPct, checked }) {
  const resultEl = document.getElementById('calcResult');
  if (!resultEl) return;

  const fmt = n => Math.round(n).toLocaleString('ar-SA');
  const baseTotal = area * base * floors;
  const servicesLabel = checked.length ? checked.join('، ') : '—';

  resultEl.innerHTML = `
    <div class="result-amount">
      <p class="result-label">التكلفة التقديرية الأولية</p>
      <div class="result-value">${fmt(estimate)}</div>
      <p class="result-suffix">ريال سعودي</p>
    </div>

    <div class="result-breakdown">
      <div class="breakdown-row"><span>نوع المشروع</span><span>${ptype}</span></div>
      <div class="breakdown-row"><span>المساحة</span><span>${area.toLocaleString('ar-SA')} م²</span></div>
      <div class="breakdown-row"><span>عدد الأدوار</span><span>${floors}</span></div>
      <div class="breakdown-row"><span>السعر الأساسي / م²</span><span>${base.toLocaleString('ar-SA')} ر.س</span></div>
      <div class="breakdown-row"><span>القيمة الأساسية</span><span>${fmt(baseTotal)} ر.س</span></div>
      <div class="breakdown-row"><span>الخدمات المضافة (${Math.round(addonPct * 100)}%)</span><span>+ ${fmt(addonAmt)} ر.س</span></div>
      <div class="breakdown-row"><span>الخدمات المحددة</span><span>${servicesLabel}</span></div>
    </div>

    <div class="result-note">
      ⚠️ هذا التقدير أولي ويحتاج مراجعة مع الفريق الهندسي. الأسعار تقديرية وقد تختلف بناءً على طبيعة المشروع وموقعه ومتطلباته التفصيلية.
    </div>

    <div class="result-actions">
      <button class="btn btn-primary review-estimate">تواصل معنا لمراجعة التقدير</button>
      <button class="btn btn-outline book-consult">حجز استشارة مجانية 🟢</button>
    </div>
  `;

  resultEl.style.display = 'block';

  // ملاحظة: إرسال البيانات عبر الإيميل
  // ضع عنوان الإيميل الحقيقي للمكتب في المتغير أدناه
  const OFFICE_EMAIL = 'office@example.com'; // ← غيّر هذا للإيميل الحقيقي
  const subject = encodeURIComponent('تقدير مشروع جديد');
  const body = encodeURIComponent(
    `نوع المشروع: ${ptype}\nالمساحة: ${area} م²\nعدد الأدوار: ${floors}\nالخدمات: ${servicesLabel}\nالتكلفة التقديرية: ${Math.round(estimate).toLocaleString()} ريال`
  );
  const mailtoUrl = `mailto:${OFFICE_EMAIL}?subject=${subject}&body=${body}`;

  // إضافة زر الإيميل (fallback)
  const emailBtn = document.createElement('a');
  emailBtn.href = mailtoUrl;
  emailBtn.className = 'btn btn-outline btn-sm';
  emailBtn.style.justifyContent = 'center';
  emailBtn.textContent = '📧 إرسال التقدير بالبريد الإلكتروني';
  resultEl.querySelector('.result-actions').appendChild(emailBtn);

  // تفعيل أزرار واتساب الجديدة
  resultEl.querySelector('.review-estimate').addEventListener('click', () => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`مرحباً، أود مراجعة التقدير الأولي.\nنوع المشروع: ${ptype}\nالمساحة: ${area} م²\nعدد الأدوار: ${floors}\nالتكلفة التقديرية: ${Math.round(estimate).toLocaleString()} ريال`)}`;
    window.open(url, '_blank');
  });
  resultEl.querySelector('.book-consult').addEventListener('click', () => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('مرحباً، أود حجز استشارة مجانية مع الفريق الهندسي.')}`;
    window.open(url, '_blank');
  });

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ══════════════════════════════════════════════
// Language Toggle (UI only — English version TBD)
// ══════════════════════════════════════════════
function initLangToggle() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // يمكن هنا لاحقاً إضافة منطق التبديل الفعلي للإنجليزية
      alert('النسخة الإنجليزية قيد التطوير — English version coming soon.');
    });
  });
}

// ══════════════════════════════════════════════
// Init all on DOM ready
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
});
