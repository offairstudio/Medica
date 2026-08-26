import { useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { DoctorShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/primitives/Button";
import { useToast } from "../components/overlay/Toast";
import { doctorById } from "../mock/doctors";
import { useData } from "../state/data";
import { he } from "../i18n/he";
import {
  SurgeryViewContent,
  SurgeryEditForm,
  draftFromSurgery,
  draftToPatch,
  validateDraft,
  type Draft,
} from "../features/surgery-details/SurgeryDetailsContent";

/**
 * עמוד פרטי ניתוח - לגישה ישירה ב-URL (/surgery/:id).
 * בתוך היומן, אותם פרטים נפתחים כפופאפ מעל המסך.
 */
export function SurgeryView() {
  const { surgeryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { surgeries, updateSurgery } = useData();
  const { toast } = useToast();
  const surgery = surgeries.find((s) => s.id === surgeryId);
  const doctor = doctorById(surgery?.doctorId ?? "doc-1");
  const editing = searchParams.get("edit") === "1";

  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  if (!surgery || !doctor) return <Navigate to="/doctor/doc-1/schedule" replace />;

  // כניסה למצב עריכה דרך URL ישיר (?edit=1)
  if (editing && !draft) {
    setDraft(draftFromSurgery(surgery));
  }

  function startEdit() {
    setDraft(draftFromSurgery(surgery!));
    setErrors({});
    setSearchParams({ edit: "1" });
  }

  function cancelEdit() {
    setDraft(null);
    setErrors({});
    setSearchParams({});
  }

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

  function save() {
    if (!draft || !surgery) return;
    const errs = validateDraft(draft);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("error", he.wizard.fixErrors);
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      updateSurgery(surgery.id, draftToPatch(draft, surgery));
      toast("success", he.toast.saved);
      setSaving(false);
      setDraft(null);
      setSearchParams({});
    }, 400);
  }

  return (
    <DoctorShell
      doctor={doctor}
      screenTitle={editing ? he.schedule.actions.edit : he.surgeryView.title}
      section="schedule"
    >
      <div className="mx-auto w-full max-w-[880px]">
        <PageHeader
          title={surgery.procedures.map((p) => p.name).join(" + ")}
          subtitle={`${he.swap.codeLabel} ${surgery.code}`}
          backTo={{ to: `/doctor/${doctor.id}/schedule`, label: he.allSurgeries.backToSchedule }}
          actions={
            editing && draft ? (
              <span className="flex items-center gap-2">
                <Button variant="ghost" onClick={cancelEdit} disabled={saving}>
                  {he.common.cancel}
                </Button>
                <Button onClick={save} loading={saving} className="min-w-24">
                  {he.common.save}
                </Button>
              </span>
            ) : (
              <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} onClick={startEdit}>
                {he.surgeryView.edit}
              </Button>
            )
          }
        />

        {editing && draft ? (
          <SurgeryEditForm draft={draft} errors={errors} patch={patch} />
        ) : (
          <SurgeryViewContent surgery={surgery} />
        )}
      </div>
    </DoctorShell>
  );
}
