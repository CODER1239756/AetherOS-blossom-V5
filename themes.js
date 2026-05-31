// =========================================================
//  AETHEROS BLOSSOM v5.0 — THEME ENGINE
//  5 presets + per-token CSS variable overrides
// =========================================================

window.THEMES = {
  blossom: {
    name: '🌸 Blossom', sub: 'Pink · White · Red',
    accent: '#ff6eb4', accent2: '#ff2d6b', bg: '#0d0007',
    surface: 'rgba(18,4,12,.97)', glass: 'rgba(255,110,180,.06)',
    border: 'rgba(255,110,180,.14)',
    text: 'rgba(255,235,245,.92)', textDim: 'rgba(255,180,210,.45)', textSub: 'rgba(255,210,230,.22)',
    wall: 'radial-gradient(ellipse at 20% 50%,rgba(200,0,60,.2) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(255,110,180,.1) 0%,transparent 50%),#100608',
  },
  midnight: {
    name: '🌙 Midnight Rose', sub: 'Deep crimson · Dark',
    accent: '#e8003d', accent2: '#8b0030', bg: '#060004',
    surface: 'rgba(10,2,7,.98)', glass: 'rgba(232,0,61,.06)',
    border: 'rgba(232,0,61,.14)',
    text: 'rgba(255,220,230,.9)', textDim: 'rgba(220,80,100,.5)', textSub: 'rgba(220,80,100,.25)',
    wall: 'radial-gradient(ellipse at 30% 60%,rgba(140,0,50,.25) 0%,transparent 55%),radial-gradient(ellipse at 70% 30%,rgba(80,0,30,.18) 0%,transparent 50%),#060004',
  },
  cherry: {
    name: '🍒 Cherry Blossom', sub: 'Pastel · Soft',
    accent: '#ffb3d1', accent2: '#ff6eb4', bg: '#160810',
    surface: 'rgba(22,8,16,.97)', glass: 'rgba(255,179,209,.06)',
    border: 'rgba(255,179,209,.14)',
    text: 'rgba(255,240,248,.92)', textDim: 'rgba(255,179,209,.5)', textSub: 'rgba(255,200,220,.22)',
    wall: 'radial-gradient(ellipse at 50% 40%,rgba(255,110,180,.18) 0%,transparent 55%),radial-gradient(ellipse at 20% 80%,rgba(200,80,120,.1) 0%,transparent 50%),#160810',
  },
  pearl: {
    name: '🤍 Pearl', sub: 'White · Rose Gold',
    accent: '#c0003a', accent2: '#ff2d6b', bg: '#f6eef2',
    surface: 'rgba(250,244,248,.97)', glass: 'rgba(192,0,58,.04)',
    border: 'rgba(192,0,58,.12)',
    text: 'rgba(30,0,10,.9)', textDim: 'rgba(160,0,50,.55)', textSub: 'rgba(160,0,50,.3)',
    wall: 'radial-gradient(ellipse at 30% 40%,rgba(255,110,180,.12) 0%,transparent 55%),radial-gradient(ellipse at 70% 70%,rgba(192,0,58,.07) 0%,transparent 50%),#f6eef2',
  },
  velvet: {
    name: '🥀 Velvet', sub: 'Crimson · Noir',
    accent: '#ff2d6b', accent2: '#c0003a', bg: '#08000a',
    surface: 'rgba(12,2,8,.98)', glass: 'rgba(255,45,107,.06)',
    border: 'rgba(192,0,58,.16)',
    text: 'rgba(255,225,235,.9)', textDim: 'rgba(255,100,130,.45)', textSub: 'rgba(255,100,130,.22)',
    wall: 'radial-gradient(ellipse at 25% 55%,rgba(192,0,58,.25) 0%,transparent 55%),radial-gradient(ellipse at 75% 20%,rgba(255,45,107,.1) 0%,transparent 50%),#08000a',
  },
};

let _currentTheme = localStorage.getItem('aether_theme') || 'blossom';
let _wallCustom   = localStorage.getItem('aether_wall_custom') || '';

window.getCurrentTheme = () => _currentTheme;

window.applyTheme = function(name) {
  const t = THEMES[name] || THEMES.blossom;
  _currentTheme = name;
  localStorage.setItem('aether_theme', name);

  const r = document.documentElement.style;
  r.setProperty('--accent',   t.accent);
  r.setProperty('--accent2',  t.accent2);
  r.setProperty('--bg-deep',  t.bg);
  r.setProperty('--surface',  t.surface);
  r.setProperty('--glass',    t.glass);
  r.setProperty('--border',   t.border);
  r.setProperty('--text',     t.text);
  r.setProperty('--text-dim', t.textDim);
  r.setProperty('--text-sub', t.textSub);

  document.body.style.background = t.bg;
  applyWall();

  // Re-render settings if open
  const wb = $('wb-settings');
  if (wb && wb.innerHTML) window.settRender?.();
};

window.applyWall = function() {
  const wall = $('wallpaper');
  if (!wall) return;
  if (_wallCustom) {
    wall.style.backgroundImage = `url("${_wallCustom}")`;
    wall.style.backgroundSize  = 'cover';
    wall.style.backgroundPosition = 'center';
    wall.style.background = '';
  } else {
    const t = THEMES[_currentTheme] || THEMES.blossom;
    wall.style.backgroundImage = '';
    wall.style.background = t.wall;
  }
};

window.setCustomWall = function(dataUrlOrUrl) {
  _wallCustom = dataUrlOrUrl;
  if (dataUrlOrUrl) localStorage.setItem('aether_wall_custom', dataUrlOrUrl);
  else localStorage.removeItem('aether_wall_custom');
  applyWall();
};

window.setDialAccent = function(hue) {
  const col = `hsl(${hue},78%,64%)`;
  document.documentElement.style.setProperty('--accent', col);
  localStorage.setItem('aether_accent_override', col);
};

// Apply saved theme on load
(function init() {
  applyTheme(_currentTheme);
  const override = localStorage.getItem('aether_accent_override');
  if (override) document.documentElement.style.setProperty('--accent', override);
})();

console.log('%cAetherOS Themes — Ready', 'color:#ff6eb4');
