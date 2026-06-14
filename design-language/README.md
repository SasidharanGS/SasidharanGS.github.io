# minimal_text

**a minimal, typographic design language.**
*typography is the design. two colors. generous whitespace. if it doesn't need to be there, remove it.*

minimal_text is a portable, framework-agnostic design language. It is deliberately
small — a designer or developer should be able to hold the whole thing in their
head. It descends from the “sasidharan gs” system and has been distilled here so
it can dress **any** product, not one. Every value is a CSS custom property;
every component is a `mt-`-prefixed class; the whole thing is one stylesheet plus
a typeface. Rename it freely (see §11).

---

## 1. The three laws

1. **If it doesn't need to be there, remove it.** Restraint is the default. One
   thousand no’s for every yes.
2. **Typography is the design.** There are no decorative elements. Hierarchy
   comes from *size + letter-spacing + whitespace* — never from weight extremes,
   color, boxes, or ornament.
3. **Whitespace is active, not empty.** It creates the breathing room and the
   hierarchy. The 8rem section rhythm is structural, not padding you can trim.

Everything below is an application of these three.

---

## 2. Quick start

```html
<!doctype html>
<html data-theme="light"><!-- "dark", or omit to follow the OS -->
  <head>
    <link rel="stylesheet" href="minimal_text.css" />
  </head>
  <body>
    <p class="mt-eyebrow">a minimal_text interface</p>
    <h1 class="mt-display">typography is the design</h1>
    <p class="mt-prose">two colors, one typeface, and the whitespace doing the
      work. nothing decorates.</p>
    <button class="mt-btn--solid mt-btn">begin</button>
  </body>
</html>
```

`minimal_text.css` is self-contained: it declares the `@font-face`, all tokens (light +
dark + system), a base reset, and the full component layer. Drop it in and
build with the tokens (`var(--fg)`, `var(--space-xl)`, `var(--text-lg)`…) and the
`mt-` classes. Machine-readable tokens live in `tokens.json`.

> **It is a language, not a kit of screens.** Compose the primitives; don’t reach
> for pre-baked page templates. When in doubt, remove something.

---

## 3. Voice & copy (this matters as much as the type)

The words are part of the design. Even a perfect layout breaks character with the
wrong copy.

- **Everything is lowercase** — written into the content, *not* via
  `text-transform`. Even the first-person “i”.
- **First person, direct, short.** Plain, unhurried sentences. No hype.
- **Em dashes (—) for asides**, not parentheses.
- **No buzzwords.** Never “passionate about”, “results-driven”, “seamless”,
  “synergy”. If a recruiter or a landing-page generator would write it, don’t.
- **No exclamation marks. No emoji. Ever.** The tone is calm and literary, closer
  to a printed essay than a web page.
- **Real names keep their casing** inside the lowercase voice (`FastAPI`,
  `TypeScript`, `PostgreSQL`). Everything else is lowercase.

---

## 4. Color

Two colors — a background and a foreground — plus a muted tint of the foreground
for hierarchy, a hairline rule, and **one** functional accent.

| token | light | dark | role |
|---|---|---|---|
| `--bg` | `#f5f5f0` | `#181818` | page / surface (warm, never pure #fff/#000) |
| `--fg` | `#181818` | `#f5f5f0` | text, primary marks, filled states |
| `--muted` | `#6f6f6f` | `#8a8a8a` | secondary text, labels, links at rest |
| `--rule` | `#dddddd` | `#2e2e2e` | every 1px divider; also `--ink-0` |
| `--accent` | `#a23c2e` | `#d2705f` | the one hue — live/active cues, selection, rare emphasis |
| `--accent-strong` | `#88301f` | `#e08573` | accent hover/pressed |

- **The accent is functional, never decorative.** Use it for live/recording
  indicators, the active nav item, the single primary action, selected chips,
  data-bearing marks. Never as a second brand color, never to fill space.
- **The warmth is deliberate.** Off-white over true white, near-black over true
  black — it reads as *designed*, not default.
- **Theme** is set by `data-theme="light|dark"` on `<html>`; omit to follow the
  OS. Build everything from the tokens and dark mode is free.

### 4a. The intensity ramp — the signature idea

When you must encode **magnitude** (activity, focus, volume, frequency, density),
encode it as **intensity, not hue.** `--ink-0…4` is a monochrome ramp — a tint of
`--fg` mixed over `--bg` via `color-mix`, so it inverts automatically in dark
mode and adds **no new color.**

```
--ink-0  (= --rule)  empty / idle
--ink-1  18%   --ink-2  38%   --ink-3  62%   --ink-4  88%
```

Darker = more. Categories stay **neutral** (a label, never a color). `--ramp-strength`
(default `1`) scales the whole ramp’s contrast in one move (soft `.78` / strong
`1.3`). This is how minimal_text stays two-color while still carrying rich data —
contribution grids, timelines, bars, donuts, heatmaps all draw from `--ink-*`.

---

## 5. Type

**Inter, and only Inter.** Two weights: **300 (light)** for almost everything,
**400 (regular)** for sparing emphasis (a name, a role, an active label).
**Never 700+/bold.** Hierarchy is size + tracking + whitespace.

- **Scale** (`rem`, so the whole system scales with the root): `--text-2xs .65`
  · `xs .7` · `sm .75` · `base .8` · `md .85` · `lg .95` · `xl 1.05` · `2xl 1.4`
  · `display clamp(1.6rem,4vw,2.9rem)`. Small sizes are intentional.
- **Tracking** — wide tracking on small labels buys presence without size:
  `tight -.02em` (display) · `name .02em` · `snug .05em` (pills) · `wide .1em`
  (dates/links) · `wider .15em` · `nav .2em` · `label .25em` (section labels).
- **Leading**: `tight 1.2 · snug 1.5 · normal 1.6 · relaxed 1.7 · loose 1.75`.
- **Measure**: prose is capped at `--measure` (560px). **Never set text full-width.**
- Helpers: `.mt-display`, `.mt-title`, `.mt-label`, `.mt-eyebrow`, `.mt-prose`,
  `.mt-mono` (technical readouts only), `.mt-em` (the one emphasis), `.mt-measure`.

---

## 6. Spacing & layout

A 5-step scale: **8 / 16 / 32 / 64 / 128px** (`--space-xs…xl`).

- **`--space-xl` (8rem) is the signature** — vertical section rhythm. *Never
  reduce it on desktop.* (`.mt-section` applies it; it relaxes to 4rem only ≤640.)
- Sections are separated by a single 1px `--rule` hairline (`.mt-rule`).
- **Layout model:** a fixed left sidebar (`--sidebar-w`) + a `1fr` content
  column on desktop; a sticky top bar (`--topbar-h`) where needed; optional right
  panels (`--panel-w`). See §9 for how this folds down on mobile.
- Prefer flex/grid with `gap` for any group of siblings — never bare inline flow
  or per-element margins.

---

## 7. Form, borders, motion, iconography

- **Square.** The **only** border-radius in the entire system is **3px**
  (`--radius-pill`), used on tag pills, chips, and — by extension — chat bubbles.
  Everything else is square.
- **Hairlines only.** 1px `--rule` borders and dividers. **No `box-shadow`,
  anywhere.** Cards have no background, no shadow, no radius — a single hairline
  *is* the card.
- **No gradients. No `rgba()` overlays. No blur / `backdrop-filter`.** (This is
  why mobile sheets are *opaque* with a *transparent* tap-catcher, not a dimming
  scrim.)
- **Motion is almost nothing.** Exactly two kinds: (1) `color 0.2s ease` on
  interactive elements, and (2) any one signature canvas/typographic moment a
  product chooses to add. **No** scroll-triggered reveals, scroll-jacking,
  bounces, slide-ins, or infinite loops. Respect `prefers-reduced-motion`.
- **Hover/press:** links and buttons go `--muted` → `--fg` (or `--accent`) —
  *only color animates.* No underlines, no background swaps, no scale/press.
- **Almost no iconography.** No icon font, no SVG icon set, no PNG icons. The only
  icons allowed are **custom thin-line inline `<svg>`**: `viewBox="0 0 24 24"`,
  `fill:none`, `stroke:currentColor`, **stroke-width 1.5–1.8**, round caps, sized
  ~15–23px, treated like text (muted at rest, fg/accent when active). Use
  `.mt-icon` as the base. Never a filled, multicolor, or branded icon. No emoji,
  no dingbats. The em dash (—) and back arrow (←) are typography, not icons.
- **No imagery** in the layout by default — no photos, illustrations, patterns,
  or textures. The wordmark is *type*, not a logo asset.

---

## 8. Components

All framework-agnostic CSS classes in `minimal_text.css`. State via native attributes
(`aria-current="page"`, `aria-pressed`, `[data-active]`) or an `.is-*` class.

| component | classes | notes |
|---|---|---|
| **Button** | `.mt-btn`, `.mt-btn--solid`, `.mt-btn--plain` | ghost (hairline, muted→fg) is default; `--solid` is the one accent fill (primary action); `--plain` is a text link. |
| **Field** | `.mt-field`, `.mt-input`, `.mt-input--box`, `.mt-select` | borderless with a single bottom hairline; `--box` for a framed input. Lowercase `.mt-label`. |
| **Card** | `.mt-card`, `.mt-card--rule` | hairline box, square, no shadow; `--rule` makes the “card” just a top hairline. |
| **Pill / Chip** | `.mt-pill`, `.mt-chip` | the only 3px-radius elements. `.mt-chip[data-active]` → accent fill (selectable filters). |
| **Segmented** | `.mt-segmented` + `<button>` | day/week/month, theme. Active button `aria-pressed="true"` → accent. |
| **Switch** | `.mt-switch` | square-track toggle; `aria-pressed="true"` / `.is-on` → accent. |
| **Intensity** | `.mt-ink-0…4`, `.mt-spark > i`, `.mt-statelabel` | the monochrome encoder for bars/cells/dots/state labels. |
| **Sidebar nav** | `.mt-nav`, `.mt-nav-item` | active = accent text + a 2px accent bar. |
| **Bottom nav** | `.mt-bottomnav` (`--labeled`/`--icons`/`--text`), `.mt-tab` | mobile **apps** only; three variants of the same destinations (see §9a). A content website uses a condensed top bar instead. |
| **Sheet** | `.mt-sheet` (`--full`/`--top`), `.mt-sheet__header/__body`, `.mt-scrim-catch` | opaque overlay, no scrim, transparent outside-tap closer. |
| **Bubbles** | `.mt-bubbles`, `.mt-bubble` (`--you`/`--them`) | native chat; you = filled/right, them = `--ink-1`/left; 3px radius. |
| **Empty state** | `.mt-empty`, `.mt-empty--dashed` | minimal_text, centered, optional dashed frame. |
| **Icon** | `.mt-icon` | base for inline thin-line SVG (§7). |

See `index.html` for every one of these rendered live.

---

## 9. Responsive & mobile patterns

Breakpoints: **≤640px phone · 641–1024px tablet · ≥1025px desktop.**
- **Tablet (641–1024):** keep the desktop sidebar; **hide right-hand panels**
  (they crowd the measure).
- **Phone (≤640):** the desktop sidebar collapses. *How* it collapses depends on
  what you're building (see §9a); helpers `.mt-desktop-only` / `.mt-mobile-only`
  flip at 640.

### 9a. Application vs. content website — pick the right collapse

The mobile patterns split by context. **Don't mix them.**

- **Application** (dashboards, tools, chat — many destinations, app-like
  interaction): the sidebar gives way to a **bottom tab bar**, the top bar
  condenses, and right panels become **sheets**. This is the app default, and
  what §9b codifies.
- **Content website** (a portfolio, a blog, a marketing page — few destinations,
  you mostly read and scroll): **no bottom tab bar.** The sidebar condenses into a
  **sticky top bar** — the wordmark (→ home) on the left, the handful of links and
  the theme control on the right. Lean on native scrolling and the native back
  button; a bottom bar here is app cosplay. This is the right pattern for a site
  like the "sasidharan gs" pages this language descends from. The top bar is a
  *composition* (wordmark + links + theme on a single `--rule` hairline), not a
  shipped component — keep it to one row and let the content do the work.

### 9b. Application mobile patterns (use as defaults; adapt per product)

1. **Bottom tab bar** for the primary destinations (≈5). Three on-brand variants
   — `--labeled` (glyph + word), `--icons` (glyph + a 2px accent tick),
   `--text` (lowercase words only, the purest expression). Pick **one** per
   product.
2. **Wordmark = home.** The type wordmark in the top-left routes home, so home
   needn’t spend a tab.
3. **Top-right icons** open **sheets**: e.g. a calendar/utility that **drops from
   its icon** (`.mt-sheet--top`) and collapses when done, and a **“more”** sheet
   (`.mt-sheet--full`) that holds secondary destinations + theme + anything that
   lived in the sidebar — *so nothing is lost.*
4. **Condensed status** in the top bar (show the live/primary field; drop the
   rest).
5. **Native chat** uses `.mt-bubble`s; the composer is pinned, with `font-size:16px`
   on the input to prevent iOS zoom; filter chips scroll horizontally.
6. **No scrim** on sheets (opaque panel + transparent tap-catcher), **no
   slide-in** — consistent with the motion rules.

> Anything mobile-only or undesigned (gestures, keyboard avoidance, landscape,
> per-tab back-stack, real-data loading/empty/error states) is a **product
> decision** — specify it deliberately, don’t assume.

---

## 10. What minimal_text is NOT (do not add these)

- ✗ a second accent color, or the accent used as decoration / for every CTA
- ✗ color in the intensity/state encoding (it stays monochrome — magnitude only)
- ✗ images, photos, illustrations, hero art
- ✗ `box-shadow`
- ✗ `border-radius` (except the 3px pill)
- ✗ `font-weight: 700`+ / bold
- ✗ `text-transform: uppercase` (lowercase lives in the content)
- ✗ gradients, `rgba()` overlays, blur / glassmorphism
- ✗ scroll-triggered animation / scroll-jacking / bounces / loops
- ✗ emoji, icon fonts, decorative glyphs
- ✗ framework UI libraries / utility-class soup

---

## 11. Tokens, files & making it yours

**Files in this folder:**
- `minimal_text.css` — the single drop-in stylesheet (font-face + tokens + base + components).
- `tokens.json` — machine-readable tokens (port to Style Dictionary, a Tailwind
  preset, native, etc.).
- `index.html` — the **living style guide**: every principle, token, and
  component rendered. Open it to *see* the language.
- `assets/fonts/Inter-Variable.ttf` — the only webfont (Inter variable; use
  300/400).
- `README.md` — this document (self-sufficient).

**Renaming / re-skinning:**
- **Re-skin** by overriding the six color tokens (`--bg --fg --muted --rule
  --accent --accent-strong`) — everything else, including the intensity ramp,
  derives from them. Keep the *relationships* (two colors + one muted accent,
  warm not pure) and it stays minimal_text.
- **Rename** by find-replacing the `mt-` class prefix and the word “minimal_text”. The
  token names are intentionally generic and need not change.
- **The essence is the constraints, not the hex values.** A different palette is
  fine; a second accent, a drop shadow, a bold weight, or a rounded corner is
  not — those break the language.

> built from restraint. the most important control is the one you don’t add.
