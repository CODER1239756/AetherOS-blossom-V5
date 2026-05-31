// =========================================================
//  AETHEROS BLOSSOM v5.0 — MAIN
//  Final init: startup notifications, keyboard shortcuts
// =========================================================

// Startup notifications (staggered)
setTimeout(() => notify('AetherOS', '🌸 Welcome back! System online.', 3500), 2200);
setTimeout(() => notify('Weather', '🌸 Mumbai · 28°C · Partly Cloudy', 3500), 5000);
setTimeout(() => notify('DBMMS', '☁ Cloud sync ready — configure in Settings → Cloud', 4000), 7500);
setTimeout(() => notify('Blossom AI', '✨ Online — ask me anything', 3000), 10000);
setTimeout(() => notify('AetherOS', '💡 Ctrl+K: Search · Right-click: Menu · Dbl-click icons: Open', 5000), 14000);

// Global keyboard shortcuts
document.addEventListener('keydown', e => {
  if (!document.getElementById('desktop')?.style?.display ||
      document.getElementById('desktop').style.display === 'none') return;

  // Ctrl/Cmd+K → Spotlight
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault(); toggleSpot();
  }
  // Escape → close spotlight / launcher
  if (e.key === 'Escape') {
    closeSpot();
    if (document.getElementById('launcher')?.classList.contains('open')) toggleLauncher();
  }
});

console.log('%c🌸 AetherOS Blossom v5.0 — All systems online', 'color:#ff6eb4;font-size:13px;font-weight:bold');
console.log('%c  Pink · White · Red · Liquid Glass · Kali Ethical Mode · DBMMS Cloud', 'color:rgba(255,180,210,.5);font-size:11px');
