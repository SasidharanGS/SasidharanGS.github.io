(function () {
  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  function getStored() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function apply(mode) {
    if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
    } else if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function save(mode) {
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }

  function currentMode() {
    return getStored() || 'system';
  }

  function updateButtons() {
    var mode = currentMode();
    document.querySelectorAll('.theme-toggle button, .mobile-nav button[data-theme]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === mode);
    });
  }

  apply(currentMode());

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle button, .mobile-nav button[data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.theme;
        save(mode);
        apply(mode);
        updateButtons();
      });
    });
    updateButtons();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (currentMode() === 'system') apply('system');
  });
})();
