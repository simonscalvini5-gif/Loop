# LOOP · Site vitrine

Site vitrine de LOOP : des applications web sur mesure pour les artisans, à la place des fichiers Excel.

Le site est fait en **HTML, CSS et un peu de JavaScript**. Il n'y a aucun outil à installer, aucune étape de compilation et aucune dépendance.

---

## 1. Ce que contient le dossier

```
index.html               Page d'accueil (toutes les sections)
mentions-legales.html    Mentions légales
confidentialite.html     Politique de confidentialité (RGPD)
cgv.html                 Conditions générales de vente (plan à compléter)
404.html                 Page « introuvable »

assets/css/style.css     Toute la mise en forme. Les couleurs, tailles et espacements
                         sont réglés dans les variables en haut du fichier
assets/js/intro.js       Choisit si l'animation d'ouverture est jouée (une fois par visite)
assets/js/main.js        Menu mobile, animations au défilement, envoi du formulaire
assets/fonts/            Police Inter, hébergée sur le site (pas d'appel à Google)
assets/img/logo/         Logos LOOP (SVG) et favicon
assets/img/              Icônes de l'application et image de partage (og-image.png)

favicon.ico, apple-touch-icon.png, site.webmanifest   Icônes du navigateur et du téléphone
sitemap.xml, robots.txt  Référencement Google
netlify.toml             Réglages Netlify (sécurité, cache)
```

---

## 2. Informations à compléter avant la mise en ligne

Les repères entre crochets sont à remplacer **dans tous les fichiers**. Le plus simple : ouvrez le dossier dans [VS Code](https://code.visualstudio.com/) (gratuit), faites **Ctrl + Maj + H** (Cmd + Maj + H sur Mac), saisissez le repère, puis la valeur, et cliquez sur « Remplacer tout ».

| Repère | Exemple | Où |
| --- | --- | --- |
| `[EMAIL]` | `contact@loop-artisans.fr` | partout |
| `[TÉLÉPHONE]` | `06 12 34 56 78` (affichage) | partout |
| `[TÉLÉPHONE_LIEN]` | `+33612345678` (sans espaces, pour le lien qui lance l'appel) | partout |
| `[ZONE GÉOGRAPHIQUE]` | `Lyon et 50 km autour` | partout |
| `[DOMAINE]` | `www.loop-artisans.fr` (sans `https://`) | balises `<head>`, sitemap.xml, robots.txt |
| `[FORMSPREE_ID]` | `xyzabcde` | index.html (formulaire) |
| `[PRÉAVIS DE RÉSILIATION]` | `sans engagement, avec un mois de préavis` | index.html (FAQ) |
| `[PRÉNOM NOM]` | votre nom | mentions légales, confidentialité |
| `[ADRESSE POSTALE]` | adresse de domiciliation | mentions légales, confidentialité |
| `[SIRET À COMPLÉTER]` | 14 chiffres | mentions légales |

Sur les pages légales, les repères sont surlignés en pointillés : ils disparaissent dès que vous les remplacez par le texte (enlevez aussi la balise `<span class="todo">` autour).

### Points à vérifier vous-même

Ces phrases vous engagent auprès de vos clients. Gardez-les seulement si elles sont vraies :

- FAQ : « hébergées en Europe », « sauvegardes chaque jour », « récupérer vos données dans un fichier Excel », « quelques semaines de mise en place ».
- Contact : « Je vous réponds sous 48 heures ouvrées ».
- Mentions légales : l'adresse de Netlify (vérifiez-la sur netlify.com au moment de la mise en ligne).
- Confidentialité : les garanties de transfert hors UE de Formspree et Netlify (voir leurs pages « DPA » ou « Privacy »).
- CGV : la page contient uniquement un plan. Faites rédiger ou relire le texte final par un professionnel.

---

## 3. Relier le formulaire de contact (Formspree)

Le site n'a pas de serveur : c'est Formspree qui reçoit les messages et vous les envoie par email.

1. Créez un compte gratuit sur [formspree.io](https://formspree.io) avec votre email professionnel.
2. Cliquez sur **New Form**, donnez-lui un nom (« Site LOOP »).
3. Formspree affiche une adresse du type `https://formspree.io/f/xyzabcde`. La fin (`xyzabcde`) est votre identifiant.
4. Dans `index.html`, remplacez `[FORMSPREE_ID]` par cet identifiant.
5. Après la mise en ligne, envoyez-vous un message de test. Le premier envoi demande de confirmer votre email.

Le formulaire affiche un message de confirmation sans quitter la page. Un champ invisible bloque les robots.

> Alternative : Netlify propose aussi son propre service de formulaires (Netlify Forms). Formspree a été retenu pour pouvoir changer d'hébergeur sans rien modifier.

---

## 4. Voir le site sur votre ordinateur

**Le plus simple :** double-cliquez sur `index.html`. Le site s'ouvre dans votre navigateur.

**Pour un rendu identique à la mise en ligne** (recommandé avant de publier), lancez un petit serveur local depuis le dossier du site :

```bash
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000> dans votre navigateur. Pour arrêter : **Ctrl + C**.

Pour revoir l'animation d'ouverture, fermez l'onglet et rouvrez le site (elle n'est jouée qu'une fois par visite).

---

## 5. Mettre le site en ligne gratuitement (GitHub + Netlify)

### Étape 1 · Mettre le code sur GitHub

Le code est déjà dans le dépôt GitHub `Loop`. Après chaque modification :

```bash
git add .
```

```bash
git commit -m "Mise à jour des coordonnées"
```

```bash
git push
```

Sans ligne de commande, vous pouvez aussi utiliser [GitHub Desktop](https://desktop.github.com/), ou modifier un fichier directement sur github.com (icône crayon).

### Étape 2 · Brancher Netlify

1. Créez un compte sur [netlify.com](https://www.netlify.com) avec « Sign up with GitHub ».
2. **Add new site → Import an existing project → GitHub**, puis choisissez le dépôt `Loop`.
3. Laissez **Build command** vide et **Publish directory** sur `.` (le fichier `netlify.toml` le fait déjà).
4. Cliquez sur **Deploy**. En une minute, le site est en ligne sur une adresse du type `loop-xxxx.netlify.app`.

Ensuite, **chaque `git push` met le site à jour automatiquement.**

### Étape 3 · Votre nom de domaine

1. Achetez un nom de domaine (OVH, Gandi, etc., environ 10 € par an).
2. Dans Netlify : **Domain management → Add a domain**, puis suivez les instructions pour pointer le domaine vers Netlify.
3. Le certificat HTTPS (cadenas) est activé automatiquement.
4. Remplacez `[DOMAINE]` dans les fichiers (voir section 2), puis faites un `git push`.

### Étape 4 · Google

Créez un compte [Google Search Console](https://search.google.com/search-console), ajoutez votre domaine et envoyez l'adresse `https://votre-domaine/sitemap.xml`.

> **Vercel** fonctionne aussi (Add New Project → dépôt `Loop` → Deploy, sans réglage). Attention : son offre gratuite est réservée à un usage non commercial, et il faudra alors remplacer Netlify par Vercel dans les mentions légales.

---

## 6. Modifier le site

| Je veux… | Où |
| --- | --- |
| Changer un texte | `index.html` : chaque section est signalée par un grand commentaire (`1. ACCUEIL`, `2. LE PROBLÈME`…) |
| Changer une couleur de gris, une taille de titre, un espacement | Variables en haut de `assets/css/style.css` (partie 2) |
| Modifier le menu ou le pied de page | Ils sont présents dans **chaque page HTML** : faites la modification dans les 4 fichiers |
| Ajouter une question à la FAQ | Copiez un bloc `<details class="faq-item">…</details>` dans `index.html` |
| Désactiver l'animation d'ouverture | Supprimez le bloc `<div class="intro">…</div>` dans `index.html` |
| Accélérer ou ralentir les animations | Durées dans `style.css` (parties 7 et 19) |

---

## 7. Choix techniques

- **Noir, blanc et gris uniquement.** Les contrastes de texte respectent les recommandations d'accessibilité (WCAG AA).
- **Animations discrètes** : logo qui se dessine à l'ouverture, titres qui glissent, éléments qui apparaissent au défilement, symbole LOOP qui se trace au fil des 4 étapes, mots qui s'éclairent dans le bandeau noir, grand logo en bas de page. Elles sont **toutes désactivées** si le visiteur l'a demandé dans les réglages de son téléphone ou ordinateur (« réduire les animations »).
- **Sans JavaScript**, tout le contenu reste visible et le formulaire fonctionne.
- **Police Inter hébergée sur le site** : plus rapide, et aucune donnée de visiteur n'est envoyée à Google (pas de bandeau cookies nécessaire).
- **Aucun cookie**, aucun outil de suivi.
- **Accessibilité** : balises sémantiques, lien « Aller au contenu », navigation au clavier, textes alternatifs, libellés de formulaire, messages d'erreur lus par les lecteurs d'écran.
- **SEO** : titre et description par page, Open Graph (aperçu lors d'un partage), données structurées, sitemap.
