import { useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  error?: boolean;
}

export function Checkbox({ label, error, className, id: idProp, ...rest }: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-[44px] cursor-pointer select-none items-center gap-2.5 text-body",
        rest.disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span className="relative inline-flex">
        <input id={id} type="checkbox" className="peer sr-only" {...rest} />
        <span
          aria-hidden
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-[6px] border bg-surface text-transparent transition-colors duration-fast",
            "peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-white",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500",
            error ? "border-danger" : "border-line hover:border-primary-400",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      </span>
      {label}
    </label>
  );
}
