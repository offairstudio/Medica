import { Navigate, useParams } from "react-router-dom";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { AppointmentDetailsContent } from "../features/patient-appointments/AppointmentDetailsContent";
import { appointments } from "../mock/appointments";
import { t } from "../i18n";

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
        title={appointment.doctorName}
        subtitle={appointment.title}
        display
        backTo={{ to: isUpcoming ? "/p/appointments" : "/p/appointments/past", label: t.patient.backToAppointments }}
      />
      <AppointmentDetailsContent appointment={appointment} />
    </PatientShell>
  );
}
