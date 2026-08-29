import { cn } from "../../../lib/cn.js";

export default function PageContainer({ children, className }) {
  return (
    <div className={cn("container-page px-4 py-5 md:px-6 md:py-6", className)}>{children}</div>
  );
}