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
  initHeroSlider();
  initStatsCounter();
  initVideoPlaceholders();
}

function initNavActiveState() {
  var path = window.location.pathname;
  var current = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
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
  var btn = document.querySelector('.nav-link-button');
  var submenuParent = document.querySelector('.nav-item-has-submenu');
  if (!btn || !submenuParent) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    submenuParent.classList.toggle('submenu-open');
    btn.setAttribute('aria-expanded', submenuParent.classList.contains('submenu-open'));
  });

  document.addEventListener('click', function (e) {
    if (!submenuParent.contains(e.target)) {
      submenuParent.classList.remove('submenu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      submenuParent.classList.remove('submenu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function initSearchBar() {
  const toggle = document.querySelector('.search-toggle');
  const searchBar = document.getElementById('site-search-bar');
  const input = document.getElementById('site-search-input');

  if (!toggle || !searchBar || !input) return;

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

  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('search-open')) return;
    if (e.target.closest('.search-bar') || e.target.closest('.search-toggle') || e.target.closest('.nav')) return;
    closeSearch();
  });
}

function initHeroSlider() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(function () {
    slides[current].classList.remove('hero-slide-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('hero-slide-active');
  }, 3000);
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
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      const thumb = card.querySelector('.video-thumb');
      if (thumb) {
        thumb.innerHTML = '';
        thumb.appendChild(iframe);
      }
    });
  });
}
