import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const countryCodes = [
  { code: "+92", label: "Pakistan" },
  { code: "+971", label: "UAE" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+44", label: "United Kingdom" },
  { code: "+1", label: "United States" },
  { code: "+91", label: "India" },
];

export default function PhoneInput({
  id,
  label = "Phone",
  value,
  onChange,
  code,
  onCodeChange,
  error,
  hint,
  placeholder = "300 1234567",
  autoComplete = "tel",
  required = true,
  className,
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const [open, setOpen] = useState(false);

  const handleInput = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
    onChange?.(digits);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={fieldId} className="text-small font-medium text-ink">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <div
        className={cn(
          "grid h-12 grid-cols-[auto_1fr] items-center overflow-hidden rounded-[10px] border border-transparent bg-gray-100/80 transition-all dark:bg-gray-700/40",
          "md:border-line md:bg-surface md:dark:bg-surface",
          "focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--primary-100)]",
          error && "border-error focus-within:border-error focus-within:shadow-[0_0_0_3px_var(--error-light)]",
        )}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-full items-center gap-1 border-r border-line/70 pr-3 pl-3.5 transition-colors hover:bg-gray-100/70 dark:hover:bg-gray-600/50"
          >
            <span className="rounded-md bg-gray-200/80 px-2 py-1 text-[13px] font-bold text-ink dark:bg-gray-600">
              {code}
            </span>
            <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
          </button>

          {open && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-20 cursor-default"
              />
              <ul
                role="listbox"
                className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-64 w-48 overflow-auto rounded-xl border border-line bg-surface p-1.5 shadow-lg shadow-black/10"
              >
                {countryCodes.map((c) => (
                  <li key={c.code} role="option" aria-selected={c.code === code}>
                    <button
                      type="button"
                      onClick={() => {
                        onCodeChange?.(c.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[15px] transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40",
                        c.code === code && "font-semibold text-primary-700 dark:text-primary-400",
                      )}
                    >
                      <span className="font-semibold text-ink">{c.code}</span>
                      <span className="text-small text-ink-secondary">{c.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <input
          id={fieldId}
          type="tel"
          autoComplete={autoComplete}
          inputMode="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="h-full w-full bg-transparent pl-3.5 pr-4 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none"
        />
      </div>
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}