import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id: idProp, rows = 3, ...rest }, ref) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label htmlFor={id} className={cn("text-caption font-semibold", error ? "text-danger" : "text-body")}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-md border bg-surface px-3 py-2.5 text-ink placeholder:text-muted transition-colors duration-fast",
            error
              ? "border-danger focus:border-danger"
              : "border-line hover:border-primary-300 focus:border-primary-500",
            rest.disabled && "opacity-45 cursor-not-allowed",
          )}
          {...rest}
        />
        {error ? (
          <p id={`${id}-error`} className="text-caption text-danger">{error}</p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-caption text-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
