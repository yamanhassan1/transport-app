# Backend Reference: Captain Registration

## Summary

This document describes the captain registration endpoint and its backend
implementation, covering the API contract as well as the request lifecycle
from route to persistence.

## API Specification — `POST /captains/register`

Registers a new captain account. The endpoint validates the request payload,
checks for duplicate accounts, hashes the supplied password using bcrypt,
persists the captain record along with their license and vehicle details, and
returns a signed JWT alongside the created captain resource.

- **Method:** `POST`
- **Path:** `/captains/register`
- **Authentication:** Not required
- **Handler:** `registerCaptain` (`backend/controllers/captain.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter                   | Type   | Required | Constraints                                                   |
| --------------------------- | ------ | -------- | ------------------------------------------------------------- |
| `fullname.firstName`        | string | Yes      | Between 2 and 50 characters                                   |
| `fullname.lastName`         | string | Yes      | Between 2 and 50 characters                                   |
| `email`                     | string | Yes      | Valid email; unique; lowercased                               |
| `phone`                     | string | Yes      | Valid phone number; unique                                    |
| `password`                  | string | Yes      | Minimum length of 6 characters                                |
| `vehicle.vehicleType`       | string | Yes      | One of `bike`, `rickshaw`, `car`, `premium`, `go`, `go_mini`, `go_sedan` |
| `vehicle.make`              | string | Yes      |                                                               |
| `vehicle.model`             | string | Yes      |                                                               |
| `vehicle.year`              | number | Yes      | Integer in a plausible year range                             |
| `vehicle.color`             | string | Yes      |                                                               |
| `vehicle.plateNumber`       | string | Yes      | Between 3 and 15 characters; unique; uppercased               |
| `license.number`            | string | Yes      | Between 5 and 30 characters; unique                           |
| `license.expiryDate`        | string | Yes      | ISO 8601 date                                                 |

#### Example Request

```json
{
  "fullname": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "captain.doe@example.com",
  "phone": "+1234567890",
  "password": "secret123",
  "vehicle": {
    "vehicleType": "car",
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Black",
    "plateNumber": "ABC1234"
  },
  "license": {
    "number": "DL-12345678",
    "expiryDate": "2030-01-01"
  }
}
```

#### Validation

Validation is performed at the route layer via `express-validator` prior to
executing the controller:

- `fullname.firstName` / `fullname.lastName` length 2–50.
- `email` must be a valid email address.
- `phone` must be a valid mobile number.
- `password` must be at least 6 characters.
- `vehicle.vehicleType` must be one of the allowed enum values.
- `vehicle` required fields (`make`, `model`, `color`, `plateNumber`, `year`).
- `license.number` and `license.expiryDate` are required.

Validation failures result in an immediate `400` response enumerating the errors.

### Responses

#### `201 Created`

Returned when the captain is successfully created.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "captain": {
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
    "license": {
      "number": "DL-12345678",
      "expiryDate": "2030-01-01T00:00:00.000Z"
    }
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
      "msg": "Invalid Vehicle Type",
      "param": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

#### `409 Conflict`

Returned when a captain already exists with one of the unique fields (email,
phone, license number, or vehicle plate number).

```json
{
  "message": "A captain with this email already exists"
}
```

### Status Codes

| Code  | Meaning            | Condition                                 |
| ----- | ------------------ | ----------------------------------------- |
| `201` | Created            | Captain registered successfully           |
| `400` | Bad Request        | One or more validation rules were violated|
| `409` | Conflict           | Captain with a unique field already exists|

### Example `curl`

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstName": "John", "lastName": "Doe" },
    "email": "captain.doe@example.com",
    "phone": "+1234567890",
    "password": "secret123",
    "vehicle": {
      "vehicleType": "car",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "color": "Black",
      "plateNumber": "ABC1234"
    },
    "license": { "number": "DL-12345678", "expiryDate": "2030-01-01" }
  }'
```

## Architecture

The backend is an Express application backed by MongoDB (via Mongoose). The
captain registration flow is decomposed into four layers:

1. **Routes** — request validation and routing
2. **Controllers** — request/response orchestration and duplicate checks
3. **Services** — business logic and duplicate lookups
4. **Models** — data schema and persistence helpers

## Registration Lifecycle

### 1. Route Layer — `backend/routes/captain.routes.js`

The `POST /register` route registers `express-validator` middleware that
enforces the schema constraints described in the Request section prior to
invoking the controller. If validation fails, the router short-circuits with
`400` and an array of error objects.

### 2. Controller Layer — `backend/controllers/captain.controller.js`

The `registerCaptain` controller:

1. Re-checks `validationResult` and responds `400` on failure.
2. Destructures `fullname`, `email`, `phone`, `password`, `vehicle`, and
   `license` from `req.body`.
3. Calls `captainService.isCaptainExists({ email, phone, licenseNumber, plateNumber })`.
4. Returns `409` with a field-specific message if an existing account matches.
5. Hashes the password via `CaptainModel.hashPassword` (bcrypt, cost 10).
6. Invokes `captainService.createCaptain` to persist the record.
7. Issues a JWT via `captain.generateAuthToken()`.
8. Stores the token in an `httpOnly` `token` cookie (`SameSite=Lax` in dev;
   `Secure` with `SameSite=None` in production; 24h TTL) and responds with
   `201` containing `{ token, captain }`.

### 3. Service Layer — `backend/services/captain.service.js`

- `isCaptainExists` looks up a captain by email, phone, license number, or
  vehicle plate number and returns `{ exists, field }`.
- `createCaptain` verifies all required fields and vehicle/license details are
  present (throws `"All fields are required"` / `"Vehicle details are
  required"` / `"License details are required"` otherwise) and creates the
  Mongoose document.

### 4. Model Layer — `backend/models/captain.model.js`

The `Captain` schema defines the fields described in the API specification,
including unique constraints on `email`, `phone`, `license.number`, and
`vehicle.plateNumber`. Schema methods:

- `generateAuthToken()` — signs `{ _id, role }` with `JWT_SECRET` (24h).
- `comparePassword(password)` — bcrypt comparison for login.
- `hashPassword(password)` (static) — bcrypt hash, cost 10.

## Security Considerations

- **Duplicate detection** — Registration rejects duplicate email, phone,
  license, and plate numbers with `409` before hashing/comparing anything.
- **Password hashing** — Passwords are hashed with bcrypt; plaintext is never
  stored or logged.
- **Password exclusion** — The `password` field uses `select: false`,
  preventing accidental exposure in queries.
- **JWT signing** — Tokens are signed with `JWT_SECRET` sourced from
  environment configuration.

## Response Contract

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `201`  | Registration successful            | `{ token, captain }`              |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |
| `409`  | Duplicate account field            | `{ message: "..." }`              |

## Source Layout

```
backend/
  app.js                 # Application bootstrap and middleware
  server.js              # Server entry point
  config/constants.js    # Centralized config (JWT secret, rate limits, CORS)
  config/cookies.js      # Auth cookie attributes (httpOnly, sameSite, secure)
  routes/captain.routes.js   # Route definitions and validation
  controllers/captain.controller.js  # Request/response handling
  services/captain.service.js        # Business logic and duplicate checks
  models/captain.model.js            # Schema and helpers
  database/db.js                     # MongoDB connection
```
