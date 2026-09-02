import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { ScrollFade } from "../layout/ScrollFade";
import { cn } from "../../lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** מהיכן המגירה נפתחת */
  side?: "end" | "bottom";
  children: ReactNode;
}

const EXIT_MS = 240;

export function Drawer({ open, onClose, title, side = "end", children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
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
    panelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, requestClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
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
          "absolute flex flex-col border-line bg-surface shadow-lg",
          side === "end" && [
            "inset-y-0 start-auto end-0 w-[min(94vw,440px)] border-s rounded-s-xl",
            closing ? "drawer-out" : "drawer-in",
          ],
          side === "bottom" && [
            "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl",
            closing ? "sheet-out" : "sheet-in",
          ],
        )}
      >
        <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-5 py-4">
          <h2 className="text-h3 text-ink">{title}</h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="סגירה"
            className="rounded-md p-2 text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative min-h-0 flex-1">
          <div className="h-full overflow-y-auto p-5">{children}</div>
          <ScrollFade className="from-surface via-surface/70" />
        </div>
      </div>
    </div>
  );
}
