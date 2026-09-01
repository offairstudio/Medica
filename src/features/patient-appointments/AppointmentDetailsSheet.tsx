import { Sheet } from "../../components/overlay/Sheet";
import { AppointmentDetailsContent } from "./AppointmentDetailsContent";
import { formatFullDate } from "../../lib/date";
import type { Appointment } from "../../types";

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
        <div className="flex flex-col gap-1">
          <h2 className="text-h2 text-ink">{appointment.title}</h2>
          <span className="text-muted">
            {formatFullDate(appointment.date)} · <span className="tnum">{appointment.time}</span>
          </span>
        </div>
      }
    >
      <AppointmentDetailsContent appointment={appointment} />
    </Sheet>
  );
}
