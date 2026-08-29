# Frontend — Design System (as built)

Shared styling/UX that both the user and captain flows rely on. Token values and
rollout are described as they currently exist in the codebase.

## Token pipeline

- `styles/tokens.css` — light theme: colors shipped as **hex pairs with `-rgb`
  twins** (hex + `R G B` triple), e.g. `--primary-500: #00a86b;
  --primary-500-rgb: 0 168 107;`.
- `styles/typography.css` — type ramp (`display`, `display-sm`, `h1`…`h4`,
  `text-body`, `text-body-large`, `text-small`, `text-caption`).
- `styles/themes.css` — light `:root` + `.dark` overrides, **both** keeping
  `-rgb` twins.
- `styles/globals.css` — imports in order `tokens.css → typography.css →
  themes.css`, base reset, safe-area helpers.

### Why `-rgb` twins

Tailwind color config points at the rgb triple:
`rgb(var(--x-rgb) / <alpha-value>)`. That is what makes opacity utilities
(`bg-primary/20`, `shadow-primary/25`, `text-primary/60`) compile correctly
against CSS variables.

## Palette

- **Brand green** `#00A86B` ramp 50–900 +
  `-rgb` twins (`tailwind.config.js`).
- Light surfaces: bg `#f6f9f7`, border `#e1e8e4`, `ink` text shades.
- Dark theme: swapped primary ramp (e.g. `400:#2bd188`, `900:#0d3623`) plus
  semantic dark tints; `bg-surface` etc. flip through `.dark` overrides.
- Semantic tokens: `success`, `warning`, `error`, `info` (+ `-light` variants)
  and text/`-muted` shades.

## Buttons (`components/ui/Button/Button.jsx`)

Pill (`rounded-full`) design language used everywhere (Header "Sign up", Home
CTAs, login/register submits):

- **Primary** — gradient `from-primary-500 to-primary-700`, green shadow
  `shadow-primary/25`, hover deepens to `from-primary-400 to-primary-700` +
  `shadow-lg`, press `active:scale-[0.97]`.
- **Secondary** — outline pill (`border-line`, surface bg).
- **Danger / ghost** variants +
  `loading` spinner state, sizes (default / `lg`), left/right icons.
- Social buttons reuse the same pill geometry.

## Navigation

- Desktop **Sidebar** incl. the bilingual logo (48 px mark / 26 px روان).
- Mobile **BottomNavigation** — **floating pill bar** (`bg-surface/90 backdrop-blur`,
  capsule border, shadow) with an **active-tab pill indicator**.
- Three destinations: Home, Profile, Settings. Pages are lazy-loaded
  (code-split).
- `RequireAuth` guards `/profile` and `/settings`; guests who hit them are sent
  to login/register with the intended destination kept in
  `location.state.from`.

## Mobile-app feel

- Flat full-bleed cards + filled inputs on mobile; card chrome (`md:border
  md:bg-surface …`) at `md:`.
- Safe-area insets (header, sidebar drawer, bottom nav, auth pages) with
  `viewport-fit=cover`.
- `tap-highlight` and overscroll effects disabled.

## Auth pages (`components/auth/AuthShell`)

- Centered `max-w-md` card (`md:border md:shadow` on desktop).
- Large bilingual logo: **80 px mark, 40 px روان** (`h-20 w-20 rounded-[26px]
  text-[40px]`).
- Hosts login/register; `ModeToggle` switches role.

## Logo & branding

- Bilingual lockup: **روان** (Arabic, on top) + **RAWAN** (Latin, below).
- Brand mark `public/logo.svg` — optimized 4.79 MB → **51 KB** (embedded 256³
  PNG, same 2048 viewBox) displayed with CSS rounding.
- `index.html` title/description (fixed from corrupted `?` placeholders):
  "rawan — Ride any way, anywhere." /
  "rawan — a modern, safe and reliable ride-hailing platform."

## Icons / PWA

- `public/icons/` PNG set: **16/32/48** (favicon), **180** (apple-touch-icon),
  **192/256/512/1024** plus **`maskable-512`** (rounded-corner alpha).
- `public/manifest.webmanifest` + favicon/apple-touch/manifest links in
  `index.html`.

## Theme

- `ThemeContext` — `theme` (`light`/`dark`/`system`) + `toggleTheme()`; applied
  via `.dark` class. Settings toggle reflects the effective value.

## Toasts

- `ToastContext` with `success` / `info` / `error` variants; used for welcome,
  signed-out, and "coming soon" social messages.

## Motion

- `motion/react` entrance animations (hero, feature tiles `whileInView`,
  staggered delays) with `prefers-reduced-motion` support.