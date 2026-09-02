import { useState, type ReactNode } from "react";
import { Download, FileText, Plus, X } from "lucide-react";
import { Card } from "../../components/data/Card";
import { HospitalChip, Chip } from "../../components/data/Chip";
import { HOSPITAL_LIST } from "../../mock/hospitals";
import { Button } from "../../components/primitives/Button";
import { Input } from "../../components/primitives/Input";
import { Select } from "../../components/primitives/Select";
import { Toggle } from "../../components/primitives/Toggle";
import { Checkbox } from "../../components/primitives/Checkbox";
import { Textarea } from "../../components/primitives/Textarea";
import { DatePicker } from "../../components/form/DatePicker";
import { TimePicker } from "../../components/form/TimePicker";
import { FileUpload, type UploadedFile } from "../../components/form/FileUpload";
import { documentTypeLabel, lookups } from "../../mock/lookups";
import { doctorById, doctors } from "../../mock/doctors";
import { departmentName } from "../../mock/departments";
import { formatNumericDate, timeRange } from "../../lib/date";
import { formatFileSize } from "../../lib/format";
import { he } from "../../i18n/he";
import type { MedicalDocument, RequirementKey, Surgery } from "../../types";

/* ============ מצב עריכה ============ */

export interface ProcedureDraft {
  name: string;
  organ: string | null;
  side: string | null;
}

export interface Draft {
  firstName: string;
  lastName: string;
  idType: "id" | "passport";
  idNumber: string;
  phone: string;
  birthDate: string | null;
  gender: string | null;
  hmo: string | null;
  payer: string | null;
  feeEnabled: boolean;
  feeAmount: string;

  doctorId: string;
  hospital: string;
  procedures: ProcedureDraft[];
  date: string | null;
  time: string | null;
  duration: string;
  anesthesia: string;
  treatmentType: string | null;
  combined: boolean;
  backupDoctorName: string;
  capitalEquipment: string | null;
  additionalEquipment: string;
  requirements: string[];

  documents: MedicalDocument[];
}

export function draftFromSurgery(s: Surgery): Draft {
  return {
    firstName: s.patient.firstName,
    lastName: s.patient.lastName,
    idType: s.patient.idType,
    idNumber: s.patient.idNumber,
    phone: s.patient.phone,
    birthDate: s.patient.birthDate || null,
    gender: s.patient.gender || null,
    hmo: s.patient.hmo || null,
    payer: s.patient.payer || null,
    feeEnabled: s.surgeonFee?.enabled ?? false,
    feeAmount: s.surgeonFee ? String(s.surgeonFee.amount) : "",
    doctorId: s.doctorId,
    hospital: s.hospital,
    procedures: s.procedures.length
      ? s.procedures.map((p) => ({ name: p.name, organ: p.organ ?? null, side: p.side ?? null }))
      : [{ name: "", organ: null, side: null }],
    date: s.date,
    time: s.startTime,
    duration: String(s.durationMinutes),
    anesthesia: s.anesthesia,
    treatmentType: s.treatmentType || null,
    combined: s.combined,
    backupDoctorName: s.backupDoctorName ?? "",
    capitalEquipment: s.capitalEquipment ?? null,
    additionalEquipment: s.additionalEquipment ?? "",
    requirements: [...s.requirements],
    documents: [...s.documents],
  };
}

export function validateDraft(draft: Draft): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!draft.firstName.trim()) errs.firstName = he.common.requiredField;
  if (!draft.lastName.trim()) errs.lastName = he.common.requiredField;
  if (!draft.idNumber.trim()) errs.idNumber = he.common.requiredField;
  if (!draft.phone.trim()) errs.phone = he.common.requiredField;
  if (!draft.procedures[0]?.name) errs["procedure-0"] = he.common.requiredField;
  if (!(Number(draft.duration) > 0)) errs.duration = he.common.invalidValue;
  if (!draft.date) errs.date = he.common.requiredField;
  if (!draft.time) errs.time = he.common.requiredField;
  if (draft.feeEnabled && !(Number(draft.feeAmount) > 0)) errs.feeAmount = he.common.invalidValue;
  return errs;
}

/** ממפה טיוטה מאושרת לעדכון על גבי הניתוח הקיים */
export function draftToPatch(draft: Draft, surgery: Surgery): Partial<Surgery> {
  return {
    patient: {
      ...surgery.patient,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      idType: draft.idType,
      idNumber: draft.idNumber,
      phone: draft.phone,
      birthDate: draft.birthDate ?? surgery.patient.birthDate,
      gender: (draft.gender as "male" | "female") ?? surgery.patient.gender,
      hmo: draft.hmo ?? "",
      payer: draft.payer ?? "",
    },
    doctorId: draft.doctorId,
    hospital: draft.hospital as Surgery["hospital"],
    procedures: draft.procedures
      .filter((p) => p.name)
      .map((p, i) => ({
        id: `${surgery.id}-proc-${i + 1}`,
        name: p.name,
        organ: p.organ ?? undefined,
        side: (p.side as "right" | "left" | "none" | null) ?? "none",
      })),
    date: draft.date!,
    startTime: draft.time!,
    durationMinutes: Number(draft.duration),
    anesthesia: draft.anesthesia as Surgery["anesthesia"],
    treatmentType: draft.treatmentType ?? "",
    combined: draft.combined,
    backupDoctorName: draft.backupDoctorName || undefined,
    capitalEquipment: draft.capitalEquipment ?? undefined,
    additionalEquipment: draft.additionalEquipment || undefined,
    requirements: draft.requirements as RequirementKey[],
    surgeonFee: draft.feeEnabled
      ? { enabled: true, amount: Number(draft.feeAmount) || 0 }
      : undefined,
    documents: draft.documents,
  };
}

/* ============ רכיבי תצוגה ============ */

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="shrink-0 text-caption text-muted">{label}</dt>
      <dd className="text-end text-ink">{value}</dd>
    </div>
  );
}

/** תוכן הצפייה בניתוח - כרטיסי מטופל, ביצוע, דרישות ומסמכים */
export function SurgeryViewContent({ surgery }: { surgery: Surgery }) {
  const anesthesiaLabel =
    lookups.anesthesiaTypes.find((a) => a.key === surgery.anesthesia)?.label ?? "";
  const requirementLabels = surgery.requirements
    .map((k) => lookups.requirements.find((r) => r.key === k)?.label)
    .filter(Boolean) as string[];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.patient}</h2>
          <dl>
            <Row label="שם מלא" value={`${surgery.patient.firstName} ${surgery.patient.lastName}`} />
            <Row label="ת.ז / דרכון" value={<span className="tnum">{surgery.patient.idNumber}</span>} />
            <Row label="טלפון" value={<span dir="ltr" className="tnum">{surgery.patient.phone}</span>} />
            <Row label="קופת חולים" value={surgery.patient.hmo} />
            <Row label="גורם מממן" value={surgery.patient.payer} />
            {surgery.surgeonFee?.enabled && (
              <Row
                label={he.wizard.step1.surgeonFee}
                value={<span className="tnum">₪{surgery.surgeonFee.amount}</span>}
              />
            )}
          </dl>
        </Card>

        <Card>
          <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.execution}</h2>
          <dl>
            <Row
              label="מנתח"
              value={
                <span>
                  <span className="font-semibold">
                    {doctorById(surgery.doctorId)?.displayName}
                  </span>
                  <span className="text-caption text-muted">
                    {" "}
                    · {departmentName(doctorById(surgery.doctorId)?.departmentId ?? "")}
                  </span>
                </span>
              }
            />
            <Row label="בית חולים" value={<HospitalChip hospital={surgery.hospital} />} />
            <Row label="תאריך" value={<span className="tnum">{formatNumericDate(surgery.date)}</span>} />
            <Row
              label="שעות"
              value={
                <span dir="ltr" className="tnum">
                  {timeRange(surgery.startTime, surgery.durationMinutes)}
                </span>
              }
            />
            <Row label="משך" value={<span className="tnum">{surgery.durationMinutes} דק'</span>} />
            <Row label="הרדמה" value={anesthesiaLabel} />
            <Row label="סוג טיפול" value={surgery.treatmentType} />
            {surgery.capitalEquipment && (
              <Row label={he.wizard.step2.capitalEquipment} value={surgery.capitalEquipment} />
            )}
            {surgery.additionalEquipment && (
              <Row label={he.wizard.step2.additionalEquipment} value={surgery.additionalEquipment} />
            )}
            {surgery.combined && <Row label="ניתוח משולב" value={surgery.backupDoctorName ?? "כן"} />}
          </dl>
        </Card>
      </div>

      {requirementLabels.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-3 text-h3 text-ink">{he.wizard.step2.requirements}</h2>
          <div className="flex flex-wrap gap-2">
            {requirementLabels.map((label) => (
              <Chip key={label} color="primary">
                {label}
              </Chip>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.documents}</h2>
        {surgery.documents.length === 0 ? (
          <p className="py-3 text-caption text-muted">{he.surgeryView.noDocuments}</p>
        ) : (
          <ul>
            {surgery.documents.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0"
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-strong font-semibold text-ink">
                    {d.fileName}
                  </span>
                  <span className="block text-caption text-muted">
                    {d.typeLabel} ·{" "}
                    <span dir="ltr" className="tnum">
                      {formatFileSize(d.sizeKb)}
                    </span>
                  </span>
                </span>
                <a
                  href={d.fileUrl}
                  download
                  aria-label={`הורדת ${d.fileName}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-caption font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {he.common.download}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

/* ============ טופס עריכה ============ */

/** שורת עריכה באותה פריסה של שורת הצפייה: תווית בהתחלה, שדה בסוף */
function EditRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2 last:border-b-0">
      <span className="shrink-0 text-caption text-muted">{label}</span>
      <div className="w-full max-w-[260px]">{children}</div>
    </div>
  );
}

export interface SurgeryEditFormProps {
  draft: Draft;
  errors: Record<string, string>;
  patch: (p: Partial<Draft>) => void;
}

/** טופס עריכה מלא בפריסת הצפייה, כולל ניהול מסמכים */
export function SurgeryEditForm({ draft, errors, patch }: SurgeryEditFormProps) {
  const [newDocType, setNewDocType] = useState<string | null>(null);
  const [newDocFile, setNewDocFile] = useState<UploadedFile | null>(null);

  function updateProcedure(index: number, p: Partial<ProcedureDraft>) {
    patch({
      procedures: draft.procedures.map((proc, i) => (i === index ? { ...proc, ...p } : proc)),
    });
  }

  function addDocument() {
    if (!newDocFile) return;
    const typeKey = newDocType ?? "medical";
    const doc: MedicalDocument = {
      id: `doc-edit-${draft.documents.length + 1}-${newDocFile.name}`,
      typeKey,
      typeLabel: documentTypeLabel(typeKey),
      fileName: newDocFile.name,
      fileUrl: "/mock-files/referral.pdf",
      sizeKb: newDocFile.sizeKb,
      uploadedAt: draft.date ?? "2026-07-26",
      source: "doctor",
    };
    patch({ documents: [...draft.documents, doc] });
    setNewDocType(null);
    setNewDocFile(null);
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* מטופל */}
        <Card>
          <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.patient}</h2>
          <div>
            <EditRow label={he.wizard.step1.firstName}>
              <Input value={draft.firstName} onChange={(e) => patch({ firstName: e.target.value })} error={errors.firstName} />
            </EditRow>
            <EditRow label={he.wizard.step1.lastName}>
              <Input value={draft.lastName} onChange={(e) => patch({ lastName: e.target.value })} error={errors.lastName} />
            </EditRow>
            <EditRow label={he.wizard.step1.idType}>
              <Select
                options={[
                  { value: "id", label: he.wizard.step1.idTypeId },
                  { value: "passport", label: he.wizard.step1.idTypePassport },
                ]}
                value={draft.idType}
                onChange={(v) => patch({ idType: (v as "id" | "passport") ?? "id" })}
              />
            </EditRow>
            <EditRow label={he.wizard.step1.idNumber}>
              <Input dir="ltr" maxLength={9} value={draft.idNumber} onChange={(e) => patch({ idNumber: e.target.value })} error={errors.idNumber} />
            </EditRow>
            <EditRow label={he.wizard.step1.phone}>
              <Input dir="ltr" type="tel" value={draft.phone} onChange={(e) => patch({ phone: e.target.value.replace(/[^\d-]/g, "") })} error={errors.phone} />
            </EditRow>
            <EditRow label={he.wizard.step1.birthDate}>
              <DatePicker value={draft.birthDate} onChange={(d) => patch({ birthDate: d })} />
            </EditRow>
            <EditRow label={he.wizard.step1.gender}>
              <Select
                options={[
                  { value: "male", label: he.wizard.step1.male },
                  { value: "female", label: he.wizard.step1.female },
                ]}
                value={draft.gender}
                onChange={(v) => patch({ gender: v as string | null })}
              />
            </EditRow>
            <EditRow label={he.wizard.step1.hmo}>
              <Select options={lookups.hmos.map((h) => ({ value: h, label: h }))} value={draft.hmo} onChange={(v) => patch({ hmo: v as string | null })} />
            </EditRow>
            <EditRow label={he.wizard.step1.payer}>
              <Select options={lookups.payers.map((p) => ({ value: p, label: p }))} value={draft.payer} onChange={(v) => patch({ payer: v as string | null })} />
            </EditRow>
            <div className="border-b border-line py-1 last:border-b-0">
              <Toggle checked={draft.feeEnabled} onChange={(v) => patch({ feeEnabled: v })} label={he.wizard.step1.surgeonFee} />
            </div>
            {draft.feeEnabled && (
              <EditRow label={he.wizard.step1.feeAmount}>
                <Input
                  dir="ltr"
                  inputMode="numeric"
                  value={draft.feeAmount}
                  onChange={(e) => patch({ feeAmount: e.target.value.replace(/\D/g, "") })}
                  error={errors.feeAmount}
                  hint={he.wizard.step1.surgeonFeeNote}
                />
              </EditRow>
            )}
          </div>
        </Card>

        {/* ביצוע */}
        <Card>
          <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.execution}</h2>
          <div>
            <EditRow label="מנתח">
              <Select
                options={doctors.map((d) => ({ value: d.id, label: d.displayName }))}
                value={draft.doctorId}
                onChange={(v) => patch({ doctorId: (v as string) ?? draft.doctorId })}
                searchable
              />
            </EditRow>
            <EditRow label="בית חולים">
              <Select
                options={[
                  ...HOSPITAL_LIST.map((h) => ({ value: h.key, label: h.name })),
                ]}
                value={draft.hospital}
                onChange={(v) => patch({ hospital: (v as string) ?? "refael" })}
              />
            </EditRow>
            <EditRow label={he.wizard.step2.date}>
              <DatePicker value={draft.date} onChange={(d) => patch({ date: d })} error={errors.date} />
            </EditRow>
            <EditRow label={he.wizard.step2.time}>
              <TimePicker value={draft.time} onChange={(t) => patch({ time: t })} error={errors.time} />
            </EditRow>
            <EditRow label={he.wizard.step2.duration}>
              <Input type="number" dir="ltr" min={1} value={draft.duration} onChange={(e) => patch({ duration: e.target.value })} error={errors.duration} />
            </EditRow>
            <EditRow label={he.wizard.step2.anesthesia}>
              <Select
                options={lookups.anesthesiaTypes.map((a) => ({ value: a.key, label: a.label }))}
                value={draft.anesthesia}
                onChange={(v) => patch({ anesthesia: (v as string) ?? "general" })}
              />
            </EditRow>
            <EditRow label={he.wizard.step2.treatmentType}>
              <Select
                options={lookups.treatmentTypes.map((t) => ({ value: t, label: t }))}
                value={draft.treatmentType}
                onChange={(v) => patch({ treatmentType: v as string | null })}
              />
            </EditRow>
            <EditRow label={he.wizard.step2.capitalEquipment}>
              <Select
                options={lookups.capitalEquipment.map((c) => ({ value: c, label: c }))}
                value={draft.capitalEquipment}
                onChange={(v) => patch({ capitalEquipment: v as string | null })}
                clearable
              />
            </EditRow>
            <div className="border-b border-line py-1 last:border-b-0">
              <Toggle checked={draft.combined} onChange={(v) => patch({ combined: v })} label={he.wizard.step2.combined} />
            </div>
            {draft.combined && (
              <EditRow label={he.wizard.step2.backupDoctor}>
                <Input value={draft.backupDoctorName} onChange={(e) => patch({ backupDoctorName: e.target.value })} />
              </EditRow>
            )}
            <div className="pt-2">
              <Textarea
                label={he.wizard.step2.additionalEquipment}
                rows={2}
                value={draft.additionalEquipment}
                onChange={(e) => patch({ additionalEquipment: e.target.value })}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* הניתוחים */}
      <Card className="mt-4">
        <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.procedures}</h2>
        <div className="flex flex-col gap-3">
          {draft.procedures.map((proc, i) => (
            <div key={i} className="relative rounded-md border border-line bg-canvas/60 p-3">
              {draft.procedures.length > 1 && (
                <button
                  type="button"
                  aria-label={`הסרת ניתוח ${i + 1}`}
                  onClick={() => patch({ procedures: draft.procedures.filter((_, j) => j !== i) })}
                  className="absolute end-2 top-2 z-10 rounded-md p-1.5 text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3" data-error={errors[`procedure-${i}`] ? "true" : undefined}>
                  <Select
                    label={he.wizard.step2.surgeryName}
                    options={lookups.surgeryNames.map((n) => ({ value: n, label: n }))}
                    value={proc.name || null}
                    onChange={(v) => updateProcedure(i, { name: (v as string) ?? "" })}
                    searchable
                    error={errors[`procedure-${i}`]}
                  />
                </div>
                <Select
                  label={he.wizard.step2.organ}
                  options={lookups.organs.map((o) => ({ value: o, label: o }))}
                  value={proc.organ}
                  onChange={(v) => updateProcedure(i, { organ: v as string | null })}
                  clearable
                />
                <Select
                  label={he.wizard.step2.side}
                  options={[
                    { value: "right", label: he.wizard.step2.sideRight },
                    { value: "left", label: he.wizard.step2.sideLeft },
                    { value: "none", label: he.wizard.step2.sideNone },
                  ]}
                  value={proc.side}
                  onChange={(v) => updateProcedure(i, { side: v as string | null })}
                />
              </div>
            </div>
          ))}
          <div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                patch({ procedures: [...draft.procedures, { name: "", organ: null, side: null }] })
              }
            >
              {he.wizard.step2.addProcedure}
            </Button>
          </div>
        </div>
      </Card>

      {/* דרישות נוספות */}
      <Card className="mt-4">
        <h2 className="mb-1 text-h3 text-ink">{he.wizard.step2.requirements}</h2>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {lookups.requirements.map((r) => (
            <Checkbox
              key={r.key}
              label={r.label}
              checked={draft.requirements.includes(r.key)}
              onChange={(e) =>
                patch({
                  requirements: e.target.checked
                    ? [...draft.requirements, r.key]
                    : draft.requirements.filter((k) => k !== r.key),
                })
              }
            />
          ))}
        </div>
      </Card>

      {/* ניהול מסמכים */}
      <Card className="mt-4">
        <h2 className="mb-2 text-h3 text-ink">{he.surgeryView.documents}</h2>

        {draft.documents.length === 0 ? (
          <p className="py-2 text-caption text-muted">{he.surgeryView.noDocuments}</p>
        ) : (
          <ul className="mb-3">
            {draft.documents.map((d) => (
              <li key={d.id} className="flex items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100">
                  <FileText className="h-5 w-5 text-primary-600" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-strong font-semibold text-ink">{d.fileName}</span>
                  <span className="block text-caption text-muted">
                    {d.typeLabel} · <span dir="ltr" className="tnum">{formatFileSize(d.sizeKb)}</span>
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`הסרת המסמך ${d.fileName}`}
                  onClick={() => patch({ documents: draft.documents.filter((x) => x.id !== d.id) })}
                  className="shrink-0 rounded-md p-2 text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-md border border-line bg-canvas/60 p-3">
          <div className="grid gap-3 sm:grid-cols-[240px,1fr]">
            <Select
              label={he.wizard.step3.docType}
              options={lookups.documentTypes.map((d) => ({ value: d.key, label: d.label }))}
              value={newDocType}
              onChange={(v) => setNewDocType(v as string | null)}
              searchable
            />
            <div className="sm:pt-6">
              <FileUpload value={newDocFile} onChange={setNewDocFile} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-caption text-muted">{he.wizard.step3.limitsNote}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              disabled={!newDocFile}
              onClick={addDocument}
            >
              {he.wizard.step3.addDocument.replace("+ ", "")}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
