(function () {
  var SENTENCE     = 'software is IDEAS.\nideas should be FREE,\nfor a BETTER world.';
  var CHARS        = 'abcdefghijklmnopqrstuvwxyz.,!?;:';
  var ACCENT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var ACCENT_WORDS = ['IDEAS', 'FREE', 'BETTER'];

  var CELL               = 11;
  var SUBCELLS           = 2;
  var GAP                = 5;
  var LINE_GAP           = 18;
  var FREEZE_RADIUS      = 90;
  var FLICKER_RATE       = 400;
  var ACCENT_FLICKER_RATE = 800;

  var FONT = {
    'A': [0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
    'B': [0b11110,0b10001,0b10001,0b11110,0b10001,0b10001,0b11110],
    'C': [0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
    'D': [0b11100,0b10010,0b10001,0b10001,0b10001,0b10010,0b11100],
    'E': [0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b11111],
    'F': [0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b10000],
    'G': [0b01110,0b10001,0b10000,0b10111,0b10001,0b10001,0b01110],
    'H': [0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
    'I': [0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
    'J': [0b00111,0b00010,0b00010,0b00010,0b00010,0b10010,0b01100],
    'K': [0b10001,0b10010,0b10100,0b11000,0b10100,0b10010,0b10001],
    'L': [0b10000,0b10000,0b10000,0b10000,0b10000,0b10000,0b11111],
    'M': [0b10001,0b11011,0b10101,0b10001,0b10001,0b10001,0b10001],
    'N': [0b10001,0b11001,0b10101,0b10011,0b10001,0b10001,0b10001],
    'O': [0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
    'P': [0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
    'Q': [0b01110,0b10001,0b10001,0b10001,0b10101,0b10010,0b01101],
    'R': [0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
    'S': [0b01111,0b10000,0b10000,0b01110,0b00001,0b00001,0b11110],
    'T': [0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
    'U': [0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
    'V': [0b10001,0b10001,0b10001,0b10001,0b01010,0b01010,0b00100],
    'W': [0b10001,0b10001,0b10001,0b10101,0b10101,0b11011,0b10001],
    'X': [0b10001,0b01010,0b00100,0b00100,0b00100,0b01010,0b10001],
    'Y': [0b10001,0b10001,0b01010,0b00100,0b00100,0b00100,0b00100],
    'Z': [0b11111,0b00001,0b00010,0b00100,0b01000,0b10000,0b11111],
    'a': [0b00000,0b00000,0b01110,0b00001,0b01111,0b10001,0b01111],
    'b': [0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b11110],
    'c': [0b00000,0b00000,0b01110,0b10000,0b10000,0b10001,0b01110],
    'd': [0b00001,0b00001,0b01111,0b10001,0b10001,0b10001,0b01111],
    'e': [0b00000,0b00000,0b01110,0b10001,0b11111,0b10000,0b01110],
    'f': [0b00110,0b01001,0b01000,0b11110,0b01000,0b01000,0b01000],
    'g': [0b00000,0b01111,0b10001,0b10001,0b01111,0b00001,0b01110],
    'h': [0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b10001],
    'i': [0b00100,0b00000,0b00100,0b00100,0b00100,0b00100,0b00110],
    'j': [0b00010,0b00000,0b00010,0b00010,0b00010,0b10010,0b01100],
    'k': [0b10000,0b10000,0b10010,0b10100,0b11000,0b10100,0b10010],
    'l': [0b01100,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
    'm': [0b00000,0b00000,0b11010,0b10101,0b10101,0b10001,0b10001],
    'n': [0b00000,0b00000,0b11110,0b10001,0b10001,0b10001,0b10001],
    'o': [0b00000,0b00000,0b01110,0b10001,0b10001,0b10001,0b01110],
    'p': [0b00000,0b11110,0b10001,0b10001,0b11110,0b10000,0b10000],
    'q': [0b00000,0b01111,0b10001,0b10001,0b01111,0b00001,0b00001],
    'r': [0b00000,0b00000,0b10110,0b11001,0b10000,0b10000,0b10000],
    's': [0b00000,0b00000,0b01110,0b10000,0b01110,0b00001,0b11110],
    't': [0b01000,0b01000,0b11110,0b01000,0b01000,0b01001,0b00110],
    'u': [0b00000,0b00000,0b10001,0b10001,0b10001,0b10011,0b01101],
    'v': [0b00000,0b00000,0b10001,0b10001,0b10001,0b01010,0b00100],
    'w': [0b00000,0b00000,0b10001,0b10001,0b10101,0b11011,0b10001],
    'x': [0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001],
    'y': [0b00000,0b10001,0b10001,0b01111,0b00001,0b00001,0b01110],
    'z': [0b00000,0b00000,0b11111,0b00010,0b00100,0b01000,0b11111],
    '.': [0b00000,0b00000,0b00000,0b00000,0b00000,0b01100,0b01100],
    ',': [0b00000,0b00000,0b00000,0b00000,0b01100,0b01100,0b01000],
    '!': [0b00100,0b00100,0b00100,0b00100,0b00000,0b00100,0b00100],
    '?': [0b01110,0b10001,0b00010,0b00100,0b00100,0b00000,0b00100],
    ' ': [0b00000,0b00000,0b00000,0b00000,0b00000,0b00000,0b00000]
  };

  var container = document.querySelector('.hero__text');
  if (!container) return;
  container.innerHTML = '';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var mouseX = -9999, mouseY = -9999;
  var cells  = [];
  var cachedRect   = null;
  var cachedFg     = '';
  var cachedAccent = '';
  var fontStr      = '';

  function randChar()       { return CHARS[Math.floor(Math.random() * CHARS.length)]; }
  function randAccentChar() { return ACCENT_CHARS[Math.floor(Math.random() * ACCENT_CHARS.length)]; }

  function getFg() {
    if (!cachedFg) cachedFg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#181818';
    return cachedFg;
  }

  function getAccent() {
    if (!cachedAccent) cachedAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#a23c2e';
    return cachedAccent;
  }

  function buildCells() {
    cells = [];
    cachedRect = null;
    cachedFg     = '';
    cachedAccent = '';

    var lines       = SENTENCE.split('\n');
    var longestLine = lines.reduce(function(a, b) { return a.length > b.length ? a : b; });
    var charCount   = longestLine.length;
    var containerWidth = container.getBoundingClientRect().width || 600;

    var cell = CELL, sc = SUBCELLS;
    outer: for (sc = SUBCELLS; sc >= 1; sc--) {
      for (cell = CELL; cell >= 2; cell--) {
        var g = Math.max(1, Math.round(GAP * cell / CELL));
        if (charCount * (5 * sc * cell + g) - g <= containerWidth) break outer;
      }
    }

    var gap     = Math.max(1, Math.round(GAP      * cell / CELL));
    var lineGap = Math.max(1, Math.round(LINE_GAP * cell / CELL));
    var letterW = 5 * sc * cell;
    var letterH = 7 * sc * cell;

    var totalW = Math.max.apply(null, lines.map(function(l) { return l.length * (letterW + gap) - gap; }));
    var totalH = lines.length * (letterH + lineGap) - lineGap;

    canvas.width  = totalW;
    canvas.height = totalH;
    canvas.style.width  = totalW + 'px';
    canvas.style.height = totalH + 'px';

    canvas._cell   = cell;
    canvas._freeze = FREEZE_RADIUS * (cell / CELL);

    fontStr = cell + 'px monospace';

    var lineY = 0;
    lines.forEach(function(line) {
      var accent = {};
      ACCENT_WORDS.forEach(function(w) {
        var i = line.indexOf(w);
        while (i !== -1) { for (var k = 0; k < w.length; k++) accent[i + k] = true; i = line.indexOf(w, i + 1); }
      });

      var lineX = 0;
      for (var ci = 0; ci < line.length; ci++) {
        var bitmap   = FONT[line[ci]] || FONT[' '];
        var isAccent = !!accent[ci];
        var isRed    = isAccent && Math.random() < (1 / 3);   // only ~1/3 of the capital letters are red
        for (var row = 0; row < 7; row++) {
          var bits = bitmap[row];
          for (var col = 0; col < 5; col++) {
            if ((bits >> (4 - col)) & 1) {
              for (var sr = 0; sr < sc; sr++) {
                for (var sc2 = 0; sc2 < sc; sc2++) {
                  cells.push({
                    x: lineX + (col * sc + sc2) * cell,
                    y: lineY + (row * sc + sr)  * cell,
                    current: isAccent ? randAccentChar() : randChar(),
                    accent: isAccent,
                    red: isRed,
                    frozen: false
                  });
                }
              }
            }
          }
        }
        lineX += letterW + gap;
      }
      lineY += letterH + lineGap;
    });

    for (var i = 0; i < cells.length; i++) scheduleCell(cells[i]);
  }

  function computeAlpha(cell, mx, my, r) {
    if (cell.accent) return 1.0;
    var half = canvas._cell / 2;
    var dx = cell.x + half - mx;
    var dy = cell.y + half - my;
    return (dx * dx + dy * dy) < r * r ? 1.0 : 0.4;
  }

  function draw() {
    if (!cachedRect) cachedRect = canvas.getBoundingClientRect();
    var mx = mouseX - cachedRect.left;
    var my = mouseY - cachedRect.top;
    var r  = canvas._freeze;
    var fg     = getFg();
    var accent = getAccent();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font         = fontStr;
    ctx.textBaseline = 'top';

    var lastColor = '';
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var a = computeAlpha(cell, mx, my, r);
      if (ctx.globalAlpha !== a) ctx.globalAlpha = a;
      var color = cell.red ? accent : fg;             // ~1/3 of the capital letters in the accent
      if (color !== lastColor) { ctx.fillStyle = color; lastColor = color; }
      ctx.fillText(cell.current, cell.x, cell.y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  function updateFrozen() {
    if (!cachedRect) return;
    var mx   = mouseX - cachedRect.left;
    var my   = mouseY - cachedRect.top;
    var r    = canvas._freeze;
    var half = canvas._cell / 2;
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].accent) { cells[i].frozen = false; continue; }
      var dx = cells[i].x + half - mx;
      var dy = cells[i].y + half - my;
      cells[i].frozen = (dx * dx + dy * dy) < r * r;
    }
  }

  function scheduleCell(cell) {
    setTimeout(function tick() {
      cell.current = cell.accent ? randAccentChar() : randChar();
      // red twinkle: on each flicker tick, re-roll whether this capital cell is
      // red — keeps ~1/3 of the constituent cells red at any instant.
      if (cell.accent) cell.red = Math.random() < (1 / 3);
      setTimeout(tick, (cell.accent || cell.frozen) ? ACCENT_FLICKER_RATE : FLICKER_RATE);
    }, Math.random() * FLICKER_RATE);
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      cachedRect = null;
      cachedFg   = '';
      buildCells();
    }, 150);
  }

  buildCells();
  draw();

  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateFrozen();
  });

  document.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
    updateFrozen();
  });

  window.addEventListener('resize', onResize);

  new MutationObserver(function() { cachedFg = ''; cachedAccent = ''; })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function() { cachedFg = ''; cachedAccent = ''; });
})();
