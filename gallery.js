// =========================================================
//  AETHEROS BLOSSOM v5.0 — GALLERY APP
//  Upload-based gallery. No placeholder photos.
//  Users drag/drop or click to upload their own images.
// =========================================================

window.GalleryApp = (() => {

  let _lightboxImages = [];
  let _lightboxIdx    = 0;

  // ── Build ─────────────────────────────────────────────
  function build() {
    return `
      <div style="height:100%;display:flex;flex-direction:column;">
        <!-- Toolbar -->
        <div class="app-toolbar">
          <span class="app-toolbar-label" style="font-family:var(--font-mono)">GALLERY</span>
          <label class="app-btn" style="cursor:pointer" for="gallery-file-input">
            + Upload
            <input type="file" id="gallery-file-input" multiple accept="image/*"
              style="display:none" onchange="GalleryApp.handleFileInput(this)">
          </label>
          <button class="app-btn" onclick="GalleryApp.clearAll()"
            style="color:rgba(255,80,80,.5);margin-left:auto">Clear All</button>
        </div>

        <!-- Drop zone + grid -->
        <div id="gallery-body" style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
          ${renderBody()}
        </div>
      </div>

      <!-- Drop overlay (shown when dragging over window) -->
      <div id="gallery-drop-overlay" style="display:none;position:absolute;inset:0;z-index:20;
        background:rgba(255,45,107,.12);border:2px dashed var(--pink);border-radius:16px;
        display:none;align-items:center;justify-content:center;flex-direction:column;gap:8px;
        pointer-events:none;">
        <div style="font-size:48px">📸</div>
        <div style="color:var(--pink);font-size:14px;letter-spacing:2px">DROP TO UPLOAD</div>
      </div>`;
  }

  function renderBody() {
    const sess   = DB.getSess();
    const images = sess
      ? DB.getImages(sess.uid)
      : DB.getDeviceImages();

    if (!images.length) return renderEmpty();
    return renderGrid(images);
  }

  function renderEmpty() {
    return `
      <div class="gallery-empty">
        <div class="gallery-upload-zone" id="gallery-drop-zone"
          onclick="document.getElementById('gallery-file-input').click()"
          ondragover="GalleryApp.onDragOver(event)"
          ondragleave="GalleryApp.onDragLeave(event)"
          ondrop="GalleryApp.onDrop(event)">
          <div style="font-size:52px">📷</div>
          <div style="font-size:15px;color:var(--text-dim);font-family:var(--font-display);font-style:italic">
            Your photos will appear here
          </div>
          <div style="font-size:11px;color:var(--text-sub);line-height:1.7;max-width:280px">
            Drag &amp; drop images here, or click to upload from your device.<br>
            JPG · PNG · GIF · WebP supported.
          </div>
          <div class="btn-primary" style="margin-top:4px;pointer-events:none">
            Choose Photos
          </div>
        </div>
      </div>`;
  }

  function renderGrid(images) {
    return `
      <div id="gallery-drop-zone" class="gallery-grid-wrap"
        ondragover="GalleryApp.onDragOver(event)"
        ondragleave="GalleryApp.onDragLeave(event)"
        ondrop="GalleryApp.onDrop(event)">
        ${images.map((img, i) => `
          <div class="gcard" onclick="GalleryApp.openLightbox(${i})">
            <img src="${img.dataUrl}" alt="${img.name || 'Photo'}" loading="lazy">
            <div class="gcard-hover">
              <div class="gcard-action" onclick="event.stopPropagation();GalleryApp.openLightbox(${i})" title="View">🔍</div>
              <div class="gcard-action" onclick="event.stopPropagation();GalleryApp.deleteImage('${img.iid}')" title="Delete">🗑</div>
            </div>
          </div>`).join('')}
        <!-- Upload more tile -->
        <label class="gcard" style="cursor:pointer;border:1px dashed rgba(255,110,180,.2);
          background:rgba(255,110,180,.02);display:flex;align-items:center;justify-content:center;"
          for="gallery-file-input" title="Upload more">
          <div style="text-align:center;color:var(--text-sub)">
            <div style="font-size:24px">+</div>
            <div style="font-size:9px;letter-spacing:1px;margin-top:4px">UPLOAD</div>
          </div>
        </label>
      </div>`;
  }

  // ── File Handling ────────────────────────────────────
  async function handleFileInput(input) {
    const files = Array.from(input.files);
    await uploadFiles(files);
    input.value = '';
  }

  async function uploadFiles(files) {
    const sess = DB.getSess();
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const dataUrl = await readFileAsDataURL(file);
        if (sess) DB.addImage(sess.uid, dataUrl, file.name);
        else      DB.addDeviceImage(dataUrl, file.name);
      } catch (e) {
        console.error('Upload error:', e);
      }
    }
    refresh();
    notify('Gallery', `📸 ${files.length} photo${files.length > 1 ? 's' : ''} uploaded`, 2500);
  }

  // ── Drag & Drop ──────────────────────────────────────
  function onDragOver(e) {
    e.preventDefault();
    const zone = $('gallery-drop-zone');
    if (zone) zone.classList.add('drag-over');
  }

  function onDragLeave(e) {
    const zone = $('gallery-drop-zone');
    if (zone) zone.classList.remove('drag-over');
  }

  async function onDrop(e) {
    e.preventDefault();
    const zone = $('gallery-drop-zone');
    if (zone) zone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) await uploadFiles(files);
  }

  // ── Delete ───────────────────────────────────────────
  function deleteImage(iid) {
    const sess = DB.getSess();
    if (sess) DB.deleteImage(sess.uid, iid);
    else      DB.deleteDeviceImage(iid);
    refresh();
  }

  function clearAll() {
    if (!confirm('Delete all photos from gallery?')) return;
    const sess = DB.getSess();
    const imgs = sess ? DB.getImages(sess.uid) : DB.getDeviceImages();
    imgs.forEach(img => {
      if (sess) DB.deleteImage(sess.uid, img.iid);
      else      DB.deleteDeviceImage(img.iid);
    });
    refresh();
  }

  // ── Refresh ──────────────────────────────────────────
  function refresh() {
    const body = $('gallery-body');
    if (body) body.innerHTML = renderBody();
    // Also rebuild lightbox image list
    const sess   = DB.getSess();
    _lightboxImages = sess ? DB.getImages(sess.uid) : DB.getDeviceImages();
  }

  // ── Lightbox ─────────────────────────────────────────
  function openLightbox(idx) {
    const sess   = DB.getSess();
    _lightboxImages = sess ? DB.getImages(sess.uid) : DB.getDeviceImages();
    if (!_lightboxImages.length) return;
    _lightboxIdx = idx;
    showLightbox();
  }

  function showLightbox() {
    const img = _lightboxImages[_lightboxIdx];
    if (!img) return;

    const lb      = $('lightbox');
    const content = $('lb-content');
    const caption = $('lb-caption');

    if (content) {
      content.innerHTML = `<img src="${img.dataUrl}" alt="${img.name||'Photo'}"
        style="max-width:100%;max-height:72vh;border-radius:12px;display:block;
          box-shadow:0 20px 60px rgba(0,0,0,.5);">`;
    }
    if (caption) {
      caption.textContent = img.name || `Photo ${_lightboxIdx + 1} of ${_lightboxImages.length}`;
    }
    if (lb) {
      lb.style.display = 'flex';
      lb.classList.add('show');
    }

    // Keyboard navigation
    document.addEventListener('keydown', _lbKeyNav);
  }

  function _lbKeyNav(e) {
    if (e.key === 'ArrowRight') { _lightboxIdx = (_lightboxIdx + 1) % _lightboxImages.length; showLightbox(); }
    if (e.key === 'ArrowLeft')  { _lightboxIdx = (_lightboxIdx - 1 + _lightboxImages.length) % _lightboxImages.length; showLightbox(); }
    if (e.key === 'Escape') closeLB();
  }

  window.closeLB = function() {
    const lb = $('lightbox');
    if (lb) { lb.style.display = 'none'; lb.classList.remove('show'); }
    document.removeEventListener('keydown', _lbKeyNav);
  };

  return { build, handleFileInput, onDragOver, onDragLeave, onDrop, deleteImage, clearAll, openLightbox, refresh };
})();

console.log('%cAetherOS Gallery — Ready', 'color:#ff6eb4');
