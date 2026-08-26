import { useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  error?: boolean;
}

export function Radio({ label, error, className, id: idProp, ...rest }: RadioProps) {
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
        <input id={id} type="radio" className="peer sr-only" {...rest} />
        <span
          aria-hidden
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border bg-surface transition-colors duration-fast",
            "peer-checked:border-primary-600 peer-checked:[&>span]:scale-100",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-500",
            error ? "border-danger" : "border-line hover:border-primary-400",
          )}
        >
          <span className="h-2.5 w-2.5 scale-0 rounded-full bg-primary-600 transition-transform duration-fast" />
        </span>
      </span>
      {label}
    </label>
  );
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  inline?: boolean;
  className?: string;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  inline = true,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn("flex flex-col gap-1", className)}>
      {label && (
        <legend
          className={cn("mb-1 text-caption font-semibold", error ? "text-danger" : "text-body")}
        >
          {label}
        </legend>
      )}
      <div className={cn("flex gap-x-5 gap-y-0", inline ? "flex-row flex-wrap" : "flex-col")}>
        {options.map((o) => (
          <Radio
            key={o.value}
            name={name}
            label={o.label}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            error={!!error}
          />
        ))}
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
    </fieldset>
  );
}
