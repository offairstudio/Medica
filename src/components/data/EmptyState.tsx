import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
  illustration?: "calendar" | "file" | "search" | "inbox";
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function EmptyStateGraphic({
  type,
}: {
  type: NonNullable<EmptyStateProps["illustration"]>;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 72 72"
      className="h-[72px] w-[72px] text-primary-700"
      aria-hidden
      focusable="false"
    >
      {type === "calendar" && (
        <>
          <rect x="8.5" y="13.5" width="55" height="49" rx="10" fill="currentColor" opacity=".08" />
          <rect x="8.5" y="13.5" width="55" height="49" rx="10" {...shared} />
          <path d="M9 28h54M23 8v12M49 8v12" {...shared} />
          <path d="m41.5 39.5 13 13m0-13-13 13" {...shared} stroke="#9A89C8" strokeWidth="3.5" />
        </>
      )}

      {type === "file" && (
        <>
          <path d="M15 7.5h28l14 14v43H15v-57Z" fill="currentColor" opacity=".08" />
          <path d="M15 7.5h28l14 14v43H15v-57Z" {...shared} />
          <path d="M43 7.5v14h14M24 33h24M24 42h15" {...shared} />
          <path d="m42 49 11 11m0-11L42 60" {...shared} stroke="#9A89C8" strokeWidth="3.5" />
        </>
      )}

      {type === "search" && (
        <>
          <circle cx="31" cy="31" r="21.5" fill="currentColor" opacity=".08" />
          <circle cx="31" cy="31" r="21.5" {...shared} />
          <path d="m47 47 16 16" {...shared} strokeWidth="4" />
          <path d="M25 25.5c1.5-3.5 4-5.5 7.5-5.5 4.5 0 7.5 2.5 7.5 6 0 5-6.5 5.5-6.5 10" {...shared} stroke="#9A89C8" />
          <circle cx="33.5" cy="44.5" r="2" fill="#9A89C8" />
        </>
      )}

      {type === "inbox" && (
        <>
          <path d="m10 26 8-15h36l8 15v35H10V26Z" fill="currentColor" opacity=".08" />
          <path d="m10 26 8-15h36l8 15v35H10V26Z" {...shared} />
          <path d="M10 41h15c1.5 6 5.2 9 11 9s9.5-3 11-9h15" {...shared} />
          <path d="M36 17v17m-7-7 7 7 7-7" {...shared} stroke="#9A89C8" strokeWidth="3.5" />
        </>
      )}
    </svg>
  );
}

export function EmptyState({
  illustration = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <EmptyStateGraphic type={illustration} />
      <p className="text-h3 text-ink">{title}</p>
      {description && <p className="max-w-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
