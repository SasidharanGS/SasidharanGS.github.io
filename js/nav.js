(function () {
  var sidebarLinks = document.querySelectorAll('.sidebar nav a[href^="#"]');
  var mobileLinks  = document.querySelectorAll('.mobile-nav a[href^="#"]');
  var allLinks     = Array.from(sidebarLinks).concat(Array.from(mobileLinks));
  var sections     = allLinks
    .map(function(l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function onScroll() {
    var scrollY  = window.scrollY + window.innerHeight * 0.35;
    var current  = sections[0];
    sections.forEach(function(s) { if (s.offsetTop <= scrollY) current = s; });
    allLinks.forEach(function(l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
