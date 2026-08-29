# Frontend Reference: Captain Registration

## Summary

Describes the captain sign-up flow at `/register` with `?mode=captain` — a
4-step Careem-style wizard identical in UX to the rider flow but adding
**vehicle** and **driving licence** steps before contact info. On success the
captain is signed in automatically and redirected.

## Page

- **Route:** `/register?mode=captain` (the `ModeToggle` also switches to captain)
- **Component:** `Register.jsx` (`frontend/src/pages/Register/Register.jsx`),
  `isCaptain = mode === "captain"`
- **Wrapper:** `AuthShell`; same progress bar, circular Back + full-width pill
  Continue (labels **Register as captain** on the last step).

### Steps

| Step | Title                 | Fields                                                              |
| ---- | --------------------- | ------------------------------------------------------------------- |
| 1    | What's your name?     | First name, last name (both **required** for captains)              |
| 2    | Your vehicle          | Vehicle type, make, model, year, color, plate number                |
| 3    | Driving licence       | License number, license expiry (date input)                         |
| 4    | Contact & password    | Email, phone (country-code), password, confirm password             |

Step 3 also shows a small heading — shield icon + **"Drive with rawan"** — as a
validation cue.

The wizard then mirrors the rider flow in
`docs/frontend/user/register.md` (progress bar, per-step validation, Back /
Continue, `scrollTo` behavior, loading state).

## Field validation (client-side)

| Field              | Rules                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| `firstName`        | required; ≥ 2 characters                                              |
| `lastName`         | required; ≥ 2 characters                                              |
| `vehicleType`      | required; one of the enum below                                      |
| `make`             | required (non-empty)                                                 |
| `model`            | required (non-empty)                                                 |
| `year`             | required; integer 1886 … `current year + 1`                          |
| `color`            | required (non-empty)                                                 |
| `plateNumber`      | required; 3–15 characters (uppercased on submit)                     |
| `licenseNumber`    | required; 5–30 characters (uppercased on submit)                     |
| `licenseExpiry`    | required; valid date (submitted as ISO string)                       |
| `email`            | matches `EMAIL_RE`                                                   |
| `phone`            | digits-only, `PHONE_DIGITS_RE = /^\d{7,15}$/` (country code separate)|
| `password`         | ≥ 6 characters                                                       |
| `confirmPassword`  | must equal `password`                                                 |

### Vehicle type select

```js
const vehicleTypes = [
  { value: "go", label: "Go" },
  { value: "go_mini", label: "Go Mini" },
  { value: "go_sedan", label: "Go Sedan" },
  { value: "premium", label: "Premier" },
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "rickshaw", label: "Rickshaw" },
];
```

## Submission

Final step collects this payload and calls `registerAccount({ role: "captain",
payload })` (from `AuthContext`), which POSTs to `/captains/register`:

```json
{
  "fullname": { "firstName": "Hassan", "lastName": "Khan" },
  "email": "hassan@example.com",
  "phone": "+923001234567",
  "password": "secret1",
  "vehicle": {
    "vehicleType": "go",
    "make": "Suzuki",
    "model": "Wagon R",
    "year": 2023,
    "color": "White",
    "plateNumber": "LEB-8341"
  },
  "license": {
    "number": "DL-12345678",
    "expiryDate": "2028-05-30T00:00:00.000Z"
  }
}
```

Notes: `year` is sent as a number, `plateNumber` and `license.number` are
uppercased, `license.expiryDate` is sent as an ISO string from the `date` input.

### Success

- `data.captain` becomes the session (`transport.role` / `transport.account`).
- Success toast: **"Welcome, {firstName}!"** /
  *"Your captain account is ready."*
- `navigate(from, { replace: true })` (`from = location.state?.from?.pathname || "/"`).

### Failure

- Alert banner with `err?.message` (e.g. `409` for a duplicate email, phone,
  licence number, or plate number) and scroll to top.

## Redirect rule

Same as riders: `isAuthenticated && role === mode` → redirect to `from`. A rider
may open this page (different role) to register a captain account.

## Source layout

- `frontend/src/pages/Register/Register.jsx` — `CAPTAIN_STEPS`, captain
  validation and payload
- `frontend/src/components/ui/Select|PhoneInput|Input/*.jsx` — form primitives
- `frontend/src/context/AuthContext.jsx` — `register({ role: "captain", payload })`
  → `POST /captains/register`