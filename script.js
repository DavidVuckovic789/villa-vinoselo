(function () {

  /* ── INTRO SPLASH ── */
  (function () {
    var splash = document.getElementById('introSplash');
    if (!splash || getComputedStyle(splash).display === 'none') return;

    document.body.style.overflow = 'hidden';
    var bg    = splash.querySelector('.intro-bg'),
        pill  = splash.querySelector('.intro-pill'),
        text  = splash.querySelector('.intro-text'),
        pen   = splash.querySelector('.intro-pen'),
        spark = splash.querySelector('.intro-spark'),
        wrap  = document.getElementById('introLogoWrap'),
        skip  = document.getElementById('introSkip'),
        realLogo = document.querySelector('#hdr .logo-mark');

    var done = false;
    function finishIntro() {
      if (done) return;
      done = true;
      splash.classList.add('hide');
      document.body.style.overflow = '';
      try { sessionStorage.setItem('vinoseloIntroShown', '1'); } catch (e) {}
      setTimeout(function () { splash.style.display = 'none'; }, 700);
    }

    if (skip) skip.addEventListener('click', finishIntro);
    splash.addEventListener('click', function (e) { if (e.target === splash) finishIntro(); });

    function runPen() {
      var letters = Array.prototype.slice.call(text.querySelectorAll('.intro-ltr'));
      if (!letters.length) return;
      var pillRect = pill.getBoundingClientRect();
      function place(letterEl, atStart) {
        var r = letterEl.getBoundingClientRect();
        var x = (atStart ? r.left : r.right) - pillRect.left;
        var y = r.top - pillRect.top + r.height * .62;
        pen.style.left = x + 'px';
        pen.style.top = y + 'px';
      }
      place(letters[0], true);
      pen.classList.add('show');
      letters.forEach(function (l) {
        var d = parseFloat(l.style.getPropertyValue('--d')) || 0;
        setTimeout(function () { place(l, false); }, d + 60);
      });
      var lastDelay = parseFloat(letters[letters.length - 1].style.getPropertyValue('--d')) || 0;
      setTimeout(function () { pen.classList.remove('show'); }, lastDelay + 550);
    }

    requestAnimationFrame(function () {
      bg.classList.add('show');
      pill.classList.add('show');
      setTimeout(function () { text.classList.add('drawing'); runPen(); }, 900);
      setTimeout(function () { spark.classList.add('show'); }, 2900);
      setTimeout(function () {
        if (realLogo && wrap) {
          var r1 = wrap.getBoundingClientRect(),
              r2 = realLogo.getBoundingClientRect(),
              scale = Math.max(.22, r2.height / r1.height),
              dx = (r2.left + r2.width / 2) - (r1.left + r1.width / 2),
              dy = (r2.top + r2.height / 2) - (r1.top + r1.height / 2);
          wrap.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
        }
      }, 3500);
      setTimeout(finishIntro, 4400);
    });
  })();

  /* ── DOM REFS ── */
  var hdr    = document.getElementById('hdr'),
      bar    = document.getElementById('pb'),
      hc     = document.getElementById('hc'),
      hero   = document.querySelector('.hero'),
      glow   = document.getElementById('glow'),
      qbBg   = document.getElementById('qbBg'),
      qbSec  = document.getElementById('qbSec'),
      hStill = document.getElementById('hStill');

  /* ── SCROLL: Progress-Bar + Parallax ── */
  function onScr() {
    var sY = window.scrollY,
        dH = document.documentElement.scrollHeight - window.innerHeight;
    hdr.classList.toggle('sc', sY > 50);
    bar.style.width = (dH > 0 ? (sY / dH) * 100 : 0) + '%';
    var hH = hero.offsetHeight, t = Math.min(sY / hH, 1);
    hc.style.transform = 'translateY(' + (sY * .28) + 'px)';
    hc.style.opacity   = Math.max(0, 1 - t * 1.4);
    var qr = qbSec.getBoundingClientRect();
    if (qr.top < window.innerHeight && qr.bottom > 0)
      qbBg.style.transform = 'translateY(' + ((window.innerHeight / 2 - qr.top) * .22) + 'px)';
  }
  window.addEventListener('scroll', onScr, { passive: true });
  onScr();

  /* ── MOBILE MENÜ ── */
  var burger = document.getElementById('burger'),
      nl     = document.querySelector('.nl');
  function closeMenu() {
    nl.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = nl.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(o));
    });
    nl.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (e) {
      if (nl.classList.contains('open') && !nl.contains(e.target) && e.target !== burger) closeMenu();
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* ── CURSOR GLOW ── */
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });

  /* ── HERO MAUS-PARALLAX + HOVER-ZOOM ── */
  hero.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth  - .5) * 22,
        y = (e.clientY / window.innerHeight - .5) * 14;
    hStill.style.transform = 'scale(1.12) translate(' + (x * .6) + 'px,' + (y * .6) + 'px)';
  });
  hero.addEventListener('mouseleave', function () {
    hStill.style.transform = '';
  });

  /* ── SCROLL-REVEALS ── */
  var revs = document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s');
  revs.forEach(function (el, i) { el.style.transitionDelay = (i % 6) * 65 + 'ms'; });
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('v'); });
  }, { threshold: .1 });
  revs.forEach(function (el) { io.observe(el); });

  /* ── COUNT-UP ANIMATIONEN ── */
  var cio = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, tg = +el.dataset.n, dur = 1400, s = performance.now();
      (function t(now) {
        var p = Math.min((now - s) / dur, 1), q = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(q * tg);
        if (p < 1) requestAnimationFrame(t); else el.textContent = tg;
      })(performance.now());
      cio.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-n]').forEach(function (el) { cio.observe(el); });

  /* ── VOLLBILD-GALERIEN MIT RUBRIKEN ── */
  function makeFwGallery(imgElId, wrapId, imgs, alts, fits, caps) {
    var imgEl = document.getElementById(imgElId);
    var capEl = document.querySelector('#' + wrapId + ' .fw-caption');
    return function (i, el) {
      if (!imgEl) return;
      imgEl.classList.add('out');
      setTimeout(function () {
        imgEl.src = imgs[i];
        imgEl.alt = alts[i];
        imgEl.classList.toggle('contain', fits && fits[i] === 'contain');
        imgEl.classList.remove('out');
        if (capEl && caps && caps[i]) {
          capEl.querySelector('h3').textContent = caps[i][0];
          capEl.querySelector('p').textContent = caps[i][1];
          capEl.querySelector('.fw-dist').textContent = caps[i][2];
        }
      }, 140);
      document.querySelectorAll('#' + wrapId + ' .fw-label').forEach(function (l) { l.classList.remove('on'); });
      el.classList.add('on');
    };
  }

  window.fwGoto = makeFwGallery(
    'fwImg', 'fwGallery',
    ['poolbereich-3.jpg', 'poolbereich-4.jpg', 'sommerkueche.jpg', 'wellness-bereich.jpg', 'gartenbereich-abend.jpg'],
    ['Außenansicht der Villa VinoSelo', 'Pool der Villa VinoSelo', 'Sommerküche der Villa VinoSelo', 'Wellnessbereich mit Sauna und Whirlpool', 'Garten der Villa VinoSelo am Abend'],
    ['cover', 'cover', 'contain', 'cover', 'cover']
  );

  window.fwGoto2 = makeFwGallery(
    'fwImg2', 'fwGallery2',
    ['weinstrasse.jpg', 'olivenhaine.jpg', 'parenzana-radweg.jpg', 'meer.jpg'],
    ['Weinstraße der Poreština', 'Olivenhaine in der Umgebung', 'Parenzana-Radweg', 'Küste der istrischen Riviera'],
    null,
    [
      ['Weinstraße', 'Familiäre Weingüter und Kellereien der Poreština in unmittelbarer Nähe.', 'in der Umgebung'],
      ['Olivenhaine', 'Frisches, kaltgepresstes Olivenöl direkt von lokalen Erzeugern.', 'in der Umgebung'],
      ['Parenzana-Radweg', 'Historische Bahntrasse zum Radfahren und Wandern durch die Weinberge.', 'vor der Tür'],
      ['Küste', 'Feine Buchten und Strände der istrischen Riviera.', '15 min']
    ]
  );

  ['poolbereich-3.jpg', 'poolbereich-4.jpg', 'sommerkueche.jpg', 'wellness-bereich.jpg', 'gartenbereich-abend.jpg',
   'weinstrasse.jpg', 'olivenhaine.jpg', 'parenzana-radweg.jpg', 'meer.jpg'].forEach(function (src) {
    new Image().src = src;
  });

  /* ── VIRTUELLER RUNDGANG ── */
  var curT   = 0,
      slides = document.querySelectorAll('.ts'),
      total  = slides.length,
      stage  = document.getElementById('tourStage'),
      dotsC  = document.getElementById('tDots'),
      isDrag = false, dStart = 0, dX = 0,
      tw     = document.getElementById('tourWrap');

  slides.forEach(function (_, i) {
    var d = document.createElement('div');
    d.className = 't-dot' + (i === 0 ? ' on' : '');
    d.addEventListener('click', function () { gotoT(i); });
    dotsC.appendChild(d);
  });

  window.tMove = function (d) { gotoT((curT + d + total) % total); };

  function gotoT(i) {
    slides[curT].classList.remove('active');
    curT = i;
    stage.style.transform = 'translateX(-' + (i * 100) + '%)';
    slides[curT].classList.add('active');
    document.querySelectorAll('.t-dot').forEach(function (d, j) { d.classList.toggle('on', j === i); });
  }

  tw.addEventListener('mousedown', function (e) { isDrag = true; dStart = e.clientX; tw.classList.add('drag'); });
  document.addEventListener('mousemove', function (e) { if (isDrag) dX = e.clientX - dStart; });
  document.addEventListener('mouseup', function () {
    if (isDrag) { if (Math.abs(dX) > 60) tMove(dX < 0 ? 1 : -1); isDrag = false; dX = 0; tw.classList.remove('drag'); }
  });
  tw.addEventListener('touchstart', function (e) { dStart = e.touches[0].clientX; }, { passive: true });
  tw.addEventListener('touchend',   function (e) {
    var dx = e.changedTouches[0].clientX - dStart;
    if (Math.abs(dx) > 45) tMove(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (document.getElementById('lb').classList.contains('on')) return;
    if (e.key === 'ArrowLeft')  tMove(-1);
    if (e.key === 'ArrowRight') tMove(1);
  });

  /* ── ANIMIERTER SVG-GRUNDRISS ── */
  window.switchFloor = function (i) {
    document.querySelectorAll('.floor-plan').forEach(function (p, j) { p.classList.toggle('on', j === i); });
    document.querySelectorAll('.ftab').forEach(function (t, j)       { t.classList.toggle('on', j === i); });
    animateRooms();
  };

  function animateRooms() {
    document.querySelectorAll('.floor-plan.on .fp-room').forEach(function (r, i) {
      r.classList.remove('drawn');
      void r.offsetWidth; // reflow
      setTimeout(function () { r.classList.add('drawn'); }, i * 90);
    });
  }

  var fpObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { animateRooms(); fpObs.disconnect(); } });
  }, { threshold: .25 });
  var fpEl = document.getElementById('grundriss');
  if (fpEl) fpObs.observe(fpEl);

  /* ── LIGHTBOX (Einzelbild-Ansicht) ── */
  var lb    = document.getElementById('lb'),
      lbImg = document.getElementById('lbImg'),
      lbCtr = document.getElementById('lbCtr'),
      lbCap = document.getElementById('lbCap');

  window.openLbSingle = function (src, cap) {
    lb.classList.add('on', 'single'); lbImg.src = src; lbImg.alt = cap || ''; lbCtr.textContent = '';
    lbCap.textContent = cap || ''; document.body.style.overflow = 'hidden';
  };
  window.closeLb = function () { lb.classList.remove('on'); document.body.style.overflow = ''; };

  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLb();
  });

  /* ── ANFRAGE MODAL ── */
  var inqModal  = document.getElementById('inqModal'),
      inqForm   = document.getElementById('inqForm'),
      inqStatus = document.getElementById('inqStatus');

  window.openInquiry = function () {
    if (!inqModal) return;
    inqModal.classList.add('on');
    document.body.style.overflow = 'hidden';
  };
  window.closeInquiry = function () {
    if (!inqModal) return;
    inqModal.classList.remove('on');
    document.body.style.overflow = '';
  };

  if (inqModal) {
    inqModal.addEventListener('click', function (e) { if (e.target === inqModal) closeInquiry(); });
    document.addEventListener('keydown', function (e) {
      if (inqModal.classList.contains('on') && e.key === 'Escape') closeInquiry();
    });
  }

  if (inqForm) {
    inqForm.addEventListener('submit', function (e) {
      e.preventDefault();
      inqStatus.textContent = 'Wird gesendet …';
      inqStatus.className = 'inq-status';
      fetch(inqForm.action, {
        method: 'POST',
        body: new FormData(inqForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          inqStatus.textContent = 'Vielen Dank! Ihre Anfrage wurde gesendet.';
          inqStatus.className = 'inq-status ok';
          inqForm.reset();
          setTimeout(closeInquiry, 2200);
        } else {
          inqStatus.textContent = 'Etwas ist schiefgelaufen. Bitte schreiben Sie uns direkt an info@villavinoselo.com.';
          inqStatus.className = 'inq-status err';
        }
      }).catch(function () {
        inqStatus.textContent = 'Etwas ist schiefgelaufen. Bitte schreiben Sie uns direkt an info@villavinoselo.com.';
        inqStatus.className = 'inq-status err';
      });
    });
  }

  /* ── LEAFLET KARTE ── */
  if (typeof L !== 'undefined') {
    var vila = [45.331145, 13.734929];
    var icon = L.divIcon({
      html: '<div style="width:32px;height:32px;background:#a2573c;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>',
      iconSize: [32, 32], iconAnchor: [16, 32], className: ''
    });
    var map = L.map('map', { scrollWheelZoom: false }).setView(vila, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
    L.marker(vila, { icon: icon }).addTo(map).bindPopup('<b>Villa VinoSelo</b><br>Vranje Selo, Istrien').openPopup();
  }

})();
