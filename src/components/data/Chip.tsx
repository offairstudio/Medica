import type { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Appointment, Hospital } from "../../types";
import { HOSPITALS } from "../../mock/hospitals";
import { he } from "../../i18n/he";

/* ---------- צ'יפ כללי ---------- */

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "primary" | "neutral" | "success" | "warning" | "danger" | "info";
  onRemove?: () => void;
  children: ReactNode;
}

const chipColors = {
  primary: "bg-primary-100 text-primary-700",
  neutral: "bg-surface-2 text-body border border-line",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export function Chip({ color = "neutral", onRemove, className, children, ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-semibold",
        chipColors[color],
        className,
      )}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="הסרה"
          className="rounded-full p-0.5 transition-colors duration-fast hover:bg-black/10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/* ---------- צ'יפ בית חולים ---------- */

/**
 * סמל medica ושם בית החולים, על גוון ייעודי לכל מרכז.
 * הלוגו המלא לא שימש כאן: הוא נושא את המילה "Medica" ולא את שם בית החולים,
 * ובגודל צ'יפ שני המרכזים נראו זהים.
 */
export function HospitalChip({
  hospital,
  compact,
  className,
}: {
  hospital: Hospital;
  compact?: boolean;
  className?: string;
}) {
  const info = HOSPITALS[hospital];

  return (
    <span
      title={info.fullName}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold text-white",
        info.chipClass,
        compact ? "px-2 py-0.5 text-caption" : "min-h-7 px-2.5 py-1 text-caption",
        className,
      )}
    >
      <img
        src="/brand/medica-mark.svg"
        alt=""
        aria-hidden
        className={cn("w-auto brightness-0 invert", compact ? "h-3" : "h-3.5")}
      />
      {info.name}
    </span>
  );
}

/* ---------- צ'יפ סוג תור ---------- */

const kindColors: Record<Appointment["kind"], string> = {
  surgery: "bg-primary-100 text-primary-700",
  consult: "bg-info/10 text-info",
  test: "bg-warning/10 text-warning",
  followup: "bg-success/10 text-success",
};

export function KindChip({ kind, className }: { kind: Appointment["kind"]; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold",
        kindColors[kind],
        className,
      )}
    >
      {he.patient.kinds[kind]}
    </span>
  );
}

/* ---------- צ'יפ סינון (לחיץ) ---------- */

export interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  onClear?: () => void;
  children: ReactNode;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
}

export function FilterChip({ active, onClick, onClear, children, ariaExpanded, ariaHasPopup }: FilterChipProps) {
  return (
    <span className="inline-flex shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 font-semibold transition-colors duration-fast",
          active
            ? "border-primary-700 bg-primary-700 text-white"
            : "border-line bg-surface text-body hover:border-primary-300 hover:bg-primary-50",
          onClear && active && "rounded-e-none border-e-0",
        )}
      >
        {children}
      </button>
      {onClear && active && (
        <button
          type="button"
          onClick={onClear}
          aria-label="ניקוי סינון"
          className="inline-flex min-h-[44px] items-center rounded-e-full border border-s-0 border-primary-700 bg-primary-700 pe-3 ps-1 text-white transition-colors duration-fast hover:bg-primary-800"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </span>
  );
}
