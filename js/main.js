/**
 * Main JavaScript - Navigation and shared functionality
 */

document.addEventListener('DOMContentLoaded', runInits);
document.addEventListener('headerFooterLoaded', runInits);

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

  toggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
    }
  });
}

function initSubmenu() {
  var nav = document.querySelector('.nav-links');
  if (!nav) return;

  nav.querySelectorAll('.nav-item-has-submenu').forEach(function (submenuParent) {
    var btn = submenuParent.querySelector('.nav-link-button');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
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
  const slides = media ? Array.from(media.querySelectorAll('.hero-slide')) : [];
  if (slides.length <= 1) return;

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
  if (!section || !numbers || numbers.length === 0) return;

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
