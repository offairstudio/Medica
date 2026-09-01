import { useState } from "react";
import { CalendarDays, Clock, MapPin, MessageSquareText, Info } from "lucide-react";
import { Card } from "../../components/data/Card";
import { Button } from "../../components/primitives/Button";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { EmptyState } from "../../components/data/EmptyState";
import { useToast } from "../../components/overlay/Toast";
import { DocumentRow } from "../patient-documents/DocumentRow";
import { formatFullDate } from "../../lib/date";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

/**
 * גוף פרטי התור - משותף למגירה/מודל ולעמוד המלא (כניסה ישירה לקישור).
 */
export function AppointmentDetailsContent({ appointment }: { appointment: Appointment }) {
  const { toast } = useToast();
  const [upload, setUpload] = useState<UploadedFile | null>(null);

  // הדרישות מגדירות לבדיקה: תאריך, שעה, שם שיווקי (הכותרת) וכתובת המכון בלבד
  const rows = [
    { icon: CalendarDays, label: he.patient.details.date, value: formatFullDate(appointment.date) },
    {
      icon: Clock,
      label: he.patient.details.time,
      value: <span className="tnum">{appointment.time}</span>,
    },
    { icon: MapPin, label: he.patient.details.location, value: appointment.location },
  ];

  const prep = appointment.preparation ?? [];
  const isUpcoming = appointment.status === "upcoming";

  return (
    <div className="flex flex-col gap-5">
      {/* כרטיס פרטים - אפיון 7.11 סעיף 3 */}
      <Card padding="lg">
        <dl>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex min-h-[52px] items-center gap-3 border-b border-line py-3 last:border-b-0"
            >
              <row.icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
              <dt className="w-28 shrink-0 font-semibold text-body">{row.label}</dt>
              <dd className="font-semibold text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* הנחיות הכנה */}
      {prep.length > 0 && (
        <section
          aria-label={he.patient.preparation}
          className="rounded-lg border border-primary-200 bg-primary-50 p-5"
        >
          <h3 className="mb-2 flex items-center gap-2 text-h3 text-primary-800">
            <Info className="h-4 w-4 text-primary-500" aria-hidden />
            {he.patient.preparation}
          </h3>
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

      {/* העלאת מסמכים לקראת התור */}
      {isUpcoming && (
        <section aria-label={he.patient.uploadTitle} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <h3 className="text-h3 text-ink">{he.patient.uploadTitle}</h3>
          <p className="mb-4 mt-1 text-muted">{he.patient.uploadHint}</p>
          <FileUpload
            value={upload}
            onChange={(file) => {
              setUpload(file);
              if (file) toast("success", he.patient.uploadDone);
            }}
          />
        </section>
      )}

      {/* מסמכים רפואיים */}
      <section aria-label={he.patient.documentsSection}>
        <h3 className="mb-3 text-h3 text-ink">{he.patient.documentsSection}</h3>
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
          <h3 className="mb-2 text-h3 text-ink">{he.patient.resultSummary}</h3>
          <p className="text-body">{appointment.resultSummary}</p>
        </Card>
      )}
    </div>
  );
}
