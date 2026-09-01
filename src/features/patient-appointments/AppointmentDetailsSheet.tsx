import { Sheet } from "../../components/overlay/Sheet";
import { Chip, KindChip } from "../../components/data/Chip";
import { AppointmentDetailsContent } from "./AppointmentDetailsContent";
import { formatFullDate } from "../../lib/date";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

const statusColor = { upcoming: "info", completed: "success", cancelled: "danger" } as const;

/**
 * פרטי התור כשכבת-על מעל הרשימה: מגירה תחתונה במובייל, דיאלוג בדסקטופ.
 * הסגירה מחזירה לרשימה שממנה נכנסו.
 */
export function AppointmentDetailsSheet({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  return (
    <Sheet
      open
      onClose={onClose}
      title={appointment.title}
      titleSlot={
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-ink">{appointment.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <KindChip kind={appointment.kind} />
            <Chip color={statusColor[appointment.status]}>
              {he.patient.statuses[appointment.status]}
            </Chip>
            <span className="text-caption text-muted">
              {formatFullDate(appointment.date)} · <span className="tnum">{appointment.time}</span>
            </span>
          </div>
        </div>
      }
    >
      <AppointmentDetailsContent appointment={appointment} />
    </Sheet>
  );
}
