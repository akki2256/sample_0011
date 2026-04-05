(function () {
  function formatNewsletterDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function initNewsletterFeatured() {
    var root = document.querySelector('[data-newsletter-featured]');
    if (!root || !window.UTS_NEWSLETTERS || !UTS_NEWSLETTERS.length) return;

    var sorted = UTS_NEWSLETTERS.slice().sort(function (a, b) {
      return String(b.dateISO).localeCompare(String(a.dateISO));
    });
    var latest = sorted[0];

    var img = root.querySelector('[data-nf-image]');
    var titleEl = root.querySelector('[data-nf-title]');
    var dateEl = root.querySelector('[data-nf-date]');
    var excerptEl = root.querySelector('[data-nf-excerpt]');
    var link = root.querySelector('[data-nf-readmore]');

    if (img) {
      img.src = latest.thumb;
      img.alt = '';
    }
    if (titleEl) titleEl.textContent = latest.title;
    if (dateEl) dateEl.textContent = formatNewsletterDate(latest.dateISO);
    if (excerptEl) excerptEl.textContent = latest.excerpt;
    if (link) {
      link.href = latest.article;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletterFeatured);
  } else {
    initNewsletterFeatured();
  }
})();
