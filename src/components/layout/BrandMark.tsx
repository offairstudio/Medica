import { cn } from "../../lib/cn";

export function BrandMark({
  inverse,
  compact,
  /** רק סמל המותג, ללא הטקסט - לסרגל מוקטן */
  mark,
  className,
}: {
  inverse?: boolean;
  compact?: boolean;
  mark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src={mark ? "/brand/medica-mark.svg" : "/brand/medica-logo.svg"}
        alt="Medica"
        className={cn(
          "block h-auto object-contain",
          mark ? "w-[22px]" : compact ? "w-[108px]" : "w-[148px] sm:w-[164px]",
          inverse && "brightness-0 invert",
        )}
      />
    </span>
  );
}
