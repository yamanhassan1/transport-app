import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const base = cn(
  "inline-flex items-center justify-center gap-2 font-semibold",
  "rounded-full transition-all duration-200 ease-out",
  "active:scale-[0.97] select-none disabled:pointer-events-none disabled:opacity-60",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
);

const variants = {
  primary:
    "bg-gradient-to-b from-primary-500 to-primary-700 text-white shadow-md shadow-primary/25 hover:from-primary-400 hover:to-primary-700 hover:shadow-lg hover:shadow-primary/30",
  secondary:
    "border border-line bg-surface text-gray-800 shadow-sm hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700/40",
  danger: "bg-error text-white shadow-sm hover:bg-error-700",
  ghost: "bg-transparent text-ink-secondary hover:bg-gray-100 hover:text-ink dark:hover:bg-gray-700/40",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-base",
};

const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", loading = false, leftIcon: LeftIcon, rightIcon: RightIcon, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], loading && "opacity-80", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="h-5 w-5" aria-hidden="true" />
      )}
      <span>{children}</span>
      {!loading && RightIcon && <RightIcon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
});

export default Button;