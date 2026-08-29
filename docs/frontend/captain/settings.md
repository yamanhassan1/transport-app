# Frontend Reference: Captain Settings

## Summary

Settings is a **shared page** — the captain experience is identical to the user's.
Appearance (dark mode switch) and Account (sign out) are role-agnostic.

## Page

- **Route:** `/settings` (auth required)
- **Component:** `Settings.jsx` (`frontend/src/pages/Settings/Settings.jsx`)
- **Wrapper:** `PageContainer max-w-2xl`

## Content

- **Appearance** — Dark-mode `role="switch"`; toggles `.dark` class via
  `ThemeContext` (`theme` shown as "On"/"Off").
- **Account** — **Sign out** button
  (see `docs/frontend/captain/logout.md`).

No captain-specific options are rendered yet; both roles share this exact file.
Complete details: `docs/frontend/user/settings.md`.

## Source layout

- `frontend/src/pages/Settings/Settings.jsx`
- `frontend/src/context/ThemeContext.jsx`, `frontend/src/context/AuthContext.jsx`