import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = { none: "", sm: "p-3", md: "p-4", lg: "p-6" };

export function Card({ padding = "md", className, ...rest }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border border-line bg-surface shadow-sm", paddings[padding], className)}
      {...rest}
    />
  );
}
