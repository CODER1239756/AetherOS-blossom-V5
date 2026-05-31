// =========================================================
//  AETHEROS BLOSSOM v5.0 — WINDOW MANAGER
//  Open, close, drag, resize, minimize, maximize, focus
// =========================================================

const WINS = {};
let   WZ   = 100;
let   DRAG = null;
let   RSZ  = null;

const APP_META = {
  dualsoul: { title: 'DualSoul — Digital Identity',  w: 760, h: 520 },
  profile:  { title: 'My Profile — Cloud Sync',       w: 620, h: 520 },
  terminal: { title: 'Terminal',                       w: 650, h: 430 },
  files:    { title: 'File Explorer',                  w: 650, h: 450 },
  notes:    { title: 'Notes',                          w: 545, h: 430 },
  music:    { title: 'Music Player',                   w: 385, h: 510 },
  calc:     { title: 'Calculator',                     w: 315, h: 510 },
  monitor:  { title: 'System Monitor',                 w: 605, h: 470 },
  settings: { title: 'Settings',                       w: 615, h: 480 },
  browser:  { title: 'AetherBrowser',                  w: 690, h: 490 },
  gallery:  { title: 'Gallery',                        w: 650, h: 470 },
  code:     { title: 'Code Editor',                    w: 710, h: 490 },
  calendar: { title: 'Calendar',                       w: 545, h: 490 },
  dualsoul2:{ title: 'DualSoul — Live Portfolio',      w: 780, h: 540 },
};

window.App = {
  open(id) {
    if (WINS[id]) { App.focus(id); return; }
    const m = APP_META[id];
    if (!m) return;

    const el  = document.createElement('div');
    el.className = 'win opening';
    el.id        = 'w-' + id;

    const n = Object.keys(WINS).length;
    const L = Math.min(80  + n * 26, 480);
    const T = Math.min(40  + n * 26, 220);

    el.style.cssText = `width:${m.w}px;height:${m.h}px;left:${L}px;top:${T}px;z-index:${++WZ};`;

    el.innerHTML = `
      <div class="win-tb" onmousedown="WM.startDrag(event,'${id}')">
        <div class="win-btns">
          <div class="win-btn close" onclick="App.close('${id}')"></div>
          <div class="win-btn min"   onclick="App.min('${id}')"></div>
          <div class="win-btn max"   onclick="App.max('${id}')"></div>
        </div>
        <div class="win-title">${m.title}</div>
      </div>
      <div class="win-body" id="wb-${id}"></div>
      <div class="win-resize" onmousedown="WM.startResize(event,'${id}')"></div>`;

    $('windows').appendChild(el);
    WINS[id] = { el, m, maxed: false };
    App.focus(id);

    // Build app content
    const wb = $('wb-' + id);
    if (wb) wb.innerHTML = buildApp(id);

    // Dock active dot
    const di = $('di-' + id);
    if (di) di.classList.add('active');

    // App-specific init
    if (id === 'monitor')  MonApp?.start();
    if (id === 'terminal') {
      setTimeout(() => {
        const inp = el.querySelector('.term-input');
        if (inp) inp.focus();
      }, 80);
    }
  },

  close(id) {
    const w = WINS[id]; if (!w) return;
    w.el.style.transition = 'opacity .18s ease, transform .18s ease';
    w.el.style.opacity    = '0';
    w.el.style.transform  = 'scale(.93)';
    setTimeout(() => {
      w.el.remove();
      delete WINS[id];
      const di = $('di-' + id); if (di) di.classList.remove('active');
    }, 200);
    if (id === 'monitor') MonApp?.stop();
    if (id === 'music')   MusicApp?.stop();
  },

  min(id) {
    const w = WINS[id]; if (!w) return;
    w.el.style.display = w.el.style.display === 'none' ? 'flex' : 'none';
  },

  max(id) {
    const w = WINS[id]; if (!w) return;
    if (!w.maxed) {
      w._saved = { l: w.el.style.left, t: w.el.style.top, wi: w.el.style.width, hi: w.el.style.height };
      Object.assign(w.el.style, { left:'0', top:'0', width:'100%', height:'calc(100% - 76px)', borderRadius:'0' });
      w.maxed = true;
    } else {
      const s = w._saved;
      Object.assign(w.el.style, { left:s.l, top:s.t, width:s.wi, height:s.hi, borderRadius:'16px' });
      w.maxed = false;
    }
  },

  focus(id) {
    const w = WINS[id]; if (!w) return;
    Object.values(WINS).forEach(x => x.el.classList.remove('focused'));
    w.el.style.zIndex = ++WZ;
    w.el.classList.add('focused');
    w.el.style.display = 'flex';
  },
};

// Expose WM helpers globally
window.WM = {
  startDrag(e, id) {
    e.preventDefault();
    const w = WINS[id]; if (!w || w.maxed) return;
    App.focus(id);
    DRAG = { id, ox: e.clientX - w.el.offsetLeft, oy: e.clientY - w.el.offsetTop };
  },
  startResize(e, id) {
    e.preventDefault(); e.stopPropagation();
    RSZ = { id };
  },
};

document.addEventListener('mousemove', e => {
  if (DRAG) {
    const w = WINS[DRAG.id]; if (!w) return;
    w.el.style.left = (e.clientX - DRAG.ox) + 'px';
    w.el.style.top  = Math.max(30, e.clientY - DRAG.oy) + 'px';
  }
  if (RSZ) {
    const w = WINS[RSZ.id]; if (!w) return;
    w.el.style.width  = Math.max(280, e.clientX - w.el.offsetLeft) + 'px';
    w.el.style.height = Math.max(160, e.clientY - w.el.offsetTop)  + 'px';
  }
});

document.addEventListener('mouseup', () => { DRAG = null; RSZ = null; });

document.addEventListener('mousedown', e => {
  const we = e.target.closest('.win');
  if (we) App.focus(we.id.replace('w-', ''));
});

// ── App content router ────────────────────────────────────
window.buildApp = function(id) {
  switch (id) {
    case 'terminal':  return TerminalApp.build();
    case 'gallery':   return GalleryApp.build();
    case 'profile':   return ProfileApp.build();
    case 'settings':  return SettingsApp.build();
    case 'music':     return MusicApp.build();
    case 'files':     return FilesApp.build();
    default:          return MiscApps.build(id);
  }
};

console.log('%cAetherOS WM — Ready', 'color:#ff6eb4');
