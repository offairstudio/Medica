import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

export interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onSelect: () => void;
}

export interface DropdownProps {
  trigger: ReactElement;
  items?: DropdownItem[];
  /** תוכן חופשי במקום רשימת פריטים */
  children?: ReactNode;
  align?: "start" | "end";
  menuClassName?: string;
  /**
   * רינדור התפריט מעל כל העמוד (portal).
   * נדרש כשה-Dropdown יושב בתוך אזור עם overflow - למשל סרגל סינון נגלל.
   */
  portal?: boolean;
}

export function Dropdown({
  trigger,
  items,
  children,
  align = "end",
  menuClassName,
  portal,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; inset: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // מיקום התפריט מתחת ל-trigger כשמרנדרים ב-portal
  useLayoutEffect(() => {
    if (!open || !portal) return;
    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 4,
        // ב-RTL הצמדה לקצה ההתחלה (ימין) נמדדת מקצה החלון
        inset: window.innerWidth - rect.right,
      });
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, portal]);

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          setOpen((o) => !o);
          const orig = (trigger.props as Record<string, unknown>).onClick;
          if (typeof orig === "function") orig(e);
        },
        "aria-expanded": open,
        "aria-haspopup": true,
      })
    : trigger;

  const menuBody = (
    <>
      {items?.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            item.onSelect();
          }}
          className={cn(
            "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-start transition-colors duration-fast",
            item.danger ? "text-danger hover:bg-danger/5" : "text-body hover:bg-primary-50",
          )}
        >
          <span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
          {item.label}
        </button>
      ))}
      {children}
    </>
  );

  return (
    <div ref={rootRef} className="relative inline-flex">
      {triggerEl}

      {open &&
        (portal ? (
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: position?.top ?? 0, insetInlineStart: position?.inset ?? 0 }}
              className={cn(
                "fixed z-[60] max-h-[60vh] min-w-44 overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-lg",
                menuClassName,
              )}
            >
              {menuBody}
            </div>,
            document.body,
          )
        ) : (
          <div
            role="menu"
            className={cn(
              "absolute top-full z-40 mt-1 min-w-44 overflow-hidden rounded-md border border-line bg-surface py-1 shadow-md",
              align === "end" ? "end-0" : "start-0",
              menuClassName,
            )}
          >
            {menuBody}
          </div>
        ))}
    </div>
  );
}
