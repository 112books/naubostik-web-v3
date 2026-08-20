document.addEventListener('DOMContentLoaded', function() {
  const powered = document.querySelector('.footer-powered');
  const reveal = document.querySelector('.footer-powered-reveal');

  if (powered && reveal) {
    powered.addEventListener('mouseenter', () => {
      reveal.style.maxWidth = reveal.scrollWidth + 'px';
      reveal.style.opacity = '1';
    });
    powered.addEventListener('mouseleave', () => {
      reveal.style.maxWidth = '0';
      reveal.style.opacity = '0';
    });
  }

  initGalleryLightbox();
  initScrollTop();
  initHeaderScroll();
  initRandomEspais();
  initHeroSlideshow();
  initAgenda();
  initEventCalendar();
  initHomeTabs();
  initWordCloud();
  initShareCopy();
  initActivitatsHistoric();
  initHscrollFade();
  initFooterLogo();
});

function initShareCopy() {
  const btn = document.querySelector('.noticia-share__item--copy');
  if (!btn) return;

  btn.addEventListener('click', function() {
    const url = btn.getAttribute('data-copy') || window.location.href;
    const done = function() {
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Enllaç copiat');
      setTimeout(function() {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copia l\'enllaç');
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function() { fallback(url, done); });
    } else {
      fallback(url, done);
    }
  });

  function fallback(url, done) {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }
}

function initHeroSlideshow() {
  var card = document.querySelector('.hero-card.hero-has-photo');
  var slides = document.querySelectorAll('.hero-slideshow .hero-slide');
  if (!card || slides.length < 2) return;

  var current = 0;
  var timer;
  var touchStartX = 0;
  var touchDeltaX = 0;

  var dotsWrap = document.createElement('div');
  dotsWrap.className = 'hero-dots';
  dotsWrap.setAttribute('role', 'tablist');
  dotsWrap.setAttribute('aria-label', 'Slides del hero');
  slides.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', function() { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  card.appendChild(dotsWrap);

  function goTo(index) {
    var dots = dotsWrap.querySelectorAll('.hero-dot');
    if (dots[current]) { dots[current].classList.remove('is-active'); dots[current].setAttribute('aria-selected', 'false'); }
    slides[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (dots[current]) { dots[current].classList.add('is-active'); dots[current].setAttribute('aria-selected', 'true'); }
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function() { goTo(current + 1); }, 6000);
  }

  var prevBtn = card.querySelector('.hero-arrow-prev');
  var nextBtn = card.querySelector('.hero-arrow-next');
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); restart(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); restart(); });

  card.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });
  card.addEventListener('touchmove', function(e) {
    touchDeltaX = e.changedTouches[0].clientX - touchStartX;
  }, { passive: true });
  card.addEventListener('touchend', function() {
    if (Math.abs(touchDeltaX) > 50) {
      goTo(touchDeltaX > 0 ? current - 1 : current + 1);
      restart();
    }
    touchDeltaX = 0;
  }, { passive: true });

  restart();
}

function initRandomEspais() {
  const container = document.getElementById('espais-random');
  const dataEl = document.getElementById('espais-data');
  if (!container || !dataEl) return;

  let espais;
  try {
    espais = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(espais) || espais.length === 0) return;

  for (let i = espais.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [espais[i], espais[j]] = [espais[j], espais[i]];
  }

  const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const picks = espais.slice(0, 4);
  container.innerHTML = picks.map((espai) => {
    const img = '<img src="' + escapeHtml(espai.photo) + '" alt="' + escapeHtml(espai.title) + '">';
    const imageHtml = espai.placeholder
      ? '<div class="espai-card-placeholder">' + img + '</div>'
      : img;
    return '<a href="' + escapeHtml(espai.url) + '" class="espai-card">' +
      '<div class="espai-card-image">' + imageHtml + '</div>' +
      '<h3 class="espai-card-title">' + escapeHtml(espai.title) + '</h3>' +
      '</a>';
  }).join('');
}

function initHeaderScroll() {
  const body = document.body;
  const ON  = 90;
  const OFF = 40;
  let locked = false;

  function update() {
    if (locked) return;
    const sc = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const isScrolled = body.classList.contains('is-scrolled');
    if (!isScrolled && sc > ON) {
      body.classList.add('is-scrolled');
      locked = true;
      setTimeout(() => { locked = false; }, 150);
    } else if (isScrolled && sc < OFF) {
      body.classList.remove('is-scrolled');
      locked = true;
      setTimeout(() => { locked = false; }, 150);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initGalleryLightbox() {
  const groups = {};

  document.querySelectorAll('.espai-gallery-item').forEach(function(item) {
    const gallery = item.getAttribute('data-gallery') || '_';
    if (!groups[gallery]) groups[gallery] = [];
    groups[gallery].push(item);
  });

  const groupNames = Object.keys(groups);
  if (!groupNames.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'espai-lightbox';
  overlay.innerHTML =
    '<button class="espai-lightbox-btn espai-lightbox-close" type="button" aria-label="Tancar">×</button>' +
    '<button class="espai-lightbox-btn espai-lightbox-prev" type="button" aria-label="Anterior">‹</button>' +
    '<img class="espai-lightbox-img" alt="">' +
    '<button class="espai-lightbox-btn espai-lightbox-next" type="button" aria-label="Següent">›</button>' +
    '<span class="espai-lightbox-counter"></span>';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.espai-lightbox-img');
  const counter = overlay.querySelector('.espai-lightbox-counter');
  const btnPrev = overlay.querySelector('.espai-lightbox-prev');
  const btnNext = overlay.querySelector('.espai-lightbox-next');
  const btnClose = overlay.querySelector('.espai-lightbox-close');

  let currentGroup = null;
  let currentIndex = 0;
  let lastFocus = null;

  function show(index) {
    const group = groups[currentGroup];
    if (!group.length) return;
    currentIndex = (index + group.length) % group.length;
    const href = group[currentIndex].getAttribute('href');
    const alt = group[currentIndex].querySelector('img').getAttribute('alt');
    img.src = href;
    img.alt = alt;
    counter.textContent = (currentIndex + 1) + ' / ' + group.length;
    btnPrev.disabled = group.length <= 1;
    btnNext.disabled = group.length <= 1;
  }

  function open(group, index) {
    currentGroup = group;
    lastFocus = document.activeElement;
    show(index);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastFocus) lastFocus.focus();
  }

  groupNames.forEach(function(group) {
    groups[group].forEach(function(item, index) {
      item.addEventListener('click', function(event) {
        event.preventDefault();
        open(group, index);
      });
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function() { show(currentIndex - 1); });
  btnNext.addEventListener('click', function() { show(currentIndex + 1); });

  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) close();
  });

  document.addEventListener('keydown', function(event) {
    if (!overlay.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(currentIndex - 1);
    if (event.key === 'ArrowRight') show(currentIndex + 1);
  });
}

function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  const bar = btn.querySelector('.scroll-top-bar');
  const CIRC = 2 * Math.PI * 22;
  let ticking = false;

  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const sc = window.scrollY || doc.scrollTop;
    const pct = max > 0 ? sc / max : 0;
    bar.style.strokeDashoffset = String(CIRC * (1 - pct));
    if (sc > 280 && !btn.classList.contains('is-visible')) btn.classList.add('is-visible');
    else if (sc <= 280 && btn.classList.contains('is-visible')) btn.classList.remove('is-visible');
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

function initAgenda() {
  if (!document.querySelector('.agenda-toggle')) return;

  document.querySelectorAll('.agenda-toggle').forEach(function(toggleGroup) {
    var btns = toggleGroup.querySelectorAll('.agenda-toggle-btn');
    btns.forEach(function(btn) {
      if (!btn.classList.contains('is-active')) {
        var view = document.getElementById(btn.dataset.view);
        if (view) view.classList.add('agenda-view--hidden');
      }
    });

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b) {
          var v = document.getElementById(b.dataset.view);
          if (v) v.classList.add('agenda-view--hidden');
          b.classList.remove('is-active');
        });
        var target = document.getElementById(btn.dataset.view);
        if (target) target.classList.remove('agenda-view--hidden');
        btn.classList.add('is-active');
      });
    });
  });

  document.querySelectorAll('.agenda-archive-btn').forEach(function(archiveBtn) {
    var bloc = archiveBtn.closest('.activitats-bloc') || document.querySelector('main');
    var textShow = archiveBtn.dataset.archiveShow;
    var textHide = archiveBtn.dataset.archiveHide;
    archiveBtn.addEventListener('click', function() {
      var showing = bloc.classList.toggle('show-past');
      archiveBtn.textContent = showing ? textHide : textShow;
    });
  });
}
function initHomeTabs() {
  var nav = document.querySelector('.tab-nav');
  if (!nav) return;

  var btns   = nav.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  // Estat inicial: la pestanya activa al HTML és la visible per defecte
  panels.forEach(function(panel) {
    var tabId = panel.id.replace('tab-', '');
    var activeBtn = nav.querySelector('.tab-btn.is-active[data-tab="' + tabId + '"]');
    if (!activeBtn) panel.classList.add('tab-panel--hidden');
  });

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = 'tab-' + btn.dataset.tab;
      var target   = document.getElementById(targetId);
      var isOpen   = btn.classList.contains('is-active');

      // Tanca tot
      btns.forEach(function(b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      panels.forEach(function(p) { p.classList.add('tab-panel--hidden'); });

      // Si no estava obert, obre'l (toggle)
      if (!isOpen && target) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        target.classList.remove('tab-panel--hidden');
        target.classList.remove('tab-panel--in');
        void target.offsetWidth;
        target.classList.add('tab-panel--in');
      }
    });
  });
}

function initWordCloud() {
  var container = document.querySelector('.identitat-paraules');
  if (!container) return;

  var words = container.querySelectorAll('span');
  if (!words.length) return;

  var cw = container.offsetWidth;
  var ch = container.offsetHeight;

  // Posicionament aleatori de cada paraula
  words.forEach(function(w) {
    var size = 0.75 + Math.random() * 0.9; // entre 0.75rem i 1.65rem
    w.style.fontSize = size + 'rem';
    var maxLeft = Math.max(0, cw - w.offsetWidth - 10);
    var maxTop  = Math.max(0, ch - w.offsetHeight - 10);
    w.style.left = Math.floor(Math.random() * maxLeft) + 'px';
    w.style.top  = Math.floor(Math.random() * maxTop)  + 'px';
  });

  var wordArr = Array.from(words);
  var active  = new Set();
  var VISIBLE_COUNT = 3;

  function pulse() {
    // Apaga un dels visibles a l'atzar
    if (active.size >= VISIBLE_COUNT) {
      var toHide = Array.from(active)[Math.floor(Math.random() * active.size)];
      toHide.classList.remove('is-visible');
      active.delete(toHide);
    }
    // Encén una paraula nova que no estigui activa
    var candidates = wordArr.filter(function(w) { return !active.has(w); });
    if (candidates.length) {
      var pick = candidates[Math.floor(Math.random() * candidates.length)];
      pick.classList.add('is-visible');
      active.add(pick);
    }
  }

  // Encén les primeres VISIBLE_COUNT paraules immediatament
  for (var i = 0; i < VISIBLE_COUNT && i < wordArr.length; i++) {
    wordArr[i].classList.add('is-visible');
    active.add(wordArr[i]);
  }

  setInterval(pulse, 2000);
}

function initEventCalendar() {
  var cal = document.querySelector('.event-calendar');
  if (!cal) return;

  var title    = cal.dataset.title    || '';
  var start    = cal.dataset.start    || '';
  var end      = cal.dataset.end      || '';
  var location = cal.dataset.location || 'Nau Bostik';
  var desc     = cal.dataset.desc     || '';
  var slug     = cal.dataset.slug     || 'event';

  cal.querySelectorAll('.js-cal-ical').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nau Bostik//CA',
        'BEGIN:VEVENT',
        'UID:' + slug + '@naubostik.com',
        'SUMMARY:' + title.replace(/\n/g, '\\n'),
        'DTSTART:' + start,
        'DTEND:' + end,
        'LOCATION:' + location.replace(/\n/g, '\\n'),
        'DESCRIPTION:' + desc.replace(/\n/g, '\\n'),
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href     = url;
      a.download = slug + '.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });
}

function initFooterLogo() {
  var logo = document.querySelector('.footer-logo');
  if (!logo) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      logo.classList.toggle('is-compact', !e.isIntersecting);
    });
  }, { threshold: 0 });
  io.observe(logo);
}

function initHscrollFade() {
  document.querySelectorAll('.act-hscroll-wrap').forEach(function(wrap) {
    var grid = wrap.querySelector('.act-historica-grid--hscroll');
    if (!grid) return;
    function check() {
      var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
      wrap.classList.toggle('is-end', atEnd);
    }
    grid.addEventListener('scroll', check, { passive: true });
    check();
  });
}

function initActivitatsHistoric() {
  [
    { gridId: 'act-historica-grid',     sentinelId: 'act-historica-sentinel',     dataId: 'act-historica-data' },
    { gridId: 'act-ent-historica-grid', sentinelId: 'act-ent-historica-sentinel', dataId: 'act-ent-historica-data' }
  ].forEach(function(ids) { initHistoricGrid(ids.gridId, ids.sentinelId, ids.dataId); });
}

function initHistoricGrid(gridId, sentinelId, dataId) {
  var grid     = document.getElementById(gridId);
  var sentinel = document.getElementById(sentinelId);
  var dataEl   = document.getElementById(dataId);
  if (!grid || !sentinel || !dataEl) return;

  var items;
  try {
    items = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(items) || !items.length) {
    sentinel.remove();
    return;
  }

  var isHscroll = grid.classList.contains('act-historica-grid--hscroll');
  var CHUNK = 24;
  var idx   = 0;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function card(item) {
    var html = '<li class="act-item">';
    if (item.img) {
      html += '<a class="act-item__img" href="' + escapeHtml(item.url) + '">' +
              '<img src="' + escapeHtml(item.img) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
              '</a>';
    }
    html += '<div class="act-item__body">';
    html += '<p class="act-item__date">' + escapeHtml(item.date);
    if (item.hora) html += ' · ' + escapeHtml(item.hora) + ' h';
    if (item.preu) html += ' · ' + escapeHtml(item.preu);
    html += '</p>';
    html += '<h3 class="act-item__title"><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>';
    if (item.desc) html += '<p class="act-item__desc">' + escapeHtml(item.desc) + '</p>';
    html += '</div></li>';
    return html;
  }

  var ioOptions = isHscroll
    ? { root: grid, rootMargin: '0px 600px 0px 0px' }
    : { rootMargin: '800px 0px' };

  var io = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;
    sentinel.classList.add('is-loading');
    var html = '';
    for (var n = 0; n < CHUNK && idx < items.length; n++, idx++) {
      html += card(items[idx]);
    }
    sentinel.insertAdjacentHTML('beforebegin', html);
    if (idx >= items.length) {
      io.unobserve(sentinel);
      sentinel.remove();
      return;
    }
    sentinel.classList.remove('is-loading');
  }, ioOptions);

  io.observe(sentinel);
}

/* ── Filtres agenda setmana (home v3) ── */
function initSetmanaFiltres() {
  var filtres = document.querySelector('.home-setmana__filtres');
  if (!filtres) return;
  filtres.addEventListener('click', function(e) {
    var btn = e.target.closest('.filtre-btn');
    if (!btn || btn.dataset.view) return;
    filtres.querySelectorAll('.filtre-btn').forEach(function(b) { b.classList.remove('is-active'); });
    btn.classList.add('is-active');
    var filtre = btn.dataset.filtre;
    var grid = document.querySelector('.home-setmana__grid');
    if (!grid) return;
    grid.querySelectorAll('.home-act-card').forEach(function(card) {
      var shouldHide = filtre !== 'tots' && card.dataset.grup !== filtre;
      if (shouldHide) {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        setTimeout(function() { card.classList.add('is-hidden'); card.style.opacity = ''; card.style.transform = ''; }, 250);
      } else {
        card.classList.remove('is-hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        });
        setTimeout(function() { card.style.transition = ''; card.style.opacity = ''; card.style.transform = ''; }, 350);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSetmanaFiltres();
  initCollectiusFiltres();
  initContacteForm();
  initMapScrollGuard();
  initCalendarDropdown();
  initCountdownAssemblea();
  initScrollReveal();
  initCalendarView();
});

function initCalendarDropdown() {
  const cal = document.querySelector('.event-calendar');
  if (!cal) return;
  cal.addEventListener('click', e => {
    const btn = e.target.closest('.js-cal-ics');
    if (!btn) return;
    const t = cal.dataset.title || '';
    const start = cal.dataset.start || '';
    const end = cal.dataset.end || start;
    const loc = cal.dataset.location || '';
    const desc = cal.dataset.desc || '';
    const slug = cal.dataset.slug || 'event';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nau Bostik//CA',
      'BEGIN:VEVENT',
      'DTSTART:' + start,
      'DTEND:' + end,
      'SUMMARY:' + t.replace(/,/g, '\\,'),
      'LOCATION:' + loc.replace(/,/g, '\\,'),
      'DESCRIPTION:' + desc.replace(/,/g, '\\,'),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    a.download = slug + '.ics';
    a.click();
    cal.querySelector('.cal-dropdown').removeAttribute('open');
  });
}

function initCollectiusFiltres() {
  const wrap = document.getElementById('col-logo-grid');
  const group = document.querySelector('.col-filtres');
  if (!wrap || !group) return;
  group.addEventListener('click', e => {
    const btn = e.target.closest('.filtre-btn');
    if (!btn) return;
    group.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filtre = btn.dataset.filtre;
    wrap.querySelectorAll('.col-logo-card').forEach(card => {
      const ambits = (card.dataset.ambit || '').split(' ');
      card.classList.toggle('is-hidden', filtre !== 'tots' && !ambits.includes(filtre));
    });
  });
}

function initContacteForm() {
  const selector = document.querySelector('.consulta-selector');
  if (!selector) return;
  const hiddenInput = document.getElementById('form-consulta-hidden');

  function activaConsulta(consulta) {
    selector.querySelectorAll('.consulta-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.consulta === consulta);
    });
    if (hiddenInput) hiddenInput.value = consulta;
    document.querySelectorAll('.faq-group').forEach(g => {
      g.style.display = g.dataset.faq === consulta ? '' : 'none';
    });
    document.querySelectorAll('.form-group--cessio').forEach(g => {
      g.style.display = consulta === 'cessio' ? '' : 'none';
    });
    document.querySelectorAll('.form-group--participar').forEach(g => {
      g.style.display = consulta === 'participar' ? '' : 'none';
    });
  }

  const urlConsulta = new URLSearchParams(window.location.search).get('consulta');
  if (urlConsulta && selector.querySelector('[data-consulta="' + urlConsulta + '"]')) {
    activaConsulta(urlConsulta);
  }

  selector.addEventListener('click', e => {
    const btn = e.target.closest('.consulta-btn');
    if (!btn) return;
    activaConsulta(btn.dataset.consulta);
  });
}

function initMapScrollGuard() {
  const mapWrap = document.getElementById('contacte-map');
  if (!mapWrap) return;
  const guard = mapWrap.querySelector('.contacte-map__scroll-guard');
  if (!guard) return;
  let hideTimer;

  mapWrap.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    guard.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => guard.classList.remove('is-visible'), 1500);
  }, { passive: false });
}

function initCountdownAssemblea() {
  var el = document.querySelector('.home-assemblea__countdown');
  if (!el) return;
  var dateStr = el.dataset.date;
  var timeStr = el.dataset.time || '17:00';
  if (!dateStr) return;

  var parts = dateStr.split('-');
  var timeParts = timeStr.split(':');
  var target = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
    parseInt(timeParts[0], 10),
    parseInt(timeParts[1], 10)
  );

  function update() {
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) {
      el.innerHTML = '<span class="countdown-value">Avui!</span>';
      return;
    }
    var dies = Math.floor(diff / 86400000);
    var hores = Math.floor((diff % 86400000) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var segments = [];
    if (dies > 0) segments.push('<span class="countdown-value">' + dies + '</span> ' + (dies === 1 ? 'dia' : 'dies'));
    if (hores > 0) segments.push('<span class="countdown-value">' + hores + '</span> ' + (hores === 1 ? 'hora' : 'hores'));
    segments.push('<span class="countdown-value">' + mins + '</span> ' + (mins === 1 ? 'minut' : 'minuts'));
    el.innerHTML = 'Falten ' + segments.join(', ');
  }

  update();
  setInterval(update, 60000);
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sections = document.querySelectorAll('.section, .home-ecosistema, .home-comissions, .home-assemblea, .home-noticies');
  if (!sections.length) return;

  sections.forEach(function(s) { s.classList.add('reveal'); });

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(function(s) { io.observe(s); });
}

function initCalendarView() {
  var calWrap = document.getElementById('home-calendar');
  var grid = document.querySelector('.home-setmana__grid');
  var filtres = document.querySelector('.home-setmana__filtres');
  if (!calWrap || !grid || !filtres) return;

  var events = [];
  try {
    var raw = JSON.parse(document.getElementById('home-calendar-data').textContent);
    events = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) { return; }

  var mesActual = new Date();
  mesActual.setDate(1);

  var viewBtn = filtres.querySelector('[data-view="calendari"]');
  if (viewBtn) {
    viewBtn.addEventListener('click', function() {
      filtres.querySelectorAll('.filtre-btn').forEach(function(b) { b.classList.remove('is-active'); });
      viewBtn.classList.add('is-active');
      grid.style.display = 'none';
      calWrap.style.display = 'block';
      renderCalendar();
    });
  }

  filtres.querySelectorAll('[data-filtre]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      calWrap.style.display = 'none';
      grid.style.display = '';
    });
  });

  function shortTitle(title) {
    if (!title) return '';
    var lower = title.toLowerCase();
    var keywords = ['exposició', 'exposicion', 'presentació', 'presentacion', 'xerrada', 'taller', 'mercant', 'concert', 'festa', 'vermut', 'projecció', 'proyeccion', 'recital', 'workshop', 'activitat'];
    for (var i = 0; i < keywords.length; i++) {
      if (lower.indexOf(keywords[i]) !== -1) {
        return keywords[i].charAt(0).toUpperCase() + keywords[i].slice(1);
      }
    }
    var words = title.split(/\s+/);
    return words.length > 3 ? words.slice(0, 3).join(' ') + '...' : title;
  }

  function dedupEvents(arr) {
    var seen = {};
    return arr.filter(function(ev) {
      var key = ev.date + '|' + (ev.title || '');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  calWrap.querySelector('.cal-prev').addEventListener('click', function() {
    mesActual.setMonth(mesActual.getMonth() - 1);
    renderCalendar();
  });
  calWrap.querySelector('.cal-next').addEventListener('click', function() {
    mesActual.setMonth(mesActual.getMonth() + 1);
    renderCalendar();
  });

  var festius = {
    '2026-01-01': 'Any Nou',
    '2026-01-06': 'Reis',
    '2026-04-03': 'Divendres Sant',
    '2026-04-06': 'Dilluns de Pasqua Florida',
    '2026-05-01': 'Dia del Treball',
    '2026-05-25': 'Dilluns de Pasqua Granada',
    '2026-06-24': 'Sant Joan',
    '2026-08-15': 'L\'Assumpció',
    '2026-09-11': 'Diada Nacional',
    '2026-09-24': 'La Mercè',
    '2026-10-12': 'Dia Nacional d\'Espanya',
    '2026-11-01': 'Tots Sants',
    '2026-12-06': 'Dia de la Constitució',
    '2026-12-08': 'Immaculada Concepció',
    '2026-12-25': 'Nadal',
    '2026-12-26': 'Sant Esteve',
    '2027-01-01': 'Any Nou',
    '2027-01-06': 'Reis',
    '2027-03-26': 'Divendres Sant',
    '2027-03-29': 'Dilluns de Pasqua Florida',
    '2027-05-01': 'Dia del Treball',
    '2027-05-17': 'Dilluns de Pasqua Granada',
    '2027-06-24': 'Sant Joan',
    '2027-08-15': 'L\'Assumpció',
    '2027-09-11': 'Diada Nacional',
    '2027-09-24': 'La Mercè',
    '2027-10-12': 'Dia Nacional d\'Espanya',
    '2027-11-01': 'Tots Sants',
    '2027-12-06': 'Dia de la Constitució',
    '2027-12-08': 'Immaculada Concepció',
    '2027-12-25': 'Nadal',
    '2027-12-26': 'Sant Esteve'
  };

  function renderCalendar() {
    var any = mesActual.getFullYear();
    var mes = mesActual.getMonth();
    var title = calWrap.querySelector('.cal-title');
    var noms = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    title.textContent = noms[mes] + ' ' + any;

    var primerDia = new Date(any, mes, 1).getDay();
    var diesAlMes = new Date(any, mes + 1, 0).getDate();
    var offset = (primerDia + 6) % 7;

    var cells = calWrap.querySelectorAll('.cal-cell');
    cells.forEach(function(c) { c.innerHTML = ''; c.className = 'cal-cell'; });

    for (var d = 0; d < offset; d++) {
      cells[d].classList.add('cal-cell--empty');
    }

    for (var dia = 1; dia <= diesAlMes; dia++) {
      var idx = offset + dia - 1;
      if (idx >= cells.length) break;
      var cell = cells[idx];
      cell.classList.add('cal-cell--day');
      var diaEl = document.createElement('span');
      diaEl.className = 'cal-dia-num';
      diaEl.textContent = dia;
      cell.appendChild(diaEl);

      var dataStr = any + '-' + String(mes + 1).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
      if (festius[dataStr]) {
        cell.classList.add('cal-cell--festiu');
        var festEl = document.createElement('span');
        festEl.className = 'cal-festiu';
        festEl.textContent = festius[dataStr];
        cell.appendChild(festEl);
      }
      var dayEvents = dedupEvents(events.filter(function(ev) { return ev.date === dataStr; }));
      if (dayEvents.length) {
        dayEvents.forEach(function(ev) {
          var evEl = document.createElement('a');
          evEl.className = 'cal-event cal-event--' + (ev.tipus || 'nb');
          evEl.href = ev.url || '#';
          evEl.title = ev.title || '';
          var header = document.createElement('span');
          header.className = 'cal-event-header';
          var dot = document.createElement('span');
          dot.className = 'cal-dot cal-dot--' + (ev.tipus || 'nb');
          header.appendChild(dot);
          var tipusEl = document.createElement('span');
          tipusEl.className = 'cal-event-tipus';
          tipusEl.textContent = ev.tipusLabel || ev.tipus || '';
          header.appendChild(tipusEl);
          evEl.appendChild(header);
          var name = document.createElement('span');
          name.className = 'cal-event-name';
          name.textContent = ev.title || '';
          evEl.appendChild(name);
          cell.appendChild(evEl);
        });
        cell.title = dayEvents.length + ' activitat' + (dayEvents.length > 1 ? 's' : '');
      }
    }
  }
}
