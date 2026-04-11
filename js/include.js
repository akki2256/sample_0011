/**
 * Shared layout fragments (same flow on every page):
 * 1. Fetch header.html → #header-placeholder, footer.html → #footer-placeholder
 * 2. Dispatch "headerFooterLoaded" (even if fetch fails, so JS can still run)
 * 3. main.js handles that event: section banner (when body[data-nav-section] is set), then nav/search init
 *
 * Markup order: #header-placeholder, <main> (optional injected banner + one <section class="page-main">…), #footer-placeholder
 * Script order: js/include.js → js/main.js → optional page-specific scripts
 */
(function () {
  var headerEl = document.getElementById('header-placeholder');
  var footerEl = document.getElementById('footer-placeholder');

  if (!headerEl && !footerEl) return;

  function inject() {
    var base = document.querySelector('base');
    var basePath = (base && base.getAttribute('href')) || '';
    var promises = [];
    if (headerEl) {
      promises.push(
        fetch(basePath + 'header.html').then(function (r) { return r.text(); }).then(function (html) {
          headerEl.innerHTML = html;
        })
      );
    }
    if (footerEl) {
      promises.push(
        fetch(basePath + 'footer.html').then(function (r) { return r.text(); }).then(function (html) {
          footerEl.innerHTML = html;
        })
      );
    }
    Promise.all(promises).then(function () {
      document.dispatchEvent(new Event('headerFooterLoaded'));
    }).catch(function () {
      document.dispatchEvent(new Event('headerFooterLoaded'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
