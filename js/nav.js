(function () {
  var sidebarLinks = document.querySelectorAll('.sidebar nav a[href^="#"]');
  var mobileLinks  = document.querySelectorAll('.mobile-nav a[href^="#"]');
  var allLinks     = Array.from(sidebarLinks).concat(Array.from(mobileLinks));
  var sections     = allLinks
    .map(function(l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    var current;
    // The last section can be too short to scroll to the top of the viewport, so
    // when we've hit the bottom of the page, it wins outright.
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      current = sections[sections.length - 1];
    } else {
      var scrollY = window.scrollY + window.innerHeight * 0.35;
      current = sections[0];
      sections.forEach(function(s) { if (s.offsetTop <= scrollY) current = s; });
    }
    allLinks.forEach(function(l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
