import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { getErrorMessage } from "../lib/api.js";

const ROLE_KEY = "transport.role";
const ACCOUNT_KEY = "transport.account";

const AuthContext = createContext(null);

function rolePath(role) {
  return role === "captain" ? "/captains" : "/users";
}

function readStoredSession() {
  try {
    const role = localStorage.getItem(ROLE_KEY);
    if (role !== "user" && role !== "captain") return null;
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return { role, account: raw ? JSON.parse(raw) : null };
  } catch {
    return null;
  }
}

function persist(role, account) {
  localStorage.setItem(ROLE_KEY, role);
  if (account) localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  else localStorage.removeItem(ACCOUNT_KEY);
}

function clearStored() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(ACCOUNT_KEY);
}

export function AuthProvider({ children }) {
  const initialSession = useMemo(() => readStoredSession(), []);

  const [account, setAccount] = useState(initialSession?.account ?? null);
  const [role, setRole] = useState(initialSession?.role ?? null);
  const [status, setStatus] = useState(initialSession ? "authenticated" : "guest");
  const [error, setError] = useState(null);

  const applySession = useCallback((nextRole, nextAccount) => {
    setRole(nextRole);
    setAccount(nextAccount);
    setStatus(nextAccount ? "authenticated" : "guest");
    setError(null);
    persist(nextRole, nextAccount);
  }, []);

  const clearSession = useCallback(() => {
    setRole(null);
    setAccount(null);
    setStatus("guest");
    setError(null);
    clearStored();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!role) return;
    const path = `${rolePath(role)}/profile`;
    try {
      const data = await api.get(path);
      const fresh = role === "captain" ? data?.captain ?? data : data?.user ?? data;
      setAccount(fresh);
      persist(role, fresh);
      setStatus("authenticated");
      return fresh;
    } catch (err) {
      if (err?.status === 401) {
        clearSession();
      }
      throw err;
    }
  }, [role, clearSession]);

  // Bootstrap: restore a cached session, then revalidate against the backend.
  useEffect(() => {
    if (!initialSession) return undefined;
    let active = true;

    (async () => {
      try {
        const data = await api.get(`${rolePath(initialSession.role)}/profile`);
        const fresh =
          initialSession.role === "captain" ? data?.captain ?? data : data?.user ?? data;
        if (!active) return;
        setAccount(fresh);
        setRole(initialSession.role);
        setStatus("authenticated");
        persist(initialSession.role, fresh);
      } catch (err) {
        if (!active) return;
        if (err?.status === 401) {
          clearStored();
          setAccount(null);
          setRole(null);
          setStatus("guest");
        }
        // Network/other errors: keep the cached session so the app stays usable.
      }
    })();

    return () => {
      active = false;
    };
  }, [initialSession]);

  const login = useCallback(
    async ({ role: nextRole, payload }) => {
      setError(null);
      try {
        const path = `${rolePath(nextRole)}/login`;
        const data = await api.post(path, payload);
        const accountData = nextRole === "captain" ? data.captain : data.user;
        applySession(nextRole, accountData);
        return { token: data.token, account: accountData };
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [applySession],
  );

  const register = useCallback(
    async ({ role: nextRole, payload }) => {
      setError(null);
      try {
        const path = `${rolePath(nextRole)}/register`;
        const data = await api.post(path, payload);
        const accountData = nextRole === "captain" ? data.captain : data.user;
        applySession(nextRole, accountData);
        return { token: data.token, account: accountData };
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    if (!role) {
      clearSession();
      return;
    }
    setError(null);
    try {
      await api.get(`${rolePath(role)}/logout`);
    } catch {
      // Log out locally even if the server request fails.
    } finally {
      clearSession();
    }
  }, [role, clearSession]);

  const value = useMemo(
    () => ({
      account,
      role,
      status,
      error,
      isAuthenticated: status === "authenticated",
      isGuest: status === "guest",
      isLoading: status === "loading",
      login,
      register,
      logout,
      refreshProfile,
    }),
    [account, role, status, error, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}