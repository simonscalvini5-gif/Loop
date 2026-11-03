/* ==========================================================================
   LOOP — main.js
   Petites interactions du site, sans aucune bibliothèque externe.
   1. Écran d'introduction (nettoyage une fois terminé)
   2. En-tête : filet au défilement, masqué quand on descend
   3. Menu mobile
   4. Apparition des éléments au défilement
   5. Effet de profondeur (maquette d'accueil)
   6. Méthode : le symbole se dessine selon la progression
   7. Bandeau noir : les mots s'éclairent un à un
   8. Formulaire de contact (Formspree)
   9. Année du pied de page
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Petite aide : exécute une fonction au plus une fois par image affichée */
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


  /* 1. Écran d'introduction ----------------------------------------------- */
  var intro = document.querySelector(".intro");
  if (intro && root.classList.contains("has-intro")) {
    intro.addEventListener("animationend", function (e) {
      if (e.target === intro) intro.remove();
    });
  }


  /* 2. En-tête ------------------------------------------------------------ */
  var header = document.querySelector("[data-header]");
  var lastY = window.scrollY;
  if (header) {
    onScrollFrame(function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      // On masque l'en-tête en descendant, on le réaffiche en remontant
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (!document.body.classList.contains("nav-open")) {
        if (goingDown && y > 240) header.classList.add("is-hidden");
        else if (goingUp || y < 240) header.classList.remove("is-hidden");
      }
      if (goingDown || goingUp) lastY = y;
    });
    // Si le clavier arrive dans l'en-tête, on l'affiche
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  }


  /* 3. Menu mobile -------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    var label = toggle.querySelector("[data-label]");
    var setMenu = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
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
    // Repasse en mode ordinateur : on referme le panneau
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setMenu(false); });
  }

  // Lien du menu correspondant à la section visible (aria-current)
  var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }


  /* 4. Apparition au défilement ------------------------------------------- */
  var revealables = document.querySelectorAll(".reveal, .reveal-line, [data-reveal-self]");
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


  /* 5. Effet de profondeur ------------------------------------------------ */
  var parallaxEls = reduceMotion ? [] : document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length) {
    onScrollFrame(function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.05;
        el.style.transform = "translate3d(0," + (window.scrollY * -speed).toFixed(1) + "px,0)";
      });
    });
  }


  /* 6. Méthode : symbole qui se dessine ----------------------------------- */
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
      // Progression de 0 à 1 entre le début et la fin de la liste des étapes
      var list = method.querySelector(".steps");
      onScrollFrame(function () {
        var rect = list.getBoundingClientRect();
        var vh = window.innerHeight;
        var progress = (vh * 0.6 - rect.top) / (rect.height - vh * 0.2);
        progress = Math.min(1, Math.max(0, progress));
        // Les 85 % premiers dessinent la boucle, la fin dessine la barre centrale
        var loop = Math.min(1, progress / 0.85);
        var cross = Math.max(0, (progress - 0.85) / 0.15);
        symbol.style.setProperty("--draw", (1 - loop).toFixed(4));
        symbol.style.setProperty("--draw-cross", (1 - cross).toFixed(4));
      });
    }

    // Étape active = celle qui passe au milieu de l'écran
    if ("IntersectionObserver" in window) {
      var stepObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) setStep(entry.target); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { stepObserver.observe(s); });
    } else {
      steps.forEach(function (s) { s.classList.add("is-active"); });
    }
  }


  /* 7. Bandeau noir : mots qui s'éclairent -------------------------------- */
  var wordsBlock = document.querySelector("[data-words]");
  if (wordsBlock && !reduceMotion) {
    // On découpe le texte en mots (le texte reste lisible tel quel par les lecteurs d'écran)
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
      var rect = wordsBlock.getBoundingClientRect();
      var vh = window.innerHeight;
      // Commence quand le texte entre aux 85 % de l'écran, finit à 35 %
      var progress = (vh * 0.85 - rect.top) / (vh * 0.5 + rect.height * 0.5);
      progress = Math.min(1, Math.max(0, progress));
      var lit = Math.round(progress * words.length);
      words.forEach(function (w, i) { w.classList.toggle("is-lit", i < lit); });
    });
  }


  /* 8. Formulaire de contact ---------------------------------------------- */
  var form = document.querySelector("[data-form]");
  if (form) {
    form.noValidate = true; // validation gérée ici, avec des messages en français
    var status = form.querySelector("[data-form-status]");
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = form.querySelector("[data-submit-label]");

    var messages = {
      nom: "Indiquez votre nom.",
      metier: "Indiquez votre métier.",
      email: "Indiquez une adresse email valide (ex. : nom@exemple.fr).",
      message: "Écrivez quelques mots sur votre besoin."
    };

    var showError = function (input, message) {
      var field = input.closest(".field");
      var error = document.getElementById("e-" + input.id.replace("f-", ""));
      field.classList.toggle("has-error", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message || "";
    };

    var validate = function () {
      var firstInvalid = null;
      form.querySelectorAll("[required]").forEach(function (input) {
        var ok = input.value.trim() !== "" && input.checkValidity();
        showError(input, ok ? "" : messages[input.name]);
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    // On efface l'erreur dès que la personne corrige le champ
    form.addEventListener("input", function (e) {
      if (e.target.closest(".has-error") && e.target.checkValidity() && e.target.value.trim()) {
        showError(e.target, "");
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "";
      if (!validate()) return;

      // Rappel pour la mise en ligne : l'identifiant Formspree n'est pas encore renseigné
      if (form.action.indexOf("%5BFORMSPREE_ID%5D") !== -1 || form.action.indexOf("[FORMSPREE_ID]") !== -1) {
        status.textContent = "Formulaire pas encore relié : remplacez [FORMSPREE_ID] dans index.html (voir README).";
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = "Envoi en cours…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Erreur " + response.status);
          form.reset();
          status.classList.add("is-success");
          status.textContent = "Merci, votre demande est bien envoyée. Nous vous répondons sous 48 heures ouvrées.";
        })
        .catch(function () {
          status.textContent = "L'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous directement par email.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitLabel.textContent = "Envoyer ma demande";
          status.setAttribute("tabindex", "-1");
          status.focus();
        });
    });
  }


  /* 9. Année du pied de page ---------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Premier calcul sans attendre le défilement
  runScrollTasks();
})();
