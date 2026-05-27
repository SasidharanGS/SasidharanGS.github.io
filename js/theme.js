(function () {
  var KEY  = 'theme';
  var root = document.documentElement;

  function current() { return localStorage.getItem(KEY) || 'system'; }

  function apply(mode) {
    if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
    else root.removeAttribute('data-theme');
  }

  function syncButtons() {
    var mode = current();
    document.querySelectorAll('button[data-theme]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === mode);
    });
  }

  apply(current());

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('button[data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.theme;
        if (mode === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, mode);
        apply(mode);
        syncButtons();
      });
    });
    syncButtons();
  });
})();
