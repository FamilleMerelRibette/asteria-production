# Asteria Production — Project Guidelines

Portfolio site for a French music collective. Single-page static site built with 11ty + Tailwind CSS, deployed to GitHub Pages.

## Build & Test

```sh
npm start        # Dev server on localhost:8080 (Eleventy + PostCSS watch)
npm run build    # Production build (minified HTML/CSS) → _site/
npm run clean    # Remove _site/
npm run debug    # Eleventy with verbose logging
```

> Use npm scripts — do not modify `package.json` directly.

## Architecture

Single-page design: all content renders as anchored sections (`#composition`, `#spectacle`, `#concert`) in one HTML file. Content files **do not generate individual routes** (`permalink: false`).

```
src/
  _data/metadata.json          # Site-wide title/description
  _includes/
    default.njk                # Main layout (head + nav + body)
    menu.njk / footer.njk      # Shared partials
    modeles/                   # Per-entry display templates (affiche-gauche/droite, premier, second)
    sections/                  # Index sections (accueil, composition, concert, spectacle)
  compositions/ concerts/ spectacles/   # Content collections (Markdown + frontmatter)
  media/                       # Poster images (passthrough → media/)
  static/                      # Logo, favicons (passthrough → root)
  styles/site.css              # Tailwind entry point
```

Collections are declared in [.eleventy.js](.eleventy.js). Each section template loops over its collection.

## Content Model

All content files are Markdown with Nunjucks frontmatter (`templateEngineOverride: njk,html`).

| Collection | Key frontmatter fields |
|---|---|
| compositions | `titre`, `slug`, `affiche`, `youtube`, `soundcloud`, `contact`, `interpretes`, `texte` |
| concerts | `titre`, `slug`, `affiche`, `youtubes` (array), `instagram`, `type`, `formation`, `repertoire`, `agenda` (array of `{date, lieu}`), `contact`, `texte` |
| spectacles | Same as concerts |

Set `draft: true` to exclude from production builds.

## Conventions

- **French language** — all labels, content, and templates are in French.
- **Nunjucks strict mode** — `throwOnUndefined: true`; undefined variables throw errors.
- **Tailwind utility-first** — no custom CSS classes; use Tailwind utilities directly in templates.
- **Gradient accent** — sky-500 → pink-600 → yellow-600 for decorative elements.
- **Icons** — Font Awesome 6.5.1 (CDN); font: Rubik via Fontsource (local woff2).
- **Embeds** — YouTube iframes and SoundCloud API URLs go directly in frontmatter; handled by `eleventy-plugin-embed-everything`.
- See [CONVENTIONS.md](../CONVENTIONS.md) for additional team conventions.
