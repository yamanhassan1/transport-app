# Backend Reference: Captain Profile

## Summary

Captains fetch their own profile through `GET /captains/profile`. The mechanism
is **identical** to the user profile endpoint (JWT auth middleware + controller
lookup), so this doc covers the API contract and the captain-specific wiring and
references the shared lifecycle instead of repeating it.

## API Specification — `GET /captains/profile`

Returns the profile (resource) of the currently authenticated captain,
protected by the `authCaptain` middleware.

- **Method:** `GET`
- **Path:** `/captains/profile`
- **Authentication:** Required (Bearer token or `token` cookie)
- **Handler:** `getCaptainProfile` (`backend/controllers/captain.controller.js`)

### Request

No body or query parameters. Auth via **`Authorization` header**
(`Bearer <token>`) **or** the **`token`** httpOnly cookie.

#### Example Request

```bash
curl http://localhost:3000/captains/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Responses

#### `200 OK`

The authenticated captain document (full shape — incl. `vehicle`, `license`,
`rating`, trip counters; `password` excluded via `select: false`):

```json
{
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
  "isOnline": false,
  "isAvailable": false,
  "totalTrips": 0,
  "createdAt": "2026-08-29T00:00:00.000Z",
  "updatedAt": "2026-08-29T00:00:00.000Z"
}
```

#### `401 Unauthorized`

`{ "message": "Unauthorized." }` — missing/invalid/expired/blacklisted token or
captain not found.

### Status codes

| Code  | Meaning         | Condition                                          |
| ----- | --------------- | -------------------------------------------------- |
| `200` | OK              | Token valid and captain found                      |
| `401` | Unauthorized    | Missing/invalid/expired/blacklisted token or captain not found |

## How it differs from the user profile

| Aspect          | User                            | Captain                                |
| --------------- | ------------------------------- | -------------------------------------- |
| Path            | `/users/profile`                | `/captains/profile`                    |
| Handler         | `getUserProfile`                | `getCaptainProfile`                    |
| Middleware      | `authUser`                      | `authCaptain`                          |
| Route wiring    | `router.get("/profile", authUser, userController.getUserProfile)` | `router.get("/profile", authCaptain, captainController.getCaptainProfile)` |
| Attached id     | `req.userId = decoded._id`      | `req.captainId = decoded._id`          |
| Lookup          | `userModel.findById(req.userId)` | `CaptainModel.findById(req.captainId)` |
| 404 message     | `"User not found"`              | `"Captain not found"`                  |
| JWT role check  | rejects non-`"user"`            | rejects non-`"captain"`                |

## Shared lifecycle

The flow is the same as the user profile: `authCaptain` middleware extracts the
token, rejects missing/blacklisted tokens with `401`, verifies with
`jwt.verify(token, JWT_SECRET)` and rejects a wrong role, attaches
`req.captainId = decoded._id` (no DB lookup in middleware); then
`getCaptainProfile` fetches the fresh record with `CaptainModel.findById` and
returns `200 { ...captain }` or `404 { message }`.

See [`../user/profile.md`](../user/profile.md) for the full lifecycle
walkthrough, flow diagram, and security notes (JWT verification, blacklist
enforcement, password exclusion).

## Response contract (captain)

| Status | Condition                                    | Body                                |
| ------ | -------------------------------------------- | ----------------------------------- |
| `200`  | Authenticated successfully                   | `{ ...captain }`                    |
| `401`  | Missing/invalid/blacklisted token or no captain | `{ message: "Unauthorized." }`    |

## Source layout

```
backend/
  routes/captain.routes.js          # GET /profile + authCaptain
  controllers/captain.controller.js # getCaptainProfile
  middlewares/auth.middleware.js    # authCaptain (JWT verification)
  models/captain.model.js           # Captain schema (select:false password)
```