# Frontend — Documentation Index

Per-flow docs for each feature, split by account type exactly like the backend
docs (`docs/backend/user/*`, `docs/backend/captain/*`).

## User (rider) flows

| Flow      | Doc                                            |
| --------- | ---------------------------------------------- |
| Register  | [`user/register.md`](user/register.md)         |
| Login     | [`user/login.md`](user/login.md)               |
| Home      | [`user/home.md`](user/home.md)                 |
| Profile   | [`user/profile.md`](user/profile.md)           |
| Settings  | [`user/settings.md`](user/settings.md)         |
| Sign out  | [`user/logout.md`](user/logout.md)             |

## Captain (driver) flows

| Flow      | Doc                                              |
| --------- | ------------------------------------------------ |
| Register  | [`captain/register.md`](captain/register.md)     |
| Login     | [`captain/login.md`](captain/login.md)           |
| Home      | [`captain/home.md`](captain/home.md)             |
| Profile   | [`captain/profile.md`](captain/profile.md)       |
| Settings  | [`captain/settings.md`](captain/settings.md)     |
| Sign out  | [`captain/logout.md`](captain/logout.md)         |

## Shared

- [`design-system.md`](design-system.md) — tokens, buttons, navbar, logo,
  icons/PWA, `VehicleSymbol` glyphs, responsive layout (mobile = bottom-nav
  only, no topbar/sidebar), theme, toasts, motion (used by both roles).

## Routing table

| Route       | Page     | Auth        | Notes                                    |
| ----------- | -------- | ----------- | ---------------------------------------- |
| `/`         | Home     | public      | role-aware CTAs + drive banner           |
| `/login`    | Login    | public      | `?mode=captain` preselects; phone default |
| `/register` | Register | public      | `?mode=captain` → captain wizard         |
| `/profile`  | Profile  | `RequireAuth` | role-aware cards                      |
| `/settings` | Settings | `RequireAuth` | theme + sign out                      |

## Shared context reference

- `AuthContext` (`context/AuthContext.jsx`):
  - `login({ role, payload })` → `POST /{role}/login`
  - `register({ role, payload })` → `POST /{role}/register`
  - `logout()` → `GET /{role}/logout` + local clear
  - Session persisted to `transport.role` / `transport.account` and revalidated
    against `GET /{role}/profile` on boot.
  - **Role rule:** login/register redirect when `isAuthenticated && role === mode`;
    a different role is allowed through so a rider can open a captain account
    (and vice versa).
- `ThemeContext` — `theme` + `toggleTheme` (`.dark` class).
- `ToastContext` — `toast({ variant, title, description })`.
- `lib/api.js` — fetch wrapper (`credentials: "include"`) with `ApiError`;
  error messages from `data.message` or joined `data.errors[].msg`.
- `lib/format.js` — `firstName`, `fullName`, `initials`, `formatDate`.