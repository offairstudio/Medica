import type { Hospital, ISODate } from "../types";
import { doctors, MOCK_TODAY } from "./doctors";

/**
 * תוכנית היומן של כל המנתחים: ימי ניתוח, בית החולים של אותו יום
 * והניתוחים בתוכו. נגזרת דטרמיניסטית ממזהה המנתח והתאריך, כך שכל
 * טעינה של הפרוטוטייפ מציגה בדיוק את אותו יומן.
 *
 * הקובץ הוא מקור אחד לשניים: הניתוחים (surgeries.ts) והבלוקים
 * (blocks.ts), כדי שחלונות פנויים ייגזרו מאותה מציאות.
 */

const RANGE_START = "2026-07-13";
const RANGE_END = "2026-09-30";

/** ימי פעילות: ראשון עד חמישי */
const WORK_DAYS = [0, 1, 2, 3, 4];

export interface PlannedSurgery {
  startMinutes: number;
  durationMinutes: number;
  procedureIndex: number;
  patientIndex: number;
  cancelled: boolean;
}

export interface PlannedDay {
  doctorId: string;
  date: ISODate;
  hospital: Hospital;
  blockStartMinutes: number;
  blockEndMinutes: number;
  surgeries: PlannedSurgery[];
}

export const PLAN_PROCEDURES: {
  name: string;
  organ?: string;
  duration: number;
  regional?: boolean;
  admission?: boolean;
}[] = [
  { name: "כריתת כיס מרה בלפרוסקופיה", organ: "כיס מרה", duration: 90 },
  { name: "תיקון בקע טבורי בלפרוסקופיה", organ: "בטן", duration: 60 },
  { name: "תיקון בקע מפשעתי דו צידי בלפרוסקופיה", organ: "בטן", duration: 85 },
  { name: "החלפת מפרק ברך", organ: "ברך", duration: 140, regional: true, admission: true },
  { name: "החלפת מפרק ירך", organ: "ירך", duration: 150, regional: true, admission: true },
  { name: "שחזור גיד אכילס", organ: "גיד אכילס", duration: 75, regional: true },
  { name: "שרוול קיבה בלפרוסקופיה", organ: "קיבה", duration: 120, admission: true },
  { name: "תיקון בקע ונטרלי בגישה לפרוסקופית עם שתל", organ: "בטן", duration: 95 },
  { name: "כריתת שד חלקית", organ: "שד", duration: 100 },
  { name: "כריתת ערמונית רדיקלית", organ: "ערמונית", duration: 160, admission: true },
  { name: "אנדרטרקטומיה של עורק התרדמה", organ: "עורק תרדמה", duration: 130, admission: true },
  { name: "כריתת בלוטת התריס", organ: "בלוטת התריס", duration: 110, admission: true },
  { name: "ארתרוסקופיה של הברך", organ: "ברך", duration: 55, regional: true },
  { name: "כריתת תוספתן בלפרוסקופיה", organ: "תוספתן", duration: 50 },
  { name: "ניתוח קטרקט", organ: "עין", duration: 35 },
  { name: "תיקון מחיצת האף", organ: "אף", duration: 70 },
  { name: "כריתת מעי גס חלקית", organ: "מעי גס", duration: 165, admission: true },
  { name: "החלפת מפרק כתף", organ: "כתף", duration: 135, regional: true, admission: true },
];

/** בתי החולים בפריסה לא אחידה - רפאל הוא המרכז הגדול ביותר */
const HOSPITAL_WEIGHTS: Hospital[] = [
  "refael", "refael", "refael", "refael",
  "elisha", "elisha", "elisha",
  "telAviv", "telAviv",
  "rmc",
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** מחולל פסאודו־אקראי זעיר עם זרע קבוע (mulberry32) */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** כל ימי הפעילות בטווח, מקובצים לשבועות */
function workWeeks(): ISODate[][] {
  const weeks: ISODate[][] = [];
  const cursor = new Date(`${RANGE_START}T00:00:00`);
  const end = new Date(`${RANGE_END}T00:00:00`);
  let week: ISODate[] = [];
  while (cursor <= end) {
    if (cursor.getDay() === 0 && week.length) {
      weeks.push(week);
      week = [];
    }
    if (WORK_DAYS.includes(cursor.getDay())) week.push(toISO(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function pick<T>(r: () => number, list: T[]): T {
  return list[Math.floor(r() * list.length) % list.length];
}

export const plannedDays: PlannedDay[] = doctors.flatMap((doctor) => {
  const base = hash(doctor.id);
  const r = rng(base);
  // כמה ימי ניתוח בשבוע - רוב המנתחים 1-3
  const daysPerWeek = 1 + (base % 3);
  const days: PlannedDay[] = [];

  for (const week of workWeeks()) {
    const chosen = new Set<ISODate>();
    for (let i = 0; i < daysPerWeek; i += 1) chosen.add(pick(r, week));

    for (const date of chosen) {
      const hospital = pick(r, HOSPITAL_WEIGHTS);
      const afternoon = r() < 0.3;
      let cursor = afternoon ? 13 * 60 + (r() < 0.5 ? 0 : 60) : 7 * 60 + 30 + (r() < 0.6 ? 30 : 0);
      // הבלוק נפתח עם הניתוח הראשון - חלונות פנויים נוצרים מפערים אמיתיים ביום
      const blockStartMinutes = cursor;
      const count = 2 + Math.floor(r() * 3);
      const surgeries: PlannedSurgery[] = [];

      for (let k = 0; k < count; k += 1) {
        const procedureIndex = Math.floor(r() * PLAN_PROCEDURES.length);
        const durationMinutes = PLAN_PROCEDURES[procedureIndex].duration;
        if (cursor + durationMinutes > 21 * 60) break;
        surgeries.push({
          startMinutes: cursor,
          durationMinutes,
          procedureIndex,
          patientIndex: Math.floor(r() * 1000),
          // מיעוט ניתוחים מבוטלים, כדי שגם המצב הזה ייראה בממשק
          cancelled: r() < 0.03 && date >= MOCK_TODAY,
        });
        // לעיתים נשאר פער גדול באמצע היום - וכך נוצר חלון פנוי אמיתי
        cursor += durationMinutes + (r() < 0.25 ? 90 + Math.floor(r() * 3) * 30 : 15 + Math.floor(r() * 4) * 15);
      }

      if (!surgeries.length) continue;
      const last = surgeries[surgeries.length - 1];
      const blockEndMinutes = Math.min(
        22 * 60,
        last.startMinutes + last.durationMinutes + 45 + Math.floor(r() * 4) * 45,
      );
      days.push({ doctorId: doctor.id, date, hospital, blockStartMinutes, blockEndMinutes, surgeries });
    }
  }

  return days;
});
