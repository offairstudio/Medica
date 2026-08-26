import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** מהיכן המגירה נפתחת */
  side?: "end" | "bottom";
  children: ReactNode;
}

export function Drawer({ open, onClose, title, side = "end", children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden className="absolute inset-0 bg-ink/50" onMouseDown={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "modal-in absolute flex flex-col border-line bg-surface shadow-lg",
          side === "end" &&
            "inset-y-0 start-auto end-0 w-[min(94vw,440px)] border-s rounded-s-xl",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl",
        )}
      >
        <div className="flex items-center justify-between border-b border-line bg-canvas/60 px-5 py-4">
          <h2 className="text-h3 text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירה"
            className="rounded-md p-2 text-muted transition-colors duration-fast hover:bg-canvas hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
