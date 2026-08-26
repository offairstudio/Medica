import type { Surgery } from "../../types";
import type { UploadedFile } from "../../components/form/FileUpload";

export interface ProcedureDraft {
  name: string;
  organ: string | null;
  side: string | null;
}

export interface ExtraDocDraft {
  id: number;
  typeKey: string | null;
  file: UploadedFile | null;
}

export interface WizardState {
  // שלב 1 - פרטי המטופל
  existingPatientId: string | null;
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

  // שלב 2 - פרטי הניתוח
  procedures: ProcedureDraft[];
  date: string | null;
  time: string | null;
  duration: string;
  combined: boolean;
  backupDoctorName: string;
  anesthesia: string | null;
  capitalEquipment: string | null;
  additionalEquipment: string;
  treatmentType: string | null;
  requirements: string[];

  // שלב 3 - מסמכים
  anamnesisFile: UploadedFile | null;
  extraDocs: ExtraDocDraft[];
}

export function emptyWizardState(prefill?: { date?: string; time?: string }): WizardState {
  return {
    existingPatientId: null,
    firstName: "",
    lastName: "",
    idType: "id",
    idNumber: "",
    phone: "",
    birthDate: null,
    gender: null,
    hmo: null,
    payer: null,
    feeEnabled: false,
    feeAmount: "",
    procedures: [{ name: "", organ: null, side: null }],
    date: prefill?.date ?? null,
    time: prefill?.time ?? null,
    duration: "",
    combined: false,
    backupDoctorName: "",
    anesthesia: null,
    capitalEquipment: null,
    additionalEquipment: "",
    treatmentType: null,
    requirements: [],
    anamnesisFile: null,
    extraDocs: [],
  };
}

export function stateFromSurgery(s: Surgery): WizardState {
  return {
    existingPatientId: s.patient.id,
    firstName: s.patient.firstName,
    lastName: s.patient.lastName,
    idType: s.patient.idType,
    idNumber: s.patient.idNumber,
    phone: s.patient.phone,
    birthDate: s.patient.birthDate,
    gender: s.patient.gender,
    hmo: s.patient.hmo,
    payer: s.patient.payer,
    feeEnabled: s.surgeonFee?.enabled ?? false,
    feeAmount: s.surgeonFee ? String(s.surgeonFee.amount) : "",
    procedures: s.procedures.map((p) => ({
      name: p.name,
      organ: p.organ ?? null,
      side: p.side ?? null,
    })),
    date: s.date,
    time: s.startTime,
    duration: String(s.durationMinutes),
    combined: s.combined,
    backupDoctorName: s.backupDoctorName ?? "",
    anesthesia: s.anesthesia,
    capitalEquipment: s.capitalEquipment ?? null,
    additionalEquipment: s.additionalEquipment ?? "",
    treatmentType: s.treatmentType,
    requirements: [...s.requirements],
    anamnesisFile: { name: "אנמנזה-רפואית.pdf", sizeKb: 156 },
    extraDocs: s.documents.map((d, i) => ({
      id: i + 1,
      typeKey: d.typeKey,
      file: { name: d.fileName, sizeKb: d.sizeKb },
    })),
  };
}

export type WizardErrors = Partial<Record<string, string>>;

const REQUIRED = "שדה חובה";
const INVALID = "ערך אינו חוקי";

export function validateStep1(s: WizardState): WizardErrors {
  const errors: WizardErrors = {};
  if (!s.firstName.trim()) errors.firstName = REQUIRED;
  if (!s.lastName.trim()) errors.lastName = REQUIRED;
  if (!s.idNumber.trim()) {
    errors.idNumber = REQUIRED;
  } else if (s.idType === "id" && !/^\d{8,9}$/.test(s.idNumber)) {
    errors.idNumber = "מספר תעודת זהות אינו תקין";
  }
  if (!s.phone.trim()) errors.phone = REQUIRED;
  if (s.feeEnabled && (!s.feeAmount.trim() || Number(s.feeAmount) <= 0)) {
    errors.feeAmount = INVALID;
  }
  return errors;
}

export function validateStep2(s: WizardState): WizardErrors {
  const errors: WizardErrors = {};
  if (!s.procedures[0]?.name) errors["procedure-0"] = REQUIRED;
  if (!s.date) errors.date = REQUIRED;
  if (!s.time) errors.time = REQUIRED;
  if (!s.duration.trim()) {
    errors.duration = REQUIRED;
  } else if (!(Number(s.duration) > 0)) {
    errors.duration = INVALID;
  }
  if (!s.anesthesia) errors.anesthesia = REQUIRED;
  return errors;
}

export function validateStep3(s: WizardState): WizardErrors {
  const errors: WizardErrors = {};
  if (!s.anamnesisFile) errors.anamnesis = "חובה להעלות קובץ אנמנזה רפואית";
  return errors;
}

/** משכי ברירת מחדל לפי פרוצדורה - להצעת משך אוטומטית */
export const typicalDurations: Record<string, number> = {
  "מיני מעקף קיבה בלפרוסקופיה": 75,
  "תיקון בקע מפשעתי דו צידי בלפרוסקופיה": 85,
  "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל": 95,
  "תיקון בקע טבורי בלפרוסקופיה": 60,
  "Achilles tendon repair": 75,
  "כריתת כיס מרה בלפרוסקופיה": 90,
  "החלפת מפרק ירך": 150,
  "החלפת מפרק ברך": 140,
  "כריתת שד חלקית": 100,
  "כריתת ערמונית רדיקלית": 160,
  "אנדרטרקטומיה של עורק התרדמה": 130,
  "שרוול קיבה בלפרוסקופיה": 120,
};
