import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/cn";
import { MonthCalendar } from "../calendar/MonthCalendar";
import { formatNumericDate } from "../../lib/date";
import { MOCK_TODAY } from "../../mock/doctors";
import type { ISODate } from "../../types";

export interface DatePickerProps {
  label?: string;
  value: ISODate | null;
  onChange: (date: ISODate | null) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  /** שדה שקט - נראה כמו טקסט עד לריחוף או מיקוד */
  quiet?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  error,
  placeholder = "בחירת תאריך",
  className,
  quiet,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
        aria-haspopup="dialog"
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
        <CalendarDays className="h-4 w-4 shrink-0 text-muted" />
        <span className={cn("tnum", value ? "text-ink" : "text-muted")}>
          {value ? formatNumericDate(value) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-1 w-[300px] rounded-md border border-line bg-surface p-3 shadow-md">
          <MonthCalendar
            today={MOCK_TODAY}
            selectedDate={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </div>
      )}

      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  );
}
