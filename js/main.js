/**
 * Main JavaScript - Navigation and shared functionality
 */

/** Shared top banners for nav sections (Who we are, What we do, etc.). Edit text/image paths here only. */
var SECTION_BANNER_CONFIG = {
  'who-we-are': {
    parentLabel: 'Who we are',
    blurb: 'Intro copy for this section will be updated soon. It will briefly describe who we are and how we support patients and families.',
    image: 'images/banner/section-who-we-are.jpg'
  },
  'what-we-do': {
    parentLabel: 'What we do',
    blurb: 'Intro copy for this section will be updated soon. It will outline our programmes and how we help during treatment.',
    image: 'images/banner/section-what-we-do.jpg'
  },
  'who-we-work-with': {
    parentLabel: 'Who we work with',
    blurb: 'Intro copy for this section will be updated soon. It will highlight our partners and communities we serve.',
    image: 'images/banner/section-who-we-work-with.jpg'
  },
  resources: {
    parentLabel: 'Resources',
    blurb: 'Intro copy for this section will be updated soon. It will point visitors to guides, stories, and useful materials.',
    image: 'images/banner/section-resources.jpg'
  }
};

function resolveNavSection() {
  var rawPath = (window.location.pathname || '').replace(/\\/g, '/');
  var path;
  try {
    path = decodeURIComponent(rawPath).toLowerCase();
  } catch (e) {
    path = rawPath.toLowerCase();
  }
  if (!path && window.location.href) {
    try {
      path = new URL(window.location.href).pathname.replace(/\\/g, '/').toLowerCase();
    } catch (e2) {
      path = '';
    }
  }
  var parts = path.split('/').filter(function (s) {
    return s.length > 0;
  });
  var file = parts.length ? parts[parts.length - 1] : '';
  var base = file.replace(/\.html?$/i, '');

  if (path === '/' || path === '') {
    return null;
  }
  if (base === 'index' || file === 'index.html') {
    return null;
  }

  /* team.html or pretty URL /team — same section as Who we are */
  if (base === 'team' || base === 'who-we-are' || parts.indexOf('who-we-are') !== -1) {
    return 'who-we-are';
  }

  if (base === 'what-we-do' || parts.indexOf('what-we-do') !== -1) {
    return 'what-we-do';
  }

  if (base === 'who-we-work-with' || parts.indexOf('who-we-work-with') !== -1) {
    return 'who-we-work-with';
  }

  if (parts.indexOf('resources') !== -1 || base === 'gallery') {
    return 'resources';
  }

  return null;
}

/**
 * Preferred: body[data-nav-section] must match a key in SECTION_BANNER_CONFIG (who-we-are, what-we-do, …).
 * Falls back to URL heuristics if the attribute is missing (e.g. older copies of a page).
 */
function getNavSectionKey() {
  var body = document.body;
  var raw = body && body.getAttribute('data-nav-section');
  if (raw != null && String(raw).trim() !== '') {
    var k = String(raw).trim();
    if (SECTION_BANNER_CONFIG[k]) {
      return k;
    }
  }
  return resolveNavSection();
}

function initSectionBanner() {
  var main = document.querySelector('main');
  if (!main || main._utsSectionBannerDone) return;
  var key = getNavSectionKey();
  if (!key) return;
  var cfg = SECTION_BANNER_CONFIG[key];
  if (!cfg) return;
  main._utsSectionBannerDone = true;

  var section = document.createElement('section');
  section.className = 'hero hero-section-banner';
  section.setAttribute('aria-label', cfg.parentLabel + ' — section introduction');

  var media = document.createElement('div');
  media.className = 'hero-media';

  var slide = document.createElement('div');
  slide.className = 'hero-slide hero-slide-active';
  var imgPath = cfg.image || '';
  if (imgPath.indexOf("'") !== -1) {
    imgPath = imgPath.replace(/'/g, '');
  }
  slide.style.backgroundImage = imgPath ? "url('" + imgPath + "')" : '';

  var overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  media.appendChild(slide);
  media.appendChild(overlay);

  var content = document.createElement('div');
  content.className = 'hero-content container';

  var parentLabel = document.createElement('p');
  parentLabel.className = 'section-banner-parent';
  parentLabel.textContent = cfg.parentLabel;

  var blurb = document.createElement('p');
  blurb.className = 'hero-subtitle section-banner-blurb';
  var blurbStrong = document.createElement('b');
  blurbStrong.textContent = cfg.blurb;
  blurb.appendChild(blurbStrong);

  content.appendChild(parentLabel);
  content.appendChild(blurb);

  section.appendChild(media);
  section.appendChild(content);

  main.insertBefore(section, main.firstChild);
}

/* DOM ready: nav chrome that does not depend on fetched header/footer */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInits);
} else {
  runInits();
}

/*
 * Same pipeline as include.js: after header.html + footer.html are injected, add the section
 * banner (if this page declares data-nav-section) and refresh nav state. Keeps header, footer,
 * and banner on one consistent “layout loaded” step.
 */
document.addEventListener('headerFooterLoaded', function onLayoutFragmentsLoaded() {
  initSectionBanner();
  runInits();
});

function runInits() {
  initNavActiveState();
  initMobileNav();
  initSubmenu();
  initSearchBar();
  initSearchPageForm();
  initHeroSlider();
  initStatsCounter();
  initCarousels();
  initVideoPlaceholders();
}

function initNavActiveState() {
  var path = window.location.pathname;
  var current = path.split('/').pop() || 'index.html';
  var pathNorm = path.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link[href], .nav-submenu-link[href]').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var hrefNorm = href.replace(/^\//, '');
    var isActive = href === current || pathNorm.endsWith(hrefNorm) || (current === '' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;
  if (navLinks._utsMobileNavBound) return;
  navLinks._utsMobileNavBound = true;

  const mqMobile = window.matchMedia('(max-width: 768px)');

  function clearMobileNavSelection() {
    navLinks.querySelectorAll('.nav-mobile-selected, .nav-mobile-line-exit').forEach(function (el) {
      if (el._utsNavLineExitEnd) {
        el.removeEventListener('animationend', el._utsNavLineExitEnd);
        el._utsNavLineExitEnd = null;
      }
      el.classList.remove('nav-mobile-selected', 'nav-mobile-line-exit');
    });
  }

  function runMobileNavLineExit(el) {
    if (!el.classList.contains('nav-mobile-selected')) return;
    if (el.classList.contains('nav-mobile-line-exit')) return;
    if (el._utsNavLineExitEnd) {
      el.removeEventListener('animationend', el._utsNavLineExitEnd);
      el._utsNavLineExitEnd = null;
    }
    el.classList.add('nav-mobile-line-exit');
    function onExitAnimEnd(ev) {
      if (ev.animationName !== 'nav-mobile-line-exit') return;
      el.removeEventListener('animationend', onExitAnimEnd);
      el._utsNavLineExitEnd = null;
      el.classList.remove('nav-mobile-selected', 'nav-mobile-line-exit');
    }
    el._utsNavLineExitEnd = onExitAnimEnd;
    el.addEventListener('animationend', onExitAnimEnd);
  }

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    clearMobileNavSelection();
  }

  toggle.addEventListener('click', function () {
    if (navLinks.classList.contains('open')) {
      closeMobileMenu();
    } else {
      navLinks.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  /* Capture: submenu buttons use stopPropagation — bubble never reaches .nav-links */
  navLinks.addEventListener(
    'click',
    function (e) {
      if (!mqMobile.matches) return;
      var t = e.target;
      var el = null;
      if (t.closest('.nav-submenu')) {
        el = t.closest('a.nav-submenu-link');
      } else {
        el = t.closest('button.nav-link-button') || t.closest('a.nav-link');
      }
      if (!el || !navLinks.contains(el)) return;
      /* Second tap closes submenu — animate line out (desktop-style scaleX), don't clear first */
      if (el.matches('button.nav-link-button')) {
        var subParent = el.closest('.nav-item-has-submenu');
        if (subParent && subParent.classList.contains('submenu-open')) {
          runMobileNavLineExit(el);
          return;
        }
      }
      clearMobileNavSelection();
      el.classList.add('nav-mobile-selected');
      var href = el.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        requestAnimationFrame(function () {
          clearMobileNavSelection();
        });
      }
    },
    true
  );

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  document.addEventListener('click', function (e) {
    if (!mqMobile.matches) return;
    if (!navLinks.classList.contains('open')) return;
    var t = e.target;
    if (t.closest && (t.closest('.nav-links') || t.closest('.nav-toggle'))) return;
    closeMobileMenu();
  });

  function onMobileMqChange() {
    if (!mqMobile.matches) clearMobileNavSelection();
  }
  if (mqMobile.addEventListener) {
    mqMobile.addEventListener('change', onMobileMqChange);
  } else if (mqMobile.addListener) {
    mqMobile.addListener(onMobileMqChange);
  }
}

function initSubmenu() {
  var nav = document.querySelector('.nav-links');
  if (!nav || nav._utsSubmenuBound) return;
  nav._utsSubmenuBound = true;
  var mqMobile = window.matchMedia('(max-width: 768px)');

  nav.querySelectorAll('.nav-item-has-submenu').forEach(function (submenuParent) {
    var btn = submenuParent.querySelector('.nav-link-button');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      if (!mqMobile.matches) {
        var firstLink = submenuParent.querySelector('.nav-submenu a.nav-submenu-link');
        var href = firstLink && firstLink.getAttribute('href');
        if (href) {
          if (e.metaKey || e.ctrlKey) {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        }
        return;
      }
      e.stopPropagation();
      var isOpen = submenuParent.classList.toggle('submenu-open');
      btn.setAttribute('aria-expanded', isOpen);
      nav.querySelectorAll('.nav-item-has-submenu').forEach(function (other) {
        if (other !== submenuParent) {
          other.classList.remove('submenu-open');
          var otherBtn = other.querySelector('.nav-link-button');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (!mqMobile.matches) return;
    if (!e.target.closest('.nav-item-has-submenu')) {
      nav.querySelectorAll('.nav-item-has-submenu').forEach(function (submenuParent) {
        submenuParent.classList.remove('submenu-open');
        var btn = submenuParent.querySelector('.nav-link-button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      nav.querySelectorAll('.nav-item-has-submenu').forEach(function (submenuParent) {
        submenuParent.classList.remove('submenu-open');
        var btn = submenuParent.querySelector('.nav-link-button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

function initSearchBar() {
  const toggle = document.querySelector('.search-toggle');
  const searchBar = document.getElementById('site-search-bar');
  const input = document.getElementById('site-search-input');

  if (!toggle || !searchBar || !input) return;
  if (toggle._utsSearchBarBound) return;

  function closeSearch() {
    document.body.classList.remove('search-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openSearch() {
    document.body.classList.add('search-open');
    toggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () {
      input.focus();
    }, 150);
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (document.body.classList.contains('search-open')) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  var siteForm = document.getElementById('site-search-form');
  if (siteForm) {
    siteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = input.value ? String(input.value).trim() : '';
      if (raw) {
        try {
          sessionStorage.setItem('uts_pending_search_q', raw);
        } catch (err) {}
      }
      window.location.href = siteForm.getAttribute('action') || 'search.html';
    });
  }

  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('search-open')) return;
    var t = e.target;
    if (t.closest('.search-bar') || t.closest('.search-toggle') || t.closest('.nav')) return;
    closeSearch();
  });

  toggle._utsSearchBarBound = true;
}

/** Survives servers that 301 search.html?q=… → /search without the query (e.g. some static hosts). */
function initSearchPageForm() {
  var form = document.querySelector('form.search-page-form');
  if (!form || form._utsSearchPageBound) return;
  form._utsSearchPageBound = true;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var qInput = form.querySelector('input[name="q"]');
    var raw = qInput && qInput.value ? String(qInput.value).trim() : '';
    if (raw) {
      try {
        sessionStorage.setItem('uts_pending_search_q', raw);
      } catch (err) {}
    }
    window.location.href = form.getAttribute('action') || 'search.html';
  });
}

function initHeroSlider() {
  const media = document.querySelector('.hero-media');
  if (!media || media._utsHeroSliderBound) return;
  const slides = media ? Array.from(media.querySelectorAll('.hero-slide')) : [];
  if (slides.length <= 1) return;
  media._utsHeroSliderBound = true;

  const prevBtn = media.querySelector('.hero-prev');
  const nextBtn = media.querySelector('.hero-next');
  const dotsContainer = media.querySelector('.hero-dots');

  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    slides[current].classList.remove('hero-slide-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('hero-slide-active');
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.hero-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  if (dotsContainer) {
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      resetAutoTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      resetAutoTimer();
    });
  }

  function resetAutoTimer() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 3000);
  }

  resetAutoTimer();
}

function initCarousels() {
  const wraps = document.querySelectorAll('.carousel-wrap[data-carousel]');

  wraps.forEach(function (wrap) {
    if (wrap._utsCarouselInit) return;
    wrap._utsCarouselInit = true;
    const viewport = wrap.querySelector('.carousel-viewport');
    const track = wrap.querySelector('.carousel-track');
    const prevBtn = wrap.querySelector('.carousel-prev');
    const nextBtn = wrap.querySelector('.carousel-next');
    const dotsEl = wrap.querySelector('.carousel-dots');
    if (!viewport || !track) return;

    /* Duplicate track for circular scroll (so we can show e.g. 7,0,1,2,3) */
    const originalCount = track.children.length;
    if (originalCount === 0) return;
    for (var c = 0; c < originalCount; c++) {
      track.appendChild(track.children[c].cloneNode(true));
    }

    const items = track.children;
    const total = originalCount; /* logical count for dots and index */
    const gap = 20; /* px, match CSS 1.25rem */
    const transitionStyle = 'transform 0.4s ease-out';
    const carouselKind = wrap.getAttribute('data-carousel') || '';

    let currentIndex = 0;
    let isWrappingNext = false;

    function getItemWidth() {
      return items[0] ? items[0].offsetWidth : 0;
    }

    function getVisibleCount() {
      var w = viewport && viewport.offsetWidth ? viewport.offsetWidth : window.innerWidth;
      if (w <= 400) return 1;
      if (w <= 600) return 2;
      return carouselKind === 'youtube' ? 3 : 5;
    }

    function setTranslate(px, useTransition) {
      track.style.transition = useTransition !== false ? transitionStyle : 'none';
      track.style.transform = 'translate3d(' + px + 'px, 0, 0)';
    }

    function applyCenterAndDots() {
      var visible = getVisibleCount();
      var centerOffset = Math.floor((visible - 1) / 2);
      var centerIndex = currentIndex + centerOffset;
      [].forEach.call(items, function (el, i) {
        el.classList.toggle('carousel-item-center', i === centerIndex);
      });
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
      if (dotsEl) {
        var dots = dotsEl.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === currentIndex);
          d.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
        });
      }
    }

    /* Visible count from getVisibleCount(); center index = currentIndex + floor((visible-1)/2). */
    function goToIndex(index) {
      currentIndex = (index + total) % total;
      if (currentIndex < 0) currentIndex += total;

      var w = getItemWidth();
      var translateX = -currentIndex * (w + gap);
      setTranslate(translateX, true);
      applyCenterAndDots();
    }

    function updateDots() {
      if (!dotsEl) return;
      var dots = dotsEl.querySelectorAll('.carousel-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
        d.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    }

    /* On transition end after "next" at end: reset to start position so list appears infinite */
    track.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform' || !isWrappingNext) return;
      isWrappingNext = false;
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0px, 0, 0)';
      currentIndex = 0;
      applyCenterAndDots();
      /* Re-enable transition after instant jump */
      requestAnimationFrame(function () {
        track.style.transition = transitionStyle;
      });
    });

    /* One dot per item (8 or 9) */
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to item ' + (i + 1));
        dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        (function (idx) {
          dot.addEventListener('click', function () {
            goToIndex(idx);
          });
        })(i);
        dotsEl.appendChild(dot);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var w = getItemWidth();
        if (currentIndex === 0) {
          /* Smooth wrap: jump to duplicate "end" then animate one step right */
          setTranslate(-total * (w + gap), false);
          currentIndex = total - 1;
          applyCenterAndDots();
          requestAnimationFrame(function () {
            setTranslate(-(total - 1) * (w + gap), true);
          });
        } else {
          goToIndex(currentIndex - 1);
        }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var w = getItemWidth();
        if (currentIndex === total - 1) {
          /* Smooth wrap: animate one step into duplicate, then reset in transitionend */
          isWrappingNext = true;
          setTranslate(-total * (w + gap), true);
        } else {
          goToIndex(currentIndex + 1);
        }
      });
    }

    window.addEventListener('resize', function () {
      goToIndex(currentIndex);
      applyCenterAndDots();
    });

    goToIndex(0);
  });
}

function initStatsCounter() {
  const section = document.querySelector('.stats-section');
  const numbers = section ? section.querySelectorAll('.stat-number') : null;
  if (!section || section._utsStatsCounterInit || !numbers || numbers.length === 0) return;
  section._utsStatsCounterInit = true;

  let hasRun = false;

  function animate() {
    if (hasRun) return;
    hasRun = true;
    numbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1500;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(target * progress);
        el.textContent = value.toLocaleString('en-IN');
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}

function initVideoPlaceholders() {
  const cards = document.querySelectorAll('.video-card[data-video-id]');
  if (!cards.length) return;
  if (document.body._utsVideoPlaceholdersBound) return;
  document.body._utsVideoPlaceholdersBound = true;

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      const videoId = card.getAttribute('data-video-id');
      if (!videoId) return;

      const iframe = document.createElement('iframe');
      iframe.src =
        'https://www.youtube.com/embed/' + videoId + '?autoplay=1&mute=1&rel=0';
      iframe.title = 'YouTube video player';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen = true;

      const thumb = card.querySelector('.video-thumb');
      if (thumb) {
        thumb.innerHTML = '';
        thumb.appendChild(iframe);
      }
    });
  });
}
