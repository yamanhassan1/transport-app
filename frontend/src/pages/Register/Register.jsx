import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  Trash2,
  User,
  UserRound,
} from "lucide-react";
import AuthShell from "../../components/auth/AuthShell/AuthShell.jsx";
import Input from "../../components/ui/Input/Input.jsx";
import PhoneInput from "../../components/ui/PhoneInput/PhoneInput.jsx";
import Select from "../../components/ui/Select/Select.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { cn } from "../../lib/cn.js";
import {
  imageFileToSvg,
  isImageTooLarge,
  isSupportedImage,
} from "../../lib/imageToSvg.js";

const vehicleTypes = [
  { value: "go", label: "Go" },
  { value: "go_mini", label: "Go Mini" },
  { value: "go_sedan", label: "Go Sedan" },
  { value: "premium", label: "Premier" },
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "rickshaw", label: "Rickshaw" },
];

const USER_STEPS = [
  {
    title: "What's your name?",
    hint: "We'll use this to personalise your rides.",
    fields: ["firstName", "lastName"],
  },
  {
    title: "Profile photo",
    hint: "Optional — we'll trace it into a lightweight vector avatar.",
    fields: ["photo"],
  },
  {
    title: "Contact details",
    hint: "A verified email and phone keep your account safe.",
    fields: ["email", "phone"],
  },
  {
    title: "Choose a password",
    hint: "At least 6 characters. You'll use it to log in.",
    fields: ["password", "confirmPassword"],
  },
];

const CAPTAIN_STEPS = [
  {
    title: "What's your name?",
    hint: "Your passengers will see this name.",
    fields: ["firstName", "lastName"],
  },
  {
    title: "Profile photo",
    hint: "Optional — your passengers will see this vector avatar.",
    fields: ["photo"],
  },
  {
    title: "Your vehicle",
    hint: "Tell us about the vehicle you'll drive.",
    fields: ["vehicleType", "make", "model", "year", "color", "plateNumber"],
  },
  {
    title: "Driving licence",
    hint: "We verify every captain before they start earning.",
    fields: ["licenseNumber", "licenseExpiry"],
  },
  {
    title: "Contact & password",
    hint: "One last step to create your captain account.",
    fields: ["email", "phone", "password", "confirmPassword"],
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /^\d{7,15}$/;

const roleCardBase =
  "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  vehicleType: "",
  make: "",
  model: "",
  year: "",
  color: "",
  plateNumber: "",
  licenseNumber: "",
  licenseExpiry: "",
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { register: registerAccount, isAuthenticated, role } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState(searchParams.get("mode") === "captain" ? "captain" : "user");
  const hasModeParam =
    searchParams.get("mode") === "user" || searchParams.get("mode") === "captain";
  const [picked, setPicked] = useState(hasModeParam);
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState("+92");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [avatarSvg, setAvatarSvg] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [converting, setConverting] = useState(false);
  const photoInputRef = useRef(null);

  const from = location.state?.from?.pathname || "/";
  const isCaptain = mode === "captain";
  const steps = isCaptain ? CAPTAIN_STEPS : USER_STEPS;
  const current = steps[step];

  useEffect(() => {
    if (isAuthenticated && role === mode) navigate(from, { replace: true });
  }, [isAuthenticated, role, mode, from, navigate]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStep(0);
    setErrors({});
    setFormError("");
    setAvatarSvg("");
    setPhotoPreview("");
    setPhotoError("");
    setConverting(false);
  };

  const handlePick = (nextMode) => {
    switchMode(nextMode);
    setPicked(true);
  };

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onPhoneChange = (digits) => {
    setForm((prev) => ({ ...prev, phone: digits }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const clearPhoto = () => {
    setAvatarSvg("");
    setPhotoPreview("");
    setPhotoError("");
  };

  const applyPhoto = async (file) => {
    setPhotoError("");
    if (!file) {
      clearPhoto();
      return;
    }
    if (!isSupportedImage(file)) {
      setPhotoError("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (isImageTooLarge(file)) {
      setPhotoError("The image must be 5 MB or smaller.");
      return;
    }
    setConverting(true);
    try {
      const svg = await imageFileToSvg(file);
      setAvatarSvg(svg);
      setPhotoPreview(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    } catch {
      setPhotoError("Couldn't read that image. Try a different one.");
    } finally {
      setConverting(false);
    }
  };

  const handlePhotoInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    void applyPhoto(file);
  };

  const validateField = (key) => {
    const minName = isCaptain ? 2 : 3;
    let message = "";

    if (key === "firstName") {
      if (!form.firstName.trim()) message = "First name is required";
      else if (form.firstName.trim().length < minName)
        message = `First name must be at least ${minName} characters`;
    } else if (key === "lastName") {
      if (isCaptain && !form.lastName.trim()) message = "Last name is required";
      else if (isCaptain && form.lastName.trim().length < 2)
        message = "Last name must be at least 2 characters";
      else if (form.lastName.trim() && form.lastName.trim().length < 3)
        message = "Last name must be at least 3 characters";
    } else if (key === "email") {
      if (!EMAIL_RE.test(form.email.trim())) message = "Enter a valid email address";
    } else if (key === "phone") {
      if (!PHONE_DIGITS_RE.test(form.phone)) message = "Enter a valid phone number";
    } else if (key === "password") {
      if (form.password.length < 6) message = "Password must be at least 6 characters";
    } else if (key === "confirmPassword") {
      if (form.confirmPassword !== form.password) message = "Passwords do not match";
    } else if (key === "vehicleType") {
      if (!form.vehicleType) message = "Choose a vehicle type";
    } else if (key === "make") {
      if (!form.make.trim()) message = "Vehicle make is required";
    } else if (key === "model") {
      if (!form.model.trim()) message = "Vehicle model is required";
    } else if (key === "year") {
      const year = Number(form.year);
      if (!form.year || !Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1)
        message = "Enter a valid vehicle year";
    } else if (key === "color") {
      if (!form.color.trim()) message = "Vehicle color is required";
    } else if (key === "plateNumber") {
      if (!form.plateNumber.trim()) message = "Plate number is required";
      else if (form.plateNumber.trim().length < 3 || form.plateNumber.trim().length > 15)
        message = "Plate number must be between 3 and 15 characters";
    } else if (key === "licenseNumber") {
      if (!form.licenseNumber.trim()) message = "License number is required";
      else if (form.licenseNumber.trim().length < 5 || form.licenseNumber.trim().length > 30)
        message = "License number must be between 5 and 30 characters";
    } else if (key === "licenseExpiry") {
      if (!form.licenseExpiry) message = "License expiry date is required";
      else if (Number.isNaN(new Date(form.licenseExpiry).getTime()))
        message = "Enter a valid expiry date";
    }

    return message;
  };

  const validateStep = (fields) => {
    const next = {};
    fields.forEach((key) => {
      const message = validateField(key);
      if (message) next[key] = message;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleContinue = () => {
    setFormError("");
    if (!validateStep(current.fields)) return;

    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    void submit();
  };

  const goBack = () => {
    setFormError("");
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    const payload = isCaptain
      ? {
          fullname: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
          },
          email: form.email.trim(),
          phone: `${code}${form.phone}`,
          password: form.password,
          profileImage: avatarSvg || undefined,
          vehicle: {
            vehicleType: form.vehicleType,
            make: form.make.trim(),
            model: form.model.trim(),
            year: Number(form.year),
            color: form.color.trim(),
            plateNumber: form.plateNumber.trim().toUpperCase(),
          },
          license: {
            number: form.licenseNumber.trim().toUpperCase(),
            expiryDate: new Date(`${form.licenseExpiry}T00:00:00Z`).toISOString(),
          },
        }
      : {
          fullname: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim() || undefined,
          },
          email: form.email.trim(),
          phone: `${code}${form.phone}`,
          password: form.password,
          profileImage: avatarSvg || undefined,
        };

    setSubmitting(true);
    try {
      const { account } = await registerAccount({ role: mode, payload });
      toast({
        variant: "success",
        title: `Welcome${account?.fullname?.firstName ? `, ${account.fullname.firstName}` : ""}!`,
        description: isCaptain ? "Your captain account is ready." : "Your account is ready to ride.",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err?.message || "Registration failed. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell mode="register">
      {!picked ? (
        <div className="flex flex-col gap-3">
          <p className="mb-1 text-center text-body text-ink-secondary">
            Choose your account to continue.
          </p>

          <button
            type="button"
            onClick={() => handlePick("user")}
            className={cn(roleCardBase, "bg-primary-600 text-white shadow-sm hover:bg-primary-700")}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-[17px] font-bold leading-tight">Register as Rider</span>
              <span className="text-[13px] text-white/80">Book a ride</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => handlePick("captain")}
            className={cn(roleCardBase, "bg-amber-700 text-white shadow-sm hover:bg-amber-800")}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/20">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-[17px] font-bold leading-tight">Register as Captain</span>
              <span className="text-[13px] text-white/80">Drive &amp; earn</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/70" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
              {isCaptain ? (
                <ShieldCheck className="h-[18px] w-[18px] text-amber-600 dark:text-amber-400" aria-hidden="true" />
              ) : (
                <UserRound className="h-[18px] w-[18px] text-primary-700 dark:text-primary-400" aria-hidden="true" />
              )}
              {isCaptain ? "Captain registration" : "Rider registration"}
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

          {/* Step progress */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-gray-300 dark:bg-gray-600",
              )}
            />
          ))}
        </div>
        <span className="text-caption text-ink-muted">
          Step {step + 1} of {steps.length}
        </span>
      </div>

      <div className="mb-5">
        <h2 className="h3">{current.title}</h2>
        <p className="mt-0.5 text-small text-ink-secondary">{current.hint}</p>
      </div>

      {formError && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-[10px] bg-error-light px-3.5 py-2.5 text-small font-medium text-error-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleContinue(); }} noValidate>
        {current.fields.includes("firstName") && (
          <div className="flex flex-col gap-4">
            <Input
              label="First name"
              autoComplete="given-name"
              placeholder="Ali"
              leftIcon={User}
              value={form.firstName}
              onChange={set("firstName")}
              error={errors.firstName}
              required
            />
            <Input
              label="Last name"
              autoComplete="family-name"
              placeholder={isCaptain ? "Hassan" : "Hassan (optional)"}
              leftIcon={User}
              value={form.lastName}
              onChange={set("lastName")}
              error={errors.lastName}
              required={isCaptain}
            />
          </div>
        )}

        {current.fields.includes("email") && (
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            leftIcon={Mail}
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            required
          />
        )}

        {current.fields.includes("phone") && (
          <PhoneInput
            id="register-phone"
            hint="Country code + number — we never share it."
            value={form.phone}
            onChange={onPhoneChange}
            code={code}
            onCodeChange={setCode}
            error={errors.phone}
          />
        )}

        {current.fields.includes("password") && (
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            leftIcon={LogIn}
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
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            required
          />
        )}

        {current.fields.includes("confirmPassword") && (
          <Input
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            leftIcon={LogIn}
            interactiveRight
            rightIcon={
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  setShowConfirmPassword((v) => !v);
                }}
                className="tap-target inline-flex items-center justify-center rounded-[10px] px-2 text-ink-muted hover:text-ink"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            }
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            error={errors.confirmPassword}
            required
          />
        )}

        {current.fields.includes("vehicleType") && (
          <>
            <Select
              label="Vehicle type"
              placeholder="Select vehicle type"
              options={vehicleTypes}
              value={form.vehicleType}
              onChange={set("vehicleType")}
              error={errors.vehicleType}
              required
            />
          </>
        )}

        {current.fields.includes("make") && (
          <div className="flex flex-col gap-4">
            <Input
              label="Make"
              placeholder="Toyota"
              value={form.make}
              onChange={set("make")}
              error={errors.make}
              required
            />
            <Input
              label="Model"
              placeholder="Corolla"
              value={form.model}
              onChange={set("model")}
              error={errors.model}
              required
            />
            <Input
              label="Year"
              type="number"
              inputMode="numeric"
              placeholder="2023"
              value={form.year}
              onChange={set("year")}
              error={errors.year}
              required
            />
          </div>
        )}

        {current.fields.includes("color") && (
          <div className="flex flex-col gap-4">
            <Input
              label="Color"
              placeholder="White"
              value={form.color}
              onChange={set("color")}
              error={errors.color}
              required
            />
            <Input
              label="Plate number"
              placeholder="LEB-8341"
              value={form.plateNumber}
              onChange={set("plateNumber")}
              error={errors.plateNumber}
              required
            />
          </div>
        )}

        {current.fields.includes("licenseNumber") && (
          <>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="h4">Drive with rawan</h2>
            </div>
          </>
        )}

        {current.fields.includes("licenseNumber") && (
          <div className="flex flex-col gap-4">
            <Input
              label="License number"
              placeholder="DL-12345678"
              leftIcon={CreditCard}
              value={form.licenseNumber}
              onChange={set("licenseNumber")}
              error={errors.licenseNumber}
              required
            />
            <Input
              label="License expiry"
              type="date"
              leftIcon={CalendarDays}
              value={form.licenseExpiry}
              onChange={set("licenseExpiry")}
              error={errors.licenseExpiry}
              required
            />
          </div>
        )}

        {current.fields.includes("photo") && (
          <div className="flex flex-col items-center gap-3 py-1">
            <div className="relative">
              <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-2 ring-primary/20 dark:bg-gray-700/40">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-12 w-12 text-ink-muted" aria-hidden="true" />
                )}
              </span>
              {converting && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-surface/70">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
                </span>
              )}
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handlePhotoInput}
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={converting}
                leftIcon={ImagePlus}
                onClick={() => photoInputRef.current?.click()}
              >
                Choose photo
              </Button>
              {(photoPreview || avatarSvg) && (
                <Button type="button" variant="ghost" size="sm" leftIcon={Trash2} onClick={clearPhoto}>
                  Remove
                </Button>
              )}
            </div>

            <p className="text-center text-caption text-ink-muted">
              Optional — we convert it to a compact vector (SVG) avatar. You can also skip this step.
            </p>

            {photoError && (
              <p role="alert" className="flex items-center gap-1.5 text-caption font-medium text-error-800">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {photoError}
              </p>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              title="Go back"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-secondary shadow-sm transition-all hover:bg-gray-50 hover:text-ink dark:text-gray-100 dark:hover:bg-gray-700/40"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <Button type="submit" size="lg" className="flex-1" loading={submitting} rightIcon={ArrowRight}>
            {submitting
              ? "Creating account…"
              : step < steps.length - 1
                ? "Continue"
                : isCaptain
                  ? "Register as captain"
                  : "Create account"}
          </Button>
        </div>

        {formError && (
          <p className="-mt-2 text-center text-caption text-ink-muted">
            Already have an account? Log in instead.
          </p>
        )}
          </form>
        </>
      )}
    </AuthShell>
  );
}