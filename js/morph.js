(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
  const FINAL = 'Software is ideas. Ideas should be free, for the good of the world.';
  const DURATION = 2200;
  const STAGGER = 38;

  const el = document.querySelector('.hero__text');
  if (!el) return;

  const total = FINAL.length;
  const resolved = new Array(total).fill(false);
  const start = performance.now();

  function rand(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function tick(now) {
    const elapsed = now - start;
    let output = '';
    let allDone = true;

    for (let i = 0; i < total; i++) {
      const charDelay = i * STAGGER;
      if (elapsed < charDelay) {
        output += rand(CHARS);
        allDone = false;
      } else if (!resolved[i]) {
        const charElapsed = elapsed - charDelay;
        const charDuration = DURATION * (0.4 + Math.random() * 0.3);
        if (charElapsed >= charDuration || FINAL[i] === ' ') {
          resolved[i] = true;
          output += FINAL[i];
        } else {
          output += rand(CHARS);
          allDone = false;
        }
      } else {
        output += FINAL[i];
      }
    }

    el.textContent = output;
    if (!allDone) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
