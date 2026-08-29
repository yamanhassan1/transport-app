# Frontend Reference: Captain Profile

## Summary

The `/profile` page (auth required) rendered for a captain. It shares the header
card, stats row, and links of the rider view but replaces the "To ride" stat with
a **rating** and adds **vehicle** and **licence** detail cards.

## Page

- **Route:** `/profile` (auth required)
- **Component:** `Profile.jsx` (`frontend/src/pages/Profile/Profile.jsx`),
  `isCaptain = role === "captain"`

## Content

### Header card

- Avatar initials + name with a **Captain** badge (`Badge variant="warning"`).
- Email + phone; "Member since {year}" pill on large screens.

### Stats row (3-column grid)

| Column     | Value (captain)                        |
| ---------- | -------------------------------------- |
| Account    | BadgeCheck + **Verified** / **Pending** from `isVerified` |
| Member since | `formatDate(createdAt)`               |
| Rating     | Star icon + `rating.average?.toFixed(1)` (**default `5.0`** when missing) |

### Your vehicle card

- Subtitle: `{color} {make} {model} ({year})`.
- Rows:
  - **Type** — `vehicleType` with `_` → space, capitalized (e.g. `Go Mini`).
  - **Plate number** — `plateNumber`.
  - **Trips** — `{completedTrips ?? 0} completed · {cancelledTrips ?? 0} cancelled`.

### License card

- Subtitle: "Driving credential on file".
- Rows:
  - **Number** (IdCard icon) — `license.number`.
  - **Expires** (CreditCard icon) — `formatDate(license.expiryDate)` or `—`.

### Links

- **Settings** → `/settings`.
- **Sign out** → `handleSignOut` (see `docs/frontend/captain/logout.md`).

## Loading

Same skeleton fallback as the rider view while `status === "loading"` or without
`account`.

## Source layout

- `frontend/src/pages/Profile/Profile.jsx`
- `frontend/src/components/ui/Badge|Card|Skeleton/*.jsx`
- `frontend/src/lib/format.js` — `initials`, `fullName`, `formatDate`