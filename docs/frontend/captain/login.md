# Frontend Reference: Captain Login

## Summary

The captain login flow at `/login` (either `?mode=captain` or by tapping
**Captain** on the `ModeToggle`). **UI is intentionally identical** to the rider
login (Google/Apple buttons, `or log in with` divider, phone-or-email toggle);
only the submit target, placeholder text, icon, and toast text differ.

## Page

- **Route:** `/login?mode=captain`
- **Component:** `Login.jsx` (`frontend/src/pages/Login/Login.jsx`),
  `isCaptain = mode === "captain"`
- **Wrapper:** `AuthShell`

## Differences from rider login

| Aspect             | Rider                     | Captain                                   |
| ------------------ | ------------------------- | ----------------------------------------- |
| Email placeholder  | `you@example.com`         | `captain@example.com`                     |
| Password icon      | LogIn                     | ShieldCheck                               |
| Submit label       | Log in                    | **Log in as captain**                     |
| Endpoint           | `POST /users/login`       | `POST /captains/login`                    |
| Session field      | `data.user`               | `data.captain`                            |
| Success toast desc | "You're signed in as a rider." | "You're signed in as a captain."      |

Everything else — social placeholders, divider "or log in with", phone first
(`PhoneInput`, country-code selector, digits 7–15) vs `Use email instead`,
single password with eye toggle, validation, `formError` banner, success toast
`Welcome back, {firstName}!`, `navigate(from)` — is the **same code path**.
See `docs/frontend/user/login.md` for the shared details.

## Redirect rule

`isAuthenticated && role === mode` → redirect to `from`. A rider can still open
`/login?mode=captain` to log into a separate captain account.

## Source layout

- `frontend/src/pages/Login/Login.jsx`
- `frontend/src/context/AuthContext.jsx` — `login({ role: "captain", payload })`
  → `POST /captains/login`