import { useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const sizes = { sm: 18, md: 24, lg: 32 };

export default function Spinner({ size = "md", label, className }) {
  const reduce = useReducedMotion();
  const px = sizes[size] || sizes.md;
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status">
      <Loader2
        className={cn("text-primary", !reduce && "animate-spin")}
        style={{ width: px, height: px }}
        aria-hidden="true"
      />
      {label && <p className="text-small text-ink-muted">{label}</p>}
    </div>
  );
}