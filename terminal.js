// =========================================================
//  AETHEROS BLOSSOM v5.0 — TERMINAL APP
//  Shell + Kali Linux Ethical Security Desktop
// =========================================================

window.TerminalApp = (() => {

  // ── Virtual Filesystem ───────────────────────────────────
  const VFS = {
    '/':                   ['home','etc','usr','dev','var'],
    '/home':               ['user'],
    '/home/user':          ['photos','projects','music','notes.txt','readme.md','.ssh'],
    '/home/user/projects': ['atheros','dualsoul','portfolio','kali-tools'],
    '/home/user/photos':   ['blossom.png','memories.zip'],
    '/home/user/music':    ['petal_beats.mp3','ambient_01.flac'],
    '/home/user/.ssh':     ['id_rsa.pub','known_hosts'],
    '/etc':                ['atheros.conf','hosts','passwd'],
    '/var':                ['log'],
    '/var/log':            ['system.log','security.log'],
  };

  const FILE_CONTENTS = {
    'notes.txt':     '"She remembered who she was and the game changed." — Lalah Delia',
    'readme.md':     '# AetherOS Blossom v5.0\nPersonal Digital Universe\nBuilt with love, code, and petals.',
    'atheros.conf':  '[system]\nversion=5.0\ntheme=blossom\nedition=girly\nkali_mode=enabled',
    'hosts':         '127.0.0.1   localhost\n::1         localhost\n10.0.0.1    atheros.local',
    'system.log':    '[INFO] AetherOS boot sequence complete\n[INFO] DBMMS cloud sync ready\n[INFO] Kali mode available',
    'security.log':  '[AUDIT] Last login: today\n[AUDIT] No threats detected\n[INFO] Ethical use only',
    'id_rsa.pub':    'ssh-rsa AAAAB3NzaC1yc2EAAA... user@atheros-blossom',
  };

  let cwd    = '/home/user';
  let hist   = [];
  let hIdx   = 0;
  let kaliOpen = false;

  // ── Build HTML ───────────────────────────────────────────
  function build() {
    cwd = '/home/user'; hist = []; hIdx = 0;
    return `
      <div style="position:relative;height:100%;display:flex;flex-direction:column">
        <div class="term-shell" id="term-out" style="flex:1">
          <div class="term-line" style="color:var(--accent)">AetherOS Blossom Terminal v5.0</div>
          <div class="term-line term-dim">${new Date().toLocaleString()} · user@atheros-blossom</div>
          <div class="term-line term-dim">Type 'help' for commands · Type 'kali' to open Kali Linux Security Desktop</div>
          <div class="term-line"></div>
          <div id="term-lines"></div>
          <div class="term-input-row term-line">
            <span class="term-prompt" id="term-prompt">user@blossom:/home/user$&nbsp;</span>
            <input class="term-input" id="term-inp" autocomplete="off" spellcheck="false"
              onkeydown="TerminalApp.keydown(event)">
          </div>
        </div>
        <!-- Kali Desktop (hidden until 'kali' command) -->
        <div id="kali-desktop" class="kali-desktop" style="display:none"></div>
      </div>`;
  }

  // ── Keydown handler ──────────────────────────────────────
  function keydown(e) {
    const inp = $('term-inp');
    if (!inp) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hIdx < hist.length) { hIdx++; inp.value = hist[hist.length - hIdx] || ''; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      inp.value = hIdx === 0 ? '' : hist[hist.length - hIdx] || '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const word  = inp.value.split(' ').pop();
      const items = VFS[cwd] || [];
      const match = items.find(x => x.startsWith(word));
      if (match) inp.value = inp.value.slice(0, -word.length) + match;
    } else if (e.key === 'Enter') {
      const cmd = inp.value.trim();
      inp.value = '';
      hIdx = 0;
      if (cmd) { hist.push(cmd); execute(cmd); }
    }
  }

  // ── Print helpers ────────────────────────────────────────
  function print(lines, cls = '') {
    const out = $('term-lines');
    if (!out) return;
    (Array.isArray(lines) ? lines : [lines]).forEach(l => {
      const d = document.createElement('div');
      d.className = 'term-line' + (cls ? ' ' + cls : '');
      d.innerHTML = l;
      out.appendChild(d);
    });
    const shell = $('term-out');
    if (shell) shell.scrollTop = shell.scrollHeight;
    const pr = $('term-prompt');
    if (pr) pr.textContent = `user@blossom:${cwd}$ `;
  }

  function echoCmd(cmd) {
    const out = $('term-lines');
    if (!out) return;
    const d = document.createElement('div');
    d.className = 'term-line';
    d.innerHTML = `<span class="term-prompt">user@blossom:${cwd}$</span> <span style="color:#fff">${cmd}</span>`;
    out.appendChild(d);
  }

  // ── Command executor ─────────────────────────────────────
  function execute(cmd) {
    echoCmd(cmd);
    const [base, ...args] = cmd.trim().split(/\s+/);

    switch (base.toLowerCase()) {
      case 'help':
        print([
          '<span style="color:var(--accent)">AetherOS Blossom Shell v5.0</span>',
          '',
          '  <b style="color:var(--blush)">ls</b>         list directory contents',
          '  <b style="color:var(--blush)">cd &lt;dir&gt;</b>    change directory',
          '  <b style="color:var(--blush)">pwd</b>        print working directory',
          '  <b style="color:var(--blush)">cat &lt;file&gt;</b>  display file contents',
          '  <b style="color:var(--blush)">echo &lt;txt&gt;</b>  print text',
          '  <b style="color:var(--blush)">clear</b>      clear terminal',
          '  <b style="color:var(--blush)">date</b>       show current date/time',
          '  <b style="color:var(--blush)">whoami</b>     show current user',
          '  <b style="color:var(--blush)">neofetch</b>   system information',
          '  <b style="color:var(--blush)">ps</b>         list running processes',
          '  <b style="color:var(--blush)">ping &lt;host&gt;</b> ping a host (simulated)',
          '  <b style="color:var(--blush)">ifconfig</b>   network configuration',
          '  <b style="color:var(--blush)">kali</b>       <span style="color:var(--pink)">open Kali Linux security desktop</span>',
          '',
        ]);
        break;

      case 'ls': {
        const items = VFS[cwd] || [];
        if (!items.length) { print(['  (empty)']); break; }
        print(items.map(x => {
          const full  = (cwd === '/' ? '' : cwd) + '/' + x;
          const isDir = VFS[full] !== undefined;
          const color = isDir ? 'color:var(--pink)' : 'color:rgba(255,210,225,.65)';
          return `  <span style="${color}">${x}${isDir ? '/' : ''}</span>`;
        }));
        break;
      }

      case 'pwd':
        print([cwd]);
        break;

      case 'cd': {
        const target = args[0];
        if (!target || target === '~') { cwd = '/home/user'; }
        else if (target === '..') {
          const parts = cwd.split('/').filter(Boolean);
          parts.pop();
          cwd = parts.length ? '/' + parts.join('/') : '/';
        } else {
          const np = (cwd === '/' ? '' : cwd) + '/' + target;
          if (VFS[np] !== undefined) cwd = np;
          else { print([`<span class="term-err">cd: ${target}: No such file or directory</span>`]); break; }
        }
        print([`→ ${cwd}`], 'term-ok');
        break;
      }

      case 'cat': {
        if (!args[0]) { print(['<span class="term-err">cat: missing operand</span>']); break; }
        const fc = FILE_CONTENTS[args[0]];
        if (fc) print(fc.split('\n'));
        else print([`<span class="term-err">cat: ${args[0]}: No such file</span>`]);
        break;
      }

      case 'echo':
        print([args.join(' ')]);
        break;

      case 'clear': {
        const out = $('term-lines');
        if (out) out.innerHTML = '';
        break;
      }

      case 'date':
        print([new Date().toString()]);
        break;

      case 'whoami':
        print([
          '<span class="term-ok">user</span>',
          'Role     : Creator · Architect of AetherOS Blossom',
          'Shell    : /bin/blossom',
          'Home     : /home/user',
        ]);
        break;

      case 'ps':
        print([
          '<span class="term-dim">  PID   NAME                  STATUS</span>',
          '  001   dualsoul-core         <span class="term-ok">running</span>',
          '  002   blossom-shell         <span class="term-ok">running</span>',
          '  003   aurora-canvas         <span class="term-ok">running</span>',
          '  004   dbmms-cloud-sync      <span class="term-ok">running</span>',
          '  005   blossom-ai            <span class="term-ok">running</span>',
          '  006   particle-engine       <span class="term-ok">running</span>',
        ]);
        break;

      case 'ifconfig':
        print([
          'eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;',
          '      inet 10.0.0.1   netmask 255.255.255.0',
          '      inet6 ::1       prefixlen 128',
          '      ether ff:6e:b4:00:00:01',
          '',
          'lo:   flags=73&lt;UP,LOOPBACK,RUNNING&gt;',
          '      inet 127.0.0.1  netmask 255.0.0.0',
        ]);
        break;

      case 'ping': {
        const host = args[0] || 'localhost';
        print([`PING ${host}: 56 data bytes`]);
        let i = 0;
        const piv = setInterval(() => {
          const ms = (Math.random() * 20 + 5).toFixed(1);
          print([`64 bytes from ${host}: icmp_seq=${++i} ttl=64 time=${ms} ms`]);
          if (i >= 4) {
            clearInterval(piv);
            print([`--- ${host} ping statistics ---`, `4 packets transmitted, 4 received, 0% packet loss`]);
          }
        }, 600);
        break;
      }

      case 'neofetch':
        neofetch();
        break;

      case 'kali':
        openKali();
        break;

      default:
        print([`<span class="term-err">Command not found: ${base}</span>  (type 'help')`]);
    }

    const shell = $('term-out');
    if (shell) shell.scrollTop = shell.scrollHeight;
  }

  // ── Neofetch ─────────────────────────────────────────────
  function neofetch() {
    const out = $('term-lines');
    if (!out) return;
    const lines = [
      '       _    _   ___  _   _  _____  _____',
      '      /_\\  | | |_ _|| | | ||  ___||  __ \\',
      '     / _ \\ | |_ | | | |_| || |__  | |  | |',
      '    /_/ \\_\\|___|___| \\___/ |_____||_|  |_|',
    ];
    lines.forEach(l => {
      const d = document.createElement('div');
      d.className = 'term-line';
      d.innerHTML = `<span style="color:var(--pink)">${l}</span>`;
      out.appendChild(d);
    });
    const info = [
      ['OS',          'AetherOS 5.0 Blossom Edition'],
      ['Host',        'Personal Digital Universe'],
      ['Kernel',      'AetherKernel 12.5-blossom'],
      ['Shell',       'Blossom Shell v5.0'],
      ['DE',          'Liquid Glass Desktop'],
      ['Theme',       'Pink · White · Red'],
      ['Memory',      '∞ GB Quantum RAM'],
      ['DBMMS',       'Cloud-Sync Active'],
      ['Kali Mode',   'Available — ethical use only'],
    ];
    info.forEach(([k, v]) => {
      const d = document.createElement('div');
      d.className = 'term-line';
      d.innerHTML = `  <span style="color:var(--pink)">${k}:</span> <span style="color:rgba(255,210,225,.6)">${v}</span>`;
      out.appendChild(d);
    });
    const dots = document.createElement('div');
    dots.className = 'term-line';
    dots.style.marginTop = '5px';
    dots.innerHTML = ['#ff2d6b','#ff6eb4','#ffb3d1','#ffd6e7','#e8003d','#c0003a'].map(c =>
      `<span style="color:${c};font-size:18px">●</span>`).join(' ');
    out.appendChild(dots);
    const shell = $('term-out');
    if (shell) shell.scrollTop = shell.scrollHeight;
  }

  // ── Kali Linux Desktop ───────────────────────────────────
  const KALI_TOOLS = {
    recon: [
      { id:'nmap',       icon:'🔍', name:'Nmap',         desc:'Network port scanner' },
      { id:'whois',      icon:'🌐', name:'Whois',        desc:'Domain registration lookup' },
      { id:'traceroute', icon:'📡', name:'Traceroute',   desc:'Trace network path to host' },
      { id:'dnsrecon',   icon:'📋', name:'DNS Recon',    desc:'DNS enumeration tool' },
    ],
    web: [
      { id:'nikto',      icon:'🕷', name:'Nikto',        desc:'Web server scanner' },
      { id:'dirb',       icon:'📂', name:'DIRB',         desc:'Web directory brute forcer' },
      { id:'sqlmap',     icon:'💉', name:'SQLMap',       desc:'SQL injection tester' },
      { id:'burp',       icon:'🔧', name:'Burp Suite',   desc:'Web application proxy' },
    ],
    network: [
      { id:'wireshark',  icon:'🦈', name:'Wireshark',    desc:'Packet analyser (simulated)' },
      { id:'netcat',     icon:'🔌', name:'Netcat',       desc:'Network utility' },
      { id:'arpspoof',   icon:'📶', name:'ARP Scan',     desc:'Network host discovery' },
      { id:'masscan',    icon:'⚡', name:'Masscan',      desc:'Fast port scanner' },
    ],
    password: [
      { id:'hydra',      icon:'🐉', name:'Hydra',        desc:'Login brute-forcer (ethical)' },
      { id:'hashcat',    icon:'#️⃣', name:'Hashcat',      desc:'Password hash cracker' },
      { id:'john',       icon:'🔑', name:'John the Ripper',desc:'Password auditing tool' },
      { id:'crunch',     icon:'🎲', name:'Crunch',       desc:'Wordlist generator' },
    ],
    exploit: [
      { id:'msf',        icon:'🎯', name:'Metasploit',   desc:'Penetration testing framework' },
      { id:'searchsploit',icon:'📚',name:'SearchSploit', desc:'Offline exploit database' },
      { id:'beef',       icon:'🐄', name:'BeEF',         desc:'Browser exploitation framework' },
      { id:'armitage',   icon:'🗺', name:'Armitage',     desc:'Metasploit GUI' },
    ],
    forensics: [
      { id:'autopsy',    icon:'🔬', name:'Autopsy',      desc:'Digital forensics platform' },
      { id:'volatility', icon:'💾', name:'Volatility',   desc:'Memory forensics' },
      { id:'binwalk',    icon:'🗃', name:'Binwalk',      desc:'Firmware analysis' },
      { id:'strings',    icon:'📝', name:'Strings',      desc:'Extract strings from binary' },
    ],
  };

  // Simulated outputs for each tool
  const TOOL_OUTPUTS = {
    nmap:       (t) => `Starting Nmap 7.94 ( https://nmap.org )\n<span class="info">Scanning ${t||'192.168.1.1'} [1000 ports]</span>\n<span class="ok">PORT     STATE  SERVICE</span>\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  open   https\n8080/tcp closed http-alt\n\nNmap done: 1 IP address (1 host up) scanned in 2.34s`,
    whois:      (t) => `Domain: ${t||'example.com'}\nRegistrar: AetherDomains LLC\nCreated: 2020-01-01\nExpires: 2025-01-01\nName Server: ns1.aether.local\nStatus: clientTransferProhibited`,
    traceroute: (t) => `traceroute to ${t||'8.8.8.8'} (${t||'8.8.8.8'}), 30 hops max:\n<span class="ok"> 1  192.168.1.1     1.2 ms   1.1 ms   1.0 ms</span>\n<span class="ok"> 2  10.0.0.1        5.4 ms   5.1 ms   5.3 ms</span>\n<span class="info"> 3  172.16.0.1     12.1 ms  11.9 ms  12.0 ms</span>\n<span class="ok"> 4  ${t||'8.8.8.8'}      20.4 ms  19.8 ms  20.2 ms</span>`,
    dnsrecon:   (t) => `[*] Performing DNS recon for ${t||'example.com'}\n<span class="ok">[+] A    ${t||'example.com'}  93.184.216.34</span>\n<span class="ok">[+] NS   ns1.${t||'example.com'}  205.251.196.1</span>\n<span class="info">[+] MX   mail.${t||'example.com'}  10</span>`,
    nikto:      (t) => `- Nikto v2.1.6\n- Target: ${t||'http://localhost'}\n<span class="warn">+ Server: Apache/2.4.41</span>\n<span class="warn">+ /admin/: Admin interface found</span>\n<span class="err">+ OSVDB-3233: /phpinfo.php: PHP info exposed</span>\n<span class="ok">+ End of scan. 3 items reported.</span>`,
    dirb:       (t) => `DIRB v2.22\nURL: ${t||'http://localhost/'}\n<span class="ok">+ ${t||'http://localhost'}/index.html (CODE:200|SIZE:1024)</span>\n<span class="ok">+ ${t||'http://localhost'}/admin/ (CODE:403|SIZE:289)</span>\n<span class="warn">+ ${t||'http://localhost'}/backup/ (CODE:200|SIZE:512)</span>\nEND_SCAN`,
    sqlmap:     (t) => `sqlmap/1.7 - automatic SQL injection tool\nTarget: ${t||'http://target.com/page?id=1'}\n<span class="warn">[INFO] testing connection...</span>\n<span class="ok">[INFO] GET parameter 'id' is injectable</span>\n<span class="warn">[WARN] always obtain written permission before testing</span>`,
    burp:       ()  => `Burp Suite Community Edition\n<span class="info">Proxy running on 127.0.0.1:8080</span>\nIntercept: ON\n<span class="ok">Ready to capture HTTP/HTTPS traffic</span>`,
    wireshark:  ()  => `Wireshark 4.0.7 (simulated)\n<span class="info">Capturing on eth0...</span>\n<span class="ok">Frame 1: 74 bytes on wire</span>\n  IP: 10.0.0.1 → 93.184.216.34\n  TCP: 54321 → 80 [SYN]\n<span class="ok">Frame 2: 74 bytes on wire</span>\n  IP: 93.184.216.34 → 10.0.0.1\n  TCP: 80 → 54321 [SYN,ACK]`,
    netcat:     (t) => `Ncat: ${t||'Connection to localhost 4444 port [tcp/*] succeeded!'}\n<span class="ok">Connected!</span>\n<span class="info">Type messages, Ctrl+C to exit</span>`,
    arpspoof:   ()  => `ARP Scan — Network Discovery\n<span class="info">Interface: eth0  (10.0.0.1/24)</span>\n<span class="ok">10.0.0.1   ff:ff:ff:00:00:01  AetherGateway</span>\n<span class="ok">10.0.0.50  de:ad:be:ef:00:02  Unknown Device</span>\n<span class="ok">10.0.0.100 aa:bb:cc:dd:ee:ff  AetherOS Host</span>\n3 hosts found.`,
    masscan:    (t) => `Masscan 1.3 — Mass IP Port Scanner\nScanning ${t||'192.168.1.0/24'}...\n<span class="ok">Discovered open port 22/tcp on 192.168.1.1</span>\n<span class="ok">Discovered open port 80/tcp on 192.168.1.10</span>\nDone. Rate: 10000 pkts/sec.`,
    hydra:      (t) => `Hydra v9.4 — Login Brute Force (ETHICAL USE ONLY)\nTarget: ${t||'ssh://192.168.1.1'}\n<span class="warn">[WARNING] Only test systems you own or have permission to test</span>\n<span class="info">Trying admin:admin...</span>\n<span class="err">[ERROR] Invalid credentials</span>\n<span class="ok">Hydra scan complete. 0 valid logins found.</span>`,
    hashcat:    (t) => `hashcat v6.2.6 — Password Hash Cracker\nHash: ${t||'5f4dcc3b5aa765d61d8327deb882cf99'}\nMode: MD5\n<span class="info">Status: Running...</span>\n<span class="ok">password  →  [CRACKED]  "password"</span>\nCrack time: 0.1s`,
    john:       ()  => `John the Ripper 1.9.0\nLoaded 1 password hash (md5crypt)\n<span class="ok">Cracked: user123 (user)</span>\nSession completed.`,
    crunch:     ()  => `Crunch 3.6 — Wordlist Generator\n<span class="info">Generating 6-8 char wordlist...</span>\n<span class="ok">Created: wordlist.txt (1.2 MB, 42,000 words)</span>`,
    msf:        ()  => `      <span style="color:#7c3aed">  =[ </span>metasploit v6.3.4<span style="color:#7c3aed"> ]=</span>\n<span class="ok">+ -- --=[ 2278 exploits - 1192 auxiliary ]</span>\n<span class="info">msf6 ></span> <span style="color:#a78bfa">help</span>\n<span class="info">Core Commands: search, use, info, exploit, sessions</span>\n<span class="warn">ETHICAL USE ONLY — Always obtain written authorisation</span>`,
    searchsploit:(t) => `Exploit-DB SearchSploit v4.2\nSearching: ${t||'apache 2.4'}\n<span class="ok">Apache 2.4.49 - Path Traversal (CVE-2021-41773) | remote/webapps/50383.sh</span>\n<span class="info">Apache 2.4.x - Denial of Service            | dos/webapps/41065.py</span>`,
    beef:       ()  => `BeEF 0.5.4 — Browser Exploitation Framework\n<span class="info">UI running at: http://localhost:3000/ui/panel</span>\n<span class="ok">REST API: http://localhost:3000/api</span>\n<span class="warn">Use only on systems you have explicit permission to test</span>`,
    armitage:   ()  => `Armitage — Metasploit GUI\n<span class="info">Connecting to Metasploit RPC server...</span>\n<span class="ok">Connected! Loading workspace...</span>`,
    autopsy:    ()  => `Autopsy 4.19.3 — Digital Forensics\n<span class="info">New Case: AetherOS Investigation</span>\n<span class="ok">Evidence source added: /dev/sda</span>\nAnalysing file system... done.\n<span class="ok">Found: 1,204 files · 45 images · 12 deleted files</span>`,
    volatility: ()  => `Volatility 3 — Memory Forensics\nProfile: Win10x64\n<span class="ok">pslist: 62 processes found</span>\n<span class="warn">malfind: 2 suspicious memory regions detected</span>\n<span class="info">netscan: 14 network connections</span>`,
    binwalk:    ()  => `binwalk v2.3.4 — Firmware Analysis\nScan: firmware.bin\n<span class="ok">0       JPEG  JFIF image data</span>\n<span class="ok">12,482  gzip  compressed data</span>\n<span class="info">52,844  ELF   32-bit LSB executable</span>`,
    strings:    (t) => `strings — Extract printable strings\nFile: ${t||'binary.bin'}\nMinimum length: 4\n<span class="ok">AetherOS\nBlossom\nhttp://localhost/api\npassword_hash\nSHA256</span>`,
  };

  let _activeTool = null;
  let _activeCategory = 'recon';

  function openKali() {
    kaliOpen = true;
    const kd = $('kali-desktop');
    if (!kd) return;
    kd.style.display = 'flex';
    renderKali();
    print(['<span style="color:#c084fc">Launching Kali Linux Security Desktop...</span>'], 'term-ok');
    notify('Kali Mode', '🔐 Ethical Security Desktop open — use responsibly', 4000);
  }

  function renderKali() {
    const kd = $('kali-desktop');
    if (!kd) return;

    const cats = Object.keys(KALI_TOOLS);
    const tools = KALI_TOOLS[_activeCategory] || [];

    kd.innerHTML = `
      <div class="kali-topbar">
        <span class="kali-logo">KALI LINUX</span>
        <span class="kali-badge">ETHICAL MODE</span>
        <span class="kali-badge" style="color:rgba(255,200,255,.5)">BLOSSOM EDITION</span>
        <button class="kali-close-btn" onclick="TerminalApp.closeKali()">✕ Exit Kali</button>
      </div>
      <div class="kali-body">
        <div class="kali-sidebar">
          ${cats.map(cat => `
            <div class="kali-cat-label">${cat.toUpperCase()}</div>
            ${(KALI_TOOLS[cat] || []).map(tool => `
              <button class="kali-tool-btn ${_activeTool === tool.id ? 'active' : ''}"
                onclick="TerminalApp.selectTool('${tool.id}','${cat}')">
                <span class="kali-tool-icon">${tool.icon}</span>${tool.name}
              </button>`).join('')}
          `).join('')}
        </div>
        <div class="kali-main" id="kali-main">
          ${_activeTool ? renderToolPanel(_activeTool) : renderKaliHome()}
        </div>
      </div>`;
  }

  function renderKaliHome() {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;padding:30px;">
        <div style="font-size:48px">🐉</div>
        <div style="font-family:var(--font-mono);font-size:22px;font-weight:bold;color:#c084fc;letter-spacing:4px">KALI LINUX</div>
        <div style="font-size:11px;color:rgba(200,150,255,.4);letter-spacing:3px">SECURITY TOOLS · BLOSSOM EDITION</div>
        <div style="max-width:400px;text-align:center;font-size:12px;color:rgba(200,150,255,.35);line-height:2;margin-top:8px;">
          Select a tool from the sidebar to begin.<br>
          All tools are for <b style="color:#c084fc">ethical, authorised testing only</b>.<br>
          Always obtain written permission before testing any system you do not own.
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;width:100%;max-width:480px;">
          ${Object.keys(KALI_TOOLS).map(cat => `
            <div onclick="TerminalApp.selectCategory('${cat}')" style="background:rgba(100,0,200,.08);border:1px solid rgba(100,0,200,.2);border-radius:10px;padding:12px;cursor:pointer;text-align:center;transition:all .15s;" onmouseover="this.style.background='rgba(100,0,200,.18)'" onmouseout="this.style.background='rgba(100,0,200,.08)'">
              <div style="font-size:10px;letter-spacing:2px;color:rgba(180,100,255,.6)">${cat.toUpperCase()}</div>
              <div style="font-size:20px;margin-top:5px;">${{recon:'🔍',web:'🕸',network:'📡',password:'🔑',exploit:'🎯',forensics:'🔬'}[cat]}</div>
              <div style="font-size:9px;color:rgba(150,80,255,.4);margin-top:3px;">${KALI_TOOLS[cat].length} tools</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderToolPanel(toolId) {
    let tool = null;
    for (const cat of Object.values(KALI_TOOLS)) {
      const found = cat.find(t => t.id === toolId);
      if (found) { tool = found; break; }
    }
    if (!tool) return renderKaliHome();

    return `
      <div style="padding:16px;display:flex;flex-direction:column;gap:12px;height:100%;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:28px">${tool.icon}</span>
          <div>
            <div class="kali-panel-title">${tool.name}</div>
            <div class="kali-panel-desc">${tool.desc}</div>
          </div>
        </div>
        <div class="kali-disclaimer">
          ⚠ <b>ETHICAL USE ONLY</b> — This tool simulation is for educational purposes and authorised penetration testing only.
          Never use security tools against systems without explicit written permission from the owner.
          Unauthorised access is illegal and unethical.
        </div>
        <div class="kali-input-row">
          <input class="kali-input" id="kali-target" placeholder="Enter target (IP, domain, URL, hash...)">
          <button class="kali-run-btn" onclick="TerminalApp.runTool('${toolId}')">▶ Run</button>
        </div>
        <div class="kali-output" id="kali-output">
          <span style="color:rgba(150,80,255,.4)">Enter a target above and click Run to simulate output.</span>
        </div>
      </div>`;
  }

  function runTool(toolId) {
    const inp = $('kali-target');
    const out = $('kali-output');
    if (!out) return;
    const target = inp ? inp.value.trim() : '';
    out.innerHTML = '<span style="color:rgba(150,80,255,.5)">Running...</span>';
    setTimeout(() => {
      const fn = TOOL_OUTPUTS[toolId];
      out.innerHTML = fn ? fn(target) : `<span class="ok">${toolId} completed successfully.</span>`;
      out.scrollTop = out.scrollHeight;
    }, 800 + Math.random() * 600);
  }

  function selectTool(toolId, cat) {
    _activeTool    = toolId;
    _activeCategory = cat;
    renderKali();
    const km = $('kali-main');
    if (km) km.innerHTML = renderToolPanel(toolId);
  }

  function selectCategory(cat) {
    _activeCategory = cat;
    _activeTool = null;
    renderKali();
  }

  function closeKali() {
    kaliOpen = false;
    const kd = $('kali-desktop');
    if (kd) kd.style.display = 'none';
    print(['<span style="color:#c084fc">Kali Linux Desktop closed.</span>']);
  }

  return { build, keydown, runTool, selectTool, selectCategory, closeKali, openKali };

})();

console.log('%cAetherOS Terminal+Kali — Ready', 'color:#c084fc');
