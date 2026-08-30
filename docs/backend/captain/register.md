# Backend Reference: Captain Registration

## Summary

Captains sign up through `POST /captains/register`. The flow mirrors the user
registration (route validation → controller → service → model) **plus** vehicle
and licence details; only the captain-specific contract, validation, and
duplicate checks are repeated here — the shared lifecycle is referenced.

## API Specification — `POST /captains/register`

Registers a new captain account. The endpoint validates the payload, checks for
duplicates, hashes the password (bcrypt), persists the captain along with their
**vehicle** and **licence**, and returns a signed JWT alongside the created
captain resource.

- **Method:** `POST`
- **Path:** `/captains/register`
- **Authentication:** Not required
- **Handler:** `registerCaptain` (`backend/controllers/captain.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter                | Type   | Required | Constraints                                             |
| ------------------------ | ------ | -------- | ------------------------------------------------------- |
| `fullname.firstName`     | string | Yes      | 2–50 characters (shorter than user's 3 — captains)      |
| `fullname.lastName`      | string | Yes      | 2–50 characters (required for captains)                 |
| `email`                  | string | Yes      | Valid email; unique; lowercased                         |
| `phone`                  | string | Yes      | International `+` + 7–15 digits; unique         |
| `password`               | string | Yes      | Minimum length of 6 characters                          |
| `vehicle.vehicleType`    | string | Yes      | One of `bike`, `rickshaw`, `car`, `premium`, `go`, `go_mini`, `go_sedan` |
| `vehicle.make`           | string | Yes      |                                                         |
| `vehicle.model`          | string | Yes      |                                                         |
| `vehicle.year`           | number | Yes      | Integer 1886 … current year + 1                         |
| `vehicle.color`          | string | Yes      |                                                         |
| `vehicle.plateNumber`    | string | Yes      | 3–15 characters; unique; uppercased                     |
| `license.number`         | string | Yes      | 5–30 characters; unique                                 |
| `license.expiryDate`     | string | Yes      | ISO 8601 date                                           |

#### Example Request

```json
{
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
}
```

#### Validation

Route layer, `express-validator` (see `backend/routes/captain.routes.js`):
firstName/lastName 2–50, valid email (normalized + lowercased), phone as an
international `+` + 7–15-digit string, password ≥ 6, `vehicleType` in the enum, `make`/`model`/`color` non-empty,
`year` integer 1886–next year, `plateNumber` 3–15 **uppercased**,
`license.number` 5–30, `license.expiryDate` ISO 8601. Failures return `400`.

### Responses

#### `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "captain": {
    "_id": "66c...",
    "fullname": { "firstName": "John", "lastName": "Doe" },
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
    "license": { "number": "DL-12345678", "expiryDate": "2030-01-01T00:00:00.000Z" }
  }
}
```

> `password` is excluded from the response (`select: false`).

#### `400 Bad Request`

`{ "errors": [ { "msg": "Invalid Vehicle Type", "param": "vehicle.vehicleType", "location": "body" } ] }`.

#### `409 Conflict`

Returned when a captain already exists with one of the **unique fields** — email,
phone, **license number**, or **vehicle plate number**:

```json
{ "message": "A captain with this email already exists" }
```

### Status codes

| Code  | Meaning     | Condition                                      |
| ----- | ----------- | ---------------------------------------------- |
| `201` | Created     | Captain registered successfully                |
| `400` | Bad Request | One or more validation rules were violated     |
| `409` | Conflict    | Captain with a unique field already exists     |

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
      "vehicleType": "car", "make": "Toyota", "model": "Camry",
      "year": 2020, "color": "Black", "plateNumber": "ABC1234"
    },
    "license": { "number": "DL-12345678", "expiryDate": "2030-01-01" }
  }'
```

## How it differs from the user registration

| Aspect             | User                                  | Captain                                   |
| ------------------ | ------------------------------------- | ----------------------------------------- |
| Path               | `/users/register`                     | `/captains/register`                      |
| Handler            | `registerUser`                        | `registerCaptain`                         |
| Name length        | firstName/lastName 3–50, lastName optional | firstName/lastName 2–50, both **required** |
| Extra payload      | —                                     | `vehicle` + `license` blocks              |
| Unique fields      | `email`, `phone`                      | `email`, `phone`, `license.number`, `vehicle.plateNumber` |
| Response           | `{ token, user }`                     | `{ token, captain }`                      |

Both roles sign their JWT with the same claim set — `{ _id, role }` (see the model
bullet below and `docs/backend/user/register.md`).

## Shared lifecycle + captain-specific implementation

The registration lifecycle (4 layers) is the same as the user flow — see
[`../user/register.md`](../user/register.md) for the route → controller →
service → model walkthrough and the security notes that both roles share
(duplicate detection, bcrypt hashing, `select: false`, JWT signing, httpOnly
cookie).

Captain-specific behaviour:

1. **Route layer** — validators listed under *Validation* above (incl. the
   `vehicleType` whitelist and `toUpperCase()` on the plate number), plus the
   `authLimiter` rate limit on `/register`.
2. **Controller** (`registerCaptain`) — re-checks `validationResult`; destructures
   `fullname`, `email`, `phone`, `password`, `vehicle`, `license`;
   `captainService.isCaptainExists({ email, phone, licenseNumber, plateNumber })`
   → `409` on a match; hashes via `CaptainModel.hashPassword` (bcrypt, cost 10);
   `captainService.createCaptain`; `captain.generateAuthToken()`;
   sets the httpOnly `token` cookie (24h); responds `201 { token, captain }`.
3. **Service** (`captain.service.js`) — `isCaptainExists` checks email, phone,
   **license number**, and **plate number** returning `{ exists, field }`;
   `createCaptain` requires all fields plus vehicle/licence blocks
   (throws `"All fields are required"` / `"Vehicle details are required"` /
   `"License details are required"` otherwise) and persists via
   `CaptainModel.create`.
4. **Model** (`captain.model.js`) — the `Captain` schema has unique indexes on
   `email`, `phone`, `license.number`, and `vehicle.plateNumber`; methods
   `generateAuthToken()` (signs `{ _id, role }`), `comparePassword()`,
   static `hashPassword()`.

## Response contract (captain)

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `201`  | Registration successful            | `{ token, captain }`              |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |
| `409`  | Duplicate account field            | `{ message: "..." }`              |

## Source layout

```
backend/
  routes/captain.routes.js          # POST /register + validation (+ authLimiter)
  controllers/captain.controller.js # registerCaptain
  services/captain.service.js       # isCaptainExists (4 fields), createCaptain
  models/captain.model.js           # Captain schema + helpers
```