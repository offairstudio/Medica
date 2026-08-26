import { useId } from "react";
import { cn } from "../../lib/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-[44px] cursor-pointer select-none items-center gap-2.5 text-body",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "flex h-6 w-11 items-center rounded-full px-0.5 transition-colors duration-base",
            checked ? "bg-primary-600" : "bg-line",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500",
          )}
        >
          <span
            className={cn(
              "h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-base",
              checked && "-translate-x-5",
            )}
          />
        </span>
      </span>
      {label}
    </label>
  );
}
