import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * כרטיסיית מקטע - הכותרת יושבת בפס עליון משלה, כך שגבול הכרטיס חד וברור.
 * זו אותה הגשה במגירת פרטי התור, במגירת הניתוח ובשלבי האשף.
 * variant="accent" שמור למקטע שדורש תשומת לב (הנחיות, דרישות), בגוון המותג.
 */
export function SectionCard({
  title,
  hint,
  variant = "card",
  className,
  bodyClassName,
  children,
}: {
  title: string;
  hint?: string;
  variant?: "card" | "accent";
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  if (variant === "accent") {
    return (
      <section
        aria-label={title}
        className={cn("min-w-0 rounded-lg border border-primary-200 bg-primary-50 p-5", className)}
      >
        <h3 className="flex items-center gap-2 text-h3 text-primary-800">
          <Info className="h-4 w-4 shrink-0 text-primary-500" aria-hidden />
          {title}
        </h3>
        {hint && <p className="mt-0.5 text-caption text-muted">{hint}</p>}
        <div className="mt-2">{children}</div>
      </section>
    );
  }

  return (
    <section
      aria-label={title}
      // בלי overflow-hidden: תפריטים נפתחים בתוך הכרטיס (תאריך, שעה, בחירה)
      // חייבים לחרוג ממנו. הפינות של פס הכותרת מעוגלות בנפרד.
      className={cn("min-w-0 rounded-lg border border-line bg-surface shadow-sm", className)}
    >
      <div className="rounded-t-lg border-b border-line bg-surface-2/60 px-5 py-3.5">
        <h3 className="text-h3 text-ink">{title}</h3>
        {hint && <p className="mt-0.5 text-caption text-muted">{hint}</p>}
      </div>
      <div className={cn("px-5 py-4", bodyClassName)}>{children}</div>
    </section>
  );
}
