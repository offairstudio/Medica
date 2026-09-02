import { useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  /** "top" - מעל הרכיב; "end" - בועית לצד הרכיב (שמאלה ב-RTL) */
  placement?: "top" | "end";
}

/**
 * בועית הסבר קצרה. במיקום "end" היא מרונדרת ל-body ולכן אינה נחתכת
 * בתוך אזורי גלילה - למשל סרגל הניווט המצומצם.
 */
export function Tooltip({ content, children, className, placement = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  function show() {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) setPoint({ x: rect.left - 8, y: rect.top + rect.height / 2 });
    setVisible(true);
  }

  return (
    <span
      ref={anchorRef}
      className={cn("relative inline-flex max-w-full", className)}
      onMouseEnter={show}
      onMouseLeave={() => setVisible(false)}
      onFocus={show}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible &&
        (placement === "end" ? (
          createPortal(
            <span
              role="tooltip"
              className="pointer-events-none fixed z-[70] w-max max-w-64 -translate-x-full -translate-y-1/2 rounded-md bg-ink px-2.5 py-1.5 text-caption text-white shadow-md"
              style={{ left: point.x, top: point.y }}
            >
              {content}
            </span>,
            document.body,
          )
        ) : (
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full start-1/2 z-50 mb-1.5 w-max max-w-72 rounded-md bg-ink px-2.5 py-1.5 text-caption text-white shadow-md"
            style={{ translate: "50% 0" }}
          >
            {content}
          </span>
        ))}
    </span>
  );
}
