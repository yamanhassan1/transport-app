# Frontend Reference: User Home

## Summary

The public landing page at `/` (`Home.jsx`). It is role-aware: guests see
sign-up/log-in CTAs, a signed-in rider sees a greeting chip and profile/settings
shortcuts, and the drive-now banner links a rider to the **captain** sign-up.

## Page

- **Route:** `/` (public)
- **Component:** `Home.jsx` (`frontend/src/pages/Home/Home.jsx`)
- **Animations:** `motion/react` — hero fades/slides in, feature tiles
  `whileInView`; disabled via `prefers-reduced-motion`.

## Sections

### 1. Hero (guest)

- Headline: **Ride any way, anywhere.**
- Sub copy about safe, quick rides with upfront fares.
- **Create your free account** (gradient pill) → `/register`
- **Log in** (outline pill) → `/login`

### 2. Hero (signed-in rider)

- `Hello, {firstName}` chip (pill, `bg-primary-100`, ShieldCheck icon) rendered
  above the headline.
- Primary CTA becomes **"Go to your profile"** → `/profile`.
- Secondary CTA becomes **"Account settings"** → `/settings`.

The name comes from `firstName(account)` (`lib/format.js`).

### 3. Brand panel

Right-hand column: the Arabic wordmark **روان** featured large in brand green
(`lang="ar" dir="rtl"`) above the copy
"One account for riders and captains — register, log in, and manage your
profile from anywhere."

### 4. Features

Four tiles (Clock · Wallet · ShieldCheck · Star):

| Title                 | Copy                                        |
| --------------------- | ------------------------------------------- |
| Minute pickup         | Nearby captains reach you in minutes…       |
| Transparent fares     | See your fare before you book…              |
| Verified captains     | Every captain and vehicle is verified…      |
| Rated rides           | Rate every trip and keep the community…     |

Sticky-safe responsive styling: flat/full-bleed on mobile (`rounded-none border-0
bg-transparent shadow-none`), card chrome at `md:`.

### 5. Drive banner

Brand-green block (`bg-primary-800`): **Drive on your own schedule** with copy
"Register as a captain with your vehicle and license details in minutes."

- For a **rider or guest** the button reads **"Become a captain"** → links to
  **`/register?mode=captain`** so a signed-in rider can open a captain account
  from the same session.
- For a **captain** it changes (see `docs/frontend/captain/home.md`).

## Source layout

- `frontend/src/pages/Home/Home.jsx`
- `frontend/src/lib/format.js` — `firstName(account)`
- `frontend/src/components/ui/Logo` and `public/logo.svg` — brand mark used via the sidebar/AuthShell