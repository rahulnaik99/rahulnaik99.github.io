/* ═══════════════════════════════════
   PORTFOLIO SHARED JS
   Auto theme: light 6am–7pm IST, dark 7pm–6am IST
   Manual override stored in localStorage (resets next day)
   ═══════════════════════════════════ */

(function () {
  'use strict';

  const THEME_KEY    = 'rn-portfolio-theme';
  const OVERRIDE_KEY = 'rn-theme-manual';

  // ── IST TIME HELPERS ──────────────────────────────────────────────────────
  function getISTHour() {
    const now     = new Date();
    const utcMs   = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist     = new Date(utcMs + 5.5 * 60 * 60000);
    return ist.getHours();
  }

  function getISTDateString() {
    const now   = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist   = new Date(utcMs + 5.5 * 60 * 60000);
    return ist.getFullYear() + '-' + ist.getMonth() + '-' + ist.getDate();
  }

  // ── TIME-BASED THEME ──────────────────────────────────────────────────────
  // Light: 06:00–18:59 IST  |  Dark: 19:00–05:59 IST
  function getTimeBasedTheme() {
    const hour = getISTHour();
    return (hour >= 6 && hour < 19) ? 'light' : 'dark';
  }

  // ── RESOLVE THEME ─────────────────────────────────────────────────────────
  // Manual override wins — but only for today (IST date)
  function resolveTheme() {
    const manual      = localStorage.getItem(OVERRIDE_KEY);
    const overrideDay = localStorage.getItem(OVERRIDE_KEY + '-date');
    const todayIST    = getISTDateString();

    if (manual && overrideDay === todayIST) {
      return manual;
    }
    // Clear stale override
    localStorage.removeItem(OVERRIDE_KEY);
    localStorage.removeItem(OVERRIDE_KEY + '-date');
    return getTimeBasedTheme();
  }

  // ── APPLY THEME ───────────────────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const label = document.querySelector('.theme-label');
    if (label) label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  }

  // ── MANUAL TOGGLE ─────────────────────────────────────────────────────────
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(OVERRIDE_KEY, next);
    localStorage.setItem(OVERRIDE_KEY + '-date', getISTDateString());
    applyTheme(next);
  }

  // ── AUTO REFRESH ──────────────────────────────────────────────────────────
  // Every 60s — if no manual override, check if theme should flip
  function scheduleAutoCheck() {
    setInterval(function () {
      if (!localStorage.getItem(OVERRIDE_KEY)) {
        var auto    = getTimeBasedTheme();
        var current = document.documentElement.getAttribute('data-theme');
        if (auto !== current) {
          applyTheme(auto);
          showToast(auto);
        }
      }
    }, 60000);
  }

  // ── TOAST ─────────────────────────────────────────────────────────────────
  function showToast(theme) {
    var old = document.getElementById('rn-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'rn-toast';
    t.textContent = theme === 'dark'
      ? '🌙 Dark mode — 7pm IST'
      : '☀️ Light mode — 6am IST';
    t.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
      'background:var(--surface)', 'color:var(--text)',
      'border:1px solid var(--border)', 'border-radius:8px',
      'padding:0.65rem 1.1rem',
      "font-family:'JetBrains Mono',monospace",
      'font-size:0.65rem', 'letter-spacing:0.08em',
      'box-shadow:0 4px 20px rgba(0,0,0,0.2)',
      'opacity:0', 'transform:translateY(8px)',
      'transition:opacity 0.3s,transform 0.3s'
    ].join(';');
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
      setTimeout(function () { t.remove(); }, 300);
    }, 3000);
  }

  // ── NAV ───────────────────────────────────────────────────────────────────
  function initNav() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks  = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.getAttribute('href') === currentPage) a.classList.add('active');
    });
  }

  // ── THEME TOGGLE BUTTON ───────────────────────────────────────────────────
  function initThemeToggle() {
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
      btn.title = '☀️ 6am–7pm IST  |  🌙 7pm–6am IST\nClick to override for today';
    }
  }

  // ── SCROLL REVEAL ─────────────────────────────────────────────────────────
  function initScrollReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ── CURSOR GLOW ───────────────────────────────────────────────────────────
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:9999',
      'width:300px', 'height:300px', 'border-radius:50%',
      'background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)',
      'transform:translate(-50%,-50%)',
      'transition:opacity 0.3s',
      'mix-blend-mode:screen'
    ].join(';');
    document.body.appendChild(glow);
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  // ── INIT ──────────────────────────────────────────────────────────────────
  // Apply immediately to prevent flash of wrong theme
  applyTheme(resolveTheme());

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initThemeToggle();
    initScrollReveal();
    initCursorGlow();
    scheduleAutoCheck();
  });

  window.rnPortfolio = { toggleTheme: toggleTheme, applyTheme: applyTheme, getTimeBasedTheme: getTimeBasedTheme };
})();
