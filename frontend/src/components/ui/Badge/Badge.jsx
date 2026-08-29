import { cn } from "../../../lib/cn.js";

const variants = {
  success: "bg-success-light text-success-800",
  warning: "bg-warning-light text-warning-800",
  error: "bg-error-light text-error-800",
  info: "bg-info-light text-info-800",
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
  primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
};

export default function Badge({ children, variant = "neutral", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-caption normal-case tracking-normal",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}