import { useState } from "react";
import { Pencil } from "lucide-react";
import { Sheet } from "../../components/overlay/Sheet";
import { HOSPITALS } from "../../mock/hospitals";
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

  const title = `${surgery.procedures.map((p) => p.name).join(" + ")} · ${t.swap.codeLabel} ${surgery.code}`;

  return (
    <Sheet
      open
      onClose={onClose}
      title={title}
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
          <>
            <Button variant="ghost" onClick={onClose}>
              {t.common.close}
            </Button>
            <Button
              variant="secondary"
              icon={<Pencil className="h-4 w-4" />}
              onClick={startEdit}
            >
              {t.surgeryView.edit}
            </Button>
          </>
        )
      }
    >
      {editing && draft ? (
        <SurgeryEditForm draft={draft} errors={errors} patch={patch} />
      ) : (
        <SurgeryViewContent surgery={surgery} />
      )}
    </Sheet>
  );
}
