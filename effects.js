/* ============================================================
   MARCOS GARCÍA VAQUERO — effects.js
   Scroll progress, mobile-menu cascade and photo lightbox.
   Pure enhancement: the site works without it.
   ============================================================ */
(function () {
  /* 1. Thin brass progress bar */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  }
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* 2. Mobile menu: links cascade in */
  document.querySelectorAll('#nav a').forEach(function (a, i) { a.style.setProperty('--n', i); });

  /* 3. Lightbox for every .gallery */
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery a'));
  if (!links.length) return;
  var es = (document.documentElement.lang || '').indexOf('es') === 0;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML =
    '<img alt="" referrerpolicy="no-referrer">' +
    '<button class="lb-close" type="button" aria-label="' + (es ? 'Cerrar' : 'Close') + '">×</button>' +
    '<button class="lb-prev" type="button" aria-label="' + (es ? 'Anterior' : 'Previous') + '">‹</button>' +
    '<button class="lb-next" type="button" aria-label="' + (es ? 'Siguiente' : 'Next') + '">›</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img');
  var current = 0;

  function show(i) {
    current = (i + links.length) % links.length;
    img.src = links[current].getAttribute('href');
    img.alt = links[current].querySelector('img').alt;
  }
  function open(i) { show(i); box.classList.add('is-open'); document.body.classList.add('menu-open'); box.querySelector('.lb-close').focus(); }
  function close() { box.classList.remove('is-open'); document.body.classList.remove('menu-open'); links[current].focus(); }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
