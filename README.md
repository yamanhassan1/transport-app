# rawan — Transport App

A ride-hailing platform (MERN stack) with two account types — **riders** and
**captains** — each with its own registration, login, and profile experience.

## What is built so far

- Full **auth** on the backend (Express): register, login (email **or** phone),
  profile, logout for both `/users` and `/captains`, with JWT, bcrypt, token
  blacklist, validation, rate limiting, CORS allow-list, security headers, and
  Swagger docs.
- A **React frontend** (Vite + Tailwind) that matches: role-aware Home, login,
  a multi-step registration wizard, profile, settings, dark mode, and a
  mobile-first design system.
- Rides/payments/maps are **not implemented yet** (a `ride` model exists but has
  no routes).

> Feature documentation is split per account type just like the backend docs —
> see [`docs/frontend/`](docs/frontend) (per-flow pages) and
> [`docs/backend/`](docs/backend) (per-endpoint APIs).

## Quick start

```bash
# Backend  → http://localhost:3000  (MongoDB required)
cd backend
npm install
npm start

# Frontend → http://localhost:5173
cd frontend
npm install
npm run dev
```

Environment lives in `backend/.env` — see `backend/.env` for `MONGO_URI`,
`JWT_SECRET`, `CORS_ORIGINS`, `PORT`.

## Repo layout

```
├── backend/            Express API (users + captains auth, models, swagger)
├── frontend/           React + Vite + Tailwind client
└── docs/
    ├── frontend/       Per-flow docs for each page (user/ & captain/)
    └── backend/        Per-endpoint API documentation (user/ & captain/)
```

## Documentation

| Topic                            | Location                                       |
| -------------------------------- | ---------------------------------------------- |
| Frontend docs (index)            | [`docs/frontend/README.md`](docs/frontend/README.md) |
| Frontend — user flows            | [`docs/frontend/user/`](docs/frontend/user)    |
| Frontend — captain flows         | [`docs/frontend/captain/`](docs/frontend/captain) |
| Frontend design system (shared)  | [`docs/frontend/design-system.md`](docs/frontend/design-system.md) |
| Backend API — users              | [`docs/backend/user/`](docs/backend/user)      |
| Backend API — captains           | [`docs/backend/captain/`](docs/backend/captain) |
| Backend API docs (Swagger setup) | [`docs/backend/api-docs.md`](docs/backend/api-docs.md) |
| Frontend design specification    | [`frontend/UI-UX-DESIGN-SYSTEM.md`](frontend/UI-UX-DESIGN-SYSTEM.md) |
| Interactive API docs (Swagger)   | `http://localhost:3000/api-docs`               |