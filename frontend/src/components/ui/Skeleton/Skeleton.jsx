import { cn } from "../../../lib/cn.js";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      aria-hidden="true"
      {...props}
    />
  );
}