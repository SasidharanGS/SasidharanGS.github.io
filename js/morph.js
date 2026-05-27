(function () {
  var SENTENCE = 'software is IDEAS.\nideas should be FREE,\nfor a BETTER world.';
  var CHARS = 'abcdefghijklmnopqrstuvwxyz.,!?;:';
  var ACCENT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var ACCENT_WORDS = ['IDEAS', 'FREE', 'BETTER'];

  var CELL = 11;
  var SUBCELLS = 2;
  var GAP = 5;
  var LINE_GAP = 5;
  var FREEZE_RADIUS = 90;
  var FLICKER_RATE = 400;
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
  container.style.minHeight = '';
  container.style.whiteSpace = 'normal';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.cursor = 'default';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var mouseX = -9999, mouseY = -9999;
  var cells = [];

  function randChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function randAccentChar() {
    return ACCENT_CHARS[Math.floor(Math.random() * ACCENT_CHARS.length)];
  }

  function getFgColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#181818';
  }

  function buildCells() {
    cells = [];
    var lines = SENTENCE.split('\n');
    var longestLine = lines.reduce(function(a, b) { return a.length > b.length ? a : b; });
    var charCount = longestLine.length;
    var containerWidth = container.getBoundingClientRect().width || 600;

    // Find the best (sc, cell) that fits containerWidth — try SUBCELLS down to 1
    var cell = CELL, sc = SUBCELLS;
    outer: for (sc = SUBCELLS; sc >= 1; sc--) {
      for (cell = CELL; cell >= 2; cell--) {
        var g = Math.max(1, Math.round(GAP * cell / CELL));
        var w = charCount * (5 * sc * cell + g) - g;
        if (w <= containerWidth) break outer;
      }
    }
    cell = Math.max(2, cell);

    var gap     = Math.max(1, Math.round(GAP * cell / CELL));
    var lineGap = Math.max(1, Math.round(LINE_GAP * cell / CELL));
    var letterW = 5 * sc * cell;
    var letterH = 7 * sc * cell;

    var totalWidth = Math.max.apply(null, lines.map(function(l) {
      return l.length * (letterW + gap) - gap;
    }));
    var totalHeight = lines.length * (letterH + lineGap) - lineGap;

    canvas.width  = totalWidth;
    canvas.height = totalHeight;
    canvas.style.width  = totalWidth + 'px';
    canvas.style.height = totalHeight + 'px';
    canvas._cellSize     = cell;
    canvas._freezeRadius = FREEZE_RADIUS * (cell / CELL);

    var lineY = 0;
    lines.forEach(function(line) {
      var accentIndices = {};
      ACCENT_WORDS.forEach(function(word) {
        var idx = line.indexOf(word);
        while (idx !== -1) {
          for (var k = 0; k < word.length; k++) accentIndices[idx + k] = true;
          idx = line.indexOf(word, idx + 1);
        }
      });

      var lineX = 0;
      for (var ci = 0; ci < line.length; ci++) {
        var ch = line[ci];
        var bitmap = FONT[ch] || FONT[' '];
        var isAccent = !!accentIndices[ci];
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
  }

  function computeAlpha(cell, mx, my, r) {
    if (cell.accent) return 1.0;
    if (mouseX === -9999) return 0.7;
    var half = canvas._cellSize / 2;
    var cx = cell.x + half;
    var cy = cell.y + half;
    var dist = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my));
    return dist < r ? 1.0 : 0.25;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = canvas._cellSize + 'px monospace';
    ctx.textBaseline = 'top';
    var fg = getFgColor();
    var rect = canvas.getBoundingClientRect();
    var mx = mouseX - rect.left;
    var my = mouseY - rect.top;
    var r  = canvas._freezeRadius;
    for (var i = 0; i < cells.length; i++) {
      ctx.globalAlpha = computeAlpha(cells[i], mx, my, r);
      ctx.fillStyle = fg;
      ctx.fillText(cells[i].current, cells[i].x, cells[i].y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  function updateFrozen() {
    var rect = canvas.getBoundingClientRect();
    var mx   = mouseX - rect.left;
    var my   = mouseY - rect.top;
    var r    = canvas._freezeRadius;
    var half = canvas._cellSize / 2;
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].accent || mouseX === -9999) { cells[i].frozen = false; continue; }
      var cx = cells[i].x + half;
      var cy = cells[i].y + half;
      cells[i].frozen = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my)) < r;
    }
  }

  function scheduleCell(cell) {
    var rate = (cell.accent || cell.frozen) ? ACCENT_FLICKER_RATE : FLICKER_RATE;
    setTimeout(function tick() {
      cell.current = cell.accent ? randAccentChar() : randChar();
      var nextRate = (cell.accent || cell.frozen) ? ACCENT_FLICKER_RATE : FLICKER_RATE;
      setTimeout(tick, nextRate);
    }, Math.random() * rate);
  }

  buildCells();
  draw();
  for (var i = 0; i < cells.length; i++) scheduleCell(cells[i]);

  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateFrozen();
  });

  window.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
    updateFrozen();
  });

  window.addEventListener('resize', function() {
    buildCells();
  });
})();
