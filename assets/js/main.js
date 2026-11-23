/* ═══════════════════════════════════════════════
   PORTFOLIO SHARED JS
   Auto theme: light 6am–7pm IST, dark 7pm–6am IST
   Manual override stored in localStorage (resets next IST day)
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const OVERRIDE_KEY = 'rn-theme-manual';

  // ── IST TIME HELPERS ──────────────────────────────────────────────────────

  function getISTHour() {
    const now   = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist   = new Date(utcMs + 5.5 * 3600000);
    return ist.getHours();
  }

  function getISTDateString() {
    const now   = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist   = new Date(utcMs + 5.5 * 3600000);
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

    if (manual && overrideDay === todayIST) return manual;

    localStorage.removeItem(OVERRIDE_KEY);
    localStorage.removeItem(OVERRIDE_KEY + '-date');
    return getTimeBasedTheme();
  }

  // ── APPLY THEME ───────────────────────────────────────────────────────────

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const label = document.querySelector('.theme-label');
    if (label) label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  }

  // ── MANUAL TOGGLE ─────────────────────────────────────────────────────────

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(OVERRIDE_KEY, next);
    localStorage.setItem(OVERRIDE_KEY + '-date', getISTDateString());
    applyTheme(next);
  }

  // ── AUTO REFRESH ──────────────────────────────────────────────────────────
  // Every 60s — silently flip if no manual override and time has changed

  function scheduleAutoCheck() {
    setInterval(function () {
      if (!localStorage.getItem(OVERRIDE_KEY)) {
        const auto    = getTimeBasedTheme();
        const current = document.documentElement.getAttribute('data-theme');
        if (auto !== current) applyTheme(auto);
      }
    }, 60000);
  }

  // ── DROPDOWN NAV ──────────────────────────────────────────────────────────

  function initDropdowns() {
    var items = document.querySelectorAll('.nav-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.nav-btn');
      if (!btn) return;

      // Click to toggle (works for both desktop keyboard and mobile tap)
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        // Close all others first
        items.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });

      // Keyboard: Escape closes
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') item.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function () {
      items.forEach(function (i) { i.classList.remove('open'); });
    });

    // Prevent dropdown itself from closing when clicked inside
    items.forEach(function (item) {
      var menu = item.querySelector('.nav-dropdown');
      if (menu) {
        menu.addEventListener('click', function (e) { e.stopPropagation(); });
      }
    });
  }

  // ── NAV ───────────────────────────────────────────────────────────────────

  function initNav() {
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
      });

      // Close drawer when any link is clicked
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
        });
      });

      // Close drawer on outside click
      document.addEventListener('click', function (e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
          hamburger.classList.remove('open');
          navLinks.classList.remove('open');
        }
      });
    }

    // Active link highlighting — match by pathname
    var path    = window.location.pathname;
    var page    = path.split('/').pop() || 'index.html';
    var segment = path.split('/').filter(Boolean);

    document.querySelectorAll('.nav-links a, .nav-dropdown a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      // Exact match or same filename match
      if (href === path || href.split('/').pop() === page) {
        a.classList.add('active');
      }
      // Parent section active state: if we're in /projects/ and link contains /projects/
      if (segment[0] === 'projects' && href.includes('/projects/')) {
        // Mark the Projects nav-btn as active
        var parentBtn = a.closest('.nav-item');
        if (parentBtn) {
          var btn = parentBtn.querySelector('.nav-btn');
          if (btn) btn.classList.add('active');
        }
      }
      if (segment[0] === 'study' && href.includes('/study/')) {
        var parentBtn = a.closest('.nav-item');
        if (parentBtn) {
          var btn = parentBtn.querySelector('.nav-btn');
          if (btn) btn.classList.add('active');
        }
      }
    });
  }

  // ── BREADCRUMB ────────────────────────────────────────────────────────────
  // Auto-generates breadcrumb from data attributes on <main>:
  //   data-section="Projects"
  //   data-section-url="/index.html#projects"
  //   data-title="LoanIQ"

  function initBreadcrumbs() {
    var main = document.querySelector('main[data-section]');
    if (!main) return;

    var section    = main.getAttribute('data-section');
    var sectionUrl = main.getAttribute('data-section-url') || '/';
    var title      = main.getAttribute('data-title');

    if (!section || !title) return;

    var crumb = document.createElement('nav');
    crumb.className = 'breadcrumb';
    crumb.setAttribute('aria-label', 'breadcrumb');
    crumb.innerHTML =
      '<a href="/">Home</a>' +
      '<span class="breadcrumb-sep" aria-hidden="true">›</span>' +
      '<a href="' + sectionUrl + '">' + section + '</a>' +
      '<span class="breadcrumb-sep" aria-hidden="true">›</span>' +
      '<span class="breadcrumb-current">' + title + '</span>';

    var nav = document.querySelector('.site-nav');
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(crumb, nav.nextSibling);
    }
  }

  // ── BACK BUTTON ───────────────────────────────────────────────────────────
  // Injects a "← Back" pill when <main data-back-url="..."> exists

  function initBackButton() {
    var main = document.querySelector('main[data-back-url]');
    if (!main) return;

    var url   = main.getAttribute('data-back-url');
    var label = main.getAttribute('data-back-label') || 'Back';

    var btn = document.createElement('a');
    btn.href = url;
    btn.className = 'back-btn';
    btn.setAttribute('aria-label', 'Go back');
    btn.innerHTML = '<span>←</span>' + label;
    document.body.appendChild(btn);
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
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ── INIT ──────────────────────────────────────────────────────────────────
  // Apply immediately to prevent flash of wrong theme
  applyTheme(resolveTheme());

  document.addEventListener('DOMContentLoaded', function () {
    initDropdowns();
    initNav();
    initThemeToggle();
    initBreadcrumbs();
    initBackButton();
    initScrollReveal();
    scheduleAutoCheck();
  });

  window.rnPortfolio = {
    toggleTheme:       toggleTheme,
    applyTheme:        applyTheme,
    getTimeBasedTheme: getTimeBasedTheme
  };
})();
