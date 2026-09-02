import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Banknote,
  Bed,
  Boxes,
  FileText,
  IdCard,
  Info,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Syringe,
  UserRound,
  Users,
  Wallet,
  X,
  CalendarDays,
  Clock,
  Hospital,
  Stethoscope,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { HospitalChip, Chip } from "../../components/data/Chip";
import { DocumentRow } from "../patient-documents/DocumentRow";
import { HOSPITAL_LIST, HOSPITALS } from "../../mock/hospitals";
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
import { formatFullDate, timeRange } from "../../lib/date";
import { formatFileSize } from "../../lib/format";
import { cn } from "../../lib/cn";
import { he } from "../../i18n/he";
// Hospital מיובא כ-HospitalKey כדי לא להתנגש באייקון בשם הזה
import type { Hospital as HospitalKey, MedicalDocument, RequirementKey, Surgery } from "../../types";

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

/**
 * שורת פרטים - אותה שפה של מגירת התור באזור המטופל:
 * אייקון, תווית ברוחב קבוע וערך, בגובה נוח לקריאה.
 */
function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 border-b border-line py-2 last:border-b-0">
      <Icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
      <dt className="w-28 shrink-0 font-semibold text-body">{label}</dt>
      <dd className="min-w-0 flex-1 font-semibold text-ink">{children}</dd>
    </div>
  );
}

/**
 * כרטיסיית מקטע במגירה - אותו כרטיס של מגירת התור באזור המטופל.
 * variant="accent" שמור למקטע הנחיות, בגוון המותג.
 */
function Section({
  title,
  hint,
  variant = "card",
  className,
  children,
}: {
  title: string;
  hint?: string;
  variant?: "card" | "accent";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "min-w-0 rounded-lg p-5",
        variant === "accent"
          ? "border border-primary-200 bg-primary-50"
          : "border border-line bg-surface shadow-sm",
        className,
      )}
    >
      <h3
        className={cn(
          "flex items-center gap-2 text-h3",
          variant === "accent" ? "text-primary-800" : "text-ink",
        )}
      >
        {variant === "accent" && <Info className="h-4 w-4 shrink-0 text-primary-500" aria-hidden />}
        {title}
      </h3>
      {hint && <p className="mt-0.5 text-caption text-muted">{hint}</p>}
      <div className={cn(hint ? "mt-2" : "mt-1")}>{children}</div>
    </section>
  );
}

/** כותרת המועד - אותה שפה של בלוק הזמן ביומן, בצפייה ובעריכה כאחד */
function SurgeryHeadline({
  date,
  startTime,
  durationMinutes,
  hospitalKey,
  doctorId,
}: {
  date: string | null;
  startTime: string | null;
  durationMinutes: number;
  hospitalKey: HospitalKey;
  doctorId: string;
}) {
  const hospital = HOSPITALS[hospitalKey];
  const doctor = doctorById(doctorId);

  return (
    <div className={cn("flex items-start gap-4 rounded-lg p-4", hospital.softClass)}>
      <span aria-hidden className={cn("w-1 shrink-0 self-stretch rounded-full", hospital.accentClass)} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-h3 text-ink">{date ? formatFullDate(date) : "—"}</span>
          <span dir="ltr" className={cn("text-h3 font-bold tnum", hospital.textClass)}>
            {startTime ? timeRange(startTime, durationMinutes) : "—"}
          </span>
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted">
          <HospitalChip hospital={hospitalKey} compact />
          <span className="tnum">{durationMinutes} דק'</span>
          {doctor && (
            <span>
              <span className="font-semibold text-ink">{doctor.displayName}</span>
              {" · "}
              {departmentName(doctor.departmentId)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/** תוכן הצפייה בניתוח: מועד, פרטי מטופל וניתוח, דרישות ומסמכים */
export function SurgeryViewContent({ surgery }: { surgery: Surgery }) {
  const anesthesiaLabel =
    lookups.anesthesiaTypes.find((a) => a.key === surgery.anesthesia)?.label ?? "";
  const requirementLabels = surgery.requirements
    .map((k) => lookups.requirements.find((r) => r.key === k)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-6">
      <SurgeryHeadline
        date={surgery.date}
        startTime={surgery.startTime}
        durationMinutes={surgery.durationMinutes}
        hospitalKey={surgery.hospital}
        doctorId={surgery.doctorId}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Section title={he.surgeryView.patient}>
          <dl>
            <DetailRow icon={UserRound} label="שם מלא">
              {surgery.patient.firstName} {surgery.patient.lastName}
            </DetailRow>
            <DetailRow icon={IdCard} label="ת.ז / דרכון">
              <span className="tnum">{surgery.patient.idNumber}</span>
            </DetailRow>
            <DetailRow icon={Phone} label="טלפון">
              <span dir="ltr" className="tnum">
                {surgery.patient.phone}
              </span>
            </DetailRow>
            <DetailRow icon={ShieldCheck} label="קופת חולים">
              {surgery.patient.hmo}
            </DetailRow>
            <DetailRow icon={Wallet} label="גורם מממן">
              {surgery.patient.payer}
            </DetailRow>
            {surgery.surgeonFee?.enabled && (
              <DetailRow icon={Banknote} label={he.wizard.step1.surgeonFee}>
                <span className="tnum">₪{surgery.surgeonFee.amount}</span>
              </DetailRow>
            )}
          </dl>
        </Section>

        <Section title={he.surgeryView.execution}>
          <dl>
            <DetailRow icon={Syringe} label="הרדמה">
              {anesthesiaLabel}
            </DetailRow>
            <DetailRow icon={Bed} label="סוג טיפול">
              {surgery.treatmentType}
            </DetailRow>
            {surgery.capitalEquipment && (
              <DetailRow icon={Package} label={he.wizard.step2.capitalEquipment}>
                {surgery.capitalEquipment}
              </DetailRow>
            )}
            {surgery.additionalEquipment && (
              <DetailRow icon={Boxes} label={he.wizard.step2.additionalEquipment}>
                {surgery.additionalEquipment}
              </DetailRow>
            )}
            {surgery.combined && (
              <DetailRow icon={Users} label="ניתוח משולב">
                {surgery.backupDoctorName ?? "כן"}
              </DetailRow>
            )}
          </dl>
        </Section>
      </div>

      {requirementLabels.length > 0 && (
        <Section title={he.wizard.step2.requirements} variant="accent">
          <div className="flex flex-wrap gap-2">
            {requirementLabels.map((label) => (
              <Chip key={label} color="primary">
                {label}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      <Section title={he.surgeryView.documents}>
        {surgery.documents.length === 0 ? (
          <p className="text-muted">{he.surgeryView.noDocuments}</p>
        ) : (
          <ul>
            {surgery.documents.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ============ טופס עריכה ============ */

/** שורת עריכה באותה פריסה של שורת הצפייה: תווית בהתחלה, שדה בסוף */
/**
 * שורת עריכה - אותה פריסה של שורת הצפייה, כך שהמעבר בין המצבים
 * אינו מזיז את התוכן: אייקון, תווית, והשדה עצמו במקום הערך.
 */
function EditRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  // התווית נקשרת לשדה עצמו, כך שגם קורא מסך וגם לחיצה על הטקסט מגיעים אליו
  const field = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string }>, { id })
    : children;

  return (
    <div className="flex min-h-[52px] items-center gap-3 border-b border-line py-1.5 last:border-b-0">
      <Icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
      <label htmlFor={id} className="w-28 shrink-0 font-semibold text-body">
        {label}
      </label>
      <div className="min-w-0 flex-1">{field}</div>
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
    <div className="flex flex-col gap-6">
      <SurgeryHeadline
        date={draft.date}
        startTime={draft.time}
        durationMinutes={Number(draft.duration) || 0}
        hospitalKey={draft.hospital as HospitalKey}
        doctorId={draft.doctorId}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* מטופל */}
        <Section title={he.surgeryView.patient}>
          <div>
            <EditRow icon={UserRound} label={he.wizard.step1.firstName}>
              <Input
                quiet value={draft.firstName} onChange={(e) => patch({ firstName: e.target.value })} error={errors.firstName} />
            </EditRow>
            <EditRow icon={UserRound} label={he.wizard.step1.lastName}>
              <Input
                quiet value={draft.lastName} onChange={(e) => patch({ lastName: e.target.value })} error={errors.lastName} />
            </EditRow>
            <EditRow icon={IdCard} label={he.wizard.step1.idType}>
              <Select
                quiet
                options={[
                  { value: "id", label: he.wizard.step1.idTypeId },
                  { value: "passport", label: he.wizard.step1.idTypePassport },
                ]}
                value={draft.idType}
                onChange={(v) => patch({ idType: (v as "id" | "passport") ?? "id" })}
              />
            </EditRow>
            <EditRow icon={IdCard} label={he.wizard.step1.idNumber}>
              <Input
                quiet dir="ltr" maxLength={9} value={draft.idNumber} onChange={(e) => patch({ idNumber: e.target.value })} error={errors.idNumber} />
            </EditRow>
            <EditRow icon={Phone} label={he.wizard.step1.phone}>
              <Input
                quiet dir="ltr" type="tel" value={draft.phone} onChange={(e) => patch({ phone: e.target.value.replace(/[^\d-]/g, "") })} error={errors.phone} />
            </EditRow>
            <EditRow icon={CalendarDays} label={he.wizard.step1.birthDate}>
              <DatePicker
                quiet value={draft.birthDate} onChange={(d) => patch({ birthDate: d })} />
            </EditRow>
            <EditRow icon={UserRound} label={he.wizard.step1.gender}>
              <Select
                quiet
                options={[
                  { value: "male", label: he.wizard.step1.male },
                  { value: "female", label: he.wizard.step1.female },
                ]}
                value={draft.gender}
                onChange={(v) => patch({ gender: v as string | null })}
              />
            </EditRow>
            <EditRow icon={ShieldCheck} label={he.wizard.step1.hmo}>
              <Select
                quiet options={lookups.hmos.map((h) => ({ value: h, label: h }))} value={draft.hmo} onChange={(v) => patch({ hmo: v as string | null })} />
            </EditRow>
            <EditRow icon={Wallet} label={he.wizard.step1.payer}>
              <Select
                quiet options={lookups.payers.map((p) => ({ value: p, label: p }))} value={draft.payer} onChange={(v) => patch({ payer: v as string | null })} />
            </EditRow>
            <div className="border-b border-line py-1 last:border-b-0">
              <Toggle checked={draft.feeEnabled} onChange={(v) => patch({ feeEnabled: v })} label={he.wizard.step1.surgeonFee} />
            </div>
            {draft.feeEnabled && (
              <EditRow icon={Banknote} label={he.wizard.step1.feeAmount}>
                <Input
                  quiet
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
        </Section>

        {/* ביצוע */}
        <Section title={he.surgeryView.execution}>
          <div>
            <EditRow icon={Stethoscope} label="מנתח">
              <Select
                quiet
                options={doctors.map((d) => ({ value: d.id, label: d.displayName }))}
                value={draft.doctorId}
                onChange={(v) => patch({ doctorId: (v as string) ?? draft.doctorId })}
                searchable
              />
            </EditRow>
            <EditRow icon={Hospital} label="בית חולים">
              <Select
                quiet
                options={[
                  ...HOSPITAL_LIST.map((h) => ({ value: h.key, label: h.name })),
                ]}
                value={draft.hospital}
                onChange={(v) => patch({ hospital: (v as string) ?? "refael" })}
              />
            </EditRow>
            <EditRow icon={CalendarDays} label={he.wizard.step2.date}>
              <DatePicker
                quiet value={draft.date} onChange={(d) => patch({ date: d })} error={errors.date} />
            </EditRow>
            <EditRow icon={Clock} label={he.wizard.step2.time}>
              <TimePicker
                quiet value={draft.time} onChange={(t) => patch({ time: t })} error={errors.time} />
            </EditRow>
            <EditRow icon={Timer} label={he.wizard.step2.duration}>
              <Input
                quiet type="number" dir="ltr" min={1} value={draft.duration} onChange={(e) => patch({ duration: e.target.value })} error={errors.duration} />
            </EditRow>
            <EditRow icon={Syringe} label={he.wizard.step2.anesthesia}>
              <Select
                quiet
                options={lookups.anesthesiaTypes.map((a) => ({ value: a.key, label: a.label }))}
                value={draft.anesthesia}
                onChange={(v) => patch({ anesthesia: (v as string) ?? "general" })}
              />
            </EditRow>
            <EditRow icon={Bed} label={he.wizard.step2.treatmentType}>
              <Select
                quiet
                options={lookups.treatmentTypes.map((t) => ({ value: t, label: t }))}
                value={draft.treatmentType}
                onChange={(v) => patch({ treatmentType: v as string | null })}
              />
            </EditRow>
            <EditRow icon={Package} label={he.wizard.step2.capitalEquipment}>
              <Select
                quiet
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
              <EditRow icon={Users} label={he.wizard.step2.backupDoctor}>
                <Input
                  quiet value={draft.backupDoctorName} onChange={(e) => patch({ backupDoctorName: e.target.value })} />
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
        </Section>
      </div>

      {/* הניתוחים */}
      <Section title={he.surgeryView.procedures}>
        <div className="flex flex-col gap-3">
          {draft.procedures.map((proc, i) => (
            <div key={i} className="relative rounded-md border border-line bg-surface-2/60 p-3">
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
      </Section>

      {/* דרישות נוספות */}
      <Section title={he.wizard.step2.requirements}>
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
      </Section>

      {/* ניהול מסמכים */}
      <Section title={he.surgeryView.documents}>

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

        <div className="rounded-md border border-line bg-surface-2/60 p-3">
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
      </Section>
    </div>
  );
}
