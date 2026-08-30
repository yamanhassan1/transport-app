# Frontend Reference: User Profile

## Summary

The `/profile` page protected by `RequireAuth`, showing the signed-in rider's
account. Same component serves both roles — this doc covers the **rider** view;
captain-specific cards are documented in `docs/frontend/captain/profile.md`.

## Page

- **Route:** `/profile` (auth required)
- **Component:** `Profile.jsx` (`frontend/src/pages/Profile/Profile.jsx`)
- **Wrapper:** `PageContainer max-w-2xl` (header inside the desktop sidebar /
  mobile bottom-nav layout)

## Loading state

While `status === "loading"` or no `account`, three `Skeleton` blocks render
instead of the content.

## Content

### Header card

- Avatar: if `account.profileImage` (an SVG string) is set, it is rendered via a
  `data:image/svg+xml` URI in a 64px circle (`rounded-full object-cover`);
  otherwise initials (`initials(account)`, `bg-primary-600` white text).
- Name with a **Rider** badge (`Badge variant="primary"`).
- Email (truncated) + phone (`text-ink-secondary` / `text-ink-muted`).
- Right-aligned pill on large screens: **Member since {last 4 digits of year}**
  e.g. "Member since 2026".

### Stats row (3-column grid)

| Column     | Value (rider)                              |
| ---------- | ------------------------------------------ |
| Account    | BadgeCheck icon + **Verified** / **Pending** from `isVerified` |
| Member since | `formatDate(createdAt)`                    |
| To ride    | Car icon + **Ready** / **To ride**         |

### Links

- **Settings** → `/settings` (hint: "Preferences and account").
- **Sign out** → action button calling `handleSignOut` (see
  `docs/frontend/user/logout.md`).

## Source layout

- `frontend/src/pages/Profile/Profile.jsx`
- `frontend/src/components/ui/Badge|Card|Skeleton/*.jsx`
- `frontend/src/lib/format.js` — `initials`, `fullName`, `formatDate`
- `frontend/src/context/AuthContext.jsx` — `account`, `role`, `status`, `logout`