/* ==========================================================================
   LOOP — intro.js
   Chargé dans le <head>, AVANT l'affichage de la page (fichier minuscule).
   - Ajoute la classe "js" : les animations ne s'activent que si le
     JavaScript fonctionne (sinon tout le contenu reste visible).
   - Décide si l'écran d'introduction (logo qui se dessine) est joué :
     une seule fois par visite, et jamais si le visiteur a demandé
     à réduire les animations sur son appareil.
   ========================================================================== */
(function () {
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  // Pas d'intro sur les pages légales (attribut data-no-intro sur <html>)
  if (root.hasAttribute("data-no-intro")) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seen = false;
  try { seen = sessionStorage.getItem("loop-intro") === "1"; } catch (e) { /* navigation privée */ }

  if (!reduce && !seen) {
    root.classList.add("has-intro");
    try { sessionStorage.setItem("loop-intro", "1"); } catch (e) {}
  }
})();
