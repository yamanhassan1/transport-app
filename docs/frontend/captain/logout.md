# Frontend Reference: Captain Sign Out

## Summary

The captain sign-out flow is **identical** to the user flow
(`docs/frontend/user/logout.md`) except the server call targets
`GET /captains/logout` instead of `/users/logout`.

## The flow

1. Tap **Sign out** — from `Profile.jsx` ("Sign out" row) or `Settings.jsx`
   ("Sign out" button).
2. `AuthContext.logout()` calls `api.get("/captains/logout")` for the captain
   role (`rolePath("captain")` → `/captains`); the backend blacklists the JWT
   and clears the auth cookie.
3. Whether or not the request succeeds, the session is cleared locally:
   `transport.role` / `transport.account` removed from `localStorage`;
   `role = null`, `account = null`, `status = "guest"`.
4. The page shows the info toast **"Signed out"** / *"See you soon."* and
   `navigate("/")`.

## Source layout

- `frontend/src/pages/Profile/Profile.jsx` — `handleSignOut`
- `frontend/src/pages/Settings/Settings.jsx` — `handleSignOut`
- `frontend/src/context/AuthContext.jsx` — `logout`, `clearSession`
- `backend/routes/captain.routes.js` + `backend/controllers/captain.controller.js` — `GET /captains/logout`