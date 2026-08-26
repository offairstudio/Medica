import { Activity } from "lucide-react";
import { cn } from "../../lib/cn";

export function BrandMark({ inverse, compact, className }: { inverse?: boolean; compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[11px] shadow-sm",
          inverse ? "bg-white text-primary-800" : "bg-primary-800 text-white",
        )}
        aria-hidden
      >
        <Activity className="h-[19px] w-[19px]" strokeWidth={2.25} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={cn("block text-[19px] font-bold tracking-[-0.025em]", inverse ? "text-white" : "text-primary-900")}>Medica</span>
          <span className={cn("mt-1 block text-[10px] font-semibold tracking-[0.08em]", inverse ? "text-white/65" : "text-muted")}>PRIVATE MEDICAL CARE</span>
        </span>
      )}
    </span>
  );
}
