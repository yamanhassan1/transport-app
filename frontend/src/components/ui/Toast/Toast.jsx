import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "../../../lib/cn.js";

const toastIcons = {
  success: { Icon: CheckCircle2, className: "text-success" },
  error: { Icon: XCircle, className: "text-error" },
  warning: { Icon: AlertTriangle, className: "text-warning" },
  info: { Icon: Info, className: "text-info" },
};

export function ToastViewport({ toasts, onDismiss }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[500] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:top-5 sm:right-5 sm:left-auto sm:items-end sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const { Icon, className } = toastIcons[toast.variant] || toastIcons.info;
          return (
            <motion.div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[14px] border border-line bg-surface p-4 shadow-md"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", className)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                {toast.title && <p className="font-semibold text-ink">{toast.title}</p>}
                {toast.description && <p className="text-small text-ink-secondary">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="tap-target -mr-2 -mt-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 hover:text-ink dark:hover:bg-gray-700/40"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}