// =========================================================
//  AETHEROS BLOSSOM v5.0 — MUSIC PLAYER APP
// =========================================================

window.MusicApp = (() => {

  const TRACKS = [
    { t:'Petal Reverie',   a:'AetherSounds',      e:'🌸', d:225, g:'linear-gradient(135deg,#c0003a,#ff6eb4)' },
    { t:'Velvet Void',     a:'Shadow Collective',  e:'🥀', d:198, g:'linear-gradient(135deg,#18000a,#400018)' },
    { t:'Blossom Bloom',   a:'Nova Waves',         e:'🌺', d:243, g:'linear-gradient(135deg,#e8003d,#ff6eb4)' },
    { t:'Rose Pulse',      a:'Quantum Beat',       e:'💗', d:187, g:'linear-gradient(135deg,#ff2d6b,#c0003a)' },
    { t:'Cherry Lane',     a:'DualSoul OST',       e:'🍒', d:267, g:'linear-gradient(135deg,#8b0030,#ff6eb4)' },
  ];

  let _idx     = 0;
  let _playing = false;
  let _prog    = 0;
  let _playIv  = null;
  let _vizIv   = null;

  function build() {
    const t = TRACKS[_idx];
    return `
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;
        padding:22px 18px;gap:13px;overflow:hidden">

        <!-- Cover -->
        <div class="music-cover ${_playing ? 'music-cover-spin' : ''}" id="music-cover"
          style="background:${t.g}">${t.e}</div>

        <!-- Info -->
        <div style="text-align:center">
          <div style="font-family:var(--font-display);font-size:17px;font-weight:600;color:var(--text)"
            id="music-title">${t.t}</div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:2px"
            id="music-artist">${t.a}</div>
        </div>

        <!-- Visualiser -->
        <div style="width:100%;height:38px;display:flex;align-items:center;
          justify-content:center;gap:3px" id="music-viz">
          ${Array.from({length:20},(_,i) =>
            `<div class="viz-bar" id="vb${i}" style="height:${_playing?Math.random()*32+4:4}px"></div>`
          ).join('')}
        </div>

        <!-- Progress -->
        <div style="width:100%">
          <div style="display:flex;justify-content:space-between;
            font-family:var(--font-mono);font-size:10px;color:var(--text-dim);margin-bottom:5px">
            <span id="music-cur">0:00</span>
            <span>${fmtTime(t.d)}</span>
          </div>
          <div class="music-progress" onclick="MusicApp.seek(event)">
            <div class="music-prog-fill" id="music-fill" style="width:${_prog}%"></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="music-ctrls" style="display:flex;gap:16px;align-items:center">
          <div class="mctrl" onclick="MusicApp.prev()" title="Previous">⏮</div>
          <div class="mctrl main" id="music-play" onclick="MusicApp.toggle()">
            ${_playing ? '⏸' : '▶'}
          </div>
          <div class="mctrl" onclick="MusicApp.next()" title="Next">⏭</div>
        </div>

        <!-- Track list -->
        <div style="width:100%;flex:1;overflow-y:auto">
          ${TRACKS.map((tr, i) => `
            <div class="mtrack ${i===_idx?'playing':''}" onclick="MusicApp.setTrack(${i})">
              <span style="font-size:22px">${tr.e}</span>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:500;
                  color:${i===_idx?'var(--accent)':'var(--text)'}">${tr.t}</div>
                <div style="font-size:10px;color:var(--text-dim)">${tr.a}</div>
              </div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dim)">
                ${fmtTime(tr.d)}
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function _startTimers() {
    clearInterval(_playIv); clearInterval(_vizIv);
    const dur = TRACKS[_idx].d;
    _playIv = setInterval(() => {
      _prog = Math.min(100, _prog + 100 / dur);
      const fill = $('music-fill'); if (fill) fill.style.width = _prog + '%';
      const cur  = $('music-cur');  if (cur)  cur.textContent  = fmtTime(Math.floor(_prog * dur / 100));
      if (_prog >= 100) { _prog = 0; MusicApp.next(); }
    }, 1000);
    _vizIv = setInterval(() => {
      for (let i = 0; i < 20; i++) {
        const b = $('vb' + i);
        if (b) b.style.height = (_playing ? Math.random() * 32 + 4 : 4) + 'px';
      }
    }, 120);
  }

  function _reload() {
    const wb = $('wb-music');
    if (wb) { wb.innerHTML = build(); if (_playing) _startTimers(); }
  }

  function toggle() {
    _playing = !_playing;
    if (_playing) _startTimers();
    else { clearInterval(_playIv); clearInterval(_vizIv); for(let i=0;i<20;i++){const b=$('vb'+i);if(b)b.style.height='4px';} }
    const btn = $('music-play');  if (btn) btn.textContent = _playing ? '⏸' : '▶';
    const cov = $('music-cover'); if (cov) cov.className   = 'music-cover' + (_playing ? ' music-cover-spin' : '');
  }

  function next()      { _idx = (_idx + 1) % TRACKS.length; _prog = 0; clearInterval(_playIv); clearInterval(_vizIv); _reload(); }
  function prev()      { _idx = (_idx - 1 + TRACKS.length) % TRACKS.length; _prog = 0; clearInterval(_playIv); clearInterval(_vizIv); _reload(); }
  function setTrack(i) { _idx = i; _prog = 0; clearInterval(_playIv); clearInterval(_vizIv); _reload(); }
  function stop()      { _playing = false; clearInterval(_playIv); clearInterval(_vizIv); }
  function seek(e)     { const b = e.currentTarget; _prog = (e.offsetX / b.offsetWidth) * 100; const f=$('music-fill'); if(f) f.style.width=_prog+'%'; }

  return { build, toggle, next, prev, setTrack, stop, seek };
})();

console.log('%cAetherOS Music — Ready', 'color:#ff6eb4');
