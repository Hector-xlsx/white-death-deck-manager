(function (root) {
  'use strict';
  let serial = 0;
  const THEMES = {
    dragon: {
      label: 'Dragón', file: 'dragon.png', width: 1984, height: 793,
      box: { x: 1020, y: 178, width: 815, height: 305 },
      glyphStyle: 'angular', tracking: -12,
      palette: {
        top: '#fff2b6', upper: '#ffe08c', middle: '#f0b64f',
        lower: '#d88e29', bottom: '#f6c667',
        outer: '#170803', rim: '#c77920', highlight: '#fff1bb', depth: '#56230a',
      },
    },
    cabeza: {
      label: 'Cabeza', file: 'cabeza.png', width: 1947, height: 808,
      box: { x: 600, y: 424, width: 745, height: 218 },
      glyphStyle: 'block', tracking: -18,
      palette: {
        top: '#fff3c4', upper: '#ffe5a1', middle: '#f2c15f',
        lower: '#d99b38', bottom: '#f3cb76',
        outer: '#160802', rim: '#a96320', highlight: '#fff1c5', depth: '#623008',
      },
    },
    kang: {
      label: 'Kang', file: 'kang.png', width: 1984, height: 793,
      box: { x: 865, y: 354, width: 930, height: 300 },
      glyphStyle: 'medieval', tracking: -18,
      palette: {
        top: '#48200c', upper: '#311105', middle: '#1c0802',
        lower: '#260b02', bottom: '#431a06',
        outer: '#6e3a1a', rim: '#e2a84c', highlight: '#fff0b5', depth: '#693b1e',
      },
    },
  };
  function getTheme(key) {
    if (!Object.prototype.hasOwnProperty.call(THEMES, key)) throw new RangeError('Tema desconocido: ' + key);
    return THEMES[key];
  }
  function scoreText(value, showPlus) {
    if (typeof value === 'number') {
      if (!Number.isSafeInteger(value)) throw new TypeError('El puntaje debe ser un entero seguro.');
      return (showPlus && value >= 0 ? '+' : '') + String(value);
    }
    if (typeof value !== 'string' || !/^[+-]?\d{1,16}$/.test(value)) {
      throw new TypeError('Puntaje inválido: usa un entero o una cadena de hasta 16 cifras.');
    }
    return showPlus && !/^[+-]/.test(value) ? '+' + value : value;
  }
  function round(v) { return Math.round(v * 10000) / 10000; }
  function pathsFor(theme, value, showPlus) {
    if (!root.ScoreCounterGlyphs) throw new Error('Carga digits.js antes de score-counter.js.');
    const text = scoreText(value, showPlus);
    const glyphs = root.ScoreCounterGlyphs[theme.glyphStyle].glyphs;
    let cursor = 0, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const paths = [];
    for (const ch of text) {
      const glyph = glyphs[ch];
      if (!glyph) throw new TypeError('Carácter no soportado: ' + ch);
      paths.push('<path d="' + glyph.path + '" transform="translate(' + round(cursor) + ' 0)"/>');
      minX = Math.min(minX, cursor + glyph.bounds[0]); minY = Math.min(minY, glyph.bounds[1]);
      maxX = Math.max(maxX, cursor + glyph.bounds[2]); maxY = Math.max(maxY, glyph.bounds[3]);
      cursor += glyph.advance + theme.tracking;
    }
    // Includes stroke, bevel and extrusion, not just the face of the glyphs.
    const pad = 65;
    const box = theme.box;
    const scale = Math.min(box.width / (maxX - minX + 2 * pad), box.height / (maxY - minY + 2 * pad));
    const tx = box.x + box.width / 2 - (minX + maxX) * scale / 2;
    const ty = box.y + box.height / 2 - (minY + maxY) * scale / 2;
    return { text, paths: paths.join(''), transform: 'translate(' + round(tx) + ' ' + round(ty) + ') scale(' + round(scale) + ')' };
  }
  function renderScoreSvg(key, value, options) {
    const theme = getTheme(key), opt = options || {}, p = theme.palette;
    const shaped = pathsFor(theme, value, Boolean(opt.showPlus));
    const id = 'score-' + (++serial);
    const defs = '<defs>' +
      '<g id="' + id + '-shape">' + shaped.paths + '</g>' +
      '<linearGradient id="' + id + '-gold" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">' +
      '<stop offset="0" stop-color="' + p.top + '"/><stop offset=".22" stop-color="' + p.upper + '"/>' +
      '<stop offset=".52" stop-color="' + p.middle + '"/><stop offset=".83" stop-color="' + p.lower + '"/>' +
      '<stop offset="1" stop-color="' + p.bottom + '"/></linearGradient>' +
      '<filter id="' + id + '-grain" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".075" numOctaves="2" seed="7" result="raw"/>' +
      '<feColorMatrix in="raw" type="saturate" values="0" result="mono"/>' +
      '<feComposite in="mono" in2="SourceGraphic" operator="in" result="grain"/>' +
      '<feBlend in="SourceGraphic" in2="grain" mode="soft-light"/></filter></defs>';
    const use = (attrs) => '<use href="#' + id + '-shape" xlink:href="#' + id + '-shape" ' + attrs + '/>';
    const layers = use('transform="translate(12 23)" fill="' + p.depth + '" stroke="' + p.outer + '" stroke-width="94"') +
      use('fill="' + p.outer + '" stroke="' + p.outer + '" stroke-width="94"') +
      use('fill="' + p.rim + '" stroke="' + p.rim + '" stroke-width="65"') +
      use('fill="' + p.highlight + '" stroke="' + p.highlight + '" stroke-width="34"') +
      use('fill="url(#' + id + '-gold)" stroke="' + (key === 'kang' ? '#6f3618' : '#aa6420') + '" stroke-width="12" filter="url(#' + id + '-grain)"');
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="score-counter__digits" viewBox="0 0 ' + theme.width + ' ' + theme.height + '" aria-hidden="true" focusable="false">' +
      defs + '<g data-score="' + shaped.text + '" transform="' + shaped.transform + '" stroke-linejoin="round">' + layers + '</g></svg>';
  }
  function create(container, options) {
    const opt = Object.assign({ theme: 'kang', value: 0, showPlus: false, assetBase: './assets/' }, options || {});
    getTheme(opt.theme); scoreText(opt.value, opt.showPlus);
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'score-counter';
    if (opt.width) button.style.setProperty('--score-width', typeof opt.width === 'number' ? opt.width + 'px' : opt.width);
    const image = document.createElement('img');
    image.className = 'score-counter__base'; image.alt = ''; image.draggable = false;
    button.appendChild(image);
    let overlay = null;
    function draw() {
      const theme = getTheme(opt.theme);
      button.dataset.theme = opt.theme;
      button.setAttribute('aria-label', 'Puntaje: ' + scoreText(opt.value, opt.showPlus));
      image.src = opt.assetBase.replace(/\/?$/, '/') + theme.file;
      image.width = theme.width; image.height = theme.height;
      const holder = document.createElement('div');
      holder.innerHTML = renderScoreSvg(opt.theme, opt.value, { showPlus: opt.showPlus });
      if (overlay) overlay.remove();
      overlay = holder.firstElementChild; button.appendChild(overlay);
    }
    if (typeof opt.onClick === 'function') button.addEventListener('click', opt.onClick);
    draw(); container.appendChild(button);
    return {
      element: button,
      setValue(value) { scoreText(value, opt.showPlus); opt.value = value; draw(); },
      setTheme(theme) { getTheme(theme); opt.theme = theme; draw(); },
      setShowPlus(show) { opt.showPlus = Boolean(show); draw(); },
      destroy() { button.remove(); },
    };
  }
  root.ScoreCounter = { create, renderScoreSvg, themes: THEMES, format: scoreText };
})(typeof window !== 'undefined' ? window : globalThis);
