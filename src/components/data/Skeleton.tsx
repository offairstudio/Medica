import { cn } from "../../lib/cn";

export interface SkeletonProps {
  variant?: "line" | "block" | "circle";
  className?: string;
}

export function Skeleton({ variant = "line", className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "skeleton-pulse block bg-line/70",
        variant === "line" && "h-4 w-full rounded",
        variant === "block" && "h-24 w-full rounded-md",
        variant === "circle" && "h-9 w-9 rounded-full",
        className,
      )}
    />
  );
}
