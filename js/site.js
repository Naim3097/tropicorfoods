/* ==========================================================
   TROPICOR FOODS — shared site behaviour
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Header: solid on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-locked', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Expand submenus on tap (mobile only)
    nav.querySelectorAll('li').forEach(function (li) {
      var link = li.querySelector(':scope > .nav-link');
      var drop = li.querySelector(':scope > .nav-drop');
      if (link && drop) {
        link.addEventListener('click', function (e) {
          if (window.matchMedia('(max-width: 63.99em)').matches) {
            e.preventDefault();
            li.classList.toggle('is-expanded');
          }
        });
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Stat counters ---------- */
  var stats = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var start = null;
        var dur = 1800;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statIO.observe(el); });
  }

  /* ---------- Conversion tracking baseline (GA4) ----------
     Fires gtag events for key B2B actions. Elements opt in via
     data-track="event_name". Links to WhatsApp / tel: / mailto:
     are tracked automatically even without data-track.       */
  function track(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a) return;

    var explicit = a.getAttribute('data-track');
    var href = a.getAttribute('href') || '';
    var label = a.getAttribute('data-track-label') || a.textContent.trim().slice(0, 80);

    if (explicit) {
      track(explicit, { link_text: label, page_path: location.pathname });
    } else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
      track('whatsapp_click', { link_text: label, page_path: location.pathname });
    } else if (href.indexOf('tel:') === 0) {
      track('tel_click', { link_text: label, page_path: location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      track('email_click', { link_text: label, page_path: location.pathname });
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.matches('form[data-track-form]')) {
      track('generate_lead', {
        form_id: form.getAttribute('data-track-form'),
        page_path: location.pathname
      });
    }
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================== MOTION LAYER ================== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Word-stagger headings ---------- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var nodes = [];
    el.childNodes.forEach(function (n) { nodes.push(n); });
    el.textContent = '';
    var wi = 0;
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); return; }
          var s = document.createElement('span');
          s.className = 'w';
          s.style.setProperty('--wi', wi++);
          s.textContent = part;
          el.appendChild(s);
        });
      } else if (n.nodeType === 1) {
        var s = document.createElement(n.tagName.toLowerCase());
        s.className = 'w';
        s.style.setProperty('--wi', wi++);
        s.textContent = n.textContent;
        el.appendChild(s);
      }
    });
    el.classList.add('split-words');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('is-visible'); });
    });
  });

  /* ---------- Curtain reveals ---------- */
  var masks = document.querySelectorAll('.mask-reveal');
  if ('IntersectionObserver' in window && masks.length && !reduceMotion) {
    var maskIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          maskIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    masks.forEach(function (el) { maskIO.observe(el); });
  } else {
    masks.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Scroll parallax ---------- */
  var pxEls = [];
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    pxEls.push({ el: el, depth: parseFloat(el.getAttribute('data-parallax')) || 0.12, scale: 1.12 });
  });
  /* Subtle auto-depth on large media frames, site-wide */
  document.querySelectorAll('.puree-block .media-frame, .split-media, .solution-intro-media, .umamite-media').forEach(function (el) {
    if (el.hasAttribute('data-parallax')) return;
    var img = el.firstElementChild;
    if (img) img.style.transition = 'none';
    pxEls.push({ el: el, depth: 0.07, scale: 1.08 });
  });
  if (pxEls.length && !reduceMotion) {
    var ticking = false;
    var updateParallax = function () {
      pxEls.forEach(function (p) {
        var r = p.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        var target = p.el.firstElementChild || p.el;
        target.style.transform = 'translateY(' + (progress * p.depth * -100).toFixed(1) + 'px) scale(' + p.scale + ')';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Header: hide down, show up ---------- */
  if (header) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > 400 && y > lastY + 4 && !document.body.classList.contains('nav-locked')) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 4 || y <= 400) {
        header.classList.remove('is-hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Hero video: load only where it earns its bytes ----------
     Phones keep the graded poster (no 1080p download on cellular);
     tablet/desktop attach the source and autoplay. */
  document.querySelectorAll('video[data-hero-video]').forEach(function (v) {
    if (window.matchMedia('(min-width: 40em)').matches && !reduceMotion) {
      v.querySelectorAll('source[data-src]').forEach(function (s) {
        s.src = s.getAttribute('data-src');
      });
      v.load();
      v.autoplay = true;
      var tryPlay = function () {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      };
      v.addEventListener('canplay', tryPlay, { once: true });
      tryPlay();
    }
  });

  /* ---------- Floating WhatsApp: park while scrolling, return on pause ---------- */
  var fab = document.querySelector('.wa-fab');
  if (fab && !reduceMotion) {
    var fabTimer = null;
    var fabLastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (Math.abs(y - fabLastY) > 6) {
        fab.classList.add('is-parked');
        clearTimeout(fabTimer);
        fabTimer = setTimeout(function () { fab.classList.remove('is-parked'); }, 320);
      }
      fabLastY = y;
    }, { passive: true });
  }

  /* ---------- Video players: pause others when one plays ---------- */
  var players = document.querySelectorAll('video[controls]');
  players.forEach(function (v) {
    v.addEventListener('play', function () {
      players.forEach(function (o) { if (o !== v) o.pause(); });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'video_play', {
          video_title: v.getAttribute('data-title') || v.currentSrc.split('/').pop(),
          page_path: location.pathname
        });
      }
    });
  });
})();
