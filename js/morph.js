(function () {
  var SENTENCE = 'software is IDEAS.\nideas should be FREE,\nfor a BETTER world.';
  var CHARS = 'abcdefghijklmnopqrstuvwxyz.,!?;:';
  var ACCENT_WORDS = ['IDEAS', 'FREE', 'BETTER'];

  var CELL = 7;
  var SUBCELLS = 2;
  var GAP = 4;
  var LINE_GAP = 4;
  var FREEZE_RADIUS = 90;
  var FLICKER_RATE = 60;

  var LETTER_W = 5 * SUBCELLS * CELL;
  var LETTER_H = 7 * SUBCELLS * CELL;

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

  function getFgColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#181818';
  }

  function buildCells() {
    cells = [];
    var lines = SENTENCE.split('\n');

    var lineWidths = lines.map(function (line) {
      return line.length * (LETTER_W + GAP) - GAP;
    });
    var totalWidth = Math.max.apply(null, lineWidths);
    var totalHeight = lines.length * (LETTER_H + LINE_GAP) - LINE_GAP;

    canvas.width = totalWidth;
    canvas.height = totalHeight;
    canvas.style.width = totalWidth + 'px';
    canvas.style.height = totalHeight + 'px';

    var lineY = 0;
    lines.forEach(function (line) {
      // Mark which character indices belong to accent words
      var accentIndices = {};
      ACCENT_WORDS.forEach(function (word) {
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
            var bit = (bits >> (4 - col)) & 1;
            if (bit) {
              for (var sr = 0; sr < SUBCELLS; sr++) {
                for (var sc = 0; sc < SUBCELLS; sc++) {
                  cells.push({
                    x: lineX + (col * SUBCELLS + sc) * CELL,
                    y: lineY + (row * SUBCELLS + sr) * CELL,
                    current: randChar(),
                    alpha: 1,
                    accent: isAccent,
                    frozen: false
                  });
                }
              }
            }
          }
        }
        lineX += LETTER_W + GAP;
      }
      lineY += LETTER_H + LINE_GAP;
    });
  }

  function updateAlphas() {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var mx = (mouseX - rect.left) * scaleX;
    var my = (mouseY - rect.top) * scaleX;
    var r = FREEZE_RADIUS * scaleX;
    var hasHover = mouseX !== -9999;

    for (var i = 0; i < cells.length; i++) {
      if (cells[i].accent) {
        cells[i].alpha = 1.0;
        cells[i].frozen = false;
        continue;
      }
      if (!hasHover) {
        cells[i].alpha = 0.7;
        cells[i].frozen = false;
      } else {
        var cx = cells[i].x + CELL / 2;
        var cy = cells[i].y + CELL / 2;
        var dist = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my));
        if (dist < r) {
          cells[i].alpha = 1.0;
          cells[i].frozen = true;
        } else {
          cells[i].alpha = 0.25;
          cells[i].frozen = false;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = (CELL - 1) + 'px monospace';
    ctx.textBaseline = 'top';
    var fg = getFgColor();
    for (var i = 0; i < cells.length; i++) {
      ctx.globalAlpha = cells[i].alpha;
      ctx.fillStyle = fg;
      ctx.fillText(cells[i].current, cells[i].x, cells[i].y);
    }
    ctx.globalAlpha = 1;
  }

  function flicker() {
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].frozen && !cells[i].accent) {
        cells[i].current = randChar();
      }
    }
    draw();
  }

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateAlphas();
  });

  window.addEventListener('mouseleave', function () {
    mouseX = -9999;
    mouseY = -9999;
    updateAlphas();
  });

  var observer = new MutationObserver(function () { updateAlphas(); draw(); });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  buildCells();
  updateAlphas();
  draw();
  setInterval(flicker, FLICKER_RATE);
})();
