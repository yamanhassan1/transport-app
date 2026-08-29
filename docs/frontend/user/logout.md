# Frontend Reference: User Sign Out

## Summary

Describes how a rider ends their session. Sign out is triggered from **two
places** that both call `AuthContext.logout()`: the Profile page
(`Profile.jsx` → "Sign out" row) and the Settings page
(`Settings.jsx` → "Sign out" button). The same flow applies to captains
(`GET /captains/logout` instead of `GET /users/logout`).

## The flow

1. User taps **Sign out**.
2. `Profile.jsx` (`handleSignOut`) or `Settings.jsx` (`handleSignOut`):
   - `await logout()` (from `AuthContext`), then
   - info toast **"Signed out"** / *"See you soon."*, then
   - `navigate("/")`.
3. `AuthContext.logout()` (`frontend/src/context/AuthContext.jsx`):
   - Calls `api.get("/users/logout")` for the current role
     (`rolePath(role)` → `/users`).
   - The backend **blacklists** the JWT
     (`BlacklistToken` model) and clears the auth cookie.
   - Even if the server call fails, the client session is cleared
     (`clearSession()` in a `finally`).

## Local session teardown

`clearSession` (and `clearStored`):

- Removes `transport.role` and `transport.account` from `localStorage`.
- Sets `role = null`, `account = null`, `status = "guest"`.

## Related: auto-sign-out

If a stored session fails JWT validation on page load (bootstrap `GET /profile`
returns `401`), the client clears the stored session the same way and falls back
to guest — the user is redirected to the public page by the router guard.

## Source layout

- `frontend/src/pages/Profile/Profile.jsx` — `handleSignOut` row action
- `frontend/src/pages/Settings/Settings.jsx` — `handleSignOut` button
- `frontend/src/context/AuthContext.jsx` — `logout`, `clearSession`, bootstrap
- `backend/routes/user.routes.js` + `backend/controllers/user.controller.js` — `GET /users/logout`