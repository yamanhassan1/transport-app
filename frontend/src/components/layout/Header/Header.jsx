import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { LogoMark } from "../../ui/Logo/Logo.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { firstName, initials } from "../../../lib/format.js";

export default function Header({ title, subtitle }) {
  const navigate = useNavigate();
  const { account, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ variant: "info", title: "Signed out", description: "See you soon." });
    navigate("/");
  };

  return (
    <header className="border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-2.5 px-3.5 md:gap-3 md:px-6">
        <Link to="/" className="flex items-center" aria-label="rawan home">
          <LogoMark />
        </Link>

        <div className="min-w-0 flex-1 md:ml-0">
          {title && <h1 className="h3 truncate">{title}</h1>}
          {subtitle && <p className="hidden truncate text-small text-ink-muted sm:block">{subtitle}</p>}
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2.5 rounded-[10px] p-1.5 pr-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
              aria-label="View profile"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-white">
                {initials(account)}
              </span>
              <span className="hidden max-w-28 truncate text-[15px] font-semibold text-ink lg:block">
                {firstName(account) || ""}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              className="tap-target inline-flex h-11 w-11 items-center justify-center rounded-[10px] text-ink-muted transition-colors hover:bg-error-light hover:text-error-800"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-2">
            <Link
              to="/login"
              className="inline-flex h-11 items-center rounded-full px-3.5 text-[15px] font-semibold text-ink-secondary transition-all hover:bg-gray-100 hover:text-ink sm:px-5 dark:hover:bg-gray-700/40"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex h-11 items-center rounded-full bg-gradient-to-b from-primary-500 to-primary-700 px-4 text-[15px] font-semibold text-white shadow-md shadow-primary/25 transition-all hover:from-primary-400 hover:to-primary-700 hover:shadow-lg sm:px-6"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}