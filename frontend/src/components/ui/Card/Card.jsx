import { cn } from "../../../lib/cn.js";

export function Card({ className, children, interactive = false }) {
  return (
    <div
      className={cn(
        "rounded-none border-0 bg-transparent shadow-none",
        "md:rounded-xl md:border md:border-line md:bg-surface md:shadow-sm",
        interactive && "transition-shadow duration-200 hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-4", className)}>
      <div>
        {title && <h3 className="h4">{title}</h3>}
        {subtitle && <p className="text-small text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

export default Card;