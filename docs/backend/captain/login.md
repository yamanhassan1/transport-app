# Backend Reference: Captain Login

## Summary

Captains authenticate through their own endpoint, `POST /captains/login`. This
doc covers the API contract and the **captain-specific** implementation details;
the request lifecycle itself is identical to the user login flow and is
referenced here rather than repeated.

## API Specification — `POST /captains/login`

Authenticates an existing captain by their email and password. The endpoint
validates the payload, looks up the captain by email, compares the password
against the stored bcrypt hash, and returns a signed JWT alongside the
authenticated captain resource.

- **Method:** `POST`
- **Path:** `/captains/login`
- **Authentication:** Not required
- **Handler:** `loginCaptain` (`backend/controllers/captain.controller.js`)

### Request

**Content-Type:** `application/json`

#### Body Parameters

| Parameter  | Type   | Required | Constraints                                     |
| ---------- | ------ | -------- | ----------------------------------------------- |
| `email`    | string | Yes      | Must be a valid email                           |
| `password` | string | Yes      | Minimum length of 6 characters                  |

> Both login endpoints accept **either** `email` **or** `phone` + password — a
> field-specific `body(...).custom` requires one of them, and the controller
> looks the captain up by whichever field was supplied. The table above shows the
> email variant; for the phone variant use `{ "phone", "password" }`.

#### Example Request

```json
{
  "email": "captain.doe@example.com",
  "password": "secret123"
}
```

#### Validation

Route layer, `express-validator`:

- `email` must be valid and is lowercased before lookup.
- `password` must be at least 6 characters.

Failures return `400` enumerating the errors.

### Responses

#### `200 OK`

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
    }
  }
}
```

> `password` is excluded from the response (`select: false`).

#### `400 Bad Request`

Validation failure — `{ "errors": [ { "msg": "Invalid Email", "param": "email", "location": "body" } ] }`.

#### `401 Unauthorized`

`{ "message": "Invalid email or password" }` — generic for both "captain not
found" and "wrong password" (prevents user enumeration).

### Status codes

| Code  | Meaning         | Condition                                        |
| ----- | --------------- | ------------------------------------------------ |
| `200` | OK              | Authentication successful                        |
| `400` | Bad Request     | One or more validation rules were violated       |
| `401` | Unauthorized    | Email not found or password mismatch             |

### Example `curl`

```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "captain.doe@example.com", "password": "secret123" }'
```

## How it differs from the user login

| Aspect             | User                                   | Captain                                    |
| ------------------ | -------------------------------------- | ------------------------------------------ |
| Path               | `/users/login`                         | `/captains/login`                          |
| Handler            | `loginUser`                            | `loginCaptain`                             |
| Model              | `User`                                 | `Captain`                                  |
| Lookup             | `findOne({ email })` on users          | `findOne({ email })` on captains           |
| Password method    | `user.comparePassword(password)`       | `captain.comparePassword(password)`        |
| JWT payload        | `{ _id, role }`                        | `{ _id, role }` (same as user)             |
| Response           | `{ token, user }`                      | `{ token, captain }`                       |

## Shared lifecycle

The flow is the same as the user login: route validation → controller
(re-check `validationResult`, query by the supplied field with
`select("+password")`, compare bcrypt, `401` on mismatch, sign a JWT with
`JWT_SECRET`, set the `token` httpOnly cookie — `SameSite=Lax` in dev,
`Secure` + `SameSite=None` in production, 24h TTL) → respond `{ token, captain }`.

See [`../user/login.md`](../user/login.md) for the full lifecycle walkthrough,
flow diagram, and security considerations (password hashing, password exclusion,
generic error messages).

## Response contract (captain)

| Status | Condition                          | Body                              |
| ------ | ---------------------------------- | --------------------------------- |
| `200`  | Authentication successful          | `{ token, captain }`              |
| `400`  | Validation error                   | `{ errors: [ ... ] }`             |
| `401`  | Invalid credentials                | `{ message: "..." }`              |

## Source layout

```
backend/
  routes/captain.routes.js     # POST /login + validation
  controllers/captain.controller.js  # loginCaptain
  models/captain.model.js            # comparePassword, generateAuthToken
```