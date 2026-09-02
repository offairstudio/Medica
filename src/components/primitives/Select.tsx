import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  /** ערך בודד או מערך ערכים במצב multiple */
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  renderValue?: (selected: SelectOption[]) => ReactNode;
  /** מזהה חיצוני, לקישור תווית */
  id?: string;
  /** שדה שקט - נראה כמו טקסט עד לריחוף או מיקוד */
  quiet?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "בחירה...",
  searchable,
  multiple,
  clearable,
  error,
  disabled,
  className,
  id: idProp,
  quiet,
}: SelectProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value],
  );
  const selected = options.filter((o) => selectedValues.includes(o.value));

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((o) => o.label.includes(query.trim()));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
    if (!open) setQuery("");
  }, [open, searchable]);

  function toggleOption(v: string) {
    if (multiple) {
      const next = selectedValues.includes(v)
        ? selectedValues.filter((x) => x !== v)
        : [...selectedValues, v];
      onChange(next);
    } else {
      onChange(v);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn("text-caption font-semibold", error ? "text-danger" : "text-body")}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border text-body transition-colors duration-fast",
          quiet ? "h-10 bg-transparent px-2" : "h-11 bg-surface px-3",
          error
            ? "border-danger"
            : open
              ? "border-primary-500"
              : quiet
                ? "border-transparent hover:border-line"
                : "border-line hover:border-primary-300",
          disabled && "opacity-45 cursor-not-allowed",
        )}
      >
        <span className={cn("truncate text-start", selected.length ? "text-ink" : "text-muted")}>
          {selected.length
            ? multiple
              ? selected.map((s) => s.label).join(", ")
              : selected[0].label
            : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && selected.length > 0 && (
            <X
              className="h-4 w-4 text-muted hover:text-danger"
              aria-label="ניקוי בחירה"
              onClick={(e) => {
                e.stopPropagation();
                onChange(multiple ? [] : null);
              }}
            />
          )}
          <ChevronDown
            className={cn("h-4 w-4 text-muted transition-transform duration-fast", open && "rotate-180")}
          />
        </span>
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-1 w-full overflow-hidden rounded-md border border-line bg-surface shadow-md">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-line px-3 py-2">
              <Search className="h-4 w-4 text-muted" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש..."
                aria-label="חיפוש באפשרויות"
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
              />
            </div>
          )}
          <ul role="listbox" aria-multiselectable={multiple} className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-caption text-muted">לא נמצאו תוצאות</li>
            )}
            {filtered.map((o) => {
              const isSelected = selectedValues.includes(o.value);
              return (
                <li key={o.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => toggleOption(o.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2 text-start transition-colors duration-fast hover:bg-primary-50",
                      isSelected ? "font-semibold text-primary-700" : "text-body",
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  );
}
