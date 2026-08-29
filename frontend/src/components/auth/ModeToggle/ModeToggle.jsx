import { cn } from "../../../lib/cn.js";

const modes = [
  { id: "user", label: "Rider", hint: "Book a ride" },
  { id: "captain", label: "Captain", hint: "Drive & earn" },
];

export default function ModeToggle({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Account type"
      className="grid grid-cols-2 gap-2 rounded-[10px] bg-gray-100 p-1 dark:bg-gray-700/40"
    >
      {modes.map((m) => {
        const selected = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(m.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-[10px] px-3 py-2.5 transition-colors",
              selected
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-muted hover:text-ink",
            )}
          >
            <span className="text-[15px] font-semibold">{m.label}</span>
            <span className="text-caption">{m.hint}</span>
          </button>
        );
      })}
    </div>
  );
}