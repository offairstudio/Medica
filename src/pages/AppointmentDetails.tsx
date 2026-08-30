import { Navigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Building2,
  MapPin,
  MessageSquareText,
  Hospital as HospitalIcon,
  Info,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/data/Card";
import { Chip, HospitalChip, KindChip } from "../components/data/Chip";
import { Button } from "../components/primitives/Button";
import { EmptyState } from "../components/data/EmptyState";
import { useToast } from "../components/overlay/Toast";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { appointments } from "../mock/appointments";
import { formatFullDate } from "../lib/date";
import { he } from "../i18n/he";

const statusColor = { upcoming: "info", completed: "success", cancelled: "danger" } as const;

export function AppointmentDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const appointment = appointments.find((a) => a.id === id);

  if (!appointment) return <Navigate to="/p" replace />;

  const rows = [
    { icon: CalendarDays, label: he.patient.details.date, value: formatFullDate(appointment.date) },
    {
      icon: Clock,
      label: he.patient.details.time,
      value: <span className="tnum">{appointment.time}</span>,
    },
    { icon: Stethoscope, label: he.patient.details.doctor, value: appointment.doctorName },
    { icon: Building2, label: he.patient.details.department, value: appointment.departmentName },
    {
      icon: HospitalIcon,
      label: he.patient.details.hospital,
      value: <HospitalChip hospital={appointment.hospital} />,
    },
    { icon: MapPin, label: he.patient.details.location, value: appointment.location },
  ];

  const prep = appointment.preparation ?? [];
  const isUpcoming = appointment.status === "upcoming";

  return (
    <PatientShell>
      <PageHeader
        title={appointment.title}
        display
        backTo={{ to: isUpcoming ? "/p" : "/p/results", label: he.patient.backToAppointments }}
        actions={
          <span className="flex items-center gap-2">
            <KindChip kind={appointment.kind} />
            <Chip color={statusColor[appointment.status]}>
              {he.patient.statuses[appointment.status]}
            </Chip>
          </span>
        }
      />

      <div className="flex flex-col gap-5">
        {/* כרטיס פרטים - אפיון 7.11 סעיף 3 */}
        <Card padding="lg">
          <dl>
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3 border-b border-line py-3 last:border-b-0"
              >
                <row.icon className="h-4 w-4 shrink-0 text-primary-400" aria-hidden />
                <dt className="w-24 shrink-0 text-caption text-muted">{row.label}</dt>
                <dd className="text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* הנחיות הכנה - רשימת נקודות; שליחה ב-SMS לתור עתידי */}
        {prep.length > 0 && (
          <section
            aria-label={he.patient.preparation}
            className="rounded-lg border border-primary-200 bg-primary-50 p-5"
          >
            <h2 className="mb-2 flex items-center gap-2 text-h3 text-primary-800">
              <Info className="h-4 w-4 text-primary-500" aria-hidden />
              {he.patient.preparation}
            </h2>
            <ul className="list-inside list-disc text-primary-800">
              {prep.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {isUpcoming && (
              <Button
                variant="secondary"
                className="mt-4"
                icon={<MessageSquareText className="h-4 w-4" />}
                onClick={() => toast("success", he.patient.instructionsSent)}
              >
                {he.patient.sendInstructionsSms}
              </Button>
            )}
          </section>
        )}

        {/* מסמכים רפואיים */}
        <section aria-label={he.patient.documentsSection}>
          <h2 className="mb-3 text-h2 text-ink">{he.patient.documentsSection}</h2>
          {appointment.documents.length === 0 ? (
            <EmptyState illustration="file" title={he.patient.noAppointmentDocuments} />
          ) : (
            <ul className="rounded-lg border border-line bg-surface px-4 shadow-sm">
              {appointment.documents.map((d) => (
                <DocumentRow key={d.id} doc={d} />
              ))}
            </ul>
          )}
        </section>

        {/* תקציר תוצאה */}
        {appointment.status === "completed" && appointment.resultSummary && (
          <Card padding="lg">
            <h2 className="mb-2 text-h3 text-ink">{he.patient.resultSummary}</h2>
            <p className="text-body">{appointment.resultSummary}</p>
          </Card>
        )}
      </div>
    </PatientShell>
  );
}
