import { useNavigate } from "react-router-dom";
import { LogOut, Moon } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Card, { CardHeader } from "../../components/ui/Card/Card.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await logout();
    toast({ variant: "info", title: "Signed out", description: "See you soon." });
    navigate("/");
  };

  return (
    <PageContainer className="max-w-2xl">
      <header className="mb-5">
        <h1 className="h1">Settings</h1>
        <p className="text-body text-ink-secondary">Manage your preferences.</p>
      </header>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader title="Appearance" />
          <ul className="divide-y divide-line px-4 pb-2">
            <li className="flex items-center gap-3 py-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <Moon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">Dark mode</span>
                <span className="block text-small text-ink-muted">{theme === "dark" ? "On" : "Off"}</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={theme === "dark"}
                aria-label="Dark mode"
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  theme === "dark" ? "bg-primary" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </li>
          </ul>
        </Card>

        <Card>
          <CardHeader title="Account" />
          <ul className="divide-y divide-line px-4 pb-2">
            <li className="flex items-center gap-3 py-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">Sign out</span>
                <span className="block text-small text-ink-muted">End your session</span>
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="tap-target inline-flex h-10 items-center rounded-[10px] px-3 text-small font-semibold text-error-700 hover:bg-error-light"
              >
                Sign out
              </button>
            </li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}