import { cn } from "../../lib/cn";

export function Badge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[11px] font-bold text-white tnum",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
