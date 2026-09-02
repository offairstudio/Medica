import { useState, type ReactNode, type UIEvent } from "react";
import { cn } from "../../lib/cn";

/**
 * אזור גלילה שהתוכן נמוג בקצהו העליון במקום להיחתך בקו חד.
 * הדהייה מופיעה רק כשיש תוכן שנגלל מעלה, ונעלמת בראש הרשימה.
 */
export function ScrollArea({
  as: Element = "div",
  className,
  fadeClassName,
  children,
}: {
  /** אלמנט אזור הגלילה - main במסכים, div במגירות */
  as?: "div" | "main";
  className?: string;
  /** גוון הדהייה, כשהרקע אינו הרקע הכללי */
  fadeClassName?: string;
  children: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  function onScroll(e: UIEvent<HTMLElement>) {
    setScrolled(e.currentTarget.scrollTop > 4);
  }

  return (
    <div className="relative min-h-0 flex-1">
      <Element onScroll={onScroll} className={cn("h-full overflow-y-auto", className)}>
        {children}
      </Element>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-canvas via-canvas/70 to-transparent transition-opacity duration-base",
          scrolled ? "opacity-100" : "opacity-0",
          fadeClassName,
        )}
      />
    </div>
  );
}
