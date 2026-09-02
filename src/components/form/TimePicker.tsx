import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Time } from "../../types";

export interface TimePickerProps {
  label?: string;
  value: Time | null;
  onChange: (time: Time) => void;
  error?: string;
  /** צעד בדקות בין אפשרויות */
  stepMinutes?: number;
  from?: Time;
  to?: Time;
  className?: string;
  /** שדה שקט - נראה כמו טקסט עד לריחוף או מיקוד */
  quiet?: boolean;
}

function buildOptions(from: Time, to: Time, step: number): Time[] {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const out: Time[] = [];
  for (let m = fh * 60 + fm; m <= th * 60 + tm; m += step) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export function TimePicker({
  label,
  value,
  onChange,
  error,
  stepMinutes = 15,
  from = "07:00",
  to = "22:00",
  className,
  quiet,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const options = buildOptions(from, to, stepMinutes);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-1.5", className)}>
      {label && (
        <span className={cn("text-caption font-semibold", error ? "text-danger" : "text-body")}>
          {label}
        </span>
      )}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md border text-body transition-colors duration-fast",
          quiet ? "h-10 bg-transparent px-2" : "h-11 bg-surface px-3",
          error
            ? "border-danger"
            : open
              ? "border-primary-500"
              : quiet
                ? "border-transparent hover:border-line"
                : "border-line hover:border-primary-300",
        )}
      >
        <Clock className="h-4 w-4 shrink-0 text-muted" />
        <span className={cn("tnum", value ? "text-ink" : "text-muted")}>{value ?? "בחירת שעה"}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-md"
        >
          {options.map((t) => (
            <li key={t} role="option" aria-selected={value === t}>
              <button
                type="button"
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-start tnum transition-colors duration-fast hover:bg-primary-50",
                  value === t ? "font-semibold text-primary-700" : "text-body",
                )}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  );
}
