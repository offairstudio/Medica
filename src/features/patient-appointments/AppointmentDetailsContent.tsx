import { useState } from "react";
import { CalendarDays, Clock, DoorOpen, FileText, Hospital, MapPin, MessageSquareText, X } from "lucide-react";
import { Button } from "../../components/primitives/Button";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { useToast } from "../../components/overlay/Toast";
import { DocumentRow } from "../patient-documents/DocumentRow";
import { CentreSignature } from "../../components/data/CentreArt";
import { SectionCard } from "../../components/data/SectionCard";
import { HOSPITALS } from "../../mock/hospitals";
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
    {
      icon: Hospital,
      label: t.patient.details.hospital,
      // הצבע כבר נמצא ברקע של ראש הכרטיס, ולכן כאן הלוגו מופיע בצבע המרכז על לבן
      value: (
        <span className="inline-flex items-center gap-1.5">
          <CentreSignature hospital={appointment.hospital} tone="centre" height={12} />
          <span className="sr-only">{HOSPITALS[appointment.hospital].name}</span>
        </span>
      ),
    },
    { icon: MapPin, label: t.patient.details.address, value: HOSPITALS[appointment.hospital].address },
    { icon: DoorOpen, label: t.patient.details.location, value: appointment.location },
  ];

  const prep = appointment.preparation ?? [];
  const isUpcoming = appointment.status === "upcoming";

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title={t.patient.detailsTitle} bodyClassName="px-5 pb-4 pt-1">
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
      </SectionCard>

      {/* הנחיות הכנה */}
      {prep.length > 0 && (
        <SectionCard title={t.patient.preparation} variant="accent">
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
        </SectionCard>
      )}

      {/* מסמכים מבית החולים - הונפקו על ידי המוסד, לקריאה בלבד */}
      <SectionCard title={t.patient.documentsSection} hint={t.patient.documentsSectionHint}>
        {appointment.documents.length === 0 ? (
          <p className="text-muted">{t.patient.noAppointmentDocuments}</p>
        ) : (
          <ul>
            {appointment.documents.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </ul>
        )}
      </SectionCard>

      {/* המסמכים של המטופל - מקור אחר, ולכן מסגרת נפרדת */}
      {isUpcoming && (
        <SectionCard title={t.patient.myDocuments} hint={t.patient.myDocumentsHint}>
          {myDocs.length > 0 && (
            <ul>
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

          <div className={myDocs.length > 0 ? "mt-3" : undefined}>
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
        </SectionCard>
      )}

      {appointment.status === "completed" && appointment.resultSummary && (
        <SectionCard title={t.patient.resultSummary}>
          <p className="text-body">{appointment.resultSummary}</p>
        </SectionCard>
      )}
    </div>
  );
}
