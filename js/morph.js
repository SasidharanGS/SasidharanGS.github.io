(function () {
  var SENTENCE = 'Software is ideas.\nIdeas should be free,\nfor the good of the world.';
  var CHARS = 'abcdefghijklmnopqrstuvwxyz.,!?;:';
  var FREEZE_RADIUS = 60;
  var FLICKER_RATE = 80;

  // 5-wide x 7-tall pixel font (each char is array of 7 rows, each row is 5 bits as number)
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

  var CELL = 9;   // px per sub-character cell
  var GAP = 2;    // px gap between letters
  var LINE_GAP = 6; // extra px between lines

  var container = document.querySelector('.hero__text');
  if (!container) return;
  container.innerHTML = '';
  container.style.minHeight = '';
  container.style.whiteSpace = 'normal';

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  canvas.style.cursor = 'crosshair';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var mouseX = -9999, mouseY = -9999;

  // Build cell list: {x, y, char, frozen}
  var cells = [];

  function randChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function getFont(ch) {
    return FONT[ch] || FONT[' '];
  }

  function buildCells() {
    cells = [];
    var lines = SENTENCE.split('\n');
    var totalWidth = 0;

    // Compute line widths
    var lineWidths = lines.map(function(line) {
      var w = 0;
      for (var i = 0; i < line.length; i++) {
        w += 5 * CELL + GAP;
      }
      return w - GAP;
    });

    totalWidth = Math.max.apply(null, lineWidths);
    var totalHeight = lines.length * (7 * CELL + LINE_GAP) - LINE_GAP;

    canvas.width = totalWidth;
    canvas.height = totalHeight;
    canvas.style.width = totalWidth + 'px';
    canvas.style.height = totalHeight + 'px';

    var lineY = 0;
    lines.forEach(function(line) {
      var lineX = 0;
      for (var ci = 0; ci < line.length; ci++) {
        var ch = line[ci];
        var bitmap = getFont(ch);
        for (var row = 0; row < 7; row++) {
          var bits = bitmap[row];
          for (var col = 0; col < 5; col++) {
            var bit = (bits >> (4 - col)) & 1;
            if (bit) {
              cells.push({
                x: lineX + col * CELL,
                y: lineY + row * CELL,
                current: randChar(),
                frozen: false
              });
            }
          }
        }
        lineX += 5 * CELL + GAP;
      }
      lineY += 7 * CELL + LINE_GAP;
    });
  }

  function getThemeColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#181818';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = (CELL - 1) + 'px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = getThemeColor();
    for (var i = 0; i < cells.length; i++) {
      ctx.fillText(cells[i].current, cells[i].x, cells[i].y);
    }
  }

  function flicker() {
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].frozen) {
        cells[i].current = randChar();
      }
    }
    draw();
  }

  function updateFrozen() {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var mx = (mouseX - rect.left) * scaleX;
    var my = (mouseY - rect.top) * scaleY;
    var r = FREEZE_RADIUS * scaleX;
    for (var i = 0; i < cells.length; i++) {
      var cx = cells[i].x + CELL / 2;
      var cy = cells[i].y + CELL / 2;
      var dist = Math.sqrt((cx - mx) * (cx - mx) + (cy - my) * (cy - my));
      cells[i].frozen = dist < r;
    }
  }

  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateFrozen();
  });

  window.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
    for (var i = 0; i < cells.length; i++) cells[i].frozen = false;
  });

  // Observe theme changes and redraw
  var observer = new MutationObserver(draw);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  buildCells();
  draw();
  setInterval(flicker, FLICKER_RATE);
})();
