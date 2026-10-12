/* Neil Vinci Lipaen · site behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var SVGNS = 'http://www.w3.org/2000/svg';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Mobile menu ---------- */
  var toggle = $('#menuToggle');
  var menu = $('#menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav__toggle-label').textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
      if (e.key === 'Tab' && !menu.hidden) {
        var f = $$('a, button', menu);
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i === 0) { e.preventDefault(); toggle.focus(); }
        else if (!e.shiftKey && document.activeElement === toggle) { e.preventDefault(); f[0].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); toggle.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1120 && !menu.hidden) setOpen(false); });
  }

  /* ---------- Reveals ---------- */
  var revealables = $$('[data-reveal], .rl, .beat, .month, .ledger, .hub');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }
  $$('.hero .rl').forEach(function (el) { requestAnimationFrame(function () { el.classList.add('is-in'); }); });

  /* ---------- Number counting (Spotify figures only) ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce.matches) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseFloat(el.dataset.count), sep = el.hasAttribute('data-sep');
        var t0 = performance.now(), dur = 1400;
        (function tick(t) {
          var p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
          var v = p >= 1 ? end : Math.round(end * e);
          el.textContent = sep ? v.toLocaleString('en-US') : String(v);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  /* ---------- Convergence lines (the intersection motif) ----------
     data-origin on each source:
       left   : from the element's left edge, curving into the target
       center : from the element's top/bottom centre (field map)
       spoke  : straight line from element centre (hub)                */
  function drawConvergence(box, animate) {
    var svg = $('svg[data-lines]', box);
    var target = $('[data-target]', box);
    var origins = $$('[data-origin]', box);
    if (!svg || !target || !origins.length) return;
    var b = box.getBoundingClientRect();
    var t = target.getBoundingClientRect();
    svg.innerHTML = '';
    if (!t.width || !b.width) return;
    var tx = t.left + t.width / 2 - b.left, ty = t.top + t.height / 2 - b.top;
    svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
    var trails = box.hasAttribute('data-trails');
    origins.forEach(function (o, i) {
      var r = o.getBoundingClientRect();
      if (!r.width) return;
      var side = o.dataset.origin, d, ox, oy;
      if (side === 'left') {
        ox = r.left - b.left - 12; oy = r.top + r.height / 2 - b.top;
        var mx = (ox + tx) / 2;
        d = 'M' + ox + ',' + oy + ' C' + mx + ',' + oy + ' ' + mx + ',' + ty + ' ' + tx + ',' + ty;
      } else if (side === 'center') {
        ox = r.left + r.width / 2 - b.left;
        oy = r.top > t.top ? r.top - b.top - 8 : r.bottom - b.top + 8;
        d = 'M' + ox + ',' + oy + ' C' + ox + ',' + (oy + ty) / 2 + ' ' + tx + ',' + (oy + ty) / 2 + ' ' + tx + ',' + ty;
      } else {
        ox = r.left + r.width / 2 - b.left; oy = r.top + r.height / 2 - b.top;
        d = 'M' + ox + ',' + oy + ' L' + tx + ',' + ty;
      }
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d); p.setAttribute('class', 'line-base');
      svg.appendChild(p);
      var len = p.getTotalLength();
      if (animate && !reduce.matches) {
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.getBoundingClientRect();
        p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.75,0,1) ' + (0.15 + i * 0.12) + 's';
        requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); });
      }
      if (trails && !reduce.matches && p.animate) {
        var tr = document.createElementNS(SVGNS, 'path');
        tr.setAttribute('d', d); tr.setAttribute('class', 'line-trail');
        tr.style.strokeDasharray = '48 ' + (len + 60);
        tr.animate([{ strokeDashoffset: 48 }, { strokeDashoffset: -len }],
          { duration: 3600 + i * 500, delay: 1800 + i * 700, iterations: Infinity, easing: 'cubic-bezier(.5,0,.2,1)' });
        svg.appendChild(tr);
      }
    });
  }
  var convergeBoxes = $$('[data-converge]');
  var drawn = new WeakSet();
  function drawAll() { convergeBoxes.forEach(function (bx) { if (drawn.has(bx)) drawConvergence(bx, false); }); }
  function firstDraw(bx) { if (drawn.has(bx)) return; drawn.add(bx); drawConvergence(bx, true); }
  if (convergeBoxes.length) {
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      if ('IntersectionObserver' in window) {
        var vio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { firstDraw(en.target); vio.unobserve(en.target); } });
        }, { threshold: 0.25 });
        convergeBoxes.forEach(function (bx) {
          if (bx.classList.contains('hero')) setTimeout(function () { firstDraw(bx); }, reduce.matches ? 0 : 900);
          else vio.observe(bx);
        });
      } else { convergeBoxes.forEach(firstDraw); }
    });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(drawAll, 150); });
  }

  /* ---------- Case-study carousel: swipe, drag, arrows, keys ---------- */
  $$('[data-carousel]').forEach(function (cs) {
    var track = $('.cs__track', cs);
    var slides = $$('.case', track);
    var prevs = $$('[data-prev]', cs), nexts = $$('[data-next]', cs);
    var countEls = $$('[data-current]', cs), bar = $('.cs__progress', cs);
    var live = $('[data-live]', cs);
    var current = 0;

    function slideLeft(i) { return slides[i].offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft); }
    function goTo(i) {
      i = clamp(i, 0, slides.length - 1);
      track.scrollTo({ left: slideLeft(i), behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    function update() {
      var x = track.scrollLeft, best = 0, bestD = Infinity;
      slides.forEach(function (s, i) { var d = Math.abs(slideLeft(i) - x); if (d < bestD) { bestD = d; best = i; } });
      if (x + track.clientWidth >= track.scrollWidth - 4) best = slides.length - 1;
      var changed = best !== current;
      current = best;
      slides.forEach(function (s, i) {
        s.classList.toggle('is-current', i === current);
        s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
        if (i === current) s.removeAttribute('inert'); else s.setAttribute('inert', '');
      });
      prevs.forEach(function (b) { b.disabled = current === 0; });
      nexts.forEach(function (b) { b.disabled = current === slides.length - 1; });
      countEls.forEach(function (c) { c.textContent = '0' + (current + 1); });
      if (bar) bar.style.setProperty('--p', ((current + 1) / slides.length).toFixed(3));
      if (changed && live) live.textContent = 'Case ' + (current + 1) + ' of ' + slides.length + ': ' + $('.case__title', slides[current]).textContent;
    }
    function jumpUp(btn) {
      // bottom controls: bring the top of the new slide into view
      if (!btn.hasAttribute('data-jump')) return;
      var top = track.getBoundingClientRect().top + window.scrollY - 64 - 24;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    prevs.forEach(function (b) { b.addEventListener('click', function () { goTo(current - 1); jumpUp(b); }); });
    nexts.forEach(function (b) { b.addEventListener('click', function () { goTo(current + 1); jumpUp(b); }); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    });
    var st; track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(update, 60); }, { passive: true });

    // mouse drag-to-swipe (touch and trackpads already scroll natively)
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('a, button')) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add('is-dragging'); track.setPointerCapture(drag.id); }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    function endDrag(e) {
      if (!drag) return;
      var moved = drag.moved, dx = e.clientX - drag.x;
      drag = null; track.classList.remove('is-dragging');
      if (moved) {
        var target = Math.abs(dx) > track.clientWidth * 0.12 ? current + (dx < 0 ? 1 : -1) : current;
        goTo(target);
      }
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', function () { goTo(current); });
    update();
  });

  /* ---------- Scroll-linked scenes ---------- */
  function progressOf(el, startAt, endAt) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * startAt - r.top) / (r.height + vh * (startAt - endAt)), 0, 1);
  }
  var lanes = $('[data-lanes]');
  var thread = $('[data-thread]');
  var flow = $('[data-flow]');
  var parallax = $$('[data-speed]');
  var principles = $$('.principle');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    if (lanes) {
      var lp = reduce.matches ? 1 : progressOf(lanes, 0.9, 0.45);
      $$('.lane__fill', lanes).forEach(function (f, i) { f.style.setProperty('--p', clamp(lp * 1.25 - i * 0.08, 0, 1).toFixed(3)); });
    }
    if (thread) {
      var tp = reduce.matches ? 1 : progressOf(thread, 0.85, 0.55);
      thread.style.setProperty('--p', tp.toFixed(3));
      var stops = $$('.thread__stop', thread);
      stops.forEach(function (s, i) { s.classList.toggle('is-lit', tp >= (i + 0.5) / stops.length); });
    }
    if (flow) {
      var fp = reduce.matches ? 1 : progressOf(flow, 0.62, 0.62);
      flow.style.setProperty('--p', fp.toFixed(3));
      var steps = $$('.flow__step', flow);
      steps.forEach(function (s, i) { s.classList.toggle('is-lit', reduce.matches || fp >= i / (steps.length - 1) - 0.02); });
    }
    if (principles.length) {
      var best = null, bestD = Infinity;
      principles.forEach(function (pr) {
        var rr = pr.getBoundingClientRect(), d = Math.abs(rr.top + rr.height / 2 - vh * 0.5);
        if (d < bestD) { bestD = d; best = pr; }
      });
      principles.forEach(function (pr) { pr.classList.toggle('is-active', pr === best && bestD < vh * 0.4); });
    }
    if (!reduce.matches) {
      parallax.forEach(function (el) {
        var rr = el.getBoundingClientRect();
        var c = rr.top + rr.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (c * parseFloat(el.dataset.speed)).toFixed(1) + 'px,0)';
      });
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  onScroll();
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);

  /* ---------- Scrollspy ---------- */
  var spyLinks = $$('.nav__links a[data-spy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    spyLinks.forEach(function (a) { if (document.getElementById(a.dataset.spy)) map[a.dataset.spy] = a; });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id]; if (!a || !en.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.remove('is-active'); }); a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { sio.observe(document.getElementById(id)); });
  }
})();
