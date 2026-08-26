import type { Patient, RequirementKey, Surgery } from "../types";
import { patients } from "./patients";
import { documents } from "./documents";
import { doctors } from "./doctors";

function pat(id: string): Patient {
  return patients.find((p) => p.id === id)!;
}

interface SurgerySeed {
  id: string;
  code: string;
  hospital: "refael" | "elisha";
  doctorId: string;
  patientId: string;
  name: string;
  organ?: string;
  side?: "right" | "left" | "none";
  date: string;
  startTime: string;
  duration: number;
  anesthesia?: Surgery["anesthesia"];
  status?: Surgery["status"];
  combined?: boolean;
  backupDoctorName?: string;
  requirements?: RequirementKey[];
  treatmentType?: string;
  withSummary?: boolean;
  withDischarge?: boolean;
  withDocs?: boolean;
}

function make(seed: SurgerySeed): Surgery {
  return {
    id: seed.id,
    code: seed.code,
    hospital: seed.hospital,
    doctorId: seed.doctorId,
    patient: pat(seed.patientId),
    procedures: [
      {
        id: `${seed.id}-proc-1`,
        name: seed.name,
        organ: seed.organ,
        side: seed.side ?? "none",
      },
    ],
    date: seed.date,
    startTime: seed.startTime,
    durationMinutes: seed.duration,
    combined: seed.combined ?? false,
    backupDoctorName: seed.backupDoctorName,
    anesthesia: seed.anesthesia ?? "general",
    requirements: seed.requirements ?? ["preOp", "bloodTypeCross"],
    treatmentType: seed.treatmentType ?? "אשפוז יום",
    documents: seed.withDocs ? [documents[5], documents[2]] : [],
    status: seed.status ?? "scheduled",
    summaryUrl: seed.withSummary ? "/mock-files/discharge-letter.pdf" : undefined,
    dischargeLetterUrl: seed.withDischarge ? "/mock-files/discharge-letter.pdf" : undefined,
  };
}

/**
 * 20 ניתוחים על פני שלושה שבועות (13/07-07/08), מפוזרים בין רפאל לאלישע.
 * יום 29/07/2026 מכיל בדיוק את ארבעת הניתוחים מהמערכת הקיימת
 * (16:00, 17:15, 18:20, 19:20) והחלון הפנוי 20:20-23:00 נגזר מהבלוק.
 */
export const initialSurgeries: Surgery[] = [
  // ---- שבוע שעבר (הסתיימו) ----
  make({ id: "sur-1", code: "198712", hospital: "refael", doctorId: "doc-1", patientId: "pat-3", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-07-13", startTime: "08:30", duration: 90, status: "done", withSummary: true, withDischarge: true }),
  make({ id: "sur-2", code: "198718", hospital: "elisha", doctorId: "doc-1", patientId: "pat-4", name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", date: "2026-07-14", startTime: "10:00", duration: 60, status: "done", withSummary: true }),
  make({ id: "sur-3", code: "198723", hospital: "refael", doctorId: "doc-2", patientId: "pat-8", name: "החלפת מפרק ירך", organ: "ירך", side: "left", date: "2026-07-15", startTime: "09:00", duration: 150, status: "done", withSummary: true, withDischarge: true, anesthesia: "regional" }),
  make({ id: "sur-4", code: "198731", hospital: "refael", doctorId: "doc-1", patientId: "pat-9", name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", date: "2026-07-16", startTime: "13:30", duration: 85, status: "done", withDischarge: true }),
  make({ id: "sur-5", code: "198740", hospital: "elisha", doctorId: "doc-3", patientId: "pat-5", name: "שרוול קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-07-20", startTime: "08:00", duration: 120, status: "done", withSummary: true, treatmentType: "אשפוז" }),
  make({ id: "sur-6", code: "198745", hospital: "refael", doctorId: "doc-1", patientId: "pat-6", name: "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", organ: "בטן", date: "2026-07-22", startTime: "11:15", duration: 95, status: "done", withSummary: true, withDischarge: true }),

  // ---- היום של המוקאפ: 26/07 ----
  make({ id: "sur-7", code: "198758", hospital: "refael", doctorId: "doc-1", patientId: "pat-7", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-07-26", startTime: "09:00", duration: 90, withDocs: true }),
  make({ id: "sur-8", code: "198761", hospital: "refael", doctorId: "doc-1", patientId: "pat-10", name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", date: "2026-07-26", startTime: "11:00", duration: 60 }),
  make({ id: "sur-9", code: "198764", hospital: "elisha", doctorId: "doc-1", patientId: "pat-2", name: "מיני מעקף קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-07-26", startTime: "15:30", duration: 110, treatmentType: "אשפוז", requirements: ["preOp", "bloodTypeCross", "icu"] }),
  make({ id: "sur-10", code: "198766", hospital: "refael", doctorId: "doc-2", patientId: "pat-8", name: "החלפת מפרק ברך", organ: "ברך", side: "right", date: "2026-07-26", startTime: "10:00", duration: 140, anesthesia: "regional" }),
  make({ id: "sur-11", code: "198769", hospital: "elisha", doctorId: "doc-5", patientId: "pat-3", name: "אנדרטרקטומיה של עורק התרדמה", organ: "עורק תרדמה", side: "right", date: "2026-07-26", startTime: "12:30", duration: 130, requirements: ["preOp", "bloodTypeCross", "nerveMonitoring", "icu"] }),

  // ---- 27-28/07 ----
  make({ id: "sur-12", code: "198772", hospital: "refael", doctorId: "doc-1", patientId: "pat-5", name: "Achilles tendon repair", organ: "גיד אכילס", side: "left", date: "2026-07-27", startTime: "14:00", duration: 75, anesthesia: "regional" }),
  make({ id: "sur-13", code: "198775", hospital: "elisha", doctorId: "doc-4", patientId: "pat-10", name: "כריתת שד חלקית", organ: "שד", side: "left", date: "2026-07-28", startTime: "09:30", duration: 100, requirements: ["preOp", "bloodTypeCross", "frozenSection", "breastFnlMarking", "breastIsotope"] }),

  // ---- 29/07 - היום מהמערכת הקיימת, בדיוק 4 ניתוחים ----
  make({ id: "sur-14", code: "2000", hospital: "refael", doctorId: "doc-1", patientId: "pat-1", name: "מיני מעקף קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-07-29", startTime: "16:00", duration: 75, treatmentType: "אשפוז", withDocs: true }),
  make({ id: "sur-15", code: "198787", hospital: "refael", doctorId: "doc-1", patientId: "pat-2", name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", date: "2026-07-29", startTime: "17:15", duration: 65 }),
  make({ id: "sur-16", code: "198790", hospital: "refael", doctorId: "doc-1", patientId: "pat-9", name: "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", organ: "בטן", date: "2026-07-29", startTime: "18:20", duration: 60 }),
  make({ id: "sur-17", code: "198793", hospital: "refael", doctorId: "doc-1", patientId: "pat-6", name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", date: "2026-07-29", startTime: "19:20", duration: 60 }),

  // ---- קדימה ----
  make({ id: "sur-18", code: "198801", hospital: "elisha", doctorId: "doc-1", patientId: "pat-8", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-08-02", startTime: "08:30", duration: 90, combined: true, backupDoctorName: 'ד"ר בורג אלון' }),
  make({ id: "sur-19", code: "198805", hospital: "refael", doctorId: "doc-7", patientId: "pat-4", name: "החלפת מפרק ברך", organ: "ברך", side: "left", date: "2026-08-04", startTime: "10:30", duration: 145, anesthesia: "regional" }),
  make({ id: "sur-20", code: "198812", hospital: "refael", doctorId: "doc-1", patientId: "pat-9", name: "כריתת ערמונית רדיקלית", organ: "ערמונית", date: "2026-08-06", startTime: "09:00", duration: 160, treatmentType: "אשפוז", requirements: ["preOp", "bloodTypeCross", "icu", "surgicalAssistant"] }),

  // ---- מילוי היומן: ניתוחים נוספים לכל המנתחים על פני השבועיים ----

  // ד"ר דוחנו אולג (doc-1)
  make({ id: "sur-21", code: "198815", hospital: "refael", doctorId: "doc-1", patientId: "pat-3", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-07-28", startTime: "08:00", duration: 90 }),
  make({ id: "sur-22", code: "198818", hospital: "refael", doctorId: "doc-1", patientId: "pat-7", name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", date: "2026-07-31", startTime: "08:00", duration: 60 }),
  make({ id: "sur-23", code: "198821", hospital: "refael", doctorId: "doc-1", patientId: "pat-5", name: "מיני מעקף קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-08-03", startTime: "14:30", duration: 110, treatmentType: "אשפוז" }),
  make({ id: "sur-24", code: "198824", hospital: "elisha", doctorId: "doc-1", patientId: "pat-2", name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", date: "2026-08-05", startTime: "11:00", duration: 85 }),
  make({ id: "sur-25", code: "198827", hospital: "elisha", doctorId: "doc-1", patientId: "pat-10", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-08-07", startTime: "08:30", duration: 90 }),

  // פרופ' דרקסלר מיכאל (doc-2) - אורתופדיה
  make({ id: "sur-26", code: "198830", hospital: "refael", doctorId: "doc-2", patientId: "pat-8", name: "החלפת מפרק ירך", organ: "ירך", side: "right", date: "2026-07-27", startTime: "09:00", duration: 150, anesthesia: "regional" }),
  make({ id: "sur-27", code: "198833", hospital: "elisha", doctorId: "doc-2", patientId: "pat-5", name: "Achilles tendon repair", organ: "גיד אכילס", side: "right", date: "2026-07-28", startTime: "11:30", duration: 75, anesthesia: "regional" }),
  make({ id: "sur-28", code: "198836", hospital: "refael", doctorId: "doc-2", patientId: "pat-4", name: "החלפת מפרק ברך", organ: "ברך", side: "left", date: "2026-07-30", startTime: "08:30", duration: 140, anesthesia: "regional" }),
  make({ id: "sur-29", code: "198839", hospital: "refael", doctorId: "doc-2", patientId: "pat-3", name: "החלפת מפרק ירך", organ: "ירך", side: "left", date: "2026-08-02", startTime: "09:00", duration: 150, anesthesia: "regional" }),
  make({ id: "sur-30", code: "198842", hospital: "refael", doctorId: "doc-2", patientId: "pat-9", name: "החלפת מפרק ברך", organ: "ברך", side: "right", date: "2026-08-05", startTime: "10:00", duration: 145, anesthesia: "regional" }),

  // פרופ' טיינין (doc-3) - בריאטרית
  make({ id: "sur-31", code: "198845", hospital: "elisha", doctorId: "doc-3", patientId: "pat-6", name: "שרוול קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-07-27", startTime: "08:00", duration: 120, treatmentType: "אשפוז" }),
  make({ id: "sur-32", code: "198848", hospital: "elisha", doctorId: "doc-3", patientId: "pat-10", name: "מיני מעקף קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-07-29", startTime: "10:00", duration: 110, treatmentType: "אשפוז" }),
  make({ id: "sur-33", code: "198851", hospital: "elisha", doctorId: "doc-3", patientId: "pat-5", name: "שרוול קיבה בלפרוסקופיה", organ: "קיבה", date: "2026-08-03", startTime: "09:30", duration: 120, treatmentType: "אשפוז" }),

  // ד"ר בניקם שלווה (doc-4) - כירורגיית שד
  make({ id: "sur-34", code: "198854", hospital: "elisha", doctorId: "doc-4", patientId: "pat-3", name: "כריתת שד חלקית", organ: "שד", side: "right", date: "2026-07-30", startTime: "12:00", duration: 100, requirements: ["preOp", "bloodTypeCross", "frozenSection", "breastFnlMarking"] }),
  make({ id: "sur-35", code: "198857", hospital: "refael", doctorId: "doc-4", patientId: "pat-6", name: "כריתת שד חלקית", organ: "שד", side: "left", date: "2026-08-04", startTime: "08:30", duration: 95, requirements: ["preOp", "bloodTypeCross", "breastIsotope"] }),

  // פרופ' חזן דוד (doc-5)
  make({ id: "sur-36", code: "198860", hospital: "refael", doctorId: "doc-5", patientId: "pat-7", name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", date: "2026-07-27", startTime: "11:00", duration: 90 }),
  make({ id: "sur-37", code: "198863", hospital: "refael", doctorId: "doc-5", patientId: "pat-2", name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", date: "2026-07-31", startTime: "09:00", duration: 85 }),
  make({ id: "sur-38", code: "198866", hospital: "elisha", doctorId: "doc-5", patientId: "pat-8", name: "אנדרטרקטומיה של עורק התרדמה", organ: "עורק תרדמה", side: "left", date: "2026-08-05", startTime: "08:00", duration: 130, requirements: ["preOp", "bloodTypeCross", "nerveMonitoring", "icu"] }),

  // ד"ר תבורי אלי (doc-6) - אורולוגיה
  make({ id: "sur-39", code: "198869", hospital: "refael", doctorId: "doc-6", patientId: "pat-4", name: "כריתת ערמונית רדיקלית", organ: "ערמונית", date: "2026-07-28", startTime: "14:00", duration: 160, treatmentType: "אשפוז", requirements: ["preOp", "bloodTypeCross", "icu"] }),
  make({ id: "sur-40", code: "198872", hospital: "refael", doctorId: "doc-6", patientId: "pat-2", name: "כריתת ערמונית רדיקלית", organ: "ערמונית", date: "2026-08-04", startTime: "13:00", duration: 155, treatmentType: "אשפוז", requirements: ["preOp", "bloodTypeCross", "icu", "surgicalAssistant"] }),

  // ד"ר בורג אלון (doc-7) - אורתופדיה
  make({ id: "sur-41", code: "198875", hospital: "refael", doctorId: "doc-7", patientId: "pat-5", name: "Achilles tendon repair", organ: "גיד אכילס", side: "left", date: "2026-07-30", startTime: "15:00", duration: 70, anesthesia: "regional" }),
  make({ id: "sur-42", code: "198878", hospital: "elisha", doctorId: "doc-7", patientId: "pat-8", name: "החלפת מפרק ברך", organ: "ברך", side: "left", date: "2026-08-06", startTime: "11:00", duration: 140, anesthesia: "regional" }),

  // ד"ר פריאל אילת (doc-8) - כלי דם
  make({ id: "sur-43", code: "198881", hospital: "elisha", doctorId: "doc-8", patientId: "pat-9", name: "אנדרטרקטומיה של עורק התרדמה", organ: "עורק תרדמה", side: "right", date: "2026-07-31", startTime: "12:30", duration: 125, requirements: ["preOp", "bloodTypeCross", "nerveMonitoring"] }),
  make({ id: "sur-44", code: "198884", hospital: "refael", doctorId: "doc-8", patientId: "pat-6", name: "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", organ: "בטן", date: "2026-08-06", startTime: "08:00", duration: 95 }),
];

/**
 * ניתוחים שנוצרים דטרמיניסטית לעשרות המנתחים הנוספים (doc-9 ואילך),
 * על פני השבועיים של המוקאפ - כדי שהיומן ירגיש כמו מערכת בשימוש אמיתי.
 */
const GEN_DATES = [
  "2026-07-26", "2026-07-27", "2026-07-28", "2026-07-29", "2026-07-30",
  "2026-07-31", "2026-08-02", "2026-08-03", "2026-08-04", "2026-08-05",
  "2026-08-06", "2026-08-07",
];

const GEN_PROCEDURES: { name: string; organ?: string; duration: number }[] = [
  { name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", duration: 90 },
  { name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", duration: 60 },
  { name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", duration: 85 },
  { name: "החלפת מפרק ברך", organ: "ברך", duration: 140 },
  { name: "החלפת מפרק ירך", organ: "ירך", duration: 150 },
  { name: "Achilles tendon repair", organ: "גיד אכילס", duration: 75 },
  { name: "שרוול קיבה בלפרוסקופיה", organ: "קיבה", duration: 120 },
  { name: "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", organ: "בטן", duration: 95 },
];

function genTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

const generatedSurgeries: Surgery[] = doctors.flatMap((doc) => {
  const docNum = Number(doc.id.split("-")[1]);
  // היומן של המשתמש המחובר נבנה ידנית בלבד (כולל יום 29/07 המדויק מהמפרט)
  if (docNum === 1) return [];

  const isExtra = docNum >= 9;
  // מנתחים חדשים: 6-9 ניתוחים לאורך היום; ותיקים: 2-3 השלמות ערב
  // (בשעות שאינן מתנגשות עם הניתוחים הידניים שלהם)
  const count = isExtra ? 6 + (docNum % 4) : 2 + (docNum % 2);

  return Array.from({ length: count }, (_, k) => {
    const date = GEN_DATES[(docNum * 5 + k * 3) % GEN_DATES.length];
    const startMinutes = isExtra
      ? 8 * 60 + k * 120 + ((docNum + k) % 4) * 30
      : 17 * 60 + k * 105;
    if (startMinutes > 19 * 60 + 30) return null;
    const proc = GEN_PROCEDURES[(docNum + k) % GEN_PROCEDURES.length];
    return make({
      id: `sur-gen-${docNum}-${k}`,
      code: String(199000 + docNum * 10 + k),
      hospital: (docNum + k) % 2 === 0 ? "refael" : "elisha",
      doctorId: doc.id,
      patientId: patients[(docNum + k) % patients.length].id,
      name: proc.name,
      organ: proc.organ,
      date,
      startTime: genTime(startMinutes),
      duration: proc.duration,
      anesthesia:
        proc.name.includes("מפרק") || proc.name.includes("Achilles") ? "regional" : "general",
    });
  }).filter((s): s is Surgery => s !== null);
});

initialSurgeries.push(...generatedSurgeries);
