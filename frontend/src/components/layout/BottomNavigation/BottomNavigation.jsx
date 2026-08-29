import { NavLink } from "react-router-dom";
import { cn } from "../../../lib/cn.js";
import { primaryNav } from "../../../lib/nav.js";

function NavItem({ item, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "group flex min-h-11 flex-1 flex-col items-center gap-0.5 rounded-full py-1 font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isActive ? "text-primary-700 dark:text-primary-400" : "text-ink-muted hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "flex h-7 items-center justify-center rounded-full px-4 transition-all duration-200",
              isActive
                ? "bg-primary-100 shadow-sm dark:bg-primary-900/30"
                : "bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-700/40",
            )}
          >
            <Icon
              className={cn("h-[20px] w-[20px]", isActive && "fill-primary-100/70 dark:fill-primary-900/30")}
              aria-hidden="true"
            />
          </span>
          <span className={cn("text-[10px] leading-3", isActive && "font-semibold")}>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function BottomNavigation({ items = primaryNav }) {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] md:hidden"
    >
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-1 rounded-full border border-line bg-surface/90 p-1.5 shadow-lg shadow-black/5 backdrop-blur-xl">
        {items.map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
      </div>
    </nav>
  );
}