# Backend Reference: Interactive API Docs (Swagger UI)

## Summary

The backend ships an interactive OpenAPI 3.0 documentation UI at
**`http://localhost:3000/api-docs`**. It is generated from a hand-written
spec `backend/swagger.js` and served with `swagger-ui-express`. It mirrors the
per-endpoint markdown docs under `docs/backend/user/` and
`docs/backend/captain/` — but is live, self-describing, and try-able.

## Access

| Entry point          | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `http://localhost:3000/api-docs` | Swagger UI (page title "transport-app API Docs") |
| `http://localhost:3000/api-docs/` | (same; trailing slash equivalent)              |
| `http://localhost:5173/api-docs`  | Through the Vite dev proxy → backend:3000     |

The Vite dev proxy routes `/api-docs` to the backend
(same block as `/users` and `/captains` in `frontend/vite.config.js`), so the UI
also works while running `npm run dev` in the frontend.

## How it is wired up

### 1. Spec — `backend/swagger.js`

A plain object exported as `swaggerSpec`:

- `openapi: "3.0.0"` (OpenAPI 3 — supports `securitySchemes` and `$ref`s).
- `info` — title **transport-app API**, version `1.0.0`, description explaining
  that protected endpoints accept a JWT either as a Bearer header **or** in the
  `token` httpOnly cookie.
- `servers` — `[{ url: "http://localhost:3000", description: "Local server" }]`.
- `apis: []` — JSDoc route annotations are **not** used; everything lives in this
  file (the `swaggerJsdoc(options)` call just validates/builds the object).

### 2. Mount — `backend/app.js`

```js
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: "transport-app API Docs" }),
);
```

Mounted **before** the API routers and is not rate-limited. Dependencies:
`swagger-jsdoc` (^6.3.0) and `swagger-ui-express` (^5.0.1) in
`backend/package.json`.

## What the spec covers

### Tags

| Tag      | Description                                          |
| -------- | ---------------------------------------------------- |
| `Health` | Server health check (`GET /`)                        |
| `Users`  | User registration and authentication                 |
| `Captains` | Captain registration and authentication           |

### Endpoints

| Method | Path                | Tag      | Auth            |
| ------ | ------------------- | -------- | --------------- |
| GET    | `/`                 | Health   | —               |
| POST   | `/users/register`   | Users    | —               |
| POST   | `/users/login`      | Users    | —               |
| GET    | `/users/profile`    | Users    | bearerAuth / cookieAuth |
| GET    | `/users/logout`     | Users    | bearerAuth / cookieAuth |
| POST   | `/captains/register`| Captains | —               |
| POST   | `/captains/login`   | Captains | —               |
| GET    | `/captains/profile` | Captains | bearerAuth / cookieAuth |
| GET    | `/captains/logout`  | Captains | bearerAuth / cookieAuth |

Each path documents `requestBody` schemas (for register/login) and the relevant
responses (`201/200`, `400`, `401`, `404`, `409`, `429`).

### Security schemes (`components.securitySchemes`)

- **`bearerAuth`** — HTTP Bearer, format `JWT`:
  `Authorization: Bearer <token>`.
- **`cookieAuth`** — API-key in cookie, name `token`:
  the httpOnly cookie set by register/login.

Protected paths declare `security: [{ bearerAuth: [] }, { cookieAuth: [] }]` —
either one works.

### Reusable schemas (`components.schemas`)

| Schema              | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `FullName`          | `{ firstName, lastName? }` (3–50 chars)              |
| `User` / `Captain`  | Response models (full documents, no password)        |
| `UserRegister`      | POST body for `/users/register`                      |
| `CaptainRegister`   | POST body for `/captains/register` (vehicle + license) |
| `Login`             | POST body for both `/login` paths — **email **or** phone** (at least one required) + password |
| `TokenResponse`     | `{ token }`                                          |
| `UserTokenResponse` / `CaptainTokenResponse` | `{ token, user/captain }`    |
| `Message`           | e.g. "Logged out successfully"                       |
| `ValidationError`   | `{ errors: [...] }` (express-validator shape)        |
| `Error401` / `Error404` / `Error409` | error bodies for common status codes  |

The spec mirrors current controller behavior — e.g. register duplicates → `409`,
login failures → generic `401`, protected routes → `401` on missing/blacklisted
token, missing document → `404`.

## Trying endpoints in the UI

1. Open `http://localhost:3000/api-docs`.
2. Register or log in (`/users/register` / `/users/login`) — copy the returned
   `token`.
3. Click **Authorize**, choose **bearerAuth**, paste the JWT (or log in from a
   browser so the `token` cookie is set and use **cookieAuth**).
4. Call `/users/profile` or `/users/logout` with the authorization applied.

## Keeping it in sync

The spec is hand-maintained — after changing a route/controller, update the
matching `paths`/`schemas` in `backend/swagger.js` **and** the per-endpoint docs:

- User flows → `docs/backend/user/register|login|profile|logout.md`
- Captain flows → `docs/backend/captain/register|login|profile|logout.md`

## Source layout

```
backend/
  swagger.js                # OpenAPI 3 spec (paths, schemas, security)
  app.js                    # mounts swagger-ui-express at /api-docs
  package.json              # swagger-jsdoc, swagger-ui-express deps
frontend/
  vite.config.js            # proxy: /api-docs → http://localhost:3000
```