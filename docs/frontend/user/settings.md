# Frontend Reference: User Settings

## Summary

The `/settings` page protected by `RequireAuth`. It is a **single shared
component** for both roles (`Settings.jsx`) — this doc shows the user perspective
and is identical for captains. It currently offers appearance (dark mode) and
account (sign out).

## Page

- **Route:** `/settings` (auth required)
- **Component:** `Settings.jsx` (`frontend/src/pages/Settings/Settings.jsx`)
- **Wrapper:** `PageContainer max-w-2xl` with app header
  ("Settings — Manage your preferences.")

## Appearance

- Row: Moon icon + "Dark mode" (status `On`/`Off` from `theme`).
- A `role="switch"` toggle (`aria-checked={theme === "dark"}`) calls
  `toggleTheme()` from `ThemeContext`.
- Theme is applied on the `<html>` root via a `.dark` class; light/dark palettes
  live in `styles/themes.css`. If the OS theme is used, `theme` reflects
  the effective value.

## Account

- Row: LogOut icon + "Sign out" + a small **Sign out** button
  (`text-error-700`, hover `bg-error-light`).
- See `docs/frontend/user/logout.md` for the exact flow.

## Source layout

- `frontend/src/pages/Settings/Settings.jsx`
- `frontend/src/context/ThemeContext.jsx` — `theme`, `toggleTheme`
- `frontend/src/context/AuthContext.jsx` — `logout`
- `frontend/src/components/ui/Card/*.jsx` — section cards