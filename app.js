/* PublicLogic™ — app.js
   Progressive enhancement only. Site is fully usable without JS. */

/* =========================
   Utilities
   ========================= */
(function () {
  document.documentElement.classList.remove('no-js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* =========================
     Theme Controls (Light/Dark/Auto + High Contrast)
     ========================= */
  const THEME_KEY = 'pl-theme';
  const HC_KEY = 'pl-hc';

  const themeRadios = $$('input[name="theme"]');
  const hcToggle = $('#hc-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  function applyHC(enabled) {
    document.documentElement.classList.toggle('hc', !!enabled);
    if (hcToggle) hcToggle.setAttribute('aria-pressed', !!enabled);
    try { localStorage.setItem(HC_KEY, enabled ? '1' : '0'); } catch {}
  }

  // Initialize from storage
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      applyTheme(savedTheme);
      const match = $(`input[name="theme"][value="${savedTheme}"]`);
      if (match) match.checked = true;
    }
    const savedHC = localStorage.getItem(HC_KEY) === '1';
    if (savedHC) applyHC(true);
  } catch {}

  // Events
  themeRadios.forEach(r => {
    r.addEventListener('change', (e) => applyTheme(e.target.value));
  });
  if (hcToggle) {
    hcToggle.addEventListener('click', () => {
      const on = !document.documentElement.classList.contains('hc');
      applyHC(on);
    });
  }

  /* =========================
     Accordion Enhancement
     - details/summary is accessible by default.
     - We sync aria-expanded for extra clarity and can animate if motion allowed.
     ========================= */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $$('.accordion').forEach(det => {
    const sum = $('summary', det);
    if (!sum) return;
    // Initialize aria-expanded
    sum.setAttribute('aria-expanded', det.hasAttribute('open') ? 'true' : 'false');

    det.addEventListener('toggle', () => {
      sum.setAttribute('aria-expanded', det.open ? 'true' : 'false');
      if (!prefersReduced) {
        const panel = $('.accordion__content', det);
        if (panel) {
          panel.style.transition = 'max-height 200ms ease';
          panel.style.overflow = 'hidden';
          panel.style.maxHeight = det.open ? panel.scrollHeight + 'px' : '0px';
          // reset after animation
          setTimeout(() => { panel.style.maxHeight = det.open ? 'none' : '0px'; }, 220);
        }
      }
    });
    // Set initial max-height for closed accordions
    if (!det.open) {
      const panel = $('.accordion__content', det);
      if (panel) { panel.style.maxHeight = '0px'; panel.style.overflow = 'hidden'; }
    }
  });

  /* =========================
     Mobile Nav (details) — set aria-expanded on summary
     ========================= */
  $$('details.site-nav').forEach(nav => {
    const sum = $('summary', nav);
    if (!sum) return;
    sum.setAttribute('aria-expanded', nav.hasAttribute('open') ? 'true' : 'false');
    nav.addEventListener('toggle', () => {
      sum.setAttribute('aria-expanded', nav.open ? 'true' : 'false');
    });
  });

  /* =========================
     Contact Form (client-side validation + mailto fallback)
     ========================= */
  const form = $('.form');
  const messages = $('.form__messages');

  function setError(id, msg) {
    const el = $('#err-' + id);
    if (el) el.textContent = msg || '';
  }

  function clearErrors() {
    ['name', 'email', 'role', 'town', 'message'].forEach(id => setError(id, ''));
    if (messages) messages.textContent = '';
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const hp = $('#company'); // honeypot
      if (hp && hp.value) {
        // silently drop
        return;
      }

      const name = $('#name')?.value.trim() || '';
      const email = $('#email')?.value.trim() || '';
      const role = $('#role')?.value.trim() || '';
      const town = $('#town')?.value.trim() || '';
      const message = $('#message')?.value.trim() || '';

      let ok = true;
      if (!name) { setError('name', 'Please enter your name.'); ok = false; }
      if (!email || !isEmail(email)) { setError('email', 'Enter a valid email.'); ok = false; }
      if (!message) { setError('message', 'Please include a short message.'); ok = false; }

      if (!ok) return;

      // Mailto fallback (no external calls)
      const to = form.getAttribute('data-mailto') || 'hello@publiclogic.example';
      const subject = encodeURIComponent('PublicLogic Inquiry');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nRole: ${role}\nTown: ${town}\n\nMessage:\n${message}`
      );
      const href = `mailto:${to}?subject=${subject}&body=${body}`;

      // Provide non-blocking confirmation text
      if (messages) messages.textContent = 'Opening your email client…';
      window.location.href = href;

      // Example POST endpoint (disabled by default)
      /*
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, town, message })
      }).then(() => {
        if (messages) messages.textContent = 'Thanks! We’ll reply shortly.';
        form.reset();
      }).catch(() => {
        if (messages) messages.textContent = 'Thanks! If your email client did not open, please send to ' + to + '.';
      });
      */
    });
  }

  /* =========================
     Cookie banner (informational only) — disabled by default
     ========================= */
  const cookie = $('.cookie');
  if (cookie) {
    const btn = cookie.querySelector('[data-cookie-dismiss]');
    if (btn) btn.addEventListener('click', () => cookie.setAttribute('hidden', ''));
  }

  /* =========================
     Footer year
     ========================= */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* =========================
     Analytics placeholder (commented)
     ========================= */
  // Example: privacy-preserving analytics could be added here.
  // Ensure no PII, honor Do Not Track, and provide an opt-out.
})();
