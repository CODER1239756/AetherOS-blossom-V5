// =========================================================
//  AETHEROS BLOSSOM v5.0 — DBMMS
//  Database Management & Multi-device Sync System
//  Local: localStorage  |  Remote: configurable HTTPS API
// =========================================================

window.DB = (() => {
  const KEY     = 'aetheros_db_v5';
  const SESS_KEY = 'aether_sess_v5';

  // ── Core IO ──
  const load = () => safeJSON(localStorage.getItem(KEY), {});
  const save = db => localStorage.setItem(KEY, JSON.stringify(db));

  // ── Session ──
  const getSess = () => safeJSON(localStorage.getItem(SESS_KEY), null);
  const setSess = u  => localStorage.setItem(SESS_KEY, JSON.stringify(u));
  const clearSess    = () => localStorage.removeItem(SESS_KEY);

  // ── Users ──
  function createUser(username, password, displayName) {
    const db = load();
    if (!db.users) db.users = {};
    const uid  = 'u_' + Date.now();
    const hash = btoa(password + '_aether_v5_salt');
    db.users[uid] = {
      uid, username: username.toLowerCase(), displayName,
      passwordHash: hash, avatar: '🌸', bio: '',
      createdAt: new Date().toISOString(), posts: [], images: []
    };
    save(db);
    _cloud('users', uid, db.users[uid]);
    return db.users[uid];
  }

  function loginUser(username, password) {
    const db   = load();
    if (!db.users) return null;
    const hash = btoa(password + '_aether_v5_salt');
    const user = Object.values(db.users).find(u =>
      u.username === username.toLowerCase() && u.passwordHash === hash
    );
    if (user) {
      setSess(user);
      // Try to pull cloud data (non-blocking)
      pullCloud(user.uid).then(data => {
        if (data) window.notify?.('Cloud', '☁ Profile synced from cloud', 2500);
      });
      return user;
    }
    return null;
  }

  function getUser(uid) { return (load().users || {})[uid] || null; }

  function updateUser(uid, fields) {
    const db = load();
    if (!db.users || !db.users[uid]) return null;
    Object.assign(db.users[uid], fields);
    save(db);
    const s = getSess();
    if (s && s.uid === uid) setSess(db.users[uid]);
    _cloud('users', uid, db.users[uid]);
    return db.users[uid];
  }

  // ── Posts ──
  function addPost(uid, content, img = null) {
    const db = load();
    if (!db.posts) db.posts = {};
    const pid  = 'p_' + Date.now();
    const post = { pid, uid, content, img, createdAt: new Date().toISOString(), synced: false };
    db.posts[pid] = post;
    if (!db.users[uid].posts) db.users[uid].posts = [];
    db.users[uid].posts.unshift(pid);
    save(db);
    _cloud('posts', pid, post).then(ok => {
      if (ok) {
        const db2 = load();
        if (db2.posts[pid]) db2.posts[pid].synced = true;
        save(db2);
      }
    });
    return post;
  }

  function getPosts(uid) {
    const db = load();
    if (!db.posts || !db.users?.[uid]) return [];
    return (db.users[uid].posts || [])
      .map(pid => db.posts[pid])
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function deletePost(uid, pid) {
    const db = load();
    if (!db.posts?.[pid]) return;
    delete db.posts[pid];
    if (db.users?.[uid])
      db.users[uid].posts = (db.users[uid].posts || []).filter(p => p !== pid);
    save(db);
  }

  // ── Images (stored per-user for gallery) ──
  function addImage(uid, dataUrl, name = '') {
    const db = load();
    if (!db.images) db.images = {};
    const iid   = 'img_' + Date.now();
    const image = { iid, uid, dataUrl, name, createdAt: new Date().toISOString() };
    db.images[iid] = image;
    if (!db.users?.[uid]) return null;
    if (!db.users[uid].images) db.users[uid].images = [];
    db.users[uid].images.unshift(iid);
    save(db);
    return image;
  }

  function getImages(uid) {
    const db = load();
    if (!db.images || !db.users?.[uid]) return [];
    return (db.users[uid].images || [])
      .map(iid => db.images[iid])
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function deleteImage(uid, iid) {
    const db = load();
    if (!db.images?.[iid]) return;
    delete db.images[iid];
    if (db.users?.[uid])
      db.users[uid].images = (db.users[uid].images || []).filter(i => i !== iid);
    save(db);
  }

  // ── Cloud Sync ──
  async function _cloud(table, id, data) {
    const ep = localStorage.getItem('aether_cloud_ep');
    if (!ep) return false;
    try {
      const r = await fetch(ep + '/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-AetherOS': '5.0' },
        body: JSON.stringify({ table, id, data, ts: Date.now() })
      });
      return r.ok;
    } catch { return false; }
  }

  // Pull user's full data from cloud (called on login from new device)
  async function pullCloud(uid) {
    const ep = localStorage.getItem('aether_cloud_ep');
    if (!ep) return null;
    try {
      const r = await fetch(`${ep}/user/${uid}`, {
        headers: { 'X-AetherOS': '5.0' }
      });
      if (!r.ok) return null;
      const d  = await r.json();
      const db = load();
      if (!db.users)  db.users  = {};
      if (!db.posts)  db.posts  = {};
      if (!db.images) db.images = {};
      db.users[uid] = d.user;
      (d.posts  || []).forEach(p => { db.posts[p.pid]    = p; });
      (d.images || []).forEach(i => { db.images[i.iid]   = i; });
      save(db);
      setSess(d.user);
      return d;
    } catch { return null; }
  }

  // ── Gallery images for non-authenticated use (per-device) ──
  function addDeviceImage(dataUrl, name = '') {
    const db = load();
    if (!db.deviceImages) db.deviceImages = [];
    const entry = { iid: 'dimg_' + Date.now(), dataUrl, name, createdAt: new Date().toISOString() };
    db.deviceImages.unshift(entry);
    save(db); return entry;
  }

  function getDeviceImages() {
    return (load().deviceImages || []);
  }

  function deleteDeviceImage(iid) {
    const db = load();
    db.deviceImages = (db.deviceImages || []).filter(i => i.iid !== iid);
    save(db);
  }

  return {
    load, save, getSess, setSess, clearSess,
    createUser, loginUser, getUser, updateUser,
    addPost, getPosts, deletePost,
    addImage, getImages, deleteImage,
    addDeviceImage, getDeviceImages, deleteDeviceImage,
    pullCloud
  };
})();

console.log('%cAetherOS DBMMS v5.0 — Ready', 'color:#ff6eb4');
