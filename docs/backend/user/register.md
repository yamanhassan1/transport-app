# Backend Reference: User Registration

## Summary

This document describes the user registration endpoint and its backend
implementation, covering the API contract as well as the request lifecycle
from route to persistence.

## API Specification — `POST /users/register`

Registers a new user account. The endpoint validates the request payload,
checks for duplicate accounts, hashes the supplied password using bcrypt,
persists the user record, and returns a signed JWT alongside the created user
resource.

- **Method:** `POST`
- **Path:** `/users/register`
- **Authentication:** Not required
- **Handler:** `registerUser` (`backend/controllers/user.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter            | Type   | Required | Constraints                                              |
| -------------------- | ------ | -------- | -------------------------------------------------------- |
| `fullname.firstName` | string | Yes      | Between 3 and 50 characters                              |
| `fullname.lastName`  | string | No       | Between 3 and 50 characters                              |
| `email`              | string | Yes      | Valid email; unique; lowercased                          |
| `phone`              | string | Yes      | Valid phone number; unique                               |
| `password`           | string | Yes      | Minimum length of 6 characters                           |

#### Example Request

```json
{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "secret123"
}
```

#### Validation

Validation is performed at the route layer via `express-validator` prior to
executing the controller:

- `fullname.firstName` must be between 3 and 50 characters.
- `email` must be a valid email address.
- `phone` must be a valid mobile number.
- `password` must be at least 6 characters.

Validation failures result in an immediate `400` response enumerating the errors.

### Responses

#### `201 Created`

Returned when the user is successfully created.

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
      "msg": "First name must be between 3 and 50 characters long",
      "param": "fullname.firstName",
      "location": "body"
    }
  ]
}
```

#### `409 Conflict`

Returned when a user already exists with the same email or phone number.

```json
{
  "message": "An account with this email already exists"
}
```

### Status Codes

| Code  | Meaning            | Condition                                 |
| ----- | ------------------ | ----------------------------------------- |
| `201` | Created            | User registered successfully              |
| `400` | Bad Request        | One or more validation rules were violated|
| `409` | Conflict           | User with a unique field already exists   |

### Example `curl`

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "secret123"
  }'
```

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
registration flow is decomposed into four layers:

1. **Routes** — request validation and routing
2. **Controllers** — request/response orchestration and duplicate checks
3. **Services** — business logic and duplicate lookups
4. **Models** — data schema and persistence helpers

## Registration Lifecycle

### 1. Route Layer — `backend/routes/user.routes.js`

The `POST /register` route registers `express-validator` middleware that
enforces the following prior to invoking the controller:

- `fullname.firstName` length 3–50
- `email` is a valid email (`isEmail`)
- `phone` is a valid mobile number
- `password` length ≥ 6

If validation fails, the router short-circuits with `400` and an array of
error objects.

### 2. Controller Layer — `backend/controllers/user.controller.js`

The `registerUser` controller:

1. Re-checks `validationResult` and responds `400` on failure.
2. Destructures `fullname`, `email`, `phone`, and `password` from `req.body`.
3. Calls `userService.isUserExists({ email, phone })`.
4. Returns `409` with a field-specific message if an account already exists.
5. Delegates password hashing to `userModel.hashPassword` (bcrypt, cost 10).
6. Invokes `userService.createUser` to persist the record.
7. Issues a JWT via `user.generateAuthToken()`.
8. Stores the token in an `httpOnly` `token` cookie (24h) and responds with
   `201` containing `{ token, user }`.

### 3. Service Layer — `backend/services/user.service.js`

- `isUserExists` looks up a user by email or phone and returns
  `{ exists, field }` (where `field` is `"email"` or `"phone"`).
- `createUser` validates that `firstName`, `email`, `phone`, and `password` are
  present (throws `"All fields are required"` otherwise) and creates the
  Mongoose document via `userModel.create`.

### 4. Model Layer — `backend/models/user.model.js`

The `User` schema defines:

| Field                 | Type    | Required | Notes                              |
| --------------------- | ------- | -------- | ---------------------------------- |
| `fullname.firstName`  | string  | Yes      | Min 3, max 50                      |
| `fullname.lastName`   | string  | No       | Min 3, max 50                      |
| `email`               | string  | Yes      | Unique, lowercase                  |
| `phone`               | string  | Yes      | Unique                             |
| `password`            | string  | Yes      | `select: false` (excluded by default) |
| `role`                | string  | No       | Enum `["user"]`, default `"user"`  |
| `isVerified`          | boolean | No       | Default `false`                    |
| `isActive`            | boolean | No       | Default `true`                     |
| `profileImage`        | string  | No       | Default `null`                     |
| `location`            | object  | No       | GeoJSON `Point`, default `[0, 0]`  |
| `socketId`            | string  | No       | Optional                           |
| `lastLoginAt`         | date    | No       | Default `null`                     |

Schema methods:

- `generateAuthToken()` — signs `{ _id }` with `JWT_SECRET` (24h).
- `comparePassword(password)` — bcrypt comparison for login.
- `hashPassword(password)` (static) — bcrypt hash, cost 10.

## Security Considerations

- **Duplicate detection** — Registration rejects duplicate email or phone with
  `409` before hashing/creating anything.
- Passwords are hashed with bcrypt; plaintext is never stored or compared.
- The `password` field uses `select: false`, preventing accidental exposure in queries.
- JWTs are signed with `JWT_SECRET` sourced from environment configuration.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `201`  | Registration successful            | `{ token, user }`                 |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |
| `409`  | Duplicate account field            | `{ message: "..." }`              |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  routes/user.routes.js  # Route definitions and validation
  controllers/user.controller.js  # Request/response handling
  services/user.service.js        # Business logic and duplicate checks
  models/user.model.js            # Schema and helpers
  database/db.js                  # MongoDB connection
```
