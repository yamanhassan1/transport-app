# Frontend Reference: User Registration

## Summary

Describes the rider registration flow — a Careem-style 4-step wizard at `/register`
that collects name, an optional profile photo, contact details, and a password,
then submits to `POST /users/register`. On success the rider is signed in
automatically (JWT session set by the backend) and redirected to the page they
came from.

## Page

- **Route:** `/register` (public; `/register?mode=captain` preselects the captain wizard)
- **Component:** `Register.jsx` (`frontend/src/pages/Register/Register.jsx`)
- **Wrapper:** `AuthShell` (centered `max-w-md` card + large bilingual logo)
- **Role toggle:** `ModeToggle` switches between rider and captain wizard

## Layout & flow

- Vertical (column) form on both mobile and desktop.
- Progress bar on top: `N` segments + "Step X of N" label (e.g. "Step 1 of 4").
- Each step has a title (`h3`) and a hint line.
- Below the form: a circular **Back** button (first step shows none) + a full-width
  pill **Continue** button with arrow. The last step's label becomes
  **Create account** (rider) / **Register as captain**.
- `window.scrollTo({ top: 0, behavior: "smooth" })` when moving between steps.

### Steps

| Step | Title                | Fields                                        |
| ---- | -------------------- | --------------------------------------------- |
| 1    | What's your name?    | First name, last name (optional)              |
| 2    | Profile photo        | Optional (vector/SVG avatar)                  |
| 3    | Contact details      | Email, phone (country-code input)             |
| 4    | Choose a password    | Password, confirm password                    |

## Profile photo (optional)

Step 2 is skippable. Picking an image runs it through a client-side tracer:

- Accepted types: `image/png`, `image/jpeg`, `image/webp`; max **5 MB**.
- The image is decoded (EXIF-aware via `createImageBitmap`, falling back to an
  `<img>` element), scaled to at most 256 px, then converted to compact vector
  **SVG** in the browser via `imagetracerjs` (see
  `lib/imageToSvg.js` — helper exports `imageFileToSvg(file) → Promise<string>`).
- The traced SVG is shown as a circular preview (also via a data URI) and is
  what gets stored; converting shows an inline spinner. Remove clears it.
- If a photo is skipped, no `profileImage` field is sent and the stored value
  defaults to `null`.

## Field validation (client-side)

Validated per-step with `validateField(key)`, in `Register.jsx`:

| Field              | Rules                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| `firstName`        | required; ≥ 3 characters                                              |
| `lastName`         | optional; if present ≥ 3 characters                                   |
| `photo`            | always valid (optional; type/size guards surface as `photoError`)     |
| `email`            | matches `EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/`                     |
| `phone`            | digits-only, `PHONE_DIGITS_RE = /^\d{7,15}$/` (country code separate) |
| `password`         | ≥ 6 characters                                                        |
| `confirmPassword`  | must equal `password`                                                  |

Error text is shown under the offending input (via the `Input` `error` prop).
`errors` entries are cleared as the user edits that field. An overall failure
banner (`formError`) is only used for server-side errors.

## Phone input

Uses the shared `PhoneInput` component (`components/ui/PhoneInput/PhoneInput.jsx`):

- Country-code selector button (PK `+92` default, UAE, SA, UK, US, IN)
  as a dropdown list.
- Digits-only input, max 15 digits, supporting hint text.
- Stored/queried as `+<code><digits>` (e.g. `+923001234567`).

## Submission

On the final "Continue" the form collects this payload and calls
`registerAccount({ role: "user", payload })` (from `AuthContext`), which POSTs to
`/users/register`:

```json
{
  "fullname": { "firstName": "Ali", "lastName": "Hassan" },
  "email": "ali@example.com",
  "phone": "+923001234567",
  "password": "secret1",
  "profileImage": "<svg ...>...</svg>"
}
```

`lastName` is omitted (`undefined`) when empty, and `profileImage` is only sent
when a photo was chosen. The button shows a loading state ("Creating account…")
while the request is in flight and is disabled.

### Success

- The returned `data.user` is pushed into the session
  (`transport.role` / `transport.account` in localStorage).
- Success toast: **"Welcome, {firstName}!"** / *"Your account is ready to ride."*
- `navigate(from, { replace: true })` where `from = location.state?.from?.pathname || "/"`.

### Failure

- Shared banner with an alert icon showing `err?.message`
  (e.g. `409` "An account with this email already exists") and scroll to top.
- Network errors fall back to a generic message via `getErrorMessage`.

## Redirect rule

If already signed in with this role
(`isAuthenticated && role === mode`), the page redirects to `from` immediately —
preventing an authenticated rider from re-registering. A rider can still open
`/register?mode=captain` (different role) to create a captain account.

## Source layout

- `frontend/src/pages/Register/Register.jsx` — wizard logic, validation, payload
- `frontend/src/lib/imageToSvg.js` — client-side image → SVG tracer helper
- `frontend/src/components/auth/AuthShell/AuthShell.jsx` — page shell/logo
- `frontend/src/components/auth/ModeToggle/ModeToggle.jsx` — role switch
- `frontend/src/components/ui/PhoneInput/PhoneInput.jsx` — country-code input
- `frontend/src/components/ui/Button|Input|Select/*.jsx` — form primitives
- `frontend/src/context/AuthContext.jsx` — `register({ role, payload })` → `POST /users/register`