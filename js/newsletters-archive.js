(function () {
  var PAGE_SIZE = 5;

  function formatNewsletterDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function sortedNewsletters() {
    return window.UTS_NEWSLETTERS.slice().sort(function (a, b) {
      return String(b.dateISO).localeCompare(String(a.dateISO));
    });
  }

  function initNewslettersArchive() {
    var listEl = document.getElementById('newsletter-archive-list');
    var pagerEl = document.getElementById('newsletter-archive-pager');
    if (!listEl || !pagerEl || !window.UTS_NEWSLETTERS || !UTS_NEWSLETTERS.length) return;

    var items = sortedNewsletters();
    var totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    var currentPage = 1;

    function renderList() {
      listEl.innerHTML = '';
      var start = (currentPage - 1) * PAGE_SIZE;
      var pageItems = items.slice(start, start + PAGE_SIZE);

      pageItems.forEach(function (item) {
        var row = document.createElement('article');
        row.className = 'newsletter-archive-row';

        var thumbWrap = document.createElement('div');
        thumbWrap.className = 'newsletter-archive-thumb';
        var img = document.createElement('img');
        img.src = item.thumb;
        img.alt = '';
        img.width = 320;
        img.height = 200;
        img.loading = 'lazy';
        img.decoding = 'async';
        thumbWrap.appendChild(img);

        var body = document.createElement('div');
        body.className = 'newsletter-archive-body';

        var h = document.createElement('h2');
        h.className = 'newsletter-archive-title';
        h.textContent = item.title;

        var dateP = document.createElement('p');
        dateP.className = 'newsletter-archive-date';
        dateP.textContent = formatNewsletterDate(item.dateISO);

        var actions = document.createElement('p');
        actions.className = 'newsletter-archive-actions';
        var a = document.createElement('a');
        a.href = item.article;
        a.className = 'newsletter-archive-readmore';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Read more >>>';
        actions.appendChild(a);

        body.appendChild(h);
        body.appendChild(dateP);
        body.appendChild(actions);

        row.appendChild(thumbWrap);
        row.appendChild(body);
        listEl.appendChild(row);
      });
    }

    function renderPager() {
      pagerEl.innerHTML = '';
      if (totalPages <= 1) {
        pagerEl.hidden = true;
        pagerEl.setAttribute('aria-hidden', 'true');
        return;
      }
      pagerEl.hidden = false;
      pagerEl.removeAttribute('aria-hidden');

      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'btn btn-outline newsletter-pager-btn';
      prev.textContent = 'Previous';
      prev.disabled = currentPage <= 1;
      prev.setAttribute('aria-label', 'Previous page');
      prev.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          renderList();
          renderPager();
          listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      var status = document.createElement('span');
      status.className = 'newsletter-pager-status';
      status.setAttribute('aria-live', 'polite');
      status.textContent = 'Page ' + currentPage + ' of ' + totalPages;

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'btn btn-outline newsletter-pager-btn';
      next.textContent = 'Next';
      next.disabled = currentPage >= totalPages;
      next.setAttribute('aria-label', 'Next page');
      next.addEventListener('click', function () {
        if (currentPage < totalPages) {
          currentPage++;
          renderList();
          renderPager();
          listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      pagerEl.appendChild(prev);
      pagerEl.appendChild(status);
      pagerEl.appendChild(next);
    }

    renderList();
    renderPager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewslettersArchive);
  } else {
    initNewslettersArchive();
  }
})();
