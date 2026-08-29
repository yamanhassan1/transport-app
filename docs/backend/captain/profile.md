# Backend Reference: Captain Profile

## Summary

This document describes the captain profile endpoint and its backend
implementation, covering the API contract as well as the request lifecycle from
route to authentication.

## API Specification — `GET /captains/profile`

Returns the profile (resource) of the currently authenticated captain. The
endpoint is protected by the `authCaptain` middleware, which resolves the
captain from the supplied JWT and attaches them to the request for the
controller to return.

- **Method:** `GET`
- **Path:** `/captains/profile`
- **Authentication:** Required (Bearer token or `token` cookie)
- **Handler:** `getCaptainProfile` (`backend/controllers/captain.controller.js`)

### Request

No request body or query parameters are required.

#### Authentication

The token may be supplied in one of two ways:

- **`Authorization` header:** `Bearer <token>`
- **`token` cookie:** `token=<token>` (set on successful login)

#### Example Request

```bash
curl http://localhost:3000/captains/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Responses

#### `200 OK`

Returned when the request is authenticated. The body is the authenticated
captain document.

```json
{
  "_id": "66c...",
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "captain.doe@example.com",
  "phone": "+1234567890",
  "vehicle": {
    "vehicleType": "car",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Black",
    "plateNumber": "ABC1234"
  },
  "isOnline": false,
  "isAvailable": false,
  "totalTrips": 0,
  "createdAt": "2026-08-29T00:00:00.000Z",
  "updatedAt": "2026-08-29T00:00:00.000Z"
}
```

> The `password` field is excluded from the response (`select: false` on the schema).

#### `401 Unauthorized`

Returned when no token is supplied, the token is invalid or expired, the token
has been blacklisted (e.g. after logout), or the captain does not exist.

```json
{
  "message": "Unauthorized."
}
```

### Status Codes

| Code  | Meaning         | Condition                                          |
| ----- | --------------- | -------------------------------------------------- |
| `200` | OK              | Token valid and captain found                      |
| `401` | Unauthorized    | Missing/invalid/expired/blacklisted token or captain not found |

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
captain profile flow is decomposed into three layers:

1. **Routes** — route definition and middleware wiring
2. **Middlewares** — authentication (JWT verification)
3. **Controllers** — response handling

## Profile Lifecycle

### 1. Route Layer — `backend/routes/captain.routes.js`

The `GET /profile` route wires the `authCaptain` middleware:

```js
router.get("/profile", authCaptain, captainController.getCaptainProfile);
```

The middleware runs before the controller to authenticate the request.

### 2. Middleware Layer — `backend/middlewares/auth.middleware.js`

The `authCaptain` middleware:

1. Extracts the token from `req.cookies.token` or the `Authorization` header
   (`Bearer <token>`).
2. Returns `401` if no token is present.
3. Checks whether the token has been blacklisted by querying the
   `BlacklistToken` collection; returns `401` if it has.
4. Verifies the token with `jwt.verify(token, JWT_SECRET)`.
5. Looks up the captain via `captainModel.findById(decoded._id)`.
6. Returns `401` if the captain no longer exists.
7. Attaches the captain to `req.captain` and calls `next()`.

### 3. Controller Layer — `backend/controllers/captain.controller.js`

The `getCaptainProfile` controller simply echoes the authenticated captain
back:

```js
module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json(req.captain);
};
```

## Authentication Flow Diagram

```
Client                  Middleware (authCaptain)       Model             Controller
  │                         │                         │                   │
  │  GET /captains/profile  │                         │                   │
  │  Authorization: Bearer  │                         │                   │
  │────────────────────────>│                         │                   │
  │                         │  token present?         │                   │
  │                         │  jwt.verify(token)      │                   │
  │                         │                         │                   │
  │                         │  findById(decoded._id)  │                   │
  │                         │────────────────────────>│                   │
  │                         │                         │                   │
  │                         │  captain returned       │                   │
  │                         │<────────────────────────│                   │
  │                         │                         │                   │
  │                         │  req.captain = captain  │ getCaptainProfile │
  │                         │───────────────────────────────────────────>  │
  │                         │                         │                   │
  │  { ...captain }         │                         │                   │
  │<────────────────────────│                         │                   │
```

## Security Considerations

- **JWT verification** — The token is verified with `JWT_SECRET` before any
  captain data is returned.
- **Blacklist enforcement** — Tokens that have been logged out are rejected
  even if they are otherwise valid.
- **Password exclusion** — The `select: false` schema option keeps the
  password out of profile responses.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `200`  | Authenticated successfully         | `{ ...captain }`                  |
| `401`  | Missing/invalid/blacklisted token or no captain | `{ message: "Unauthorized." }` |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  routes/captain.routes.js  # Route definitions and middleware wiring
  controllers/captain.controller.js  # Request/response handling
  middlewares/auth.middleware.js     # JWT authentication
  models/captain.model.js            # Schema and helpers
  models/blacklistToken.model.js     # Token blacklist (checked on auth)
  database/db.js                    # MongoDB connection
```
