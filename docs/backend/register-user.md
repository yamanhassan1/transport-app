# Backend Reference: User Registration

## Summary

This document describes the user registration endpoint and its backend
implementation, covering the API contract as well as the request lifecycle
from route to persistence.

## API Specification — `POST /user/register`

Registers a new user account. The endpoint validates the request payload,
hashes the supplied password using bcrypt, persists the user record, and
returns a signed JWT alongside the created user resource.

- **Method:** `POST`
- **Path:** `/user/register`
- **Authentication:** Not required
- **Handler:** `registerUser` (`backend/controllers/user.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter            | Type   | Required | Constraints                                              |
| -------------------- | ------ | -------- | -------------------------------------------------------- |
| `fullname.firstname` | string | Yes      | Minimum length of 3 characters                           |
| `fullname.lastname`  | string | No       | Minimum length of 3 characters                           |
| `email`              | string | Yes      | Must be a valid email; minimum 5 characters; unique      |
| `password`           | string | Yes      | Minimum length of 6 characters                           |

#### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

#### Validation

Validation is performed at the route layer via `express-validator` prior to
executing the controller:

- `email` must be a valid email address.
- `fullname.firstname` must be at least 3 characters.
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
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
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
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

### Status Codes

| Code  | Meaning            | Condition                                 |
| ----- | ------------------ | ----------------------------------------- |
| `201` | Created            | User registered successfully              |
| `400` | Bad Request        | One or more validation rules were violated|

### Example `curl`

```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "secret123"
  }'
```

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
registration flow is decomposed into four layers:

1. **Routes** — request validation and routing
2. **Controllers** — request/response orchestration
3. **Services** — business logic
4. **Models** — data schema and persistence helpers

## Registration Lifecycle

### 1. Route Layer — `backend/routes/user.routes.js`

The `POST /register` route registers `express-validator` middleware that
enforces the following prior to invoking the controller:

- `email` is a valid email (`isEmail`)
- `fullname.firstname` length ≥ 3
- `password` length ≥ 6

If validation fails, the router short-circuits with `400` and an array of
error objects.

### 2. Controller Layer — `backend/controllers/user.controller.js`

The `registerUser` controller:

1. Re-checks `validationResult` and responds `400` on failure.
2. Destructures `fullname`, `email`, and `password` from `req.body`.
3. Delegates password hashing to `userModel.hashPassword` (bcrypt, cost 10).
4. Invokes `userService.createUser` to persist the record.
5. Issues a JWT via `user.generateAuthToken()`.
6. Responds with `201` containing `{ token, user }`.

### 3. Service Layer — `backend/services/user.service.js`

`createUser` validates that `firstname`, `email`, and `password` are present
(throws `"All fields are required"` otherwise) and creates the Mongoose
document via `userModel.create`.

### 4. Model Layer — `backend/models/user.model.js`

The `User` schema defines:

| Field                | Type   | Required | Notes                              |
| -------------------- | ------ | -------- | ---------------------------------- |
| `fullname.firstname` | string | Yes      | Min length 3                       |
| `fullname.lastname`  | string | No       | Min length 3                       |
| `email`              | string | Yes      | Unique, min length 5               |
| `password`           | string | Yes      | `select: false` (excluded by default) |
| `socketId`           | string | No       | Optional                           |

Schema methods:

- `generateAuthToken()` — signs `{ _id }` with `JWT_SECRET`.
- `comparePassword(password)` — bcrypt comparison for login.
- `hashPassword(password)` (static) — bcrypt hash, cost 10.

## Security Considerations

- Passwords are hashed with bcrypt; plaintext is never stored or compared.
- The `password` field uses `select: false`, preventing accidental exposure in queries.
- JWTs are signed with `JWT_SECRET` sourced from environment configuration.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `201`  | Registration successful            | `{ token, user }`                 |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  routes/user.routes.js  # Route definitions and validation
  controllers/user.controller.js  # Request/response handling
  services/user.service.js        # Business logic
  models/user.model.js            # Schema and helpers
  database/db.js                  # MongoDB connection
```
