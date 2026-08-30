import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import AuthShell from "../../components/auth/AuthShell/AuthShell.jsx";
import Input from "../../components/ui/Input/Input.jsx";
import PhoneInput from "../../components/ui/PhoneInput/PhoneInput.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import { cn } from "../../lib/cn.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.7 0 3.1.58 4.27 1.53l3.16-3.16C17.3 1.67 14.88.7 12 .7 7.58.7 3.78 3.19 1.96 6.88l3.7 2.87C6.7 6.83 9.12 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.46c-.28 1.49-1.12 2.74-2.39 3.59l3.66 2.84c2.15-1.98 3.76-4.9 3.76-8.46z"
      />
      <path
        fill="#FBBC05"
        d="M5.66 14.86a6.9 6.9 0 0 1 0-4.11l-3.7-2.87a11.2 11.2 0 0 0 0 10.05l3.7-2.87z"
      />
      <path
        fill="#34A853"
        d="M12 23.3c3.24 0 5.96-1.07 7.95-2.9l-3.66-2.84c-1.01.69-2.31 1.09-4.29 1.09-2.88 0-5.3-1.79-6.34-4.29l-3.7 2.87C3.78 20.82 7.58 23.3 12 23.3z"
      />
    </svg>
  );
}

function AppleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

const socialButtonBase =
  "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const roleCardBase =
  "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const hasModeParam =
    searchParams.get("mode") === "user" || searchParams.get("mode") === "captain";

  const [mode, setMode] = useState(hasModeParam ? searchParams.get("mode") : "user");
  const [picked, setPicked] = useState(hasModeParam);
  const [method, setMethod] = useState("phone");
  const [code, setCode] = useState("+92");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated && role === mode) navigate(from, { replace: true });
  }, [isAuthenticated, role, mode, from, navigate]);

  const isCaptain = mode === "captain";
  const isPhone = method === "phone";

  const handlePick = (next) => {
    setMode(next);
    setPicked(true);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (isPhone) {
      if (!/^\d{7,15}$/.test(phone)) {
        setFormError("Enter a valid phone number.");
        return;
      }
    } else if (!EMAIL_RE.test(email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setFormError(isPhone ? "Please enter your password." : "Please enter your email and password.");
      return;
    }

    const payload = isPhone
      ? { phone: `${code}${phone}`, password }
      : { email: email.trim(), password };

    setSubmitting(true);
    try {
      const { account } = await login({ role: mode, payload });
      toast({
        variant: "success",
        title: `Welcome back${account?.fullname?.firstName ? `, ${account.fullname.firstName}` : ""}!`,
        description: isCaptain ? "You're signed in as a captain." : "You're signed in as a rider.",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err?.message || "Invalid credentials, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocial = (provider) => {
    toast({
      variant: "info",
      title: `${provider} login is almost here`,
      description: "We're still setting this up — use phone or email for now.",
    });
  };

  return (
    <AuthShell mode="login">
      {!picked ? (
        <div className="flex flex-col gap-3">
          <p className="mb-1 text-center text-body text-ink-secondary">
            Choose your account to continue.
          </p>

          <button
            type="button"
            onClick={() => handlePick("user")}
            className={cn(
              roleCardBase,
              "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-[17px] font-bold leading-tight">Log in as Rider</span>
              <span className="text-[13px] text-white/80">Book a ride</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handlePick("captain")}
            className={cn(
              roleCardBase,
              "bg-amber-700 text-white shadow-sm hover:bg-amber-800",
            )}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-[17px] font-bold leading-tight">Log in as Captain</span>
              <span className="text-[13px] text-white/80">Drive &amp; earn</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="mb-1 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
              {isCaptain ? (
                <ShieldCheck className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400" aria-hidden="true" />
              ) : (
                <UserRound className="h-[18px] w-[18px] text-primary-700 dark:text-primary-400" aria-hidden="true" />
              )}
              {isCaptain ? "Captain login" : "Rider login"}
            </p>
            <button
              type="button"
              onClick={() => {
                setPicked(false);
                setFormError("");
              }}
              className="inline-flex items-center gap-1 text-small font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Switch role
            </button>
          </div>

          {formError && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-[10px] bg-error-light px-3.5 py-2.5 text-small font-medium text-error-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleSocial("Google")}
              className={cn(
                socialButtonBase,
                "border border-line bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
              )}
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial("Apple")}
              className={cn(
                socialButtonBase,
                "bg-gray-900 text-white shadow-sm hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
              )}
            >
              <AppleIcon className="h-5 w-5" />
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="text-caption font-medium uppercase tracking-wide text-ink-muted">
              or log in with
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {isPhone ? (
            <PhoneInput
              label="Phone number"
              hint="We'll match this to your account."
              placeholder="300 1234567"
              value={phone}
              onChange={setPhone}
              code={code}
              onCodeChange={setCode}
            />
          ) : (
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder={isCaptain ? "captain@example.com" : "you@example.com"}
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="At least 6 characters"
            leftIcon={isCaptain ? ShieldCheck : LogIn}
            interactiveRight
            rightIcon={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  setShowPassword((v) => !v);
                }}
                className="tap-target inline-flex items-center justify-center rounded-[10px] px-2 text-ink-muted hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => {
              setMethod((m) => (m === "phone" ? "email" : "phone"));
              setFormError("");
            }}
            className="self-start text-small font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {isPhone ? "Use email instead" : "Use phone number instead"}
          </button>

          <Button
            type="submit"
            size="lg"
            variant={isCaptain ? "amber" : "primary"}
            className="mt-1 w-full"
            loading={submitting}
          >
            {submitting ? "Logging in…" : isCaptain ? "Log in as captain" : "Log in"}
          </Button>

          {formError && (
            <p className="-mt-2 text-center text-caption text-ink-muted">
              {isCaptain
                ? "Not registered yet? Create a captain account instead."
                : "New to rawan? Create your rider account."}
            </p>
          )}
        </form>
      )}
    </AuthShell>
  );
}