/* ═══════════════════════════════════
   PORTFOLIO SHARED JS
   ═══════════════════════════════════ */

(function () {
  'use strict';

  // ── THEME MANAGEMENT ──
  const THEME_KEY = 'rn-portfolio-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const label = document.querySelector('.theme-label');
    if (label) label.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── HAMBURGER NAV ──
  function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
      // Close on link click
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }

    // Mark active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === currentPage) {
        a.classList.add('active');
      }
    });
  }

  // ── THEME TOGGLE BUTTON ──
  function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  }

  // ── SCROLL REVEAL ──
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  // ── CURSOR GLOW ──
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%);
      transform:translate(-50%,-50%);
      transition:opacity 0.3s;
      mix-blend-mode:screen;
    `;
    document.body.appendChild(glow);

    let mx = -999, my = -999;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      glow.style.left = mx + 'px';
      glow.style.top  = my + 'px';
    });
  }

  // ── INIT ──
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());
    initNav();
    initThemeToggle();
    initScrollReveal();
    initCursorGlow();
  });

  // Expose for inline use
  window.rnPortfolio = { toggleTheme, applyTheme, getTheme };
})();
