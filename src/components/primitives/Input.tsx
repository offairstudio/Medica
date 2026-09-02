import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  /** גובה מוגדל למסכי מטופל */
  tall?: boolean;
  /** שדה שקט - נראה כמו טקסט עד לריחוף או מיקוד */
  quiet?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, tall, quiet, className, id: idProp, ...rest }, ref) => {
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
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "w-full rounded-md border text-ink placeholder:text-muted transition-colors duration-fast",
              quiet ? "h-10 bg-transparent px-2" : "bg-surface px-3",
              quiet ? "" : tall ? "h-[52px]" : "h-11",
              icon && "ps-9",
              error
                ? "border-danger focus:border-danger"
                : quiet
                  ? "border-transparent hover:border-line focus:border-primary-500 focus:bg-surface"
                  : "border-line hover:border-primary-300 focus:border-primary-500",
              rest.disabled && "opacity-45 cursor-not-allowed",
            )}
            {...rest}
          />
        </div>
        {error ? (
          <p id={`${id}-error`} className="text-caption text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-caption text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
