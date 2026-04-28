/* ── Logo image fallback ─────────────────────────────────── */
(function () {
  document.querySelectorAll('.nav__logo-img').forEach(img => {
    const fallback = img.nextElementSibling;
    img.addEventListener('load', () => {
      img.style.display = 'block';
      if (fallback) fallback.style.display = 'none';
    });
    img.addEventListener('error', () => {
      img.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
    });
  });
})();

/* ── Nav scroll behaviour ────────────────────────────────── */
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  function update() {
    if (window.scrollY > 40) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  // mobile toggle
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // close on link click
    menu.querySelectorAll('.nav__link').forEach(l => {
      l.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // active link
  const path = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav__link').forEach(l => {
    const href = l.getAttribute('href').replace(/\/$/, '') || '/index.html';
    if (path.endsWith(href) || (href === '/index.html' && path === '/')) {
      l.classList.add('nav__link--active');
    }
  });
})();

/* ── Scroll fade-up ──────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ── FAQ accordion ───────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Toast helper ────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* ── Contact form ────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '傳送中…';
    await new Promise(r => setTimeout(r, 1000));
    showToast('感謝您的來信，我們將於 1 個工作日內與您聯繫。');
    form.reset();
    btn.disabled = false; btn.textContent = '送出訊息';
  });
})();

/* ── Inquiry form ────────────────────────────────────────── */
(function () {
  const form = document.getElementById('inquiryForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = '傳送中…';
    await new Promise(r => setTimeout(r, 1000));
    showToast('詢問已送出，我們將盡快與您聯繫。');
    form.reset();
    btn.disabled = false; btn.textContent = '送出詢問';
  });
})();

/* ── Hero video (loads URL from /api/settings if available) ── */
(function () {
  const vid = document.getElementById('heroVideo');
  if (!vid) return;
  fetch('/api/settings')
    .then(r => r.ok ? r.json() : null)
    .then(cfg => {
      if (cfg && cfg.heroVideoUrl) {
        vid.src = cfg.heroVideoUrl;
        vid.closest('.hero').classList.add('hero--video');
      }
    })
    .catch(() => {});
})();
