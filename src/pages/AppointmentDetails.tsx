import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Building2,
  Download,
  MapPin,
  Hospital as HospitalIcon,
  Info,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/data/Card";
import { Chip, HospitalChip, KindChip } from "../components/data/Chip";
import { Checkbox } from "../components/primitives/Checkbox";
import { EmptyState } from "../components/data/EmptyState";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { ExternalAction } from "../features/patient-appointments/ExternalAction";
import { AppointmentActionCenter } from "../features/patient-appointments/AppointmentActionCenter";
import { appointments } from "../mock/appointments";
import { formatFullDate } from "../lib/date";
import { he } from "../i18n/he";

const statusColor = { upcoming: "info", completed: "success", cancelled: "danger" } as const;

export function AppointmentDetails() {
  const { id } = useParams();
  const appointment = appointments.find((a) => a.id === id);
  // צ'ק-ליסט הכנה לתור - מצב מקומי בלבד
  const [checked, setChecked] = useState<number[]>([]);

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
        backTo={{ to: isUpcoming ? "/p" : "/p?tab=past", label: he.patient.backToAppointments }}
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
        {/* כרטיס פרטים */}
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

          {/* מסמך זימון + ניהול התור במערכת החיצונית - לתור עתידי */}
          {isUpcoming && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="/mock-files/referral.pdf"
                download={`מסמך-זימון-${appointment.title}.pdf`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line px-4 font-semibold text-primary-600 transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50"
              >
                <Download className="h-4 w-4" aria-hidden />
                {he.patient.summonsDocument}
              </a>
              <ExternalAction label={he.patient.externalManage} variant="link" />
            </div>
          )}
        </Card>

        {isUpcoming && <AppointmentActionCenter appointment={appointment} />}

        {/* הנחיות הכנה - עם צ'ק-ליסט אינטראקטיבי */}
        {prep.length > 0 && isUpcoming && (
          <section
            aria-label={he.patient.preparation}
            className="rounded-lg border border-primary-200 bg-primary-50 p-5"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-h3 text-primary-800">
                <Info className="h-4 w-4 text-primary-500" aria-hidden />
                {he.patient.preparation}
              </h2>
              <span className="text-caption font-semibold text-primary-600 tnum">
                {checked.length}/{prep.length} הושלמו
              </span>
            </div>
            <ul>
              {prep.map((p, i) => (
                <li key={i}>
                  <Checkbox
                    label={p}
                    checked={checked.includes(i)}
                    onChange={(e) =>
                      setChecked((list) =>
                        e.target.checked ? [...list, i] : list.filter((x) => x !== i),
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {prep.length > 0 && !isUpcoming && (
          <section className="rounded-lg border border-primary-200 bg-primary-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 text-h3 text-primary-800">
              <Info className="h-4 w-4 text-primary-500" aria-hidden />
              {he.patient.preparation}
            </h2>
            <ul className="list-inside list-disc text-primary-800">
              {prep.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
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
