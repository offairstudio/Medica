import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export interface StepperProps {
  steps: readonly string[];
  /** אינדקס השלב הנוכחי (0-based) */
  current: number;
  /** מעבר לשלב שהושלם */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * התקדמות באשף כפס מקטעים: לכל שלב מקטע ותווית מתחתיו.
 * שטוח ונמוך, כדי שיוכל לשבת בכותרת הקבועה של המגירה.
 */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="שלבי יצירת הניתוח" className={cn("flex items-stretch gap-2", className)}>
      {steps.map((name, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = done && Boolean(onStepClick);

        return (
          <button
            key={name}
            type="button"
            disabled={!clickable}
            onClick={() => onStepClick?.(i)}
            aria-current={active ? "step" : undefined}
            aria-label={`שלב ${i + 1} מתוך ${steps.length}: ${name}`}
            className={cn(
              "group flex flex-1 flex-col gap-1.5 rounded-sm text-start",
              clickable && "cursor-pointer",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-1 rounded-full transition-colors duration-base",
                done || active ? "bg-primary-700" : "bg-line",
                clickable && "group-hover:bg-primary-800",
              )}
            />
            <span
              className={cn(
                "flex items-center gap-1.5 text-caption transition-colors duration-fast",
                active ? "font-semibold text-primary-700" : done ? "text-body" : "text-muted",
                clickable && "group-hover:text-primary-800",
              )}
            >
              {/* מספר השלב - וי מחליף אותו אחרי שהשלב הושלם */}
              <span
                aria-hidden
                className={cn(
                  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold leading-none",
                  done || active
                    ? "bg-primary-700 text-white"
                    : "border border-line text-muted",
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className="truncate">{name}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
