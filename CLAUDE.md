# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio site. Plain HTML/CSS/JS, no framework, no build step, no package manager.

## Running locally

There is no build/lint/test tooling in this repo. To view the site:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly via `file://` will NOT work — `fetch("data.json")` is blocked by CORS in that context, and the page fails to render (the JS catches this and prints an error to the page telling the user to serve it locally).

## Architecture

The page is a static shell with **all content driven by `data.json`** — there is no hardcoded copy in `index.html` beyond empty section containers. To update site content (name, bio, projects, skills, experience, contact links, etc.), edit `data.json`; do not hand-edit HTML for content changes.

Flow, on load (`js/main.js`):
1. `init()` kicks off `loadData()` (fetches and parses `data.json`) and `runPreloader()` (the intro animation) in parallel via `Promise.all`.
2. Once both resolve, one `render*(data)` function per section populates its corresponding empty `<section>` in `index.html` (`renderNav`, `renderHero`, `renderAbout`, `renderSkills`, `renderProjects`, `renderExperience`, `renderEducation`, `renderContact`, `renderFooter`). Each function reads its own top-level key out of the `data.json` object and builds DOM nodes with the `el()` helper — there's no templating engine.
3. `hidePreloader()` runs last, lifting the preloader overlay and adding the `.reveal` class to `#hero` to trigger its staggered fade-in (see `@keyframes hero-fade-up` in `css/style.css`).

Adding a new section means: add an empty `<section id="...">` in `index.html`, add a matching top-level key to `data.json`, write a `render*(data)` function in `main.js`, call it from `init()`, and style it in `style.css`.

**Images (`about.photo`, `projects[].photo`)** are optional per-item paths into `assets/`. `renderImageOrPlaceholder()` in `main.js` renders the `<img>` if a path is set, and swaps in a small mono-label placeholder box (`"photo"` / `"img"`) if the field is empty or the image 404s. Don't assume every photo field is populated — the placeholder path must keep working.

**Preloader / intro animation**: a full-screen `#preloader` overlay (fixed, `z-index: 100`) types out `// hello, world` in `css/style.css`'s `--mono-font`, holds briefly, then slides up (`.preloader.hide`) to reveal the page. It respects `prefers-reduced-motion: reduce` (skips the typing animation and hero stagger entirely). It currently replays on every page load/refresh (no `sessionStorage` gate).

## Design system (`css/style.css`)

Monochrome theme driven by CSS custom properties in `:root` (`--paper`, `--ink`, `--ink-soft`, `--hairline`). Three font roles, loaded from Google Fonts in `index.html`'s `<head>`:
- `--display-font` (Fraunces) — headlines, project/name titles
- `--body-font` (Inter) — body copy
- `--mono-font` (JetBrains Mono) — section labels (styled like code comments, e.g. `// about`), dates, tags, nav name

Sections are hairline-divided (`border-bottom: 1px solid var(--hairline)`) rather than boxed/cards, centered in a `--max-width: 760px` column. Contrast comes from type weight/size, not color — there is intentionally no accent color anywhere in the stylesheet.
