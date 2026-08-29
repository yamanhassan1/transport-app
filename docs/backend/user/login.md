# Backend Reference: User Login

## Summary

This document describes the user login endpoint and its backend implementation,
covering the API contract as well as the request lifecycle from route to
authentication.

## API Specification — `POST /users/login`

Authenticates an existing user by verifying their email **or phone** and
password. The endpoint validates the request payload, looks up the user by the
supplied field, compares the supplied password against the stored bcrypt hash,
and returns a signed JWT alongside the authenticated user resource.

- **Method:** `POST`
- **Path:** `/users/login`
- **Authentication:** Not required
- **Handler:** `loginUser` (`backend/controllers/user.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter  | Type   | Required | Constraints                                     |
| ---------- | ------ | -------- | ----------------------------------------------- |
| `email`    | string | No*      | Valid email; lowercased before lookup           |
| `phone`    | string | No*      | Valid mobile number                             |
| `password` | string | Yes      | Minimum length of 6 characters                  |

> \* At least one of `email` or `phone` is required (enforced by a
> `body().custom` check). The controller queries `{ phone }` when a phone is
> given, otherwise `{ email: email.toLowerCase() }`.

#### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

or, by phone:

```json
{
  "phone": "+1234567890",
  "password": "secret123"
}
```

#### Validation

Validation is performed at the route layer via `express-validator` prior to
executing the controller:

- `email` (optional) must be a valid email address (and is lowercased).
- `phone` (optional) must be a valid mobile phone number.
- `password` must be at least 6 characters.
- A `body().custom` check rejects the request unless `email` **or** `phone` is present.

Validation failures result in an immediate `400` response enumerating the errors.

### Responses

#### `200 OK`

Returned when authentication succeeds.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "_id": "66c...",
    "fullname": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }
}
```

> The `password` field is excluded from the response (`select: false` on the schema).

#### `400 Bad Request`

Returned when request validation fails.

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### `401 Unauthorized`

Returned when the email does not exist or the password does not match.

```json
{
  "message": "Invalid email or password"
}
```

> A generic message is returned for both scenarios to prevent user enumeration.

### Status Codes

| Code  | Meaning         | Condition                                        |
| ----- | --------------- | ------------------------------------------------ |
| `200` | OK              | Authentication successful                        |
| `400` | Bad Request     | One or more validation rules were violated       |
| `401` | Unauthorized    | Email not found or password mismatch             |

### Example `curl`

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "secret123"
  }'
```

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
login flow is decomposed into three layers:

1. **Routes** — request validation and routing
2. **Controllers** — request/response orchestration and authentication logic
3. **Models** — data lookup, password comparison, and token generation

## Login Lifecycle

### 1. Route Layer — `backend/routes/user.routes.js`

The `POST /login` route registers `express-validator` middleware that
enforces the following prior to invoking the controller:

- `email` (optional) is a valid email (`isEmail`) and is lowercased (`toLowerCase`)
- `phone` (optional) is a valid mobile number
- `password` length ≥ 6
- exactly one of `email` / `phone` required (custom `body()` check)

If validation fails, the router short-circuits with `400` and an array of
error objects.

### 2. Controller Layer — `backend/controllers/user.controller.js`

The `loginUser` controller:

1. Re-checks `validationResult` and responds `400` on failure.
2. Destructures `email`, `phone` and `password` from `req.body`.
3. Queries the database with `{ phone }` when a phone was supplied, otherwise by
   `{ email: email.toLowerCase() }` (matching the stored lowercase value),
   explicitly selecting the `password` field
   (`select("+password")`) since it is excluded by default.
4. Returns `401` if no user is found.
5. Calls `user.comparePassword(password)` to verify the bcrypt hash.
6. Returns `401` if the password does not match.
7. Issues a JWT via `user.generateAuthToken()`.
8. Stores the token as an `httpOnly` `token` cookie (`SameSite=Lax` in dev;
   `Secure` with `SameSite=None` in production; 24h TTL) and clears
   `user.password`.
9. Responds with `200` containing `{ token, user }`.

### 3. Model Layer — `backend/models/user.model.js`

The `User` schema provides the following methods used during login:

- `comparePassword(password)` — instance method that performs a bcrypt
  comparison between the supplied plaintext and the stored hash.
- `generateAuthToken()` — instance method that signs `{ _id, role }` with
  `JWT_SECRET` and returns the resulting JWT.

#### Schema Field: `password`

| Property | Value    | Purpose                                                |
| -------- | -------- | ------------------------------------------------------ |
| `select` | `false`  | Excluded from query results by default; must be explicitly selected with `+password` when needed for authentication. |

## Authentication Flow Diagram

```
Client                  Route                   Controller              Model
  │                       │                         │                     │
  │  POST /users/login    │                         │                     │
  │──────────────────────>│                         │                     │
  │                       │  express-validator       │                     │
  │                       │─────────────────────    │                     │
  │                       │                         │                     │
  │                       │  loginUser(req, res)    │                     │
  │                       │────────────────────>    │                     │
  │                       │                         │  findOne({ email }) │
  │                       │                         │  .select("+password")│
  │                       │                         │───────────────────> │
  │                       │                         │                     │
  │                       │                         │  user returned      │
  │                       │                         │<─────────────────── │
  │                       │                         │                     │
  │                       │                         │  comparePassword()  │
  │                       │                         │───────────────────> │
  │                       │                         │                     │
  │                       │                         │  true / false       │
  │                       │                         │<─────────────────── │
  │                       │                         │                     │
  │                       │                         │  generateAuthToken()│
  │                       │                         │───────────────────> │
  │                       │                         │                     │
  │                       │                         │  token              │
  │                       │                         │<─────────────────── │
  │                       │                         │                     │
  │  { token, user }      │                         │                     │
  │<──────────────────────│                         │                     │
```

## Security Considerations

- **Password hashing** — Passwords are compared using bcrypt; plaintext is
  never stored or logged.
- **Password exclusion** — The `select: false` schema option prevents the
  password from being returned in queries unless explicitly requested.
- **Generic error messages** — Both "user not found" and "wrong password"
  return the same `401` response (`"Invalid email or password"`) to prevent
  attackers from enumerating valid email addresses.
- **JWT signing** — Tokens are signed with `JWT_SECRET` sourced from
  environment configuration.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `200`  | Authentication successful          | `{ token, user }`                 |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |
| `401`  | Invalid credentials                | `{ message: "..." }`              |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  config/constants.js    # Centralized config (JWT secret, rate limits, CORS)
  config/cookies.js      # Auth cookie attributes (httpOnly, sameSite, secure)
  routes/user.routes.js  # Route definitions and validation
  controllers/user.controller.js  # Request/response handling
  services/user.service.js        # Business logic (not used for login)
  models/user.model.js            # Schema and helpers
  database/db.js                  # MongoDB connection
```
