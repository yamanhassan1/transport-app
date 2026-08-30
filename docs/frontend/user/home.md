# Frontend Reference: User Home

## Summary

The landing page at `/` (`Home.jsx`) — a ride-hailing landing in the style of
Uber / inDrive. It uses **illustrated symbol graphics** (custom drawn line-art
vehicle glyphs on vivid gradient tiles, a dashed-route hero) instead of photos,
a ride-booking card with a **Continue** button and a **Log in** button directly
beneath it, five service category symbols (**including Shipment**), and a
drive-now banner. **No prices are shown anywhere.** Role-aware: guests get the
full landing; a signed-in rider sees their name and app-shortcut CTAs.

## Page

- **Route:** `/` (public)
- **Component:** `Home.jsx` (`frontend/src/pages/Home/Home.jsx`)
- **Animations:** `motion/react` hero entrance + `whileInView` service/feature tiles.
- **Graphics:** `VehicleSymbol` line-art SVG glyphs (`components/ui/VehicleSymbol`)
  drawn live in white over brand gradients — no raster images, no external
  requests. Service tiles use rotated "ghost" symbols, soft glow rings and a
  dashed-route SVG flourish.

### Mobile layout note

On phones (`< md`): the **header (topbar) and sidebar are removed entirely**;
guests/signed-in users navigate with the floating bottom nav (Home / Profile /
Settings). Each page renders its own `<h1>`, so no heading is lost. Desktop
(`md+`) keeps the sidebar + header as usual.

## Sections

### 1. Hero + booking card

Two-column on desktop (text left, symbol graphic right); single column on mobile.

- Headline: **"Book a ride in minutes."** (guests) /
  **"Where to, {name}?"** (signed-in, plus the "Hello, {name}" chip above).
- **Booking card** — the Uber-style "where to?" card:
  - Two rounded destination fields ("Where to?" / "Enter your destination")
    with numbered pins + quick chips (Home, Work, Airport).
  - **Continue** button — primary gradient pill, `ArrowRight` icon
    → **`/register`** for guests (or `/profile` if already signed in).
  - Below it: **Log in** button — outline pill **→ `/login`** for guests
    (or "Account settings" → `/settings` when signed in).
  - Small helper note for guests:
    "Continue creates your free account after you enter your details."
- **Hero symbol graphic** (desktop only): brand-green `rounded-[28px]` panel
  with a dashed route path (SVG) + endpoint pins, speed-dash accents, a large
  `VehicleSymbol` sedan with a glow halo, and bottom chips. Floating glass chips:
  - **"Captains nearby"** with a live green-dot icon — "4 min average pickup",
  - **"24/7 support"** — "Phone & chat, always on".

### 2. Ride with rawan — service symbols

Heading "Ride with rawan". Five symbol tiles in a responsive grid
(`sm:grid-cols-2 lg:grid-cols-5`) — **no prices**:

| Service   | Symbol glyph   | Gradient            | Tag              | Hints                   |
| --------- | -------------- | ------------------- | ---------------- | ----------------------- |
| Go        | sedan (`car`)  | sky 500 → 700       | 4 seats          | Everyday rides          |
| Go Mini   | hatch (`mini`) | amber 500 → orange 700 | 4 seats       | Quick & budget-friendly |
| Shipment  | parcel (`box`) | violet 500 → purple 700 | up to 10 kg   | Send parcels fast       |
| Premier   | `premium`      | slate 600 → 800     | 4 seats          | High-end comfort        |
| Bike      | `bike`         | emerald 500 → teal 700 | 1 seat        | Zip through traffic     |

Each tile: `aspect-[16/11]` gradient with a rotated ghost `VehicleSymbol` in the
corner, a centered white glyph, a translucent tag badge, and label/hint with an
`ArrowRight` affordance.

### 3. Feature badges

The app's trust symbols as tiles (flat on mobile, cards at `md:`):

- Clock — Minute pickup
- Wallet — Transparent fares
- ShieldCheck — Verified captains
- Star — Rated rides

### 4. Drive banner

Brand-green panel with a **graphic** profile (giant faint `VehicleSymbol`
silhouette + rings) and **Drive on your own schedule** copy. For a rider/guest
the button reads **"Become a captain"** → `/register?mode=captain`; for a
signed-in captain it becomes **"View captain profile"** → `/profile`
(see `../captain/home.md`).

## Source layout

- `frontend/src/pages/Home/Home.jsx` — sections, `ServiceCard` helper, service
  symbol map (variant + tint + tag), role-aware CTAs
- `frontend/src/components/ui/VehicleSymbol/VehicleSymbol.jsx` — line-art glyphs
  (`car`, `mini`, `premium`, `bike`, `box`)
- `frontend/src/lib/format.js` — `firstName(account)`