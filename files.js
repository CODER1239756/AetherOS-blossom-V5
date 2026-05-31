// =========================================================
//  AETHEROS BLOSSOM v5.0 — FILE EXPLORER APP
// =========================================================

window.FilesApp = (() => {

  const VFS = {
    '/':                   ['home','etc','usr','dev'],
    '/home':               ['user'],
    '/home/user':          ['photos','projects','music','notes.txt','readme.md','.ssh'],
    '/home/user/projects': ['atheros','dualsoul','portfolio','kali-tools'],
    '/home/user/photos':   ['blossom.png','memories.zip'],
    '/home/user/music':    ['petal_beats.mp3','ambient_01.flac'],
    '/home/user/.ssh':     ['id_rsa.pub','known_hosts'],
    '/etc':                ['atheros.conf','hosts','passwd'],
  };
  const ICONS = {
    photos:'🖼', projects:'💼', music:'🎵', 'notes.txt':'📄', 'readme.md':'📋',
    '.ssh':'🔒', atheros:'⬡', dualsoul:'✦', portfolio:'🌐', 'kali-tools':'🐉',
    'blossom.png':'🌸', 'memories.zip':'🗜', 'petal_beats.mp3':'🎶', 'ambient_01.flac':'🎶',
    'id_rsa.pub':'🔑', 'known_hosts':'🌐', 'atheros.conf':'⚙', hosts:'🌐', passwd:'🔐',
    home:'🏠', etc:'⚙', usr:'📁', dev:'💻', user:'🌸',
  };
  const SIDE = [
    { label:'🏠 Home',     path:'/home/user' },
    { label:'📷 Photos',   path:'/home/user/photos' },
    { label:'💼 Projects', path:'/home/user/projects' },
    { label:'🎵 Music',    path:'/home/user/music' },
    { label:'⚙ Etc',      path:'/etc' },
    { label:'/ Root',      path:'/' },
  ];

  let _cwd  = '/home/user';
  let _hist = ['/home/user'];
  let _hidx = 0;

  function build() { return render(); }

  function render() {
    const items = VFS[_cwd] || [];
    return `
      <div style="height:100%;display:flex;flex-direction:column">
        <!-- Toolbar -->
        <div class="app-toolbar">
          <button class="app-btn" ${_hidx>0?'':'disabled style="opacity:.3"'}
            onclick="FilesApp.navBack()">←</button>
          <button class="app-btn" onclick="FilesApp.refresh()">↺</button>
          <div style="flex:1;font-family:var(--font-mono);font-size:11px;
            color:var(--text-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 6px">
            ${_cwd}
          </div>
          <button class="app-btn" onclick="FilesApp.navTo('/home/user',true)">⌂</button>
        </div>

        <!-- Body -->
        <div style="flex:1;display:grid;grid-template-columns:162px 1fr;overflow:hidden">
          <!-- Sidebar -->
          <div class="files-sidebar">
            <div class="fsb-label">PLACES</div>
            ${SIDE.map(s => `
              <div class="fsb-item ${s.path===_cwd?'active':''}"
                onclick="FilesApp.navTo('${s.path}',true)">
                ${s.label}
              </div>`).join('')}
            <div class="fsb-label" style="margin-top:8px">CLOUD</div>
            <div class="fsb-item" onclick="notify('Cloud','Archive synced ☁',2000)">☁ Archive</div>
          </div>

          <!-- Files grid -->
          <div style="padding:12px;overflow-y:auto">
            ${!items.length
              ? '<div style="padding:20px;color:var(--text-sub);font-size:13px">Empty folder</div>'
              : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px">
                  ${items.map(f => {
                    const fp    = (_cwd === '/' ? '' : _cwd) + '/' + f;
                    const isDir = VFS[fp] !== undefined;
                    return `
                      <div class="fcard" ondblclick="${isDir ? `FilesApp.navTo('${fp}',true)` : `notify('Files','Opening ${f}…',1800)`}">
                        <div style="font-size:30px;line-height:1">${ICONS[f] || (isDir ? '📁' : '📄')}</div>
                        <div class="fcard-name ${isDir?'fcard-dir':''}">${f}</div>
                      </div>`;
                  }).join('')}
                </div>`}
          </div>
        </div>
      </div>`;
  }

  function navTo(path, push) {
    if (VFS[path] === undefined) return;
    _cwd = path;
    if (push) { _hist = _hist.slice(0, _hidx + 1); _hist.push(path); _hidx = _hist.length - 1; }
    const wb = $('wb-files'); if (wb) wb.innerHTML = render();
  }

  function navBack() {
    if (_hidx > 0) { _hidx--; _cwd = _hist[_hidx]; const wb=$('wb-files'); if(wb) wb.innerHTML=render(); }
  }

  function refresh() {
    const wb = $('wb-files'); if (wb) wb.innerHTML = render();
  }

  return { build, navTo, navBack, refresh };
})();

console.log('%cAetherOS Files — Ready', 'color:#ff6eb4');
