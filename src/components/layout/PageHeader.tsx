import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: { to: string; label: string };
  actions?: ReactNode;
  /** כותרת גדולה למסכי מטופל */
  display?: boolean;
  className?: string;
}

export function PageHeader({ title, subtitle, backTo, actions, display, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-5 flex flex-col gap-1", className)}>
      {backTo && (
        <Link
          to={backTo.to}
          className="mb-1 inline-flex w-fit items-center gap-1 rounded text-caption font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
        >
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          {backTo.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={cn("text-ink", display ? "text-display" : "text-h1")}>{title}</h1>
        {actions}
      </div>
      {subtitle && <p className="text-caption text-muted">{subtitle}</p>}
    </div>
  );
}
