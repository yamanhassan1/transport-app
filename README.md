# transport-app

A MERN-stack ride/transport application. This repository currently contains the
**backend** built with Express, MongoDB (Mongoose), JWT-based authentication,
and bcrypt password hashing.

## Tech Stack

- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — data models (User, Captain, Ride, BlacklistToken)
- **JWT + bcrypt** — authentication and password hashing
- **express-validator** — request validation
- **helmet + express-rate-limit** — security headers and rate limiting
- **swagger-jsdoc + swagger-ui-express** — interactive API docs

## Authentication

Two types of accounts are supported, each with a full register / login /
profile / logout flow:

| Account  | Base path      | Features                                                                 |
| -------- | -------------- | ------------------------------------------------------------------------ |
| User     | `/users`       | `register`, `login`, `profile`, `logout`                                 |
| Captain  | `/captains`    | `register`, `login`, `profile`, `logout` (adds license + vehicle details) |

- Progressive flow: `/users/register` → `/users/login` → `/users/profile` → `/users/logout`
  and the same for `/captains/*`.
- Registration validates input against the schemas and rejects duplicate
  emails / phone numbers (and license / plate numbers for captains) with `409`.
- Passwords are hashed with bcrypt and excluded from responses (`select: false`).
- Logout blacklists the JWT so it can no longer be used.

## API Endpoints

### Users

| Method | Path                | Auth     | Description                      |
| ------ | ------------------- | -------- | -------------------------------- |
| POST   | `/users/register`   | No       | Create a user account            |
| POST   | `/users/login`      | No       | Authenticate and get a JWT       |
| GET    | `/users/profile`    | Yes      | Get the authenticated user       |
| GET    | `/users/logout`     | Yes      | Log out and blacklist the token  |

### Captains

| Method | Path                | Auth     | Description                      |
| ------ | ------------------- | -------- | -------------------------------- |
| POST   | `/captains/register`| No       | Create a captain account         |
| POST   | `/captains/login`   | No       | Authenticate and get a JWT       |
| GET    | `/captains/profile` | Yes      | Get the authenticated captain    |
| GET    | `/captains/logout`  | Yes      | Log out and blacklist the token  |

## Getting Started

```bash
cd backend
npm install
npm start        # runs nodemon server.js
```

Set up the environment in `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/transport-app
JWT_SECRET=a_long_random_secret
CORS_ORIGINS=http://localhost:5173,http://localhost:3001
```

- `MONGO_URI` — MongoDB connection string.
- `JWT_SECRET` — secret used to sign/verify JWTs.
- `CORS_ORIGINS` — comma-separated allow-listed origins. If unset, CORS
  reflects any origin (dev only; set this in production).

Then the server runs on `http://localhost:3000`. Safe production deployment
should also set `NODE_ENV=production` (enables secure cookies) and place the
app behind HTTPS.

## Documentation

Detailed endpoint documentation (API contract, request/response, lifecycle,
flow diagrams) lives in [`docs/backend`](docs/backend):

- [`docs/backend/user`](docs/backend/user) — user register / login / profile / logout
- [`docs/backend/captain`](docs/backend/captain) — captain register / login / profile / logout

## API Documentation (Swagger UI)

An interactive OpenAPI 3.0 spec is served by the backend at
`http://localhost:3000/api-docs`. It covers every endpoint (Users and Captains),
the request/response schemas, and the two supported auth methods (Bearer token
and the `token` httpOnly cookie), and lets you try requests directly in the
browser.

## Project Status

Backend user and captain registration, login, profile, and logout are
implemented with schema-aligned validation and error handling. Auth is
stateless (JWT verified without a per-request DB lookup), tokens are revoked
via a self-expiring blacklist, all routes are rate-limited, security headers
and a CORS allow-list are applied, and shared config is centralized in
`backend/config/constants.js`. Ride functionality (model only,
[`backend/models/ride.model.js`](backend/models/ride.model.js)) is stubbed and
not yet exposed via routes.
