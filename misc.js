// =========================================================
//  AETHEROS BLOSSOM v5.0 — MISC APPS
//  Notes, Calculator, Browser, System Monitor,
//  Calendar, Code Editor, DualSoul
// =========================================================

window.MiscApps = { build };

function build(id) {
  switch (id) {
    case 'notes':    return buildNotes();
    case 'calc':     return buildCalc();
    case 'browser':  return buildBrowser();
    case 'monitor':  return buildMonitor();
    case 'calendar': return buildCalendar();
    case 'code':     return buildCode();
    case 'dualsoul': return buildDualSoul();
    default:         return `<div style="padding:20px;color:var(--text-dim)">Loading ${id}…</div>`;
  }
}

// ── NOTES ─────────────────────────────────────────────────
let _notesVal = localStorage.getItem('aether_notes_v5') || '# My Notes 🌸\n\nStart writing here…\n\n';

function buildNotes() {
  return `
    <div style="height:100%;display:flex;flex-direction:column">
      <div class="app-toolbar">
        <span style="font-family:var(--font-mono);font-size:8px;letter-spacing:2.5px;color:var(--text-sub)">NOTES</span>
        <button class="app-btn" onclick="_notesFmt('**','**')"><b>B</b></button>
        <button class="app-btn" onclick="_notesFmt('_','_')"><i>I</i></button>
        <button class="app-btn" onclick="_notesFmt('# ','')">H1</button>
        <button class="app-btn" onclick="_notesFmt('## ','')">H2</button>
        <button class="app-btn" onclick="_notesFmt('- ','')">• List</button>
        <div style="margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-sub)" id="notes-stats">
          ${_notesVal.trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
      <textarea class="notes-area" id="notes-area"
        oninput="_notesSave(this.value)" spellcheck="true">${_notesVal.replace(/</g,'&lt;')}</textarea>
    </div>`;
}

window._notesSave = function(v) {
  _notesVal = v;
  localStorage.setItem('aether_notes_v5', v);
  const s = $('notes-stats');
  if (s) { const w = v.trim().split(/\s+/).filter(Boolean).length; s.textContent = w + ' word' + (w!==1?'s':''); }
};

window._notesFmt = function(before, after) {
  const el = $('notes-area'); if (!el) return;
  const s = el.selectionStart, e = el.selectionEnd, sel = el.value.substring(s, e);
  el.value = el.value.substring(0,s) + before + sel + after + el.value.substring(e);
  el.focus(); el.selectionStart = s + before.length; el.selectionEnd = s + before.length + sel.length;
  _notesSave(el.value);
};

// ── CALCULATOR ────────────────────────────────────────────
let _cExpr = '', _cRes = '0', _cNew = false;

function buildCalc() {
  const rows = [['C','±','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],[' ','0','.','=']];
  return `
    <div style="height:100%;display:flex;flex-direction:column;padding:14px;gap:10px">
      <div class="calc-display">
        <div class="calc-expr" id="c-expr">&nbsp;</div>
        <div class="calc-result" id="c-res">0</div>
      </div>
      <div class="calc-grid" style="flex:1">
        ${rows.flat().map(b => {
          const isOp = ['÷','×','−','+'].includes(b);
          const isFn = ['C','±','%'].includes(b);
          const isEq = b === '=';
          return `<button class="c-btn ${isOp?'op':''} ${isFn?'fn':''} ${isEq?'eq':''}"
            onclick="_calcPress('${b.trim()||'0'}')">${b}</button>`;
        }).join('')}
      </div>
    </div>`;
}

window._calcPress = function(b) {
  const r = $('c-res'), e = $('c-expr');
  if (b==='C')      { _cExpr=''; _cRes='0'; _cNew=false; }
  else if (b==='=') {
    try {
      const s = _cExpr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      const v = Function('"use strict";return(' + s + ')')();
      _cRes = String(Math.round(v * 1e12) / 1e12);
      _cExpr = _cRes; _cNew = true;
    } catch { _cRes = 'Error'; _cExpr = ''; }
  } else if (b==='±') { const v=-parseFloat(_cRes)||0; _cRes=String(v); _cExpr=String(v); }
  else if (b==='%')   { const v=parseFloat(_cRes)/100;  _cRes=String(v); _cExpr=String(v); }
  else {
    if (_cNew && !['÷','×','−','+'].includes(b)) { _cExpr=b; _cNew=false; }
    else _cExpr += b;
    _cRes = _cExpr;
  }
  if (r) r.textContent = _cRes;
  if (e) e.textContent = _cExpr || '\u00a0';
};

// ── BROWSER ───────────────────────────────────────────────
function buildBrowser() {
  const shortcuts = [
    {icon:'🌸',name:'Profile',   u:'profile',  d:'Your space'},
    {icon:'✦', name:'DualSoul',  u:'https://ad2p.lovable.app', d:'Portfolio'},
    {icon:'🖼', name:'Gallery',   u:'gallery',  d:'Photos'},
    {icon:'🎵', name:'Music',     u:'music',    d:'Tracks'},
    {icon:'📋', name:'Notes',     u:'notes',    d:'Your notes'},
    {icon:'⚙', name:'Settings',  u:'settings', d:'Configure'},
  ];
  return `
    <div style="height:100%;display:flex;flex-direction:column">
      <!-- Address bar -->
      <div class="app-toolbar">
        <button class="app-btn">←</button>
        <button class="app-btn">→</button>
        <button class="app-btn">↺</button>
        <input style="flex:1;background:rgba(255,110,180,.06);border:1px solid var(--border);
          border-radius:var(--r);padding:5px 13px;font-size:12px;font-family:var(--font-mono);
          color:var(--text-dim);transition:all .14s"
          value="atheros://home"
          onkeydown="if(event.key==='Enter')window.open(this.value,'_blank')"
          onfocus="this.style.borderColor='rgba(255,110,180,.42)'"
          onblur="this.style.borderColor='var(--border)'">
        <span style="font-size:13px;color:var(--accent)">🔒</span>
      </div>

      <!-- Page content -->
      <div style="flex:1;overflow-y:auto;padding:24px">
        <div style="text-align:center;padding:14px 0 6px">
          <div style="font-family:var(--font-display);font-size:32px;font-weight:600;
            letter-spacing:4px;color:var(--accent);text-shadow:0 0 40px rgba(255,110,180,.4)">
            AetherSearch 🌸
          </div>
          <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:4px;
            color:var(--text-sub);margin-top:4px">POWERED BY DUCKDUCKGO</div>
        </div>

        <div style="display:flex;max-width:520px;margin:16px auto 0;gap:8px">
          <input id="search-q" style="flex:1;background:rgba(255,110,180,.06);
            border:1px solid var(--border);border-radius:26px;padding:12px 22px;
            font-size:14px;color:var(--text)"
            placeholder="Search the web…"
            onkeydown="if(event.key==='Enter')_browserSearch()"
            onfocus="this.style.borderColor='rgba(255,110,180,.42)'"
            onblur="this.style.borderColor='var(--border)'">
          <button onclick="_browserSearch()"
            style="padding:0 20px;background:linear-gradient(135deg,var(--accent2),var(--accent));
              border:none;border-radius:26px;color:#fff;font-size:14px;cursor:pointer;font-weight:500">
            Search
          </button>
        </div>

        <div id="search-status" style="text-align:center;font-size:11px;color:var(--text-sub);margin-top:8px"></div>
        <div id="search-results" style="max-width:680px;margin:16px auto 0;display:flex;flex-direction:column;gap:10px"></div>

        <div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;
          color:var(--text-sub);text-align:center;margin:24px 0 12px">QUICK ACCESS</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:520px;margin:0 auto">
          ${shortcuts.map(b => `
            <div onclick="${b.u.startsWith('http')?`window.open('${b.u}','_blank')`:`App.open('${b.u}')`}"
              style="background:var(--glass);border:1px solid var(--border);border-radius:var(--r-lg);
                padding:14px;cursor:pointer;transition:all .14s;display:flex;align-items:center;gap:10px"
              onmouseover="this.style.borderColor='rgba(255,110,180,.3)'"
              onmouseout="this.style.borderColor='var(--border)'">
              <span style="font-size:24px">${b.icon}</span>
              <div>
                <div style="font-size:12px;font-weight:500;color:var(--text)">${b.name}</div>
                <div style="font-size:10px;color:var(--text-dim)">${b.d}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

window._browserSearch = async function() {
  const q  = ($('search-q')||{}).value || ''; if (!q.trim()) return;
  const sr = $('search-results'), ss = $('search-status');
  if (sr) sr.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-dim)">🔍 Searching…</div>';
  try {
    const resp = await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(q) + '&format=json&no_html=1&skip_disambig=1&t=aetheros');
    const data = await resp.json();
    let html = '';
    if (data.Answer) html += `<div style="background:rgba(255,110,180,.07);border:1px solid rgba(255,110,180,.18);border-radius:12px;padding:14px"><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:2px;color:var(--accent);margin-bottom:6px">INSTANT ANSWER</div><div style="font-size:14px;color:var(--text)">${data.Answer}</div></div>`;
    if (data.AbstractText) html += `<div style="background:var(--glass);border:1px solid var(--border);border-radius:12px;padding:14px"><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:2px;color:var(--text-sub);margin-bottom:6px">SUMMARY · ${data.AbstractSource}</div><div style="font-size:13px;color:var(--text);line-height:1.75">${data.AbstractText}</div>${data.AbstractURL?`<a href="${data.AbstractURL}" target="_blank" style="display:inline-block;margin-top:8px;font-size:11px;color:var(--accent);text-decoration:none">Read more ↗</a>`:''}</div>`;
    if (!html) html = `<div style="text-align:center;padding:20px;color:var(--text-dim)"><a href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" style="color:var(--accent);text-decoration:none">🔗 Search "${q}" on Google</a></div>`;
    if (ss) ss.textContent = 'Results via DuckDuckGo';
    if (sr) sr.innerHTML = html;
  } catch {
    if (sr) sr.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-dim)">Network error. <a href="https://www.google.com/search?q=${encodeURIComponent(q)}" target="_blank" style="color:var(--accent)">Search on Google ↗</a></div>`;
  }
};

// ── SYSTEM MONITOR ────────────────────────────────────────
window.MonApp = (() => {
  let iv = null;
  const start = Date.now();
  let cpu = 34, ram = 62;
  const cH = [], rH = [];

  function build() {
    return `
      <div style="height:100%;padding:14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div class="mon-card">
            <div class="mon-label">CPU USAGE</div>
            <div class="mon-value" id="m-cpu">${cpu}%</div>
            <canvas id="cpu-canvas" style="width:100%;height:50px;display:block;margin-top:6px;border-radius:6px" height="50"></canvas>
            <div class="mon-bar-bg"><div class="mon-bar-fill" id="m-cpu-bar"
              style="width:${cpu}%;background:linear-gradient(90deg,var(--accent2),var(--accent))"></div></div>
          </div>
          <div class="mon-card">
            <div class="mon-label">MEMORY</div>
            <div class="mon-value" id="m-ram" style="color:var(--blush,#ffb3d1)">${ram}%</div>
            <canvas id="ram-canvas" style="width:100%;height:50px;display:block;margin-top:6px;border-radius:6px" height="50"></canvas>
            <div class="mon-bar-bg"><div class="mon-bar-fill" id="m-ram-bar"
              style="width:${ram}%;background:linear-gradient(90deg,var(--blush,#ffb3d1),var(--accent2))"></div></div>
          </div>
          <div class="mon-card">
            <div class="mon-label">NETWORK</div>
            <div class="mon-value" id="m-net" style="font-size:20px;color:rgba(255,200,215,.8)">12 MB/s</div>
            <div class="mon-bar-bg"><div class="mon-bar-fill" id="m-net-bar"
              style="width:40%;background:linear-gradient(90deg,var(--accent2),var(--blush,#ffb3d1))"></div></div>
          </div>
          <div class="mon-card">
            <div class="mon-label">UPTIME</div>
            <div class="mon-value" id="m-up" style="font-size:20px;color:rgba(255,180,210,.7)">0m 0s</div>
          </div>
        </div>
        <div class="mon-card">
          <div class="mon-label">PROCESSES</div>
          <table class="proc-table">
            <thead><tr><th>PID</th><th>NAME</th><th>CPU</th><th>MEM</th><th>STATUS</th></tr></thead>
            <tbody>
              <tr><td>001</td><td>dualsoul-core</td>   <td class="proc-run" id="pc1">8.2%</td> <td>124MB</td><td class="proc-run">RUNNING</td></tr>
              <tr><td>002</td><td>blossom-shell</td>   <td class="proc-run" id="pc2">1.1%</td> <td>32MB</td> <td class="proc-run">RUNNING</td></tr>
              <tr><td>003</td><td>aurora-canvas</td>   <td class="proc-run" id="pc3">4.5%</td> <td>88MB</td> <td class="proc-run">RUNNING</td></tr>
              <tr><td>004</td><td>dbmms-cloud</td>     <td class="proc-slp" id="pc4">0.3%</td> <td>256MB</td><td class="proc-slp">STANDBY</td></tr>
              <tr><td>005</td><td>blossom-ai</td>      <td class="proc-run" id="pc5">6.8%</td> <td>256MB</td><td class="proc-run">RUNNING</td></tr>
              <tr><td>006</td><td>kali-mode</td>       <td class="proc-slp" id="pc6">0.0%</td> <td>64MB</td> <td class="proc-slp">STANDBY</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function drawGraph(id, hist, c1, c2) {
    const cv = $(id); if (!cv) return;
    cv.width = cv.offsetWidth;
    const cx = cv.getContext('2d'), W = cv.width, H = cv.height;
    cx.clearRect(0, 0, W, H);
    if (hist.length < 2) return;
    const step = W / (hist.length - 1);
    const g = cx.createLinearGradient(0,0,W,0);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    cx.beginPath(); cx.moveTo(0, H*(1-hist[0]/100));
    for (let i=1;i<hist.length;i++) cx.lineTo(i*step, H*(1-hist[i]/100));
    cx.strokeStyle=g; cx.lineWidth=1.5; cx.stroke();
    cx.lineTo((hist.length-1)*step,H); cx.lineTo(0,H); cx.closePath();
    const fg=cx.createLinearGradient(0,0,0,H); fg.addColorStop(0,c1.replace('rgb','rgba').replace(')',`,.1)`)); fg.addColorStop(1,'transparent');
    cx.fillStyle=fg; cx.fill();
  }

  function tickM() {
    cpu = clamp(cpu + (Math.random()-.5)*7, 5, 92);
    ram = clamp(ram + (Math.random()-.5)*2.5, 30, 88);
    const net = Math.round(Math.random()*40+5);
    cH.push(cpu); if(cH.length>30) cH.shift();
    rH.push(ram); if(rH.length>30) rH.shift();
    const vc=$('m-cpu'),vr=$('m-ram'),vn=$('m-net'),vu=$('m-up');
    const bc=$('m-cpu-bar'),br=$('m-ram-bar'),bn=$('m-net-bar');
    if(vc) vc.textContent = Math.round(cpu)+'%';
    if(vr) vr.textContent = Math.round(ram)+'%';
    if(vn) vn.textContent = net+' MB/s';
    if(bc) bc.style.width = cpu+'%';
    if(br) br.style.width = ram+'%';
    if(bn) bn.style.width = Math.min(100,net*2.5)+'%';
    if(vu) { const s=Math.floor((Date.now()-start)/1000); vu.textContent=`${Math.floor(s/60)}m ${s%60}s`; }
    drawGraph('cpu-canvas', cH, 'rgb(232,0,61)','rgb(255,110,180)');
    drawGraph('ram-canvas', rH, 'rgb(255,179,209)','rgb(232,0,61)');
    [['pc1',cpu*.4],['pc2',cpu*.08],['pc3',cpu*.2],['pc4',0.3],['pc5',cpu*.28],['pc6',0]].forEach(([id,v])=>{
      const el=$(id); if(el) el.textContent=Math.round(v*10)/10+'%';
    });
  }

  return {
    build,
    start() { clearInterval(iv); iv=setInterval(tickM,1500); setTimeout(tickM,120); },
    stop()  { clearInterval(iv); },
  };
})();
function buildMonitor() { return MonApp.build(); }

// ── CALENDAR ──────────────────────────────────────────────
let _calYear = new Date().getFullYear();
let _calMonth = new Date().getMonth();

function buildCalendar() {
  const now=new Date(), today=now.getDate(), tm=now.getMonth(), ty=now.getFullYear();
  const first=new Date(_calYear,_calMonth,1).getDay();
  const last =new Date(_calYear,_calMonth+1,0).getDate();
  const prev =new Date(_calYear,_calMonth,0).getDate();
  const DH=['Su','Mo','Tu','We','Th','Fr','Sa'];
  const MONS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  let cells=[];
  for(let i=0;i<first;i++) cells.push({d:prev-first+1+i,cur:false});
  for(let i=1;i<=last;i++) cells.push({d:i,cur:true,today:i===today&&_calMonth===tm&&_calYear===ty});
  let n=1; while(cells.length<42) cells.push({d:n++,cur:false});
  const weeks=[]; for(let i=0;i<6;i++) weeks.push(cells.slice(i*7,(i+1)*7));
  return `
    <div style="height:100%;display:flex;flex-direction:column">
      <div style="height:50px;flex-shrink:0;background:rgba(255,110,180,.03);
        border-bottom:1px solid var(--border);display:flex;align-items:center;
        padding:0 16px;gap:12px">
        <button class="app-btn" style="width:32px;height:32px;font-size:17px"
          onclick="_calPrev()">‹</button>
        <div style="flex:1;text-align:center;font-family:var(--font-display);
          font-size:16px;color:var(--text);letter-spacing:2px">
          ${MONS[_calMonth].toUpperCase()} ${_calYear}
        </div>
        <button class="app-btn" style="width:32px;height:32px;font-size:17px"
          onclick="_calNext()">›</button>
        <button class="app-btn" onclick="_calToday()">Today</button>
      </div>
      <div style="flex:1;padding:12px;display:flex;flex-direction:column;gap:4px">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px">
          ${DH.map(d=>`<div style="text-align:center;font-size:10px;letter-spacing:1px;color:var(--text-sub);padding:4px 0">${d}</div>`).join('')}
        </div>
        ${weeks.map(w=>`
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">
            ${w.map(c=>`
              <div class="cal-cell ${c.today?'today':''} ${!c.cur?'other':''}">
                <span style="font-size:13px">${c.d}</span>
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </div>`;
}
window._calPrev  = ()=>{ _calMonth--; if(_calMonth<0){_calMonth=11;_calYear--;} const wb=$('wb-calendar');if(wb)wb.innerHTML=buildCalendar(); };
window._calNext  = ()=>{ _calMonth++; if(_calMonth>11){_calMonth=0;_calYear++;} const wb=$('wb-calendar');if(wb)wb.innerHTML=buildCalendar(); };
window._calToday = ()=>{ _calYear=new Date().getFullYear();_calMonth=new Date().getMonth();const wb=$('wb-calendar');if(wb)wb.innerHTML=buildCalendar(); };

// ── CODE EDITOR ───────────────────────────────────────────
const CODE_FILES = {
  'index.tsx': `import React, { useState } from 'react'\n\n// AetherOS Blossom Component\nconst AetherOS = () => {\n  const [theme, setTheme] = useState('blossom')\n\n  return (\n    <div className="aetheros-wrapper">\n      <h1>AetherOS 🌸</h1>\n      <p>A universe of petals and code.</p>\n    </div>\n  )\n}\n\nexport default AetherOS`,
  'styles.css': `/* AetherOS Blossom Design System v5.0 */\n:root {\n  --accent:  #ff6eb4;\n  --accent2: #ff2d6b;\n  --crimson: #c0003a;\n  --glass:   rgba(255,110,180,.06);\n  --border:  rgba(255,110,180,.14);\n}`,
  'dbmms.ts':  `// AetherOS DBMMS v5.0\nexport interface User {\n  uid: string\n  username: string\n  displayName: string\n  avatar: string\n  bio: string\n  posts: string[]\n  images: string[]\n}\n\nexport class DBMMS {\n  async sync(table: string, id: string, data: any) {\n    return fetch('/sync', {\n      method: 'POST',\n      body: JSON.stringify({ table, id, data })\n    })\n  }\n}`,
};
let _curFile = 'index.tsx';

function buildCode() {
  const code  = CODE_FILES[_curFile] || '';
  const lines = code.split('\n');
  return `
    <div style="height:100%;display:flex;flex-direction:column">
      <div class="app-toolbar" style="overflow-x:auto">
        ${Object.keys(CODE_FILES).map(f=>`
          <button class="ctab ${f===_curFile?'active':''}" onclick="_codeSwitch('${f}')">${f}</button>
        `).join('')}
        <div style="margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-sub)">
          ${lines.length} lines · UTF-8
        </div>
      </div>
      <div style="display:grid;grid-template-columns:40px 1fr;flex:1;overflow:hidden">
        <div class="code-gutter" id="code-gutter">
          ${lines.map((_,i)=>`<div class="code-ln">${i+1}</div>`).join('')}
        </div>
        <textarea class="code-area" id="code-area"
          oninput="_codeInput()" spellcheck="false"
          onkeydown="_codeKey(event)">${code}</textarea>
      </div>
    </div>`;
}
window._codeSwitch = f=>{ _curFile=f; const wb=$('wb-code');if(wb)wb.innerHTML=buildCode(); };
window._codeInput  = ()=>{
  const a=$('code-area'),g=$('code-gutter');if(!a||!g)return;
  CODE_FILES[_curFile]=a.value;
  g.innerHTML=a.value.split('\n').map((_,i)=>`<div class="code-ln">${i+1}</div>`).join('');
};
window._codeKey = e=>{ if(e.key==='Tab'){e.preventDefault();const a=$('code-area'),s=a.selectionStart;a.value=a.value.substring(0,s)+'  '+a.value.substring(a.selectionEnd);a.selectionStart=a.selectionEnd=s+2;_codeInput();} };

// ── DUALSOUL ──────────────────────────────────────────────
let _dsTab = 'live';

function buildDualSoul() {
  return `
    <div style="height:100%;display:flex;flex-direction:column;background:#0e0008">
      <div style="display:flex;border-bottom:1px solid rgba(255,110,180,.08);flex-shrink:0">
        ${[['live','🌐 Live'],['shadow','◐ Shadow'],['nova','◑ Nova'],['archive','✿ Archive']].map(([k,l])=>`
          <button class="ds-tab ${_dsTab===k?'active':''}" onclick="_dsSwitch('${k}')">${l}</button>
        `).join('')}
        <a href="https://ad2p.lovable.app" target="_blank"
          style="margin-left:auto;padding:0 14px;display:flex;align-items:center;
            font-size:11px;color:rgba(255,110,180,.45);text-decoration:none;gap:5px;
            border-left:1px solid rgba(255,110,180,.07)">↗ Open</a>
      </div>
      <div id="ds-panel" style="flex:1;overflow:hidden">${buildDsPanel()}</div>
    </div>`;
}

function buildDsPanel() {
  if (_dsTab==='live') return `<iframe src="https://ad2p.lovable.app" style="width:100%;height:100%;border:none;background:#000" title="DualSoul" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>`;
  if (_dsTab==='archive') return `<div style="padding:18px;overflow-y:auto;height:100%"><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:3px;color:rgba(255,110,180,.2);margin-bottom:14px">✿ MEMORY ARCHIVE</div><div style="display:flex;gap:7px;flex-wrap:wrap">${['✿ First photograph','✿ Built first app','✿ Composed a song','✿ 3AM epiphany','✿ DualSoul born','✿ Two worlds merge','✿ The archive opens'].map(m=>`<div style="background:rgba(255,110,180,.04);border:1px solid rgba(255,110,180,.1);border-radius:8px;padding:5px 12px;font-size:11px;color:rgba(255,200,215,.4);cursor:pointer;transition:all .14s" onmouseover="this.style.color='#fff';this.style.borderColor='var(--accent)'" onmouseout="this.style.color='rgba(255,200,215,.4)';this.style.borderColor='rgba(255,110,180,.1)'">${m}</div>`).join('')}</div></div>`;
  const iS = _dsTab==='shadow';
  const c  = iS ? '#ffb3d1' : '#ff6eb4';
  const skills = iS
    ? [['Photography','Cinematic storytelling, film photography'],['Writing','Introspective poetry, memory logs'],['Ambience','Atmospheric music, lo-fi composition']]
    : [['Development','React, Next.js, TypeScript, WebGL'],['Music','Electronic production, synthesis'],['Design','UI/UX, motion design, generative art']];
  const projs = iS
    ? [['The Quiet Archive','A visual diary of forgotten spaces'],['Constellation Map','Memory mapped as a star field']]
    : [['AetherOS','This OS — running right now'],['DualSoul','The cinematic portfolio platform']];
  const quote = iS ? '"I capture light and call it memory."' : '"I write code like I write music — in loops and layers."';
  return `<div style="padding:24px;overflow-y:auto;height:100%;display:flex;flex-direction:column;gap:16px"><div style="text-align:center"><div style="font-family:var(--font-mono);font-size:9px;letter-spacing:4px;color:rgba(255,110,180,.4)">PROFILE · 0${iS?1:2}</div><div style="font-family:var(--font-display);font-size:24px;font-weight:600;color:${c};letter-spacing:5px;margin-top:5px">${iS?'SHADOW':'NOVA'}</div></div><div style="font-family:var(--font-display);font-size:12px;line-height:1.9;color:rgba(255,200,215,.42);font-style:italic;text-align:center">${quote}</div>${skills.map(([n,d])=>`<div style="padding:9px 0;border-bottom:1px solid rgba(255,110,180,.05)"><div style="font-family:var(--font-display);font-size:12px;letter-spacing:1px;color:${c}">${n}</div><div style="font-size:11px;color:rgba(255,180,210,.3);margin-top:2px">${d}</div></div>`).join('')}${projs.map(([n,d])=>`<div style="background:rgba(255,110,180,.03);border:1px solid rgba(255,110,180,.08);border-radius:10px;padding:12px"><div style="font-size:13px;color:#fff;font-weight:500">${n}</div><div style="font-size:11px;color:rgba(255,180,210,.3);margin-top:3px">${d}</div></div>`).join('')}</div>`;
}

window._dsSwitch = tab => {
  _dsTab = tab;
  const wb = $('wb-dualsoul');
  if (wb) wb.innerHTML = buildDualSoul();
};

console.log('%cAetherOS MiscApps — Ready', 'color:#ff6eb4');
