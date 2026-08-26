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

export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  return (
    <ol className={cn("flex items-start justify-center", className)}>
      {steps.map((name, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={name} className="flex flex-1 items-start last:flex-initial">
            <div className="flex w-24 flex-col items-center gap-1.5">
              <button
                type="button"
                disabled={!done || !onStepClick}
                onClick={() => onStepClick?.(i)}
                aria-current={active ? "step" : undefined}
                aria-label={`שלב ${i + 1}: ${name}`}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-base",
                  done && "bg-primary-700 text-white",
                  done && onStepClick && "cursor-pointer hover:bg-primary-800",
                  active && "bg-primary-700 text-white ring-4 ring-primary-200",
                  !done && !active && "border border-line bg-surface text-muted",
                )}
              >
                {done ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
              </button>
              <span
                className={cn(
                  "text-center text-caption",
                  active ? "font-semibold text-primary-700" : done ? "text-body" : "text-muted",
                )}
              >
                {name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mt-5 h-0.5 flex-1 rounded-full transition-colors duration-base",
                  i < current ? "bg-primary-700" : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
