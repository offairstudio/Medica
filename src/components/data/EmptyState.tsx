import type { ReactNode } from "react";
import { CalendarX2, FileX2, SearchX, Inbox } from "lucide-react";
import { cn } from "../../lib/cn";

export interface EmptyStateProps {
  illustration?: "calendar" | "file" | "search" | "inbox";
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const icons = {
  calendar: CalendarX2,
  file: FileX2,
  search: SearchX,
  inbox: Inbox,
};

export function EmptyState({
  illustration = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[illustration];
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
        <Icon className="h-8 w-8 text-primary-300" aria-hidden />
      </span>
      <p className="text-h3 text-ink">{title}</p>
      {description && <p className="max-w-sm text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
