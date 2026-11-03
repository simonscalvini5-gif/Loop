/* ==========================================================================
   LOOP — main.js
   Interactions et animations du site.
   Seule bibliothèque utilisée : Lenis (défilement fluide), dans assets/js/vendor.

   1.  Outils (calcul à chaque image)
   2.  Défilement fluide (Lenis) et liens d'ancre
   3.  Écran d'introduction
   4.  En-tête : couleur selon la section, masqué en descendant, progression
   5.  Menu mobile
   6.  Apparition au défilement + titres mot par mot
   7.  Accueil : le texte s'efface en quittant la section
   8.  Histoire : le logo se dessine et les phrases se succèdent
   9.  Bandeau noir : il s'élargit, puis les mots s'éclairent
   10. Méthode : le symbole se dessine au fil des étapes
   11. Bandeau de mots qui glissent
   12. Année du pied de page
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };


  /* 1. Outils --------------------------------------------------------------
     Toutes les animations liées au défilement sont calculées ensemble,
     une seule fois par image affichée. */
  var scrollTasks = [];
  var ticking = false;
  function onScrollFrame(fn) { scrollTasks.push(fn); }
  function runScrollTasks() {
    ticking = false;
    for (var i = 0; i < scrollTasks.length; i++) scrollTasks[i]();
  }
  function requestTick() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(runScrollTasks); }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  // Progression (0 → 1) d'un élément : 0 quand son haut est à startRatio
  // de la hauteur d'écran, 1 quand il atteint endRatio
  function progressOf(el, startRatio, endRatio) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * startRatio;
    var end = vh * endRatio;
    return clamp((start - rect.top) / (start - end), 0, 1);
  }


  /* 2. Défilement fluide ---------------------------------------------------- */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.09 });
    lenis.on("scroll", requestTick);
    var raf = function (time) { lenis.raf(time); window.requestAnimationFrame(raf); };
    window.requestAnimationFrame(raf);
  }

  // Liens vers une section de la page (#solution…) : défilement doux,
  // en tenant compte de la hauteur de l'en-tête
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var headerEl = document.querySelector("[data-header]");
    var offset = headerEl ? -headerEl.offsetHeight : 0;
    if (lenis) lenis.scrollTo(target, { offset: offset, duration: 1.6 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + id);
  });


  /* 3. Écran d'introduction ------------------------------------------------- */
  var intro = document.querySelector(".intro");
  if (intro && root.classList.contains("has-intro")) {
    if (lenis) lenis.stop();                         // pas de défilement pendant l'intro
    intro.addEventListener("animationend", function (e) {
      if (e.target !== intro) return;
      intro.remove();
      if (lenis) lenis.start();
    });
  }


  /* 4. En-tête -------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  var darkSections = document.querySelectorAll('[data-theme="dark"]');
  var lastY = window.scrollY;
  if (header) {
    onScrollFrame(function () {
      var y = window.scrollY;
      var h = header.offsetHeight;
      header.classList.toggle("is-scrolled", y > 8);

      // Texte blanc quand l'en-tête passe au-dessus d'une section noire
      var dark = false;
      for (var i = 0; i < darkSections.length; i++) {
        var r = darkSections[i].getBoundingClientRect();
        if (r.top <= h / 2 && r.bottom >= h / 2) { dark = true; break; }
      }
      header.classList.toggle("is-dark", dark);

      // Masqué en descendant, réaffiché en remontant
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (!document.body.classList.contains("nav-open")) {
        if (goingDown && y > 240) header.classList.add("is-hidden");
        else if (goingUp || y < 240) header.classList.remove("is-hidden");
      }
      if (goingDown || goingUp) lastY = y;

      // Barre de progression de lecture
      var max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
    });
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  }


  /* 5. Menu mobile ---------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    var label = toggle.querySelector("[data-label]");
    var setMenu = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setMenu(false); });
  }

  // Lien du menu correspondant à la section visible
  var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }


  /* 6. Apparition au défilement --------------------------------------------- */
  // Titres .split : chaque mot est placé dans un cache pour monter à son tour
  document.querySelectorAll(".split").forEach(function (title) {
    var words = title.textContent.trim().split(/\s+/);
    title.textContent = "";
    words.forEach(function (word, i) {
      var outer = document.createElement("span");
      var inner = document.createElement("span");
      outer.className = "w";
      inner.style.setProperty("--wi", i);
      inner.textContent = word;
      outer.appendChild(inner);
      title.appendChild(outer);
      if (i < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
  });

  var revealables = document.querySelectorAll(".reveal, .reveal-line, .split, [data-reveal-self]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }


  /* 7. Accueil : sortie en douceur ------------------------------------------ */
  var hero = document.querySelector("[data-hero]");
  if (hero && !reduceMotion) {
    onScrollFrame(function () {
      var rect = hero.getBoundingClientRect();
      var p = clamp(-rect.top / (rect.height * 0.9), 0, 1);
      hero.style.setProperty("--hp", p.toFixed(4));
    });
  }


  /* 8. Histoire : le logo relie tout ---------------------------------------- */
  var story = document.querySelector("[data-story]");
  if (story && !reduceMotion) {
    var draw = story.querySelector(".story-draw");
    var logo = story.querySelector(".story-logo");
    var lines = story.querySelectorAll(".story-lines li");
    var count = story.querySelector("[data-story-count]");
    var currentLine = -1;

    onScrollFrame(function () {
      var rect = story.getBoundingClientRect();
      var scrollable = rect.height - window.innerHeight;
      var p = clamp(-rect.top / scrollable, 0, 1);

      // 0 → 0,72 : la boucle se dessine · 0,72 → 0,8 : la barre centrale
      // 0,8 → 0,95 : le L et le P apparaissent et forment « LOOP »
      draw.style.setProperty("--s-loop", (1 - clamp(p / 0.72, 0, 1)).toFixed(4));
      draw.style.setProperty("--s-cross", (1 - clamp((p - 0.72) / 0.08, 0, 1)).toFixed(4));
      draw.style.setProperty("--s-lp", (1 - clamp((p - 0.8) / 0.15, 0, 1)).toFixed(4));
      logo.style.setProperty("--sp", clamp(p * 1.4, 0, 1).toFixed(4));

      var index = Math.min(lines.length - 1, Math.floor(p * lines.length * 0.999));
      if (index !== currentLine) {
        currentLine = index;
        lines.forEach(function (li, i) {
          li.classList.toggle("is-current", i === index);
          li.classList.toggle("is-past", i < index);
        });
        if (count) count.textContent = "0" + (index + 1);
      }
    });
  }


  /* 9. Bandeau noir --------------------------------------------------------- */
  var expand = document.querySelector("[data-expand]");
  if (expand && !reduceMotion) {
    onScrollFrame(function () {
      // Carte arrondie quand elle entre à l'écran, pleine largeur aux 2/5
      expand.style.setProperty("--ex", (1 - progressOf(expand, 1, 0.4)).toFixed(4));
    });
  }

  var wordsBlock = document.querySelector("[data-words]");
  if (wordsBlock && !reduceMotion) {
    var text = wordsBlock.textContent.trim().replace(/\s+/g, " ");
    wordsBlock.setAttribute("aria-label", text);
    wordsBlock.textContent = "";
    var words = text.split(" ").map(function (w, i, all) {
      var span = document.createElement("span");
      span.className = "word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = w;
      wordsBlock.appendChild(span);
      if (i < all.length - 1) wordsBlock.appendChild(document.createTextNode(" "));
      return span;
    });
    onScrollFrame(function () {
      var lit = Math.round(progressOf(wordsBlock, 0.85, 0.4) * words.length);
      words.forEach(function (w, i) { w.classList.toggle("is-lit", i < lit); });
    });
  }


  /* 10. Méthode ------------------------------------------------------------- */
  var method = document.querySelector("[data-method]");
  if (method) {
    var symbol = method.querySelector(".method-symbol");
    var steps = method.querySelectorAll("[data-step]");
    var current = method.querySelector("[data-step-current]");
    var setStep = function (step) {
      steps.forEach(function (s) { s.classList.toggle("is-active", s === step); });
      if (current) current.textContent = step.getAttribute("data-step");
    };
    setStep(steps[0]);

    if (reduceMotion) {
      symbol.style.setProperty("--draw", 0);
      symbol.style.setProperty("--draw-cross", 0);
    } else {
      var list = method.querySelector(".steps");
      onScrollFrame(function () {
        var rect = list.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = clamp((vh * 0.6 - rect.top) / (rect.height - vh * 0.2), 0, 1);
        symbol.style.setProperty("--draw", (1 - Math.min(1, p / 0.85)).toFixed(4));
        symbol.style.setProperty("--draw-cross", (1 - Math.max(0, (p - 0.85) / 0.15)).toFixed(4));
      });
    }

    if ("IntersectionObserver" in window) {
      var stepObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) setStep(entry.target); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { stepObserver.observe(s); });
    } else {
      steps.forEach(function (s) { s.classList.add("is-active"); });
    }
  }


  /* 11. Bandeau de mots ----------------------------------------------------- */
  var ticker = document.querySelector("[data-ticker]");
  if (ticker && !reduceMotion) {
    var rows = ticker.querySelectorAll("[data-dir]");
    onScrollFrame(function () {
      var rect = ticker.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      // Les deux lignes glissent en sens inverse, proportionnellement au défilement
      var travel = (vh - rect.top) * 0.45;
      rows.forEach(function (row) {
        var dir = parseFloat(row.getAttribute("data-dir"));
        row.style.setProperty("--tx", (dir * travel).toFixed(1) + "px");
      });
    });
  }


  /* 12. Année du pied de page ----------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Premier calcul sans attendre le défilement
  runScrollTasks();
})();
