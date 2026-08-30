import { Link } from "react-router-dom";
import { Clock, MapPin, ArrowLeft, Paperclip } from "lucide-react";
import { cn } from "../../lib/cn";
import { KindChip } from "../../components/data/Chip";
import { formatDateBlock } from "../../lib/date";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

export interface AppointmentCardProps {
  appointment: Appointment;
  /** גוונים מאופקים לתורים קודמים */
  muted?: boolean;
  featured?: boolean;
  featuredLabel?: string;
}

export function AppointmentCard({ appointment, muted, featured, featuredLabel }: AppointmentCardProps) {
  const { day, month } = formatDateBlock(appointment.date);

  return (
    <Link
      to={`/p/appointment/${appointment.id}`}
      className={cn(
        "group block rounded-lg border bg-surface p-5 shadow-sm transition-all duration-fast hover:border-primary-300 hover:shadow-md",
        featured ? "border-primary-300 bg-gradient-to-l from-primary-50 to-white ring-1 ring-primary-100" : "border-line",
      )}
    >
      {featured && (
        <span className="mb-4 flex items-center justify-between gap-2 border-b border-primary-100 pb-3">
          <span className="rounded-full bg-primary-700 px-3 py-1 text-caption font-semibold text-white">התור הקרוב</span>
          {featuredLabel && <span className="text-caption font-semibold text-primary-700">{featuredLabel}</span>}
        </span>
      )}
      <div className="flex items-start gap-4">
        {/* בלוק תאריך */}
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md",
            muted ? "bg-canvas" : "bg-primary-100",
          )}
        >
          <span
            className={cn(
              "text-h2 font-bold leading-none tnum",
              muted ? "text-body" : "text-primary-700",
            )}
          >
            {day}
          </span>
          <span className={cn("text-[11px] font-semibold", muted ? "text-muted" : "text-primary-600")}>
            {month}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-start justify-between gap-2">
            <span className={cn("truncate text-h3", muted ? "text-body" : "text-ink")}>
              {appointment.title}
            </span>
            <KindChip kind={appointment.kind} />
          </span>
          <span className="mt-0.5 block truncate text-muted">
            {appointment.doctorName} · {appointment.departmentName}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              <span className="tnum">{appointment.time}</span>
            </span>
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{appointment.location}</span>
            </span>
          </span>

          {/* שורת מסמכים - לתורים קודמים עם קבצים */}
          {muted && appointment.documents.length > 0 && (
            <span className="mt-2 flex items-center gap-1.5 border-t border-line pt-2 text-caption text-body">
              <Paperclip className="h-3.5 w-3.5 text-muted" aria-hidden />
              {he.patient.documentsAttached(appointment.documents.length)}
              <span className="font-semibold text-primary-600">{he.common.download}</span>
            </span>
          )}

          {muted && appointment.resultSummary && (
            <span className="mt-1.5 block truncate text-caption text-muted">
              {appointment.resultSummary}
            </span>
          )}
        </span>
      </div>

      <span className="mt-3 flex items-center justify-end gap-1 border-t border-line pt-3 text-caption font-semibold text-primary-600 transition-colors duration-fast group-hover:text-primary-800">
        {he.patient.toAppointment}
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-fast group-hover:-translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
