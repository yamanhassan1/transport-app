# Backend Reference: User Logout

## Summary

This document describes the user logout endpoint and its backend implementation,
covering the API contract as well as the request lifecycle from route to token
invalidation.

## API Specification — `GET /users/logout`

Logs out the currently authenticated user. The endpoint clears the authentication
cookie and blacklists the supplied token so it can no longer be used to access
protected routes.

- **Method:** `GET`
- **Path:** `/users/logout`
- **Authentication:** Required (Bearer token or `token` cookie)
- **Handler:** `logoutUser` (`backend/controllers/user.controller.js`)

### Request

No request body or query parameters are required.

#### Authentication

The token may be supplied in one of two ways:

- **`Authorization` header:** `Bearer <token>`
- **`token` cookie:** `token=<token>` (set on successful login)

#### Example Request

```bash
curl http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Responses

#### `200 OK`

Returned when the token has been cleared and blacklisted.

```json
{
  "message": "Logged out successfully"
}
```

#### `401 Unauthorized`

Returned when no token is supplied, the token is invalid or expired, or the
token has already been blacklisted.

```json
{
  "message": "Unauthorized."
}
```

### Status Codes

| Code  | Meaning         | Condition                                                     |
| ----- | --------------- | ------------------------------------------------------------- |
| `200` | OK              | Token cleared and blacklisted                                 |
| `401` | Unauthorized    | Missing/invalid/expired token or user not found or blacklisted|

### Example `curl`

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
logout flow is decomposed into three layers:

1. **Routes** — route definition and middleware wiring
2. **Middlewares** — authentication (JWT verification)
3. **Controllers** — token invalidation and response handling

## Logout Lifecycle

### 1. Route Layer — `backend/routes/user.routes.js`

The `GET /logout` route wires the `authUser` middleware:

```js
router.get("/logout", authUser, userController.logoutUser);
```

### 2. Middleware Layer — `backend/middlewares/auth.middleware.js`

The `authUser` middleware authenticates the request before logout runs:

1. Extracts the token from `req.cookies.token` or the `Authorization` header.
2. Returns `401` if no token is present.
3. Returns `401` if the token is already blacklisted.
4. Verifies the token with `jwt.verify(token, JWT_SECRET)` and resolves the user.
5. Attaches the user to `req.user` and calls `next()`.

### 3. Controller Layer — `backend/controllers/user.controller.js`

The `logoutUser` controller:

1. Clears the `token` cookie via
   `res.clearCookie("token", clearCookieOptions())`, using the same attributes
   it was set with.
2. Re-extracts the token from the cookie or `Authorization` header
   (`req.cookies.token || req.headers.authorization?.split(" ")[1]`).
3. Persists the token to the blacklist collection via
   `blackListTokenModel.create({ token })`, invalidating it for future requests.
4. Responds with `200` and `{ message: "Logged out successfully" }`.

### 4. Model Layer — `backend/models/blacklistToken.model.js`

The `BlacklistToken` schema stores invalidated tokens:

| Field       | Type   | Required | Notes                                              |
| ----------- | ------ | -------- | -------------------------------------------------- |
| `token`     | string | Yes      | Unique                                            |
| `createdAt` | Date   | Yes      | Defaults to now; auto-expires after `86400` seconds (24 hours) |

## Logout Flow Diagram

```
Client                Middleware (authUser)         Model                   Controller
  │                         │                         │                         │
  │  GET /users/logout      │                         │                         │
  │  Authorization: Bearer  │                         │                         │
  │────────────────────────>│                         │                         │
  │                         │  jwt.verify(token)      │                         │
  │                         │  req.userId = decoded._id│ logoutUser             │
  │                         │─────────────────────────────────────────────────>│
  │                         │                         │                         │
  │                         │                         │  create({ token })      │
  │                         │                         │────────────────────────>│
  │                         │                         │  (blacklist)            │
  │                         │                         │<────────────────────────│
  │                         │                         │                         │
  │  { message }            │                         │                         │
  │<────────────────────────│                         │                         │
```

## Security Considerations

- **Token blacklisting** — On logout the token is stored in a blacklist with a
  24-hour TTL, so it cannot be reused even before natural JWT expiry.
- **Cookie clearing** — The authentication cookie is removed on the client.
- **Idempotent re-check** — The `authUser` middleware rejects requests carrying
  an already-blacklisted token with `401`.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `200`  | Logged out successfully            | `{ message: "Logged out successfully" }` |
| `401`  | Missing/invalid token or blacklisted| `{ message: "Unauthorized." }`    |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  config/constants.js    # Centralized config (JWT secret, rate limits, CORS)
  config/cookies.js      # Auth cookie attributes (httpOnly, sameSite, secure)
  routes/user.routes.js  # Route definitions and middleware wiring
  controllers/user.controller.js  # Request/response handling and token invalidation
  middlewares/auth.middleware.js  # JWT authentication
  models/user.model.js            # Schema and helpers
  models/blacklistToken.model.js  # Token blacklist (created on logout)
  database/db.js                  # MongoDB connection
```
