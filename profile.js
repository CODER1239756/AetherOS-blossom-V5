// =========================================================
//  AETHEROS BLOSSOM v5.0 — PROFILE APP
//  DBMMS-backed: auth, posts (text+image), cloud sync
// =========================================================

window.ProfileApp = (() => {

  let _tab          = 'posts';
  let _pendingImg   = null;

  // ── Build ─────────────────────────────────────────────
  function build() {
    const sess = DB.getSess();
    return sess ? buildMain(sess) : buildAuth();
  }

  // ── Auth Screen ───────────────────────────────────────
  function buildAuth() {
    return `
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;
        justify-content:center;padding:28px;gap:14px;">
        <div style="font-family:var(--font-display);font-size:30px;font-weight:600;
          color:var(--text);text-align:center;line-height:1.2;">
          Welcome to<br><span style="color:var(--accent)">Your Profile</span>
        </div>
        <div style="font-size:13px;color:var(--text-dim);text-align:center;line-height:1.8;max-width:300px;">
          Sign in to sync your posts and images across<br>all your devices via cloud.
        </div>
        <div style="width:100%;max-width:320px;margin-top:6px;">
          <div class="section-label">USERNAME</div>
          <input id="auth-user" class="field" placeholder="your_username" autocomplete="username">
          <div class="section-label">PASSWORD</div>
          <input id="auth-pass" class="field" type="password" placeholder="••••••••"
            autocomplete="current-password"
            onkeydown="if(event.key==='Enter')ProfileApp.login()">
          <div style="display:flex;gap:10px;margin-top:4px;">
            <button class="btn-primary" style="flex:1" onclick="ProfileApp.login()">Sign In</button>
            <button class="btn-ghost"   style="flex:1" onclick="ProfileApp.register()">Create Account</button>
          </div>
          <div id="auth-msg" style="font-size:11px;color:var(--accent);text-align:center;
            margin-top:9px;min-height:16px;"></div>
        </div>
        <div style="font-size:11px;color:var(--text-sub);text-align:center;margin-top:6px;line-height:1.8;">
          ☁ Posts and images sync via HTTPS to your server.<br>
          Configure endpoint in <b style="color:var(--text-dim)">Settings → Cloud</b>.
        </div>
      </div>`;
  }

  // ── Main Profile ──────────────────────────────────────
  function buildMain(user) {
    const cloudUrl = localStorage.getItem('aether_cloud_ep') || '';
    return `
      <div style="height:100%;display:flex;flex-direction:column;">
        <div class="profile-hero">
          <div class="profile-avatar" id="profile-av-wrap" style="cursor:pointer"
            onclick="ProfileApp.cycleAvatar()" title="Click to change avatar">
            <span id="profile-av" style="font-size:32px">${user.avatar || '🌸'}</span>
          </div>
          <div style="flex:1">
            <div class="profile-name">${user.displayName}</div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:3px;display:flex;align-items:center;gap:8px;">
              @${user.username}
              <span class="pill ${cloudUrl ? 'pill-pink' : 'pill-dark'}">
                ${cloudUrl ? '☁ Cloud Active' : '💾 Local Only'}
              </span>
            </div>
            <div style="font-size:11px;color:var(--text-sub);margin-top:5px;">
              ${user.bio || 'Add a bio in Edit Profile →'}
            </div>
          </div>
          <button class="btn-ghost" style="font-size:11px;padding:6px 14px;align-self:flex-start"
            onclick="ProfileApp.logout()">Sign Out</button>
        </div>

        <!-- Tabs -->
        <div class="profile-tabs" style="display:flex;border-bottom:1px solid var(--border);flex-shrink:0">
          <div class="ptab ${_tab==='posts'  ?'active':''}" onclick="ProfileApp.switchTab('posts')">Posts</div>
          <div class="ptab ${_tab==='images' ?'active':''}" onclick="ProfileApp.switchTab('images')">Images</div>
          <div class="ptab ${_tab==='edit'   ?'active':''}" onclick="ProfileApp.switchTab('edit')">Edit Profile</div>
        </div>

        <!-- Tab Body -->
        <div id="profile-tab-body" style="flex:1;overflow-y:auto;padding:18px;">
          ${buildTab(user)}
        </div>
      </div>`;
  }

  function buildTab(user) {
    if (_tab === 'posts')  return buildPostsTab(user);
    if (_tab === 'images') return buildImagesTab(user);
    if (_tab === 'edit')   return buildEditTab(user);
    return '';
  }

  // ── Posts Tab ─────────────────────────────────────────
  function buildPostsTab(user) {
    const posts = DB.getPosts(user.uid);
    return `
      <div style="margin-bottom:14px;">
        <textarea id="post-text" class="field field-area"
          placeholder="What's on your mind? 🌸"></textarea>
        <div style="display:flex;align-items:center;gap:10px;">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;
            font-size:12px;color:var(--text-dim);">
            📎 Attach image
            <input type="file" accept="image/*" style="display:none"
              id="post-img-input" onchange="ProfileApp.previewImg(this)">
          </label>
          <div id="post-img-preview" style="display:none;font-size:11px;color:var(--accent)">
            Image ready ✓
          </div>
          <button class="btn-primary" style="margin-left:auto;padding:7px 18px"
            onclick="ProfileApp.submitPost()">Post 🌸</button>
        </div>
      </div>

      <div id="posts-list">
        ${!posts.length
          ? `<div style="text-align:center;padding:32px;color:var(--text-sub);font-size:13px">
               No posts yet. Share something beautiful! 🌸
             </div>`
          : posts.map(p => `
            <div class="post-card" id="pc-${p.pid}">
              <div class="post-meta">
                ${new Date(p.createdAt).toLocaleString()}
                ${p.synced ? '· <span style="color:var(--accent)">☁ Synced</span>' : '· 💾 Local'}
              </div>
              <div class="post-text">${p.content.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
              ${p.img ? `<img src="${p.img}" class="post-image" style="max-height:200px;object-fit:cover">` : ''}
              <div style="margin-top:8px;text-align:right">
                <button onclick="ProfileApp.deletePost('${user.uid}','${p.pid}')"
                  style="font-size:10px;color:rgba(255,80,80,.5);background:none;border:none;cursor:pointer">
                  🗑 Delete
                </button>
              </div>
            </div>`).join('')}
      </div>`;
  }

  // ── Images Tab ────────────────────────────────────────
  function buildImagesTab(user) {
    const imgs = DB.getImages(user.uid).filter(p => p.dataUrl);
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">
        ${!imgs.length
          ? `<div style="grid-column:1/-1;text-align:center;padding:32px;
               color:var(--text-sub);font-size:13px">
               No images yet. Upload photos in Gallery or attach them to posts. 🌸
             </div>`
          : imgs.map(img => `
            <div style="aspect-ratio:1;border-radius:var(--r);overflow:hidden;cursor:pointer;
              border:1px solid var(--border)" onclick="GalleryApp.openLightbox&&GalleryApp._openByUrl('${img.dataUrl}')">
              <img src="${img.dataUrl}" style="width:100%;height:100%;object-fit:cover">
            </div>`).join('')}
      </div>`;
  }

  // ── Edit Tab ─────────────────────────────────────────
  function buildEditTab(user) {
    const cloudUrl = localStorage.getItem('aether_cloud_ep') || '';
    const AVATARS  = ['🌸','🌺','🌹','🌷','💐','🦋','✨','🎀','💖','🌙','⭐','🍒'];
    return `
      <div style="max-width:400px">
        <div class="section-label">DISPLAY NAME</div>
        <input id="edit-dname" class="field" value="${user.displayName}" placeholder="Your display name">

        <div class="section-label">BIO</div>
        <textarea id="edit-bio" class="field field-area"
          placeholder="Tell the world about yourself...">${user.bio || ''}</textarea>

        <div class="section-label">AVATAR</div>
        <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px">
          ${AVATARS.map(e => `
            <div onclick="ProfileApp.setAvatar('${e}')"
              style="font-size:22px;cursor:pointer;padding:6px;border-radius:8px;
                border:2px solid ${user.avatar===e?'var(--accent)':'transparent'};
                transition:border .15s" id="av-${e}">${e}</div>`).join('')}
        </div>

        <div class="section-label">CLOUD SERVER ENDPOINT</div>
        <input id="edit-cloud" class="field"
          value="${cloudUrl}" placeholder="https://your-server.com/api">
        <div style="font-size:11px;color:var(--text-sub);margin-bottom:12px;line-height:1.8">
          Your HTTPS server should accept:<br>
          <code style="color:var(--text-dim)">POST /sync</code> — save records &nbsp;|&nbsp;
          <code style="color:var(--text-dim)">GET /user/:uid</code> — fetch on login
        </div>

        <button class="btn-primary" onclick="ProfileApp.saveEdit()">Save Changes</button>
      </div>`;
  }

  // ── Auth Actions ──────────────────────────────────────
  function login() {
    const u   = ($('auth-user') || {}).value || '';
    const p   = ($('auth-pass') || {}).value || '';
    const msg = $('auth-msg');
    if (!u || !p) { if (msg) msg.textContent = 'Please fill in all fields.'; return; }
    const user = DB.loginUser(u, p);
    if (user) {
      if (msg) msg.textContent = '';
      notify('Profile', `Welcome back, ${user.displayName}! 🌸`, 3000);
      _refresh();
    } else {
      if (msg) msg.textContent = 'Invalid username or password.';
    }
  }

  function register() {
    const u   = ($('auth-user') || {}).value || '';
    const p   = ($('auth-pass') || {}).value || '';
    const msg = $('auth-msg');
    if (!u || !p) { if (msg) msg.textContent = 'Please fill in all fields.'; return; }
    if (p.length < 6) { if (msg) msg.textContent = 'Password must be 6+ characters.'; return; }
    const db = DB.load();
    if (Object.values(db.users || {}).some(usr => usr.username === u.toLowerCase())) {
      if (msg) msg.textContent = 'Username already taken.'; return;
    }
    const user = DB.createUser(u, p, u);
    DB.setSess(user);
    notify('Profile', `Account created! Welcome, ${user.displayName}! 🌸`, 3500);
    _refresh();
  }

  function logout() {
    DB.clearSess();
    _tab = 'posts';
    notify('Profile', 'Signed out. See you soon! 🌸', 2500);
    _refresh();
  }

  // ── Tab Actions ───────────────────────────────────────
  function switchTab(tab) {
    _tab = tab;
    const sess = DB.getSess(); if (!sess) return;
    // Update active state
    document.querySelectorAll('.ptab').forEach((el, i) => {
      el.classList.toggle('active', ['posts','images','edit'][i] === tab);
    });
    const body = $('profile-tab-body');
    if (body) body.innerHTML = buildTab(DB.getUser(sess.uid));
  }

  // ── Post Actions ──────────────────────────────────────
  function previewImg(input) {
    const file = input.files[0]; if (!file) return;
    readFileAsDataURL(file).then(url => {
      _pendingImg = url;
      const prev = $('post-img-preview');
      if (prev) prev.style.display = 'inline';
    });
  }

  function submitPost() {
    const sess = DB.getSess(); if (!sess) return;
    const ta   = $('post-text'); if (!ta) return;
    const text = ta.value.trim();
    if (!text && !_pendingImg) return;
    const post = DB.addPost(sess.uid, text || '(image)', _pendingImg);
    ta.value = ''; _pendingImg = null;
    const prev = $('post-img-preview');
    if (prev) prev.style.display = 'none';
    notify('Profile', 'Post published! ☁ Syncing…', 2500);
    switchTab('posts');
  }

  function deletePost(uid, pid) {
    DB.deletePost(uid, pid);
    const card = $('pc-' + pid);
    if (card) {
      card.style.transition = 'opacity .3s';
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 310);
    }
  }

  // ── Edit Actions ─────────────────────────────────────
  function setAvatar(emoji) {
    const sess = DB.getSess(); if (!sess) return;
    DB.updateUser(sess.uid, { avatar: emoji });
    document.querySelectorAll('[id^="av-"]').forEach(el => el.style.borderColor = 'transparent');
    const avEl = $('av-' + emoji); if (avEl) avEl.style.borderColor = 'var(--accent)';
    const avSpan = $('profile-av'); if (avSpan) avSpan.textContent = emoji;
  }

  function cycleAvatar() {
    const AVTS = ['🌸','🌺','🌹','🌷','💐','🦋','✨','🎀','💖','🌙','⭐','🍒'];
    const sess = DB.getSess(); if (!sess) return;
    const cur  = sess.avatar || '🌸';
    const idx  = AVTS.indexOf(cur);
    const next = AVTS[(idx + 1) % AVTS.length];
    DB.updateUser(sess.uid, { avatar: next });
    const av = $('profile-av'); if (av) av.textContent = next;
  }

  function saveEdit() {
    const sess = DB.getSess(); if (!sess) return;
    const dname = ($('edit-dname') || {}).value || '';
    const bio   = ($('edit-bio')   || {}).value || '';
    const cloud = ($('edit-cloud') || {}).value || '';
    if (dname) DB.updateUser(sess.uid, { displayName: dname, bio });
    if (cloud) localStorage.setItem('aether_cloud_ep', cloud);
    else       localStorage.removeItem('aether_cloud_ep');
    notify('Profile', 'Profile updated! ☁ Syncing…', 2500);
    _refresh();
  }

  function _refresh() {
    const wb = $('wb-profile');
    if (wb) wb.innerHTML = build();
  }

  return {
    build, login, register, logout,
    switchTab, previewImg, submitPost, deletePost,
    setAvatar, cycleAvatar, saveEdit,
  };
})();

console.log('%cAetherOS Profile — Ready', 'color:#ff6eb4');
