import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface ToastItem {
  id: number;
  kind: "success" | "error" | "info";
  message: string;
  /** פעולת ביטול אופציונלית (Undo) */
  undo?: { label: string; onUndo: () => void };
}

interface ToastContextValue {
  toast: (kind: ToastItem["kind"], message: string, undo?: ToastItem["undo"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast חייב להיות בתוך ToastProvider");
  return ctx;
}

const kindStyles = {
  success: { icon: CheckCircle2, bar: "bg-success", text: "text-success" },
  error: { icon: XCircle, bar: "bg-danger", text: "text-danger" },
  info: { icon: Info, bar: "bg-info", text: "text-info" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastItem["kind"], message: string, undo?: ToastItem["undo"]) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, kind, message, undo }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col-reverse gap-2 sm:inset-x-auto sm:end-4 sm:w-[420px]"
      >
        {toasts.map((t) => {
          const { icon: Icon, bar, text } = kindStyles[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className="toast-in pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-md border border-line bg-surface py-3 pe-3 ps-4 shadow-lg"
            >
              <span className={cn("absolute inset-y-0 start-0 w-1", bar)} />
              <Icon className={cn("h-5 w-5 shrink-0", text)} aria-hidden />
              <p className="flex-1 text-ink">{t.message}</p>
              {t.undo && (
                <button
                  type="button"
                  onClick={() => {
                    t.undo!.onUndo();
                    dismiss(t.id);
                  }}
                  className="shrink-0 rounded px-2 py-1 text-caption font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
                >
                  {t.undo.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="סגירת ההודעה"
                className="shrink-0 rounded p-1 text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
