import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, MapPin, ArrowLeft, Paperclip } from "lucide-react";
import { cn } from "../../lib/cn";
import { HospitalChip } from "../../components/data/Chip";
import { HOSPITALS } from "../../mock/hospitals";
import { formatDateBlock } from "../../lib/date";
import { t } from "../../i18n";
import type { Appointment } from "../../types";

export interface AppointmentCardProps {
  appointment: Appointment;
  /** גוונים מאופקים לתורים קודמים */
  muted?: boolean;
  featured?: boolean;
  /** טקסט בקצה שורת ההדגשה - למשל "בעוד 3 ימים" */
  featuredLabel?: string;
  /** תגית בתחילת שורת ההדגשה. יש להשמיט כשהכותרת שמעל הכרטיס כבר אומרת זאת */
  featuredBadge?: string;
  /** תוכן נוסף בתוך הכרטיס, מעל שורת הפעולה - למשל הנחיות הכנה */
  extra?: ReactNode;
}

export function AppointmentCard({ appointment, muted, featured, featuredLabel, featuredBadge, extra }: AppointmentCardProps) {
  const location = useLocation();
  const { day, month } = formatDateBlock(appointment.date);
  // הכרטיס נושא את זהות המרכז שבו מתקיים הטיפול, כמו רשומת ניתוח ביומן המנתח
  const hospital = HOSPITALS[appointment.hospital];

  return (
    <Link
      to={`/p/appointment/${appointment.id}`}
      state={{ background: location }}
      className={cn(
        "group block rounded-lg p-5 transition-all duration-fast hover:shadow-md",
        // תורים קודמים נשארים מאופקים; תור עתידי נצבע בגוון המרכז
        muted
          ? "border border-line bg-surface shadow-sm"
          : cn(hospital.softClass, featured && "ring-1 ring-inset ring-white/60"),
      )}
    >
      {featured && (featuredBadge || featuredLabel) && (
        <span className="mb-4 flex items-center justify-between gap-2 border-b border-white/70 pb-3">
          {featuredBadge && (
            <span className="rounded-full bg-primary-700 px-3 py-1 text-caption font-semibold text-white">
              {featuredBadge}
            </span>
          )}
          {featuredLabel && (
            <span className="text-caption font-semibold text-primary-700">{featuredLabel}</span>
          )}
        </span>
      )}
      <div className="flex items-start gap-4">
        {/* פס בצבע המרכז - אותו סימון של בלוק זמן ביומן המנתח */}
        <span
          aria-hidden
          className={cn(
            "w-1 shrink-0 self-stretch rounded-full",
            muted ? "bg-line" : hospital.accentClass,
          )}
        />

        {/* בלוק תאריך */}
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md",
            muted ? "bg-surface-2" : undefined,
          )}
        >
          <span
            className={cn(
              "text-h2 font-bold leading-none tnum",
              muted ? "text-body" : hospital.textClass,
            )}
          >
            {day}
          </span>
          <span className={cn("text-[12px] font-semibold", muted ? "text-muted" : hospital.textClass)}>
            {month}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-h3", muted ? "text-body" : "text-ink")}>
            {appointment.doctorName}
          </span>
          <span className="mt-0.5 block truncate text-muted">{appointment.title}</span>
          <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted">
            <HospitalChip hospital={appointment.hospital} compact />
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              <span className="tnum">{appointment.time}</span>
            </span>
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{appointment.location}</span>
            </span>
            {/* חיווי בלבד - הקבצים עצמם נפתחים בפרטי התור */}
            {appointment.documents.length > 0 && (
              <span className="flex shrink-0 items-center gap-1">
                <Paperclip className="h-3.5 w-3.5" aria-hidden />
                {t.patient.documentsAttached(appointment.documents.length)}
              </span>
            )}
            <span className="ms-auto flex shrink-0 items-center gap-1 font-semibold text-primary-600 transition-colors duration-fast group-hover:text-primary-800">
              {t.patient.toAppointment}
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-fast group-hover:-translate-x-0.5" aria-hidden />
            </span>
          </span>
        </span>
      </div>

      {extra && (
        <span
          className={cn("mt-4 block border-t pt-4", muted ? "border-line" : "border-white/70")}
        >
          {extra}
        </span>
      )}
    </Link>
  );
}
