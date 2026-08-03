// ============================================================
// Light "view source" deterrent
// ------------------------------------------------------------
// IMPORTANT: this does NOT actually hide or protect the code —
// anyone using browser DevTools' Network/Sources tab, curl, or
// "view-source:" directly can still see everything. This only
// blocks the obvious right-click / keyboard shortcuts so casual
// visitors don't stumble into the source by accident.
//
// Real protection for user data comes from Firebase Auth +
// Firestore Security Rules (see firestore.rules), not from
// hiding this file.
// ============================================================

(function () {
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  document.addEventListener("keydown", function (e) {
    const key = (e.key || "").toLowerCase();

    // F12 — DevTools
    if (e.key === "F12") { e.preventDefault(); return; }

    // Ctrl/Cmd + U — View Source
    if ((e.ctrlKey || e.metaKey) && key === "u") { e.preventDefault(); return; }

    // Ctrl/Cmd + S — Save Page
    if ((e.ctrlKey || e.metaKey) && key === "s") { e.preventDefault(); return; }

    // Ctrl/Cmd + Shift + I/J/C/K — DevTools panels (Inspect, Console, Element picker, Firefox console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(key)) {
      e.preventDefault();
      return;
    }
  });
})();
