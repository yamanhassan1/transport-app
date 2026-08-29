# Frontend Reference: Captain Home

## Summary

The same `/` landing page rendered with the captain session active. Most of it is
identical to the rider view (`docs/frontend/user/home.md`) — this doc lists only
what changes for a signed-in captain.

## Differences for captains

### Hero (signed-in)

- `Hello, {firstName}` greeting chip appears (same as any authenticated user).
- Primary CTA **"Go to your profile"** → `/profile`.
- Secondary CTA **"Account settings"** → `/settings`.

### Drive banner

The `role === "captain"` branch of the drive-now section:

- Button label: **"View captain profile"** (instead of "Become a captain").
- Link target: `/profile` (instead of `/register?mode=captain`).

So a logged-in captain is routed from the banner straight to their profile
(vehicle + licence cards) rather than to a sign-up wizard.

## Source layout

- `frontend/src/pages/Home/Home.jsx` — `to={role === "captain" ? "/profile" : "/register?mode=captain"}`
  and `{role === "captain" ? "View captain profile" : "Become a captain"}`