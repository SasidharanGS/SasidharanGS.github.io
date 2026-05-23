(function () {
  var SENTENCE = 'Software is ideas. Ideas should be free, for the good of the world.';
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var WORD_DURATION = 420;
  var GHOST_COUNT = 3;
  var WORD_GAP = 320;

  var container = document.querySelector('.hero__text');
  if (!container) return;

  var words = SENTENCE.split(' ');
  var spans = [];

  container.innerHTML = '';
  words.forEach(function (word, i) {
    var span = document.createElement('span');
    span.className = 'hw';
    span.textContent = scramble(word);
    span.style.opacity = '0';
    container.appendChild(span);
    if (i < words.length - 1) container.appendChild(document.createTextNode(' '));
    spans.push({ el: span, word: word, done: false });
  });

  function rand(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  function scramble(word) {
    var punctuation = '';
    var core = word;
    if (/[.,]$/.test(word)) {
      punctuation = word.slice(-1);
      core = word.slice(0, -1);
    }
    var out = '';
    for (var i = 0; i < core.length; i++) out += rand(CHARS);
    return out + punctuation;
  }

  function animateWord(entry, delay) {
    var el = entry.el;
    var finalWord = entry.word;
    var punctuation = '';
    var core = finalWord;
    if (/[.,]$/.test(finalWord)) {
      punctuation = finalWord.slice(-1);
      core = finalWord.slice(0, -1);
    }

    var ghostEls = [];
    var parent = el.parentNode;

    for (var g = 0; g < GHOST_COUNT; g++) {
      var ghost = document.createElement('span');
      ghost.className = 'hw-ghost';
      ghost.textContent = scramble(finalWord);
      ghost.style.cssText = [
        'position:absolute',
        'opacity:0',
        'transition:transform ' + WORD_DURATION + 'ms ease, opacity ' + WORD_DURATION + 'ms ease',
        'pointer-events:none',
        'white-space:nowrap'
      ].join(';');
      el.style.position = 'relative';
      el.appendChild(ghost);
      ghostEls.push(ghost);
    }

    setTimeout(function () {
      el.style.opacity = '1';
      el.style.transition = 'none';

      var rect = el.getBoundingClientRect();

      ghostEls.forEach(function (ghost, gi) {
        var angle = (gi / GHOST_COUNT) * Math.PI * 2;
        var dist = 18 + gi * 10;
        var ox = Math.round(Math.cos(angle) * dist);
        var oy = Math.round(Math.sin(angle) * dist);
        ghost.style.opacity = '0.35';
        ghost.style.transform = 'translate(' + ox + 'px, ' + oy + 'px)';
      });

      var scrambleInterval = setInterval(function () {
        ghostEls.forEach(function (ghost) {
          ghost.textContent = scramble(finalWord);
        });
        el.textContent = scramble(finalWord);
      }, 60);

      setTimeout(function () {
        ghostEls.forEach(function (ghost) {
          ghost.style.transform = 'translate(0,0)';
          ghost.style.opacity = '0';
        });

        var resolveStart = performance.now();
        var resolved = new Array(core.length).fill(false);

        function tick(now) {
          var elapsed = now - resolveStart;
          var out = '';
          var allDone = true;
          for (var i = 0; i < core.length; i++) {
            var charDelay = (i / core.length) * WORD_DURATION * 0.6;
            if (elapsed >= charDelay) {
              if (!resolved[i] && elapsed - charDelay >= WORD_DURATION * 0.4) {
                resolved[i] = true;
              }
              out += resolved[i] ? core[i] : rand(CHARS);
              if (!resolved[i]) allDone = false;
            } else {
              out += rand(CHARS);
              allDone = false;
            }
          }
          el.textContent = out + punctuation;
          if (!allDone) {
            requestAnimationFrame(tick);
          } else {
            clearInterval(scrambleInterval);
            el.textContent = finalWord;
            ghostEls.forEach(function (g) { g.remove(); });
            entry.done = true;
          }
        }

        clearInterval(scrambleInterval);
        requestAnimationFrame(tick);
      }, WORD_DURATION * 0.6);

    }, delay);
  }

  spans.forEach(function (entry, i) {
    animateWord(entry, i * WORD_GAP);
  });
})();
