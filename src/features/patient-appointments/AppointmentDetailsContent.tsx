import { useState } from "react";
import { CalendarDays, Clock, FileText, MapPin, MessageSquareText, Info, X } from "lucide-react";
import { Button } from "../../components/primitives/Button";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { useToast } from "../../components/overlay/Toast";
import { DocumentRow } from "../patient-documents/DocumentRow";
import { formatFullDate } from "../../lib/date";
import { formatFileSize } from "../../lib/format";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

/**
 * גוף פרטי התור - משותף למגירה/מודל ולעמוד המלא (כניסה ישירה לקישור).
 */
export function AppointmentDetailsContent({ appointment }: { appointment: Appointment }) {
  const { toast } = useToast();
  const [myDocs, setMyDocs] = useState<UploadedFile[]>([]);

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
      <section
        aria-label={he.patient.detailsTitle}
        className="rounded-lg border border-line bg-surface p-5 shadow-sm"
      >
        <h3 className="mb-2 text-h3 text-ink">{he.patient.detailsTitle}</h3>
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
      </section>

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

      {/* מסמכים מבית החולים - הונפקו על ידי המוסד, לקריאה בלבד */}
      <section
        aria-label={he.patient.documentsSection}
        className="rounded-lg border border-line bg-surface p-5 shadow-sm"
      >
        <h3 className="text-h3 text-ink">{he.patient.documentsSection}</h3>
        <p className="mt-0.5 text-caption text-muted">{he.patient.documentsSectionHint}</p>
        {appointment.documents.length === 0 ? (
          <p className="mt-3 text-muted">{he.patient.noAppointmentDocuments}</p>
        ) : (
          <ul className="mt-2">
            {appointment.documents.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </ul>
        )}
      </section>

      {/* המסמכים של המטופל - מקור אחר, ולכן מסגרת נפרדת */}
      {isUpcoming && (
        <section
          aria-label={he.patient.myDocuments}
          className="rounded-lg border border-line bg-surface p-5 shadow-sm"
        >
          <h3 className="text-h3 text-ink">{he.patient.myDocuments}</h3>
          <p className="mt-0.5 text-caption text-muted">{he.patient.myDocumentsHint}</p>

          {myDocs.length > 0 && (
            <ul className="mt-3">
              {myDocs.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex min-h-[56px] items-center gap-3 border-b border-line py-2 last:border-b-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-100">
                    <FileText className="h-5 w-5 text-primary-600" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{file.name}</span>
                    <span className="block text-caption text-muted" dir="ltr">
                      {formatFileSize(file.sizeKb)}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMyDocs((list) => list.filter((_, idx) => idx !== i))}
                    aria-label={`${he.patient.removeUpload}: ${file.name}`}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-danger"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3">
            {myDocs.length > 0 && (
              <p className="mb-2 font-semibold text-ink">{he.patient.addAnotherDocument}</p>
            )}
            <FileUpload
              value={null}
              onChange={(file) => {
                if (!file) return;
                setMyDocs((list) => [...list, file]);
                toast("success", he.patient.uploadDone);
              }}
            />
          </div>
        </section>
      )}

      {appointment.status === "completed" && appointment.resultSummary && (
        <section
          aria-label={he.patient.resultSummary}
          className="rounded-lg border border-line bg-surface p-5 shadow-sm"
        >
          <h3 className="text-h3 text-ink">{he.patient.resultSummary}</h3>
          <p className="mt-2 text-body">{appointment.resultSummary}</p>
        </section>
      )}
    </div>
  );
}
