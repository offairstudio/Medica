import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "../../lib/cn";

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: (id: string, describedBy?: string) => ReactNode;
  className?: string;
}

/** עוטף label + שדה + hint + error עבור רכיבים שאינם Input/Select */
export function Field({ label, error, hint, children, className }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-caption font-semibold", error ? "text-danger" : "text-body")}>
        {label}
      </label>
      {children(id, describedBy)}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
