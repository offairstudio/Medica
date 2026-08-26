import { useMemo, useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  FileUp,
  Info,
  MessageSquareText,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/primitives/Button";
import { Drawer } from "../../components/overlay/Drawer";
import { Modal } from "../../components/overlay/Modal";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { useToast } from "../../components/overlay/Toast";
import { formatFullDate } from "../../lib/date";
import type { Appointment } from "../../types";

export function AppointmentActionCenter({ appointment }: { appointment: Appointment }) {
  const { toast } = useToast();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState<"change" | "cancel" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [answers, setAnswers] = useState({ fasting: "", metal: "", notes: "" });

  const instructions = useMemo(
    () =>
      appointment.preparation?.length
        ? appointment.preparation
        : ["יש להגיע 15 דקות לפני מועד התור", "יש להצטייד בתעודה מזהה"],
    [appointment.preparation],
  );

  function addToCalendar() {
    const compactDate = appointment.date.replace(/-/g, "");
    const compactTime = appointment.time.replace(":", "") + "00";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${appointment.id}@medica.local`,
      `DTSTART:${compactDate}T${compactTime}`,
      `SUMMARY:${appointment.title}`,
      `LOCATION:${appointment.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `medica-${appointment.id}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast("success", "הזימון הורד וניתן להוסיף אותו ליומן");
  }

  function submitCheckIn() {
    if (!answers.fasting || !answers.metal || !attendance) {
      toast("error", "יש להשלים את כל שאלות החובה ואישור ההגעה");
      return;
    }
    setCheckInOpen(false);
    toast("success", "השאלון ואישור ההגעה נשמרו בהצלחה");
  }

  return (
    <>
      <section aria-label="פעולות לתור" className="rounded-xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-h2 text-ink">פעולות לקראת התור</h2>
            <p className="mt-1 text-caption text-muted">אפשר להשלים את כל ההכנות ישירות מהאזור האישי</p>
          </div>
          {attendance === "yes" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-caption font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" /> הגעה אושרה
            </span>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ActionButton icon={Info} label="צפייה בהנחיות" onClick={() => setInstructionsOpen(true)} />
          {appointment.remoteCheckIn && (
            <ActionButton icon={ClipboardCheck} label="שאלון ו-Check-in" onClick={() => setCheckInOpen(true)} />
          )}
          <ActionButton icon={FileUp} label={uploadedFile ? "הצילום הועלה" : "העלאת צילום קודם"} onClick={() => setUploadOpen(true)} />
          <ActionButton icon={CalendarPlus} label="סנכרון ליומן" onClick={addToCalendar} />
          <ActionButton icon={RefreshCw} label="שינוי מועד התור" onClick={() => setManageOpen("change")} />
          <ActionButton icon={XCircle} label="ביטול התור" onClick={() => setManageOpen("cancel")} danger />
        </div>
      </section>

      <Drawer open={instructionsOpen} onClose={() => setInstructionsOpen(false)} title="צפייה בהנחיות">
        <p className="font-semibold text-ink">{appointment.title}</p>
        <p className="mt-1 text-caption text-muted">
          {formatFullDate(appointment.date)} בשעה <span className="tnum">{appointment.time}</span>
        </p>
        <h3 className="mt-6 text-h3 text-ink">הנחיות רפואיות</h3>
        <ul className="mt-3 space-y-3">
          {instructions.map((instruction) => (
            <li key={instruction} className="flex gap-2 text-body">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              {instruction}
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-line pt-5">
          <Button
            fullWidth
            icon={<MessageSquareText className="h-4 w-4" />}
            onClick={() => toast("success", "ההנחיות נשלחו ב-SMS למספר המעודכן במערכת")}
          >
            שליחת ההנחיות ב-SMS
          </Button>
          <Button fullWidth variant="ghost" className="mt-2" onClick={() => setInstructionsOpen(false)}>
            חזרה לאזור האישי
          </Button>
        </div>
      </Drawer>

      <Modal
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        title="שאלון הכנה ו-Check-in מהבית"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCheckInOpen(false)}>ביטול</Button>
            <Button icon={<Send className="h-4 w-4" />} onClick={submitCheckIn}>שליחה</Button>
          </>
        }
      >
        <div className="space-y-5">
          <Question
            legend="האם פעלת לפי הנחיות הצום?"
            value={answers.fasting}
            name="fasting"
            onChange={(value) => setAnswers((current) => ({ ...current, fasting: value }))}
          />
          <Question
            legend="האם יש בגופך קוצב, שתל או גוף מתכתי?"
            value={answers.metal}
            name="metal"
            onChange={(value) => setAnswers((current) => ({ ...current, metal: value }))}
          />
          <label className="block">
            <span className="font-semibold text-ink">מידע נוסף לצוות</span>
            <textarea
              value={answers.notes}
              onChange={(event) => setAnswers((current) => ({ ...current, notes: event.target.value }))}
              className="mt-2 min-h-24 w-full rounded-md border border-line bg-surface p-3 text-ink focus:border-primary-500"
              placeholder="אפשר לציין רגישויות, תרופות או מידע חשוב"
            />
          </label>
          <fieldset className="rounded-md border border-primary-200 bg-primary-50 p-4">
            <legend className="px-1 font-semibold text-primary-800">אישור הגעה לתור</legend>
            <div className="mt-2 flex flex-wrap gap-5">
              <Radio label="אני מאשר/ת" checked={attendance === "yes"} onChange={() => setAttendance("yes")} />
              <Radio label="איני מאשר/ת" checked={attendance === "no"} onChange={() => setAttendance("no")} />
            </div>
          </fieldset>
        </div>
      </Modal>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="העלאת צילום או מסמך קודם"
        footer={<Button onClick={() => { setUploadOpen(false); if (uploadedFile) toast("success", "הקובץ צורף לתור בהצלחה"); }} disabled={!uploadedFile}>שמירת הקובץ</Button>}
      >
        <p className="mb-4 text-body">אפשר לצרף צילום, פענוח או מסמך רפואי רלוונטי לבדיקה.</p>
        <FileUpload value={uploadedFile} onChange={setUploadedFile} />
      </Modal>

      <Modal
        open={manageOpen !== null}
        onClose={() => setManageOpen(null)}
        title={manageOpen === "cancel" ? "ביטול התור" : "שינוי מועד התור"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setManageOpen(null)}>חזרה</Button>
            <Button
              variant={manageOpen === "cancel" ? "danger" : "primary"}
              onClick={() => {
                toast("info", manageOpen === "cancel" ? "בקשת הביטול התקבלה ותטופל על ידי המרפאה" : "מערכת שינוי התורים נפתחת (מדומה בפרוטוטייפ)");
                setManageOpen(null);
              }}
            >
              {manageOpen === "cancel" ? "שליחת בקשת ביטול" : "המשך לבחירת מועד"}
            </Button>
          </>
        }
      >
        <p>
          {manageOpen === "cancel"
            ? "הבקשה תועבר למרפאה. התור נשאר בתוקף עד לקבלת אישור ביטול."
            : "בחירת מועד חלופי מתבצעת במערכת הזימונים, ולאחריה התור יתעדכן באזור האישי."}
        </p>
      </Modal>
    </>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger }: { icon: typeof Info; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[52px] items-center gap-3 rounded-md border px-4 text-start font-semibold transition-colors duration-fast ${
        danger ? "border-danger/20 text-danger hover:bg-danger/5" : "border-primary-200 text-primary-700 hover:bg-primary-50"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

function Question({ legend, name, value, onChange }: { legend: string; name: string; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="font-semibold text-ink">{legend} <span className="text-danger">*</span></legend>
      <div className="mt-2 flex gap-5">
        <Radio name={name} label="כן" checked={value === "yes"} onChange={() => onChange("yes")} />
        <Radio name={name} label="לא" checked={value === "no"} onChange={() => onChange("no")} />
      </div>
    </fieldset>
  );
}

function Radio({ label, checked, onChange, name }: { label: string; checked: boolean; onChange: () => void; name?: string }) {
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-2">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-primary-600" />
      <span>{label}</span>
    </label>
  );
}
