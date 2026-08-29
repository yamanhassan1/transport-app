# Backend Reference: User Profile

## Summary

This document describes the user profile endpoint and its backend
implementation, covering the API contract as well as the request lifecycle from
route to authentication.

## API Specification — `GET /users/profile`

Returns the profile (resource) of the currently authenticated user. The
endpoint is protected by the `authUser` middleware, which resolves the user from
the supplied JWT and attaches them to the request for the controller to return.

- **Method:** `GET`
- **Path:** `/users/profile`
- **Authentication:** Required (Bearer token or `token` cookie)
- **Handler:** `getUserProfile` (`backend/controllers/user.controller.js`)

### Request

No request body or query parameters are required.

#### Authentication

The token may be supplied in one of two ways:

- **`Authorization` header:** `Bearer <token>`
- **`token` cookie:** `token=<token>` (set on successful login)

#### Example Request

```bash
curl http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Responses

#### `200 OK`

Returned when the request is authenticated. The body is the authenticated user
document.

```json
{
  "_id": "66c...",
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "socketId": "abc123",
  "createdAt": "2026-08-29T00:00:00.000Z",
  "updatedAt": "2026-08-29T00:00:00.000Z"
}
```

> The `password` field is excluded from the response (`select: false` on the schema).

#### `401 Unauthorized`

Returned when no token is supplied, the token is invalid or expired, or the
token has been blacklisted (e.g. after logout).

```json
{
  "message": "Unauthorized."
}
```

### Status Codes

| Code  | Meaning         | Condition                                                    |
| ----- | --------------- | ------------------------------------------------------------ |
| `200` | OK              | Token valid and user found                                   |
| `401` | Unauthorized    | Missing/invalid/expired token or user not found or blacklisted |

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
profile flow is decomposed into three layers:

1. **Routes** — route definition and middleware wiring
2. **Middlewares** — authentication (JWT verification)
3. **Controllers** — response handling

## Profile Lifecycle

### 1. Route Layer — `backend/routes/user.routes.js`

The `GET /profile` route wires the `authUser` middleware:

```js
router.get("/profile", authUser, userController.getUserProfile);
```

The middleware runs before the controller to authenticate the request.

### 2. Middleware Layer — `backend/middlewares/auth.middleware.js`

The `authUser` middleware:

1. Extracts the token from `req.cookies.token` or the `Authorization` header
   (`Bearer <token>`).
2. Returns `401` if no token is present.
3. Checks whether the token has been blacklisted by querying the blacklist
   collection; returns `401` if it has.
4. Verifies the token with `jwt.verify(token, JWT_SECRET)`.
5. Looks up the user via `userModel.findById(decoded._id)`.
6. Returns `401` if the user no longer exists.
7. Attaches the user to `req.user` and calls `next()`.

### 3. Controller Layer — `backend/controllers/user.controller.js`

The `getUserProfile` controller simply echoes the authenticated user back:

```js
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};
```

## Authentication Flow Diagram

```
Client                Middleware (authUser)         Model             Controller
  │                         │                         │                   │
  │  GET /users/profile     │                         │                   │
  │  Authorization: Bearer  │                         │                   │
  │────────────────────────>│                         │                   │
  │                         │  token present?         │                   │
  │                         │  jwt.verify(token)      │                   │
  │                         │                         │                   │
  │                         │  findById(decoded._id)  │                   │
  │                         │────────────────────────>│                   │
  │                         │                         │                   │
  │                         │  user returned          │                   │
  │                         │<────────────────────────│                   │
  │                         │                         │                   │
  │                         │  req.user = user        │ getUserProfile    │
  │                         │─────────────────────────────────────────>   │
  │                         │                         │                   │
  │  { ...user }            │                         │                   │
  │<────────────────────────│                         │                   │
```

## Security Considerations

- **JWT verification** — The token is verified with `JWT_SECRET` before any
  user data is returned.
- **Blacklist enforcement** — Tokens that have been logged out are rejected
  even if they are otherwise valid.
- **Password exclusion** — The `select: false` schema option keeps the password
  out of profile responses.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `200`  | Authenticated successfully         | `{ ...user }`                     |
| `401`  | Missing/invalid token or blacklisted| `{ message: "Unauthorized." }`    |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  routes/user.routes.js  # Route definitions and middleware wiring
  controllers/user.controller.js  # Request/response handling
  middlewares/auth.middleware.js  # JWT authentication
  models/user.model.js            # Schema and helpers
  models/blacklistToken.model.js  # Token blacklist (used by auth/logout)
  database/db.js                  # MongoDB connection
```
