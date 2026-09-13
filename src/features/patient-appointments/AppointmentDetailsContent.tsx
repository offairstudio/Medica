import { useState } from "react";
import { CalendarDays, Clock, FileText, MapPin, MessageSquareText, Info, X } from "lucide-react";
import { Button } from "../../components/primitives/Button";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { useToast } from "../../components/overlay/Toast";
import { DocumentRow } from "../patient-documents/DocumentRow";
import { HospitalChip } from "../../components/data/Chip";
import { HOSPITALS } from "../../mock/hospitals";
import { cn } from "../../lib/cn";
import { formatFullDate } from "../../lib/date";
import { formatFileSize } from "../../lib/format";
import { t } from "../../i18n";
import type { Appointment } from "../../types";

/**
 * גוף פרטי התור - משותף למגירה/מודל ולעמוד המלא (כניסה ישירה לקישור).
 */
export function AppointmentDetailsContent({ appointment }: { appointment: Appointment }) {
  const { toast } = useToast();
  const [myDocs, setMyDocs] = useState<UploadedFile[]>([]);

  // הדרישות מגדירות לבדיקה: תאריך, שעה, שם שיווקי (הכותרת) וכתובת המכון בלבד
  const rows = [
    { icon: CalendarDays, label: t.patient.details.date, value: formatFullDate(appointment.date) },
    {
      icon: Clock,
      label: t.patient.details.time,
      value: <span className="tnum">{appointment.time}</span>,
    },
    { icon: MapPin, label: t.patient.details.location, value: appointment.location },
  ];

  const prep = appointment.preparation ?? [];
  const isUpcoming = appointment.status === "upcoming";
  const hospital = HOSPITALS[appointment.hospital];

  return (
    <div className="flex flex-col gap-5">
      {/* כרטיס אחד: המרכז בראשו בגוון שלו, ומתחתיו פרטי התור */}
      <section
        aria-label={t.patient.detailsTitle}
        className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm"
      >
        <div className={cn("flex items-start gap-3 px-5 py-4", hospital.softClass)}>
          <span aria-hidden className={cn("w-1 shrink-0 self-stretch rounded-full", hospital.accentClass)} />
          <div className="min-w-0 flex-1">
            <h3 className="text-h3 text-ink">{t.patient.detailsTitle}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <HospitalChip hospital={appointment.hospital} compact />
              <p className="flex items-center gap-1.5 text-body">
                <MapPin className={cn("h-4 w-4 shrink-0", hospital.textClass)} aria-hidden />
                {hospital.address}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 pt-1">
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
        </div>
      </section>

      {/* הנחיות הכנה */}
      {prep.length > 0 && (
        <section
          aria-label={t.patient.preparation}
          className="rounded-lg border border-primary-200 bg-primary-50 p-5"
        >
          <h3 className="mb-2 flex items-center gap-2 text-h3 text-primary-800">
            <Info className="h-4 w-4 text-primary-500" aria-hidden />
            {t.patient.preparation}
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
              onClick={() => toast("success", t.patient.instructionsSent)}
            >
              {t.patient.sendInstructionsSms}
            </Button>
          )}
        </section>
      )}

      {/* מסמכים מבית החולים - הונפקו על ידי המוסד, לקריאה בלבד */}
      <section
        aria-label={t.patient.documentsSection}
        className="rounded-lg border border-line bg-surface p-5 shadow-sm"
      >
        <h3 className="text-h3 text-ink">{t.patient.documentsSection}</h3>
        <p className="mt-0.5 text-caption text-muted">{t.patient.documentsSectionHint}</p>
        {appointment.documents.length === 0 ? (
          <p className="mt-3 text-muted">{t.patient.noAppointmentDocuments}</p>
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
          aria-label={t.patient.myDocuments}
          className="rounded-lg border border-line bg-surface p-5 shadow-sm"
        >
          <h3 className="text-h3 text-ink">{t.patient.myDocuments}</h3>
          <p className="mt-0.5 text-caption text-muted">{t.patient.myDocumentsHint}</p>

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
                    aria-label={`${t.patient.removeUpload}: ${file.name}`}
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
              <p className="mb-2 font-semibold text-ink">{t.patient.addAnotherDocument}</p>
            )}
            <FileUpload
              value={null}
              onChange={(file) => {
                if (!file) return;
                setMyDocs((list) => [...list, file]);
                toast("success", t.patient.uploadDone);
              }}
            />
          </div>
        </section>
      )}

      {appointment.status === "completed" && appointment.resultSummary && (
        <section
          aria-label={t.patient.resultSummary}
          className="rounded-lg border border-line bg-surface p-5 shadow-sm"
        >
          <h3 className="text-h3 text-ink">{t.patient.resultSummary}</h3>
          <p className="mt-2 text-body">{appointment.resultSummary}</p>
        </section>
      )}
    </div>
  );
}
