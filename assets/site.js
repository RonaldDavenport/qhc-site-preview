(function () {
  'use strict';

  // Navigation: dropdown panels and the mobile drawer.
  var nav = document.getElementById('site-nav');
  var menuButton = document.getElementById('menu-button');
  var toggles = [].slice.call(document.querySelectorAll('.nav-toggle'));

  function closePanels(except) {
    toggles.forEach(function (toggle) {
      if (toggle === except) return;
      toggle.setAttribute('aria-expanded', 'false');
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = true;
    });
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      closePanels(toggle);
      toggle.setAttribute('aria-expanded', String(!open));
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = open;
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-nav') && !event.target.closest('#menu-button')) closePanels();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closePanels();
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      if (!open) closePanels();
    });
  }

  // Reviews: render the full Google review set into the scroll row.
  var track = document.getElementById('review-track');
  var data = document.getElementById('review-data');
  if (track && data) {
    var star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.7 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/></svg>';
    track.innerHTML = '';
    JSON.parse(data.textContent).forEach(function (review) {
      var card = document.createElement('figure');
      card.className = 'review';
      var stars = document.createElement('div');
      stars.className = 'review-stars';
      stars.setAttribute('aria-label', '5 out of 5 stars');
      stars.innerHTML = star.repeat(5);
      var quote = document.createElement('blockquote');
      var text = document.createElement('p');
      text.className = 'review-text';
      text.textContent = review.text ? '“' + review.text + '”' : '5-star rating';
      quote.appendChild(text);
      var caption = document.createElement('figcaption');
      var photo = document.createElement('img');
      photo.className = 'reviewer-photo';
      photo.src = review.photo;
      photo.alt = review.name;
      photo.loading = 'lazy';
      var meta = document.createElement('span');
      meta.className = 'reviewer-meta';
      var name = document.createElement('span');
      name.className = 'review-name';
      name.textContent = review.name;
      var source = document.createElement('span');
      source.className = 'review-source';
      source.textContent = 'Google review · ' + review.age;
      meta.appendChild(name);
      meta.appendChild(source);
      caption.appendChild(photo);
      caption.appendChild(meta);
      card.appendChild(stars);
      card.appendChild(quote);
      card.appendChild(caption);
      track.appendChild(card);
    });
  }

  // Mobile action bar: show it only while the main call-to-action buttons are off screen.
  var bar = document.getElementById('mobile-bar');
  if (bar && 'IntersectionObserver' in window) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      bar.hidden = Object.keys(visible).some(function (id) { return visible[id]; });
    });
    ['hero-actions', 'why-actions', 'request', 'final-cta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
