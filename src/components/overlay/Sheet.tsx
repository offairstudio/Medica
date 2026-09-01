import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** כותרת נגישות; מוצגת גם ויזואלית אלא אם הועבר titleSlot */
  title: string;
  /** אזור כותרת עשיר - למשל כותרת + צ'יפים */
  titleSlot?: ReactNode;
  size?: "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
}

const sizes = { md: "md:w-[min(94vw,460px)]", lg: "md:w-[min(94vw,560px)]" };

/**
 * שכבת-על רספונסיבית:
 * במובייל מגירה תחתונה ברוחב מלא, בדסקטופ מגירת צד בגובה מלא בקצה המסך.
 * סגירה: כפתור ה-X, לחיצה על הרקע או Esc.
 */
const EXIT_MS = 240;

export function Sheet({ open, onClose, title, titleSlot, size = "lg", children, footer }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  // נשארים mounted עד שאנימציית היציאה מסתיימת, ורק אז מודיעים להורה
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  const requestClose = useCallback(() => setClosing(true), []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClose, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreFocusRef.current?.focus();
    };
  }, [open, requestClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 bg-ink/50", closing ? "overlay-out" : "overlay-in")}
        onMouseDown={requestClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden border border-line bg-surface shadow-lg",
          closing ? "sheet-out md:drawer-out" : "sheet-in md:drawer-in",
          "rounded-t-xl border-b-0 pb-[env(safe-area-inset-bottom)]",
          "md:h-full md:max-h-none md:rounded-none md:rounded-s-xl md:border-b-0 md:border-e-0 md:pb-0",
          sizes[size],
        )}
      >
        {/* ידית גרירה - מובייל בלבד */}
        <div className="flex justify-center pt-2.5 md:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-line bg-canvas/60 px-5 py-4 md:px-6">
          <div className="min-w-0 flex-1">
            {titleSlot ?? <h2 className="text-h2 text-ink">{title}</h2>}
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="סגירה וחזרה לרשימה"
            className="-me-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-canvas hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">{children}</div>

        {footer && (
          <div className="border-t border-line px-5 py-4 md:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}
