// ---------- משותף ----------
export type ID = string;
export type ISODate = string; // '2026-07-29'
export type Time = string; // '16:00'

export type Hospital = "refael" | "elisha";

// ---------- מנתח ----------
export interface Doctor {
  id: ID;
  firstName: string;
  lastName: string;
  displayName: string; // 'ד"ר דוחנו אולג'
  title: 'ד"ר' | "פרופ'" | "";
  avatarUrl?: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  departmentId: ID;
  managedByMe: boolean;
}

// ---------- מחלקה ----------
export interface Department {
  id: ID;
  name: string;
}

// ---------- מטופל ----------
export interface Patient {
  id: ID;
  firstName: string;
  lastName: string;
  idType: "id" | "passport";
  idNumber: string;
  phone: string;
  birthDate: ISODate;
  gender: "male" | "female";
  hmo: string;
  payer: string;
}

// ---------- ניתוח ----------
export interface Surgery {
  id: ID;
  code: string;
  hospital: Hospital;
  doctorId: ID;
  patient: Patient;

  procedures: Procedure[];
  date: ISODate;
  startTime: Time;
  durationMinutes: number;
  combined: boolean;
  backupDoctorName?: string;

  anesthesia: "general" | "regional" | "local" | "sedation";
  capitalEquipment?: string;
  additionalEquipment?: string;
  requirements: RequirementKey[];
  treatmentType: string;

  surgeonFee?: { enabled: boolean; amount: number };

  documents: MedicalDocument[];
  status: "scheduled" | "done" | "cancelled";
  summaryUrl?: string;
  dischargeLetterUrl?: string;
}

export interface Procedure {
  id: ID;
  name: string;
  organ?: string;
  side?: "right" | "left" | "none";
}

export type RequirementKey =
  | "pacemaker"
  | "bloodTypeCross"
  | "preOp"
  | "icu"
  | "frozenSection"
  | "nerveMonitoring"
  | "xrayTech"
  | "agent"
  | "breastFnlMarking"
  | "breastIsotope"
  | "surgicalAssistant"
  | "guestSurgeonPrep"; // הכנת אורח לזהוד ניתוח

// ---------- מסמך ----------
export interface MedicalDocument {
  id: ID;
  typeKey: string;
  typeLabel: string;
  fileName: string;
  fileUrl: string;
  sizeKb: number;
  uploadedAt: ISODate;
  source: "doctor" | "hospital";
}

// ---------- בלוק ניתוחים (ליומן) ----------
export interface Block {
  id: ID;
  hospital: Hospital;
  date: ISODate;
  startTime: Time;
  endTime: Time;
  doctorId: ID;
  state: "full" | "partial" | "open";
}

// ---------- תור מטופל ----------
export interface Appointment {
  id: ID;
  patientId: ID;
  kind: "surgery" | "consult" | "test" | "followup";
  title: string;
  departmentId: ID;
  departmentName: string;
  doctorId: ID;
  doctorName: string;
  hospital: Hospital;
  date: ISODate;
  time: Time;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  preparation?: string[];
  documents: MedicalDocument[];
  resultSummary?: string;
  /** האם קיימת הדמיה לצפייה דרך MyVue */
  imagingAvailable?: boolean;
}
