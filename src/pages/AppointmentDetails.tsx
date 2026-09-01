import { Navigate, useParams } from "react-router-dom";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { AppointmentDetailsContent } from "../features/patient-appointments/AppointmentDetailsContent";
import { appointments } from "../mock/appointments";
import { he } from "../i18n/he";

/**
 * עמוד פרטי תור מלא - נשמר לכניסה ישירה לקישור או לרענון.
 * בניווט מתוך הרשימה מוצגת במקומו שכבת-על (AppointmentDetailsSheet).
 */
export function AppointmentDetails() {
  const { id } = useParams();
  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) return <Navigate to="/p" replace />;

  const isUpcoming = appointment.status === "upcoming";

  return (
    <PatientShell>
      <PageHeader
        title={appointment.title}
        display
        backTo={{ to: isUpcoming ? "/p/appointments" : "/p/appointments/past", label: he.patient.backToAppointments }}
      />
      <AppointmentDetailsContent appointment={appointment} />
    </PatientShell>
  );
}
