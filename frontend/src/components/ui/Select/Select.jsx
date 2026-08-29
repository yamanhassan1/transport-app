import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const Select = forwardRef(function Select(
  { className, label, error, hint, options = [], placeholder, id, required, ...props },
  ref,
) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={selectId} className="text-small font-medium text-ink">
          {label}
          {required && <span className="text-error"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-[10px] border border-line bg-surface px-4 pr-10 text-[15px] text-ink",
            "placeholder:text-ink-muted transition-colors duration-200",
            "focus:border-primary focus:outline-none focus:shadow-[0_0_0_3px_var(--primary-100)]",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-ink-muted",
            !props.value && "text-ink-muted",
            error && "border-error focus:border-error focus:shadow-[0_0_0_3px_var(--error-light)]",
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p id={`${selectId}-error`} role="alert" className="text-small text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-small text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;