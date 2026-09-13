import { Sheet } from "../../components/overlay/Sheet";
import { AppointmentDetailsContent } from "./AppointmentDetailsContent";
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
      title={appointment.doctorName}
      titleSlot={
        <div className="flex flex-col gap-0.5">
          <h2 className="text-h2 text-ink">{appointment.doctorName}</h2>
          <span className="text-muted">{appointment.title}</span>
        </div>
      }
    >
      <AppointmentDetailsContent appointment={appointment} />
    </Sheet>
  );
}
