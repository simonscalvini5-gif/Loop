# LOOP · Site vitrine

Site vitrine de LOOP : des ERP personnalisés, à la place des fichiers Excel.

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
assets/js/main.js        Menu mobile, animations, défilement fluide, fenêtre de devis
assets/js/vendor/        Lenis (défilement fluide, licence MIT)
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

Déjà renseignés : email (`contact@loop.fr`), téléphone, zone (toute la France), nom, résiliation sans engagement, domaine (`loop.fr`).

Restent à compléter :

| Repère | Exemple | Où |
| --- | --- | --- |
| `[FORMSPREE_ID]` | `xyzabcde` | dans chaque page HTML (fenêtre de devis) |
| `[ADRESSE POSTALE]` | adresse de domiciliation | mentions légales, confidentialité |
| `[SIRET À COMPLÉTER]` | 14 chiffres | mentions légales |

Pour changer le nom de domaine plus tard, remplacez `loop.fr` dans les balises `<head>` des pages, `sitemap.xml` et `robots.txt`.

Sur les pages légales, les repères sont surlignés en pointillés : ils disparaissent dès que vous les remplacez par le texte (enlevez aussi la balise `<span class="todo">` autour).

### Points à vérifier vous-même

Ces phrases vous engagent auprès de vos clients. Gardez-les seulement si elles sont vraies :

- FAQ : « hébergées en Europe », « sauvegardes chaque jour », « récupérer vos données dans un fichier Excel », « quelques semaines de mise en place ».
- Pied de page et fenêtre de devis : « Nous vous répondons sous 48 heures ouvrées ».
- Mentions légales : l'adresse de Netlify (vérifiez-la sur netlify.com au moment de la mise en ligne).
- Confidentialité : les garanties de transfert hors UE de Formspree et Netlify (voir leurs pages « DPA »).
- CGV : la page contient uniquement un plan. Faites rédiger ou relire le texte final par un professionnel.

---

## 3. Relier le formulaire de devis (Formspree)

Tous les boutons « Demander un devis » ouvrent une fenêtre avec un formulaire. Le site n'a pas de serveur : c'est Formspree qui reçoit les demandes et vous les envoie par email.

1. Créez un compte gratuit sur [formspree.io](https://formspree.io) avec votre email professionnel.
2. Cliquez sur **New Form** et nommez-le « Site LOOP ».
3. Formspree affiche une adresse du type `https://formspree.io/f/xyzabcde`. La fin (`xyzabcde`) est votre identifiant.
4. Remplacez `[FORMSPREE_ID]` par cet identifiant **dans toutes les pages HTML** (recherche-remplacement, voir section 2).
5. Après la mise en ligne, envoyez-vous une demande de test. Le premier envoi demande de confirmer votre email.

Sans JavaScript, les boutons « Demander un devis » ouvrent simplement un email vers contact@loop.fr.

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
| Changer un texte | `index.html` : chaque section est signalée par un grand commentaire (`1. ACCUEIL`, `2. LA SOLUTION`…) |
| Changer une couleur de gris, une taille de titre, un espacement | Variables en haut de `assets/css/style.css` (partie 2) ; `--c-deep` est le noir profond |
| Modifier le menu ou le pied de page | Ils sont présents dans **chaque page HTML** : faites la modification dans les 4 fichiers |
| Changer les phrases de « Ce que fait LOOP » | Bloc `HISTOIRE` dans `index.html` (garder 4 phrases) |
| Ajouter une question à la FAQ | Copiez un bloc `<details class="faq-item">…</details>` dans `index.html` |
| Désactiver l'animation d'ouverture | Supprimez le bloc `<div class="intro">…</div>` dans `index.html` |
| Accélérer ou ralentir les animations | Durées dans `style.css` (parties 7 et 19) |

---

## 7. Choix techniques

- **Noir, blanc et gris uniquement.** Les contrastes de texte respectent les recommandations d'accessibilité (WCAG AA).
- **Animations** : logo qui se dessine à l'ouverture, point lumineux qui tourne sans fin dans le symbole de l'accueil, logo de l'en-tête qui se redessine au survol, section « Ce que fait LOOP » où le logo se trace pendant le défilement, titres qui apparaissent mot par mot, bandeau noir qui s'élargit, mots qui glissent selon le défilement, cartes qui passent en noir au survol, grand logo animé en bas de page. Elles sont **toutes désactivées** si le visiteur l'a demandé dans les réglages de son téléphone ou ordinateur (« réduire les animations »).
- **Sans JavaScript**, tout le contenu reste visible.
- **Défilement fluide** grâce à Lenis (hébergé sur le site, licence MIT).
- **Police Inter hébergée sur le site** : plus rapide, et aucune donnée de visiteur n'est envoyée à Google (pas de bandeau cookies nécessaire).
- **Aucun cookie**, aucun outil de suivi. Les demandes de devis passent par une fenêtre avec formulaire (Formspree).
- **Accessibilité** : balises sémantiques, lien « Aller au contenu », navigation au clavier, textes alternatifs.
- **SEO** : titre et description par page, Open Graph (aperçu lors d'un partage), données structurées, sitemap.
