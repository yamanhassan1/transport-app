# Backend Reference: Captain Logout

## Summary

Captains log out through their own endpoint, `GET /captains/logout`. The
mechanism is **identical** to the user logout (clear cookie + blacklist token),
so this doc covers the API contract and the captain-specific wiring and
references the shared lifecycle instead of repeating it.

## API Specification — `GET /captains/logout`

Logs out the currently authenticated captain. Clears the authentication cookie
and blacklists the supplied token so it can no longer be used.

- **Method:** `GET`
- **Path:** `/captains/logout`
- **Authentication:** Required (Bearer token or `token` cookie)
- **Handler:** `logoutCaptain` (`backend/controllers/captain.controller.js`)

### Request

No body or query parameters. Auth via **`Authorization` header**
(`Bearer <token>`) **or** the **`token`** httpOnly cookie.

#### Example Request

```bash
curl http://localhost:3000/captains/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Responses

#### `200 OK`

`{ "message": "Logged out successfully" }` — token cleared and blacklisted.

#### `401 Unauthorized`

`{ "message": "Unauthorized." }` — missing/invalid/expired/blacklisted token or
captain not found.

### Status codes

| Code  | Meaning         | Condition                                          |
| ----- | --------------- | -------------------------------------------------- |
| `200` | OK              | Token cleared and blacklisted                      |
| `401` | Unauthorized    | Missing/invalid/expired/blacklisted token or captain not found |

## How it differs from the user logout

| Aspect          | User                              | Captain                                |
| --------------- | --------------------------------- | -------------------------------------- |
| Path            | `/users/logout`                   | `/captains/logout`                     |
| Handler         | `logoutUser`                      | `logoutCaptain`                        |
| Middleware      | `authUser`                        | `authCaptain`                          |
| Route wiring    | `router.get("/logout", authUser, userController.logoutUser)` | `router.get("/logout", authCaptain, captainController.logoutCaptain)` |

## Shared lifecycle

The flow is the same as the user logout: `authCaptain` middleware extracts the
token (`req.cookies.token` or `Authorization: Bearer`), rejects missing or
already-blacklisted tokens with `401`, verifies with `jwt.verify(token,
JWT_SECRET)` and checks the role, setting `req[idField] = decoded._id`; then `logoutCaptain` clears
the `token` cookie (`res.clearCookie("token", clearCookieOptions())`),
re-extracts the token (`req.cookies.token || req.headers.authorization?.split(" ")[1]`),
persists it to the blacklist (`blackListTokenModel.create({ token })`), and
answers `200 { message }`.

See [`../user/logout.md`](../user/logout.md) for the full lifecycle walkthrough,
flow diagram, security notes (24h blacklist TTL, cookie clearing,
blacklisted-token re-check), and the `BlacklistToken` model table.

## Response contract (captain)

| Status | Condition                                   | Body                              |
| ------ | ------------------------------------------- | --------------------------------- |
| `200`  | Logged out successfully                     | `{ message: "Logged out successfully" }` |
| `401`  | Missing/invalid/blacklisted token or no captain | `{ message: "Unauthorized." }`   |

## Source layout

```
backend/
  routes/captain.routes.js          # GET /logout + authCaptain
  controllers/captain.controller.js # logoutCaptain (cookie clear + blacklist)
  middlewares/auth.middleware.js    # authCaptain (JWT verification)
  models/blacklistToken.model.js    # Token blacklist (created on logout)
```