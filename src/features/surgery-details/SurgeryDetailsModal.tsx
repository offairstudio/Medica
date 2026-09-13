import { useState } from "react";
import { Pencil } from "lucide-react";
import { Sheet } from "../../components/overlay/Sheet";
import { Modal } from "../../components/overlay/Modal";
import { HOSPITALS } from "../../mock/hospitals";
import { CentreSignature } from "../../components/data/CentreArt";
import { formatFullDate, timeRange } from "../../lib/date";
import { Button } from "../../components/primitives/Button";
import { useToast } from "../../components/overlay/Toast";
import { useData } from "../../state/data";
import { t } from "../../i18n";
import {
  SurgeryViewContent,
  SurgeryEditForm,
  draftFromSurgery,
  draftToPatch,
  validateDraft,
  type Draft,
} from "./SurgeryDetailsContent";

export interface SurgeryDetailsModalProps {
  surgeryId: string;
  /** פתיחה ישירה במצב עריכה */
  startInEdit?: boolean;
  onClose: () => void;
}

/**
 * פרטי ניתוח כפופאפ מעל המסך הנוכחי - צפייה ועריכה מלאה,
 * בלי לעזוב את היומן שמאחור.
 */
export function SurgeryDetailsModal({ surgeryId, startInEdit, onClose }: SurgeryDetailsModalProps) {
  const { surgeries, updateSurgery } = useData();
  const { toast } = useToast();
  const surgery = surgeries.find((s) => s.id === surgeryId);

  const [editing, setEditing] = useState(!!startInEdit);
  const [draft, setDraft] = useState<Draft | null>(() =>
    startInEdit && surgery ? draftFromSurgery(surgery) : null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  // אזהרה לפני ויתור על שינויים שלא נשמרו: "close" סוגר את המגירה,
  // "cancel" חוזר לצפייה בלי לסגור אותה
  const [leaveIntent, setLeaveIntent] = useState<"close" | "cancel" | null>(null);
  const dirty =
    editing && draft && surgery
      ? JSON.stringify(draft) !== JSON.stringify(draftFromSurgery(surgery))
      : false;

  if (!surgery) return null;

  function patch(p: Partial<Draft>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(p)) delete next[k];
      if ("procedures" in p) {
        for (const k of Object.keys(next)) if (k.startsWith("procedure-")) delete next[k];
      }
      return next;
    });
  }

  function startEdit() {
    setDraft(draftFromSurgery(surgery!));
    setErrors({});
    setEditing(true);
  }

  function cancelEdit() {
    if (dirty) {
      setLeaveIntent("cancel");
      return;
    }
    setDraft(null);
    setErrors({});
    setEditing(false);
  }

  /** ויתור על השינויים אחרי אישור: או חזרה לצפייה, או סגירת המגירה */
  function discardChanges() {
    const intent = leaveIntent;
    setLeaveIntent(null);
    if (intent === "close") {
      onClose();
      return;
    }
    setDraft(null);
    setErrors({});
    setEditing(false);
  }

  function save() {
    if (!draft || !surgery) return;
    const errs = validateDraft(draft);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("error", t.wizard.fixErrors);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      updateSurgery(surgery.id, draftToPatch(draft, surgery));
      toast("success", t.toast.saved);
      setSaving(false);
      setDraft(null);
      setEditing(false);
    }, 400);
  }

  // הכותרת עונה על "מי, מה, מתי ואיפה" עוד לפני הגלילה הראשונה:
  // המטופל מזהה את הרשומה, הניתוח אומר מה עושים, והשורה הקצרה נושאת את השאר.
  const patientName = `${surgery.patient.firstName} ${surgery.patient.lastName}`;
  const procedureName = surgery.procedures.map((p) => p.name).join(" + ");
  const title = `${patientName} · ${procedureName}`;

  return (
    <>
    <Sheet
      open
      onClose={onClose}
      beforeClose={() => {
        if (!dirty) return true;
        setLeaveIntent("close");
        return false;
      }}
      title={title}
      titleSlot={
        <div className="min-w-0">
          <h2 className="truncate text-h2 font-bold text-ink">{patientName}</h2>
          <span className="block truncate text-muted">{procedureName}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
            <span className="tnum rounded-full bg-surface px-2 py-0.5 font-semibold">
              {t.swap.codeLabel} {surgery.code}
            </span>
            <span>{formatFullDate(surgery.date)}</span>
            <span dir="ltr" className="tnum font-semibold text-ink">
              {timeRange(surgery.startTime, surgery.durationMinutes)}
            </span>
            <CentreSignature hospital={surgery.hospital} tone="centre" height={11} />
          </span>
        </div>
      }
      // הזהות של המרכז - בגוון של ראש המגירה
      headerClassName={HOSPITALS[surgery.hospital].softClass}
      size="xl"
      footer={
        editing && draft ? (
          <>
            <Button variant="ghost" onClick={cancelEdit} disabled={saving}>
              {t.common.cancel}
            </Button>
            <Button onClick={save} loading={saving} className="min-w-24">
              {t.common.save}
            </Button>
          </>
        ) : (
          // בצפייה אין מה לאשר או לבטל: היציאה היא ה-X בראש המגירה,
          // ולכן בפוטר נשארת רק הפעולה עצמה
          <Button icon={<Pencil className="h-4 w-4" />} onClick={startEdit}>
            {t.surgeryView.edit}
          </Button>
        )
      }
    >
      {editing && draft ? (
        <SurgeryEditForm draft={draft} errors={errors} patch={patch} />
      ) : (
        <SurgeryViewContent surgery={surgery} />
      )}
    </Sheet>

    <Modal
      open={leaveIntent !== null}
      onClose={() => setLeaveIntent(null)}
      title={t.common.discardTitle}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => setLeaveIntent(null)}>
            {t.common.keepEditing}
          </Button>
          <Button variant="danger" onClick={discardChanges}>
            {t.common.discardConfirm}
          </Button>
        </>
      }
    >
      <p className="text-body">{t.common.discardBody}</p>
    </Modal>
    </>
  );
}
