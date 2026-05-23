(function () {
  const links = document.querySelectorAll('.sidebar nav a[href^="#"]');
  const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href')));

  function onScroll() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach(s => { if (s && s.offsetTop <= scrollY) current = s; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current?.id);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
