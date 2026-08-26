import { cn } from "../../lib/cn";

export function BrandMark({ inverse, compact, className }: { inverse?: boolean; compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src="/brand/medica-logo.svg"
        alt="Medica"
        className={cn(
          "block h-auto object-contain",
          compact ? "w-[108px]" : "w-[148px] sm:w-[164px]",
          inverse && "brightness-0 invert",
        )}
      />
    </span>
  );
}
