// =========================================================
//  AETHEROS BLOSSOM v5.0 — UTILS
//  Shared helpers exposed on window object
// =========================================================

// Shorthand selectors
window.$ = id => document.getElementById(id);
window.qs = sel => document.querySelector(sel);

// Days / months
window.DAYS  = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
window.MONS  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
window.MONS3 = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// Create element helper
window.el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

// Format time as mm:ss
window.fmtTime = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

// Clamp number
window.clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Debounce
window.debounce = (fn, delay) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

// Read file as data URL
window.readFileAsDataURL = file => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload  = e => res(e.target.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});

// Safe JSON parse
window.safeJSON = (str, fallback = {}) => {
  try { return JSON.parse(str); } catch { return fallback; }
};

// DOM ready
window.onDOMReady = fn => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

console.log('%cAetherOS Blossom v5.0 — Utils loaded', 'color:#ff6eb4;font-weight:bold');
