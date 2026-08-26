import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className={cn("relative inline-flex max-w-full", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full start-1/2 z-50 mb-1.5 w-max max-w-72 rounded-md bg-ink px-2.5 py-1.5 text-caption text-white shadow-md"
          style={{ translate: "50% 0" }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
