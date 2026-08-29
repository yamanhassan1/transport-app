import { NavLink, useNavigate } from "react-router-dom";
import { X, Moon, Sun, LogOut, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../lib/cn.js";
import { dashboardNav } from "../../../lib/nav.js";
import { Logo } from "../../ui/Logo/Logo.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { fullName, initials } from "../../../lib/format.js";

function Brand() {
  return (
    <Logo
      className="px-2"
      markClassName="h-12 w-12 rounded-2xl"
      textClassName="text-[26px]"
      subtitleClassName="text-[11px] tracking-[0.3em]"
    />
  );
}

function SidebarLinks({ onNavigate }) {
  return (
    <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-3">
      {dashboardNav.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2 text-[15px] font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  : "text-ink-secondary hover:bg-gray-100 hover:text-ink dark:hover:bg-gray-700/40",
              )
            }
            aria-label={item.label}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function AccountSection() {
  const navigate = useNavigate();
  const { account, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ variant: "info", title: "Signed out", description: "See you soon." });
    navigate("/");
  };

  return (
    <div className="space-y-1 border-t border-line p-3">
      {isAuthenticated && account && (
        <NavLink
          to="/profile"
          className="flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-sm font-bold text-white">
            {initials(account)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold text-ink">
              {fullName(account) || "My account"}
            </span>
            <span className="block truncate text-small text-ink-muted">
              {account.role === "captain" ? "Captain" : "Rider"}
            </span>
          </span>
        </NavLink>
      )}

      <button
        type="button"
        onClick={toggleTheme}
        className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-[15px] font-medium text-ink-secondary transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>

      {isAuthenticated ? (
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-[15px] font-medium text-ink-secondary transition-colors hover:bg-error-light hover:text-error-800 dark:hover:bg-error/10"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      ) : (
        <NavLink
          to="/login"
          className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-3 text-[15px] font-medium text-ink-secondary transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
        >
          <LogIn className="h-5 w-5" aria-hidden="true" />
          <span>Log in</span>
        </NavLink>
      )}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r border-line bg-surface md:flex">
        <div className="flex h-16 items-center px-3">
          <Brand />
        </div>
        <SidebarLinks />
        <AccountSection />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[300] md:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-gray-900/45"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[280px] flex-col gap-6 border-r border-line bg-surface p-4 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between pt-[env(safe-area-inset-top)]">
                <Brand />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={onClose}
                  className="tap-target flex h-10 w-10 items-center justify-center rounded-[10px] text-ink-muted hover:bg-gray-100 dark:hover:bg-gray-700/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarLinks onNavigate={onClose} />
              <AccountSection />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}