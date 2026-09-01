import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** מחלקות הטאב - זהות בכל מסכי המטופל */
export function tabClass(isActive: boolean) {
  return cn(
    "-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-3 font-semibold transition-colors duration-fast",
    isActive ? "border-primary-700 text-ink" : "border-transparent text-muted hover:text-body",
  );
}

export function tabCountClass(isActive: boolean) {
  return cn(
    "tnum rounded-full px-1.5 py-0.5 text-[11px] font-bold",
    isActive ? "bg-primary-100 text-primary-800" : "bg-canvas text-muted",
  );
}

export interface PatientPageHeaderProps {
  title: string;
  subtitle?: string;
  /** בקרות בתחילת השורה - בדרך כלל טאבים */
  start?: ReactNode;
  /** בקרות בקצה השורה - סינון וחיפוש */
  end?: ReactNode;
}

/**
 * כותרת אחידה למסכי המטופל: כותרת, ומתחתיה שורת בקרות עם קו תחתון.
 * הכותרת מוזרקת ל-PatientShell ולכן נשארת קבועה בראש המסך;
 * הקו התחתון הוא הגבול שבו תוכן הגלילה נחתך.
 */
export function PatientPageHeader({ title, subtitle, start, end }: PatientPageHeaderProps) {
  const hasControls = Boolean(start || end);

  return (
    <>
      <h1 className="text-display text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-body text-muted">{subtitle}</p>}

      {hasControls ? (
        <div className="mt-4 flex flex-col gap-1 border-b border-line md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0">{start}</div>
          <div className="min-w-0">{end}</div>
        </div>
      ) : (
        <div className="mt-4 border-b border-line" />
      )}
    </>
  );
}
