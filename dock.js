// =========================================================
//  AETHEROS BLOSSOM v5.0 — LAUNCHER + DOCK
//  App launcher grid and liquid glass dock builder
// =========================================================

// ── APP REGISTRY ─────────────────────────────────────────
window.ALL_APPS = [
  { id:'dualsoul', n:'DualSoul',  g:['#e8003d','#ff6eb4'], s:'✦'  },
  { id:'profile',  n:'Profile',   g:['#c0003a','#ffb3d1'], s:'🌸' },
  { id:'terminal', n:'Terminal',  g:['#12000a','#1a000f'], s:'>_' },
  { id:'files',    n:'Files',     g:['#ff2d6b','#ffb3d1'], s:'📁' },
  { id:'music',    n:'Music',     g:['#c0003a','#ff6eb4'], s:'♪'  },
  { id:'gallery',  n:'Gallery',   g:['#e8003d','#ffb3d1'], s:'🖼' },
  { id:'notes',    n:'Notes',     g:['#ff6eb4','#ffd6e7'], s:'✏'  },
  { id:'calc',     n:'Calc',      g:['#c0003a','#ff2d6b'], s:'▦'  },
  { id:'code',     n:'Code',      g:['#8b0030','#ff2d6b'], s:'</>' },
  { id:'browser',  n:'Browser',   g:['#e8003d','#ff6eb4'], s:'◎'  },
  { id:'monitor',  n:'Monitor',   g:['#1a000f','#200010'], s:'▲'  },
  { id:'calendar', n:'Calendar',  g:['#ff2d6b','#ffb3d1'], s:'📅' },
  { id:'settings', n:'Settings',  g:['#1c0010','#200816'], s:'⚙'  },
];

// ── LAUNCHER ─────────────────────────────────────────────
let _launchOpen = false;

window.toggleLauncher = function() {
  _launchOpen = !_launchOpen;
  const l = $('launcher');
  if (!l) return;
  l.classList.toggle('open', _launchOpen);
  if (_launchOpen) renderLauncher('');
};

window.filterLauncher = function(q) { renderLauncher(q); };

function renderLauncher(q) {
  const g = $('launcher-grid');
  if (!g) return;
  const list = q
    ? ALL_APPS.filter(a => a.n.toLowerCase().includes(q.toLowerCase()))
    : ALL_APPS;

  g.innerHTML = list.map(a => `
    <div class="la-icon" onclick="App.open('${a.id}');toggleLauncher()">
      <svg viewBox="0 0 44 44" width="44" height="44" style="border-radius:11px">
        <defs><linearGradient id="lag-${a.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="${a.g[0]}"/>
          <stop offset="100%" stop-color="${a.g[1]}"/>
        </linearGradient></defs>
        <rect width="44" height="44" rx="11" fill="url(#lag-${a.id})"/>
        <text x="22" y="28" text-anchor="middle" fill="rgba(255,255,255,.9)" font-size="15">${a.s}</text>
      </svg>
      <span>${a.n}</span>
    </div>`).join('');
}

document.addEventListener('click', e => {
  if (_launchOpen && !e.target.closest('#launcher') && !e.target.closest('.dock-start'))
    toggleLauncher();
});

// ── DOCK BUILDER ─────────────────────────────────────────
const DOCK_ICONS = [
  { id:'dualsoul', tip:'DualSoul',  svg:'<defs><linearGradient id="dk-ds" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8003d"/><stop offset="100%" stop-color="#ff6eb4"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-ds)"/><circle cx="16" cy="22" r="8" fill="rgba(255,255,255,.18)"/><circle cx="28" cy="22" r="8" fill="rgba(255,255,255,.13)"/><circle cx="22" cy="22" r="5.5" fill="rgba(255,255,255,.45)"/>'},
  { id:'profile',  tip:'Profile',   svg:'<defs><linearGradient id="dk-pr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c0003a"/><stop offset="100%" stop-color="#ffb3d1"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-pr)"/><circle cx="22" cy="17" r="6.5" fill="rgba(255,255,255,.88)"/><path d="M8 38 Q8 27 22 27 Q36 27 36 38" fill="rgba(255,255,255,.72)"/>'},
  { id:'terminal', tip:'Terminal',  svg:'<rect width="44" height="44" rx="11" fill="#12000a"/><text x="7" y="26" fill="#ff6eb4" font-family="monospace" font-size="13" font-weight="bold">&gt;_</text>'},
  { id:'files',    tip:'Files',     svg:'<defs><linearGradient id="dk-fi" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff2d6b"/><stop offset="100%" stop-color="#ffb3d1"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-fi)"/><path d="M7 15 Q7 13 9 13 L17 13 L19 16 L37 16 Q38 16 38 18 L38 32 Q38 33 37 33 L9 33 Q7 33 7 32Z" fill="rgba(255,255,255,.9)"/>'},
  { id:'music',    tip:'Music',     svg:'<defs><linearGradient id="dk-mu" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c0003a"/><stop offset="100%" stop-color="#ff6eb4"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-mu)"/><path d="M29 10L29 27" stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-linecap="round"/><path d="M29 10L18 13L18 30" stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="17" cy="30" r="4.5" fill="rgba(255,255,255,.9)"/><circle cx="28" cy="27" r="4.5" fill="rgba(255,255,255,.9)"/>'},
  { id:'gallery',  tip:'Gallery',   svg:'<defs><linearGradient id="dk-ga" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8003d"/><stop offset="100%" stop-color="#ffb3d1"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-ga)"/><rect x="6" y="8" width="32" height="27" rx="5" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/><circle cx="30" cy="13" r="3" fill="rgba(255,240,0,.92)"/><path d="M6 26 L15 18 L23 24 L28 20 L36 26 L36 33 Q36 35 34 35 L8 35 Q6 35 6 33Z" fill="rgba(255,255,255,.78)"/>'},
  { id:'notes',    tip:'Notes',     svg:'<defs><linearGradient id="dk-no" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff6eb4"/><stop offset="100%" stop-color="#ffd6e7"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-no)"/><rect x="8" y="6" width="28" height="32" rx="4" fill="rgba(255,255,255,.93)"/><line x1="13" y1="14" x2="31" y2="14" stroke="#e8003d" stroke-width="2" stroke-linecap="round"/><line x1="13" y1="20" x2="31" y2="20" stroke="rgba(0,0,0,.14)" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="26" x2="23" y2="26" stroke="rgba(0,0,0,.14)" stroke-width="1.5" stroke-linecap="round"/>'},
  { id:'calc',     tip:'Calculator',svg:'<defs><linearGradient id="dk-ca" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c0003a"/><stop offset="100%" stop-color="#ff2d6b"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-ca)"/><rect x="7" y="6" width="30" height="32" rx="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.28)" stroke-width="1"/><rect x="9" y="9" width="26" height="9" rx="2" fill="rgba(255,255,255,.82)"/><circle cx="13" cy="24" r="2.2" fill="rgba(255,255,255,.72)"/><circle cx="22" cy="24" r="2.2" fill="rgba(255,255,255,.72)"/><circle cx="31" cy="24" r="2.2" fill="rgba(255,255,255,.72)"/><circle cx="13" cy="32" r="2.2" fill="rgba(255,255,255,.72)"/><circle cx="22" cy="32" r="2.2" fill="rgba(255,255,255,.72)"/><rect x="27" y="29" width="7" height="5.5" rx="2" fill="rgba(255,230,200,.9)"/>'},
  { id:'browser',  tip:'Browser',   svg:'<defs><linearGradient id="dk-br" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8003d"/><stop offset="100%" stop-color="#ff6eb4"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-br)"/><circle cx="22" cy="22" r="13" stroke="rgba(255,255,255,.85)" stroke-width="1.5" fill="none"/><ellipse cx="22" cy="22" rx="5" ry="13" stroke="rgba(255,255,255,.45)" stroke-width="1.2" fill="none"/><line x1="9" y1="17" x2="35" y2="17" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/><line x1="9" y1="27" x2="35" y2="27" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/>'},
  { id:'monitor',  tip:'Monitor',   svg:'<rect width="44" height="44" rx="11" fill="#1a000f"/><rect x="5" y="7" width="34" height="22" rx="3" fill="rgba(255,110,180,.08)" stroke="rgba(255,110,180,.28)" stroke-width="1"/><polyline points="7,24 12,16 18,20 24,13 29,18 37,14" stroke="#ff6eb4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="8" y="33" width="28" height="3" rx="1.5" fill="rgba(255,110,180,.38)"/><rect x="18" y="29" width="8" height="4" fill="rgba(255,110,180,.28)"/>'},
  { id:'calendar', tip:'Calendar',  svg:'<defs><linearGradient id="dk-cl" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff2d6b"/><stop offset="100%" stop-color="#ffb3d1"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-cl)"/><rect x="7" y="11" width="30" height="24" rx="4" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.4)" stroke-width="1"/><rect x="7" y="11" width="30" height="10" rx="4" fill="rgba(255,255,255,.9)"/><line x1="15" y1="8" x2="15" y2="14" stroke="rgba(0,0,0,.4)" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="8" x2="29" y2="14" stroke="rgba(0,0,0,.4)" stroke-width="2" stroke-linecap="round"/><text x="22" y="18" text-anchor="middle" fill="#e8003d" font-size="7" font-weight="700" font-family="DM Sans,sans-serif">MAY</text><text x="22" y="29" text-anchor="middle" fill="rgba(255,255,255,.82)" font-size="9" font-family="DM Sans,sans-serif">28</text>'},
  { id:'code',     tip:'Code',      svg:'<defs><linearGradient id="dk-co" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b0030"/><stop offset="100%" stop-color="#ff2d6b"/></linearGradient></defs><rect width="44" height="44" rx="11" fill="url(#dk-co)"/><path d="M15 15L8 22L15 29" stroke="rgba(255,255,255,.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M29 15L36 22L29 29" stroke="rgba(255,255,255,.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="24" y1="11" x2="22" y2="33" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round"/>'},
  { id:'settings', tip:'Settings',  svg:'<rect width="44" height="44" rx="11" fill="#1c0010"/><circle cx="22" cy="22" r="8" stroke="rgba(255,110,180,.58)" stroke-width="1.8" fill="rgba(255,110,180,.1)"/><circle cx="22" cy="22" r="3" fill="rgba(255,110,180,.85)"/><path d="M22 8v5M22 31v5M8 22h5M31 22h5M12 12l3.5 3.5M28.5 28.5l3.5 3.5M32 12l-3.5 3.5M15.5 28.5l-3.5 3.5" stroke="rgba(255,110,180,.48)" stroke-width="1.8" stroke-linecap="round"/>'},
];

function buildDock() {
  const dock = $('dock');
  if (!dock) return;

  const icons = DOCK_ICONS.map(ic => `
    <div class="dock-icon" id="di-${ic.id}" onclick="App.open('${ic.id}')">
      <svg viewBox="0 0 44 44">${ic.svg}</svg>
      <div class="dock-tooltip">${ic.tip}</div>
    </div>`).join('');

  dock.innerHTML = `
    <div class="dock-start" onclick="toggleLauncher()" title="Apps">🌸</div>
    <div class="dock-sep"></div>
    ${icons}
    <div class="dock-sep"></div>
    <div style="display:flex;align-items:center;gap:5px;">
      <div class="tray-btn" id="tray-spot" onclick="toggleSpot()" title="Search (Ctrl+K)">🔍</div>
      <div class="tray-btn" id="tray-ai"   onclick="toggleAI()"   title="Blossom AI">🌸</div>
      <div class="tray-time" id="tray-time">--:--</div>
    </div>`;
}

buildDock();

console.log('%cAetherOS Launcher+Dock — Ready', 'color:#ff6eb4');
