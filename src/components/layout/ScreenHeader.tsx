import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** מחלקות הטאב - זהות בכל המסכים */
export function tabClass(isActive: boolean) {
  return cn(
    "-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-3 font-semibold transition-colors duration-fast",
    isActive ? "border-primary-700 text-ink" : "border-transparent text-muted hover:text-body",
  );
}

export function tabCountClass(isActive: boolean) {
  return cn(
    "tnum rounded-full px-1.5 py-0.5 text-[12px] font-bold",
    isActive ? "bg-primary-100 text-primary-800" : "bg-surface-2 text-muted",
  );
}

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** בקרות בתחילת השורה - בדרך כלל טאבים */
  start?: ReactNode;
  /** בקרות בקצה השורה - סינון וחיפוש */
  end?: ReactNode;
  /** תמונה או סימון בתחילת שורת הכותרת */
  media?: ReactNode;
  /** פעולה בקצה שורת הכותרת */
  titleEnd?: ReactNode;
  /** כותרת מוקטנת - כשהכותרת היא שם ולא שם מסך */
  compact?: boolean;
  /** קו הפרדה מתחת לשורת הבקרות */
  divider?: boolean;
}

/**
 * כותרת אחידה לכל מסכי המערכת - מטופל ומנתח כאחד:
 * כותרת, ומתחתיה שורת בקרות עם קו תחתון.
 * הכותרת מוזרקת ל-shell ולכן נשארת קבועה בראש המסך;
 * הקו התחתון הוא הגבול שבו תוכן הגלילה נחתך.
 */
export function ScreenHeader({
  title,
  subtitle,
  start,
  end,
  media,
  titleEnd,
  compact,
  divider = true,
}: ScreenHeaderProps) {
  const hasControls = Boolean(start || end);

  return (
    <>
      <div className="flex items-center gap-3">
        {media}
        <h1 className={cn("min-w-0 flex-1 truncate", compact ? "text-h1 text-ink" : "text-display text-ink")}>
          {title}
        </h1>
        {titleEnd}
      </div>
      {subtitle && <p className="mt-1 text-body text-muted">{subtitle}</p>}

      {hasControls ? (
        <div
          className={cn(
            "mt-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6",
            divider && "border-b border-line",
          )}
        >
          <div className="min-w-0">{start}</div>
          <div className="min-w-0">{end}</div>
        </div>
      ) : (
        divider && <div className="mt-4 border-b border-line" />
      )}
    </>
  );
}
