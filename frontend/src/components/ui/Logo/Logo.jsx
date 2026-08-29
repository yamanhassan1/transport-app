import { forwardRef } from "react";
import { cn } from "../../../lib/cn.js";

export function LogoMark({ className }) {
  return (
    <img
      src="/logo.svg"
      alt="rawan logo"
      className={cn("h-9 w-9 shrink-0 rounded-[10px] object-cover", className)}
      width="36"
      height="36"
    />
  );
}

export const Logo = forwardRef(function Logo({ className, markClassName, textClassName, subtitleClassName }, ref) {
  return (
    <span ref={ref} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col justify-center gap-0.5 leading-none">
        <span
          lang="ar"
          dir="rtl"
          className={cn(
            "text-lg font-bold text-primary-600 dark:text-primary-400",
            textClassName,
          )}
          style={{ fontFamily: "'Segoe UI', 'Noto Naskh Arabic', 'Geeza Pro', sans-serif" }}
        >
          روان
        </span>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.32em] text-ink-secondary",
            subtitleClassName,
          )}
        >
          rawan
        </span>
      </span>
    </span>
  );
});

export default Logo;