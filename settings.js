// =========================================================
//  AETHEROS BLOSSOM v5.0 — SETTINGS APP
//  Themes, Dial, Wallpaper, Cloud, System, About
// =========================================================

window.SettingsApp = (() => {

  let _tab        = 'themes';
  let _dialAngle  = parseFloat(localStorage.getItem('aether_dial_angle') || '0');
  let _dialDrag   = false;
  let _dialStartY = 0;
  let _dialStartA = 0;
  const _toggles  = {
    particles:     true,
    glass:         true,
    animations:    true,
    notifications: true,
  };

  // ── Build ─────────────────────────────────────────────
  function build() {
    const TABS = [
      { k:'themes',    icon:'🎨', label:'Themes'    },
      { k:'wallpaper', icon:'🖼', label:'Wallpaper'  },
      { k:'cloud',     icon:'☁', label:'Cloud'      },
      { k:'system',    icon:'🖥', label:'System'     },
      { k:'about',     icon:'🌸', label:'About'      },
    ];
    return `
      <div class="sett-layout">
        <!-- Sidebar -->
        <div style="border-right:1px solid var(--border);padding:10px;overflow-y:auto">
          ${TABS.map(t => `
            <div class="sett-nav-item ${_tab===t.k?'active':''}"
              onclick="SettingsApp.switchTab('${t.k}')">
              <span style="font-size:14px;width:20px;text-align:center">${t.icon}</span>
              ${t.label}
            </div>`).join('')}
        </div>
        <!-- Main -->
        <div style="padding:20px;overflow-y:auto" id="sett-main">
          ${buildTabContent()}
        </div>
      </div>`;
  }

  function buildTabContent() {
    switch (_tab) {
      case 'themes':    return buildThemes();
      case 'wallpaper': return buildWallpaper();
      case 'cloud':     return buildCloud();
      case 'system':    return buildSystem();
      case 'about':     return buildAbout();
      default:          return '';
    }
  }

  // ── Themes Tab ────────────────────────────────────────
  function buildThemes() {
    const cur = getCurrentTheme();
    return `
      <div class="section-label">THEME PRESETS</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px">
        ${Object.entries(THEMES).map(([key, t]) => `
          <div class="theme-card ${cur===key?'selected':''}"
            style="background:${t.wall}"
            onclick="applyTheme('${key}');SettingsApp.rerender()">
            <div class="theme-card-name">${t.name}</div>
            <div class="theme-card-sub">${t.sub}</div>
          </div>`).join('')}
      </div>

      <div class="section-label">MANUAL COLOUR DIAL</div>
      <div style="display:flex;align-items:center;gap:22px;margin-top:6px;margin-bottom:20px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <div class="dial-ring" id="dial-ring"
            onmousedown="SettingsApp.dialStart(event)">
            <div class="dial-needle" id="dial-needle"
              style="transform:rotate(${_dialAngle}deg)"></div>
          </div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);text-align:center"
            id="dial-val">Hue: ${Math.round(((_dialAngle % 360) + 360) % 360)}°</div>
          <div style="font-size:10px;color:var(--text-sub);text-align:center">Drag to shift accent</div>
        </div>
        <div style="flex:1">
          <div style="font-size:11px;color:var(--text-dim);line-height:2;margin-bottom:10px">
            Drag the dial up/down to shift the accent colour hue across the full spectrum.
            Current theme: <span style="color:var(--accent)">${THEMES[getCurrentTheme()]?.name}</span>
          </div>
          <div style="display:flex;gap:7px;flex-wrap:wrap">
            ${['#ff6eb4','#ff2d6b','#c0003a','#e8003d','#ff94c8','#ffb3d1','#a855f7','#3b82f6','#10b981','#f59e0b'].map(c => `
              <div onclick="SettingsApp.setAccent('${c}')"
                style="width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;
                  border:2px solid transparent;transition:border .14s"
                onmouseover="this.style.borderColor='#fff'"
                onmouseout="this.style.borderColor='transparent'"></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="section-label">INTERFACE TOGGLES</div>
      ${Object.entries({ particles:'Particle Effects', glass:'Glassmorphism', animations:'Window Animations', notifications:'Notifications' })
        .map(([k, label]) => `
          <div class="sett-row">
            <div><div style="font-size:13px;color:var(--text)">${label}</div></div>
            <div class="toggle ${_toggles[k]?'on':''}" onclick="SettingsApp.toggle('${k}')"></div>
          </div>`).join('')}`;
  }

  // ── Wallpaper Tab ─────────────────────────────────────
  function buildWallpaper() {
    const cur = getCurrentTheme();
    const t   = THEMES[cur] || THEMES.blossom;
    const custom = localStorage.getItem('aether_wall_custom') || '';
    return `
      <div class="section-label">THEME WALLPAPERS</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">
        ${[t.wall, ...Object.values(THEMES).slice(0,3).map(th=>th.wall)].map((w,i) => `
          <div onclick="setCustomWall('');applyWall()"
            style="height:60px;border-radius:var(--r);background:${w};cursor:pointer;
              border:2px solid ${!custom&&i===0?'var(--accent)':'transparent'};transition:border .14s"
            onmouseover="this.style.borderColor='rgba(255,110,180,.5)'"
            onmouseout="this.style.borderColor='${!custom&&i===0?'var(--accent)':'transparent'}'"></div>`).join('')}
      </div>

      <div class="section-label">CUSTOM WALLPAPER URL</div>
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <input id="wall-url" class="field" style="margin:0;flex:1"
          placeholder="https://example.com/image.jpg"
          value="${custom && !custom.startsWith('data:') ? custom : ''}"
          onkeydown="if(event.key==='Enter')SettingsApp.applyWallUrl()">
        <button class="btn-ghost" style="padding:0 14px" onclick="SettingsApp.applyWallUrl()">Apply</button>
      </div>

      <div class="section-label">UPLOAD FROM DEVICE</div>
      <label style="display:flex;align-items:center;gap:12px;padding:14px;
        background:var(--glass);border:1px dashed var(--border);border-radius:var(--r-lg);
        cursor:pointer;transition:all .15s"
        onmouseover="this.style.borderColor='var(--accent)'"
        onmouseout="this.style.borderColor='var(--border)'">
        <span style="font-size:22px">📁</span>
        <div>
          <div style="font-size:13px;color:var(--text-dim)">Choose from device</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">JPG · PNG · GIF · WebP</div>
        </div>
        <input type="file" accept="image/*" style="display:none"
          onchange="SettingsApp.applyWallFile(this)">
      </label>
      ${custom ? `
        <div style="margin-top:12px;display:flex;align-items:center;gap:10px">
          <span style="font-size:11px;color:var(--text-dim)">Custom wallpaper active</span>
          <button class="app-btn" style="color:rgba(255,80,80,.6)"
            onclick="setCustomWall('');SettingsApp.rerender()">Clear</button>
        </div>` : ''}`;
  }

  // ── Cloud Tab ─────────────────────────────────────────
  function buildCloud() {
    const ep = localStorage.getItem('aether_cloud_ep') || '';
    return `
      <div class="section-label">DBMMS CLOUD CONFIGURATION</div>
      <div class="card" style="margin-bottom:16px;font-size:12px;line-height:1.9;color:var(--text-dim)">
        AetherOS DBMMS syncs your profile, posts, and images across devices via HTTPS.<br>
        Your server must implement:<br>
        <code style="color:var(--text)">POST /sync</code> — receive and store records<br>
        <code style="color:var(--text)">GET  /user/:uid</code> — return user + posts + images on login
      </div>
      <div class="section-label">SERVER ENDPOINT URL</div>
      <input id="cloud-ep" class="field"
        placeholder="https://your-server.com/api" value="${ep}">
      <button class="btn-primary" style="width:100%;margin-top:4px"
        onclick="SettingsApp.saveCloud()">Save Cloud Config</button>
      ${ep
        ? `<div style="margin-top:10px;font-size:11px;color:var(--accent)">☁ Active: ${ep}</div>`
        : `<div style="margin-top:10px;font-size:11px;color:var(--text-sub)">No endpoint — data saved locally only.</div>`}

      <div class="section-label" style="margin-top:24px">LOCAL DATABASE</div>
      <div class="sett-row">
        <div>
          <div style="font-size:13px;color:var(--text)">Clear All Local Data</div>
          <div style="font-size:11px;color:var(--text-sub);margin-top:2px">Permanently deletes all stored data</div>
        </div>
        <button class="app-btn" style="color:rgba(255,80,80,.5)"
          onclick="if(confirm('Clear ALL local data? This cannot be undone.')){localStorage.clear();notify('DBMMS','All data cleared.',2500)}">
          Clear
        </button>
      </div>`;
  }

  // ── System Tab ────────────────────────────────────────
  function buildSystem() {
    const info = [
      ['Version',      'AetherOS 5.0 Blossom'],
      ['Build',        'AETHER-BLOSSOM-PINK-v5'],
      ['Kernel',       'AetherKernel 12.5-blossom'],
      ['Architecture', 'Quantum-x64'],
      ['Renderer',     'CSS Glassmorphism Engine'],
      ['DBMMS',        'v5.0 Cloud-Sync Active'],
      ['Kali Mode',    'Enabled — Ethical Use Only'],
      ['Languages',    'HTML5 · CSS3 · Tailwind · JS Modules'],
      ['Fonts',        'Cormorant Garamond · DM Sans · JetBrains Mono'],
    ];
    return `
      <div class="section-label">SYSTEM INFORMATION</div>
      ${info.map(([k,v]) => `
        <div class="sett-row">
          <div style="font-size:13px;color:var(--text)">${k}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${v}</div>
        </div>`).join('')}`;
  }

  // ── About Tab ─────────────────────────────────────────
  function buildAbout() {
    return `
      <div style="text-align:center;padding:20px 0">
        <div style="font-family:var(--font-display);font-size:42px;font-weight:600;
          color:var(--accent);text-shadow:0 0 40px rgba(255,110,180,.4)">
          AETHER<span style="color:var(--accent2)">OS</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:5px;
          color:var(--text-sub);margin-top:5px">BLOSSOM EDITION · v5.0</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:18px;flex-wrap:wrap">
          <span class="pill pill-pink">🌸 SYSTEM NOMINAL</span>
          <span class="pill pill-red">☁ DBMMS ACTIVE</span>
          <span class="pill pill-dark">🔐 KALI ETHICAL MODE</span>
          <span class="pill pill-dark">✿ AI ONLINE</span>
        </div>
        <div style="font-family:var(--font-display);font-size:12px;font-style:italic;
          color:var(--text-sub);margin-top:28px;line-height:2.6">
          Designed for the ones who bloom.<br>
          Runs on love and code.<br>
          Built with petals and pixels.
        </div>
        <div style="margin-top:24px;font-family:var(--font-mono);font-size:10px;
          color:var(--text-sub);letter-spacing:1px">
          HTML5 · CSS3 · Tailwind CSS · ES Modules · Canvas API · Web APIs
        </div>
      </div>`;
  }

  // ── Actions ───────────────────────────────────────────
  function switchTab(tab) {
    _tab = tab;
    const main = $('sett-main');
    if (main) main.innerHTML = buildTabContent();
    // Update nav active state
    document.querySelectorAll('.sett-nav-item').forEach((el, i) => {
      el.classList.toggle('active', ['themes','wallpaper','cloud','system','about'][i] === tab);
    });
  }

  function rerender() {
    const wb = $('wb-settings');
    if (wb) wb.innerHTML = build();
  }

  window.settRender = rerender;

  function setAccent(color) {
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('aether_accent_override', color);
  }

  function toggle(key) {
    _toggles[key] = !_toggles[key];
    notify('Settings', `${key} ${_toggles[key] ? 'enabled' : 'disabled'}`, 2000);
    const el = document.querySelector(`[onclick="SettingsApp.toggle('${key}')"]`);
    if (el) el.classList.toggle('on', _toggles[key]);
  }

  // Dial interaction
  function dialStart(e) {
    _dialDrag   = true;
    _dialStartY = e.clientY;
    _dialStartA = _dialAngle;
    document.addEventListener('mousemove', _dialMove);
    document.addEventListener('mouseup',   _dialEnd);
  }
  function _dialMove(e) {
    if (!_dialDrag) return;
    _dialAngle = _dialStartA + (_dialStartY - e.clientY) * 1.6;
    const needle = $('dial-needle');
    if (needle) needle.style.transform = `rotate(${_dialAngle}deg)`;
    const val = $('dial-val');
    const hue = ((_dialAngle % 360) + 360) % 360;
    if (val) val.textContent = `Hue: ${Math.round(hue)}°`;
    document.documentElement.style.setProperty('--accent', `hsl(${hue},78%,64%)`);
    localStorage.setItem('aether_dial_angle', _dialAngle);
  }
  function _dialEnd() {
    _dialDrag = false;
    document.removeEventListener('mousemove', _dialMove);
    document.removeEventListener('mouseup',   _dialEnd);
  }

  function applyWallUrl() {
    const inp = $('wall-url'); if (!inp) return;
    const url = inp.value.trim(); if (!url) return;
    setCustomWall(url);
    notify('Wallpaper', 'Custom wallpaper applied.', 2000);
    rerender();
  }

  function applyWallFile(input) {
    const file = input.files[0]; if (!file) return;
    readFileAsDataURL(file).then(url => {
      setCustomWall(url);
      notify('Wallpaper', 'Custom wallpaper applied.', 2000);
      rerender();
    });
  }

  function saveCloud() {
    const url = ($('cloud-ep') || {}).value || '';
    if (url) localStorage.setItem('aether_cloud_ep', url);
    else     localStorage.removeItem('aether_cloud_ep');
    notify('Cloud', url ? `☁ Endpoint saved` : 'Cloud sync disabled.', 2500);
    switchTab('cloud');
  }

  return {
    build, switchTab, rerender,
    setAccent, toggle, dialStart,
    applyWallUrl, applyWallFile, saveCloud,
  };
})();

console.log('%cAetherOS Settings — Ready', 'color:#ff6eb4');
