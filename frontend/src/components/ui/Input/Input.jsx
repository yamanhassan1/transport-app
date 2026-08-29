import { forwardRef, useId } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const Input = forwardRef(function Input(
  {
    className,
    label,
    error,
    hint,
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    interactiveRight = false,
    id,
    required,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-small font-medium text-ink">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-12 w-full rounded-[10px] border border-transparent bg-gray-100/80 px-4 text-[15px] text-ink dark:bg-gray-700/40",
            "md:border-line md:bg-surface md:dark:bg-surface",
            "placeholder:text-ink-muted transition-colors duration-200",
            "focus:border-primary focus:outline-none focus:shadow-[0_0_0_3px_var(--primary-100)]",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-ink-muted",
            LeftIcon && "pl-11",
            RightIcon && "pr-11",
            error && "border-error focus:border-error focus:shadow-[0_0_0_3px_var(--error-light)]",
          )}
          {...props}
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-ink-muted" aria-hidden="true" />
        )}
        {!loading && RightIcon && interactiveRight && (
          <span className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
            {RightIcon}
          </span>
        )}
        {!loading && RightIcon && !interactiveRight && (
          <RightIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;