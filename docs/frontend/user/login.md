# Frontend Reference: User Login

## Summary

Describes the rider login flow at `/login`. Phone number is the default method;
a toggle switches between phone and email, both paired with a password. Google
and Apple buttons are present but **UI-only** for now. On success the rider's
session is stored and they are redirected to the intended page.

## Page

- **Route:** `/login` (public; `/login?mode=captain` preselects captains)
- **Component:** `Login.jsx` (`frontend/src/pages/Login/Login.jsx`)
- **Wrapper:** `AuthShell` (centered card + large bilingual logo)
- **Role toggle:** `ModeToggle` at the top; submit label adapts
  (`Log in` / `Log in as captain`)

## Layout

1. **Social buttons** (stacked, pill):
   - **Continue with Google** — outlined white button with official Google logo.
   - **Continue with Apple** — dark button (inverts in dark mode) with Apple logo.
   - Both call `handleSocial(provider)` → **info toast**: "`{provider}` login is
     almost here — We're still setting this up — use phone or email for now."
     No OAuth backend is wired up yet.
2. **Divider** — `or log in with` between two hairlines.
3. **Credentials** — either `PhoneInput` (label "Phone number", hint
   "We'll match this to your account.", placeholder `300 1234567`) or a normal
   email `Input` (`you@example.com` for riders), followed by one password field
   with an eye toggle (show/hide).
4. **Method link** — `Use email instead` &harr; `Use phone number instead`
   (resets `formError`).
5. **Submit** — full-width pill button; busy label "Logging in…".

## Validation (client-side)

- Phone method: `phone` digits 7–15 (`/^\d{7,15}$/`).
- Email method: matches `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `password` must be non-empty client-side (backend enforces ≥ 6).
- Failures render as the alert `formError` banner above the form.

## Submission

`handleSubmit` builds the payload and calls `login({ role: "user", payload })`
(from `AuthContext`), which POSTs to `/users/login`:

```json
{ "phone": "+923001234567", "password": "secret1" }
```

or

```json
{ "email": "ali@example.com", "password": "secret1" }
```

The backend login accepts **either** `email` **or** `phone` + password.

### Success

- `data.user` is applied as the session
  (`transport.role` / `transport.account` in localStorage).
- Success toast: **"Welcome back, {firstName}!"** /
  *"You're signed in as a rider."*
- `navigate(from, { replace: true })` where
  `from = location.state?.from?.pathname || "/"`.

### Failure

- `formError` banner shows `err?.message`
  (e.g. `401` — "Invalid email or password", generic to avoid enumeration).
- Button stops loading; user can retry.

## Redirect rule

`useEffect` redirects to `from` when `isAuthenticated && role === mode` — so an
already-signed-in rider never sees the rider login. A rider may still open
`/login?mode=captain` to log into a separate captain account.

## Source layout

- `frontend/src/pages/Login/Login.jsx` — social buttons, method toggle, submit
- `frontend/src/components/auth/AuthShell/AuthShell.jsx` — page shell/logo
- `frontend/src/components/auth/ModeToggle/ModeToggle.jsx` — role switch
- `frontend/src/components/ui/PhoneInput/PhoneInput.jsx` — country-code input
- `frontend/src/context/AuthContext.jsx` — `login({ role, payload })` → `POST /users/login`