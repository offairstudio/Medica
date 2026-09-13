import type { Doctor } from "../types";
import { isEnglish, m } from "./localize";

/**
 * "היום" של המוקאפ. כל הנתונים מסודרים סביב התאריך הזה,
 * כך שההדגמה תמיד נראית עדכנית.
 */
export const MOCK_TODAY = "2026-07-26";

const BASE_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    firstName: m("אולג", "Oleg"),
    lastName: m("דוחנו", "Dohno"),
    displayName: m('ד"ר דוחנו אולג', "Dr. Oleg Dohno"),
    title: m('ד"ר', "Dr."),
    email: "oleg.dohno@raphael.co.il",
    mobile: "0523372667",
    licenseNumber: "1-47382",
    departmentId: "dep-1",
    managedByMe: true,
  },
  {
    id: "doc-2",
    firstName: m("מיכאל", "Michael"),
    lastName: m("דרקסלר", "Drexler"),
    displayName: m("פרופ' דרקסלר מיכאל", "Prof. Michael Drexler"),
    title: m("פרופ'", "Prof."),
    email: "m.drexler@raphael.co.il",
    mobile: "0528114923",
    licenseNumber: "1-29847",
    departmentId: "dep-2",
    managedByMe: true,
  },
  {
    id: "doc-3",
    firstName: "",
    lastName: m("טיינין", "Tainin"),
    displayName: m("פרופ' טיינין", "Prof. Tainin"),
    title: m("פרופ'", "Prof."),
    email: "tainin@raphael.co.il",
    mobile: "0542218837",
    licenseNumber: "1-31205",
    departmentId: "dep-3",
    managedByMe: true,
  },
  {
    id: "doc-4",
    firstName: m("שלווה", "Shalva"),
    lastName: m("בניקם", "Benikam"),
    displayName: m('ד"ר בניקם שלווה', "Dr. Shalva Benikam"),
    title: m('ד"ר', "Dr."),
    email: "s.benikam@raphael.co.il",
    mobile: "0537761204",
    licenseNumber: "1-52918",
    departmentId: "dep-4",
    managedByMe: true,
  },
  {
    id: "doc-5",
    firstName: m("דוד", "David"),
    lastName: m("חזן", "Hazan"),
    displayName: m("פרופ' חזן דוד", "Prof. David Hazan"),
    title: m("פרופ'", "Prof."),
    email: "d.hazan@raphael.co.il",
    mobile: "0509923471",
    licenseNumber: "1-18463",
    departmentId: "dep-1",
    managedByMe: true,
  },
  {
    id: "doc-6",
    firstName: m("אלי", "Eli"),
    lastName: m("תבורי", "Tavori"),
    displayName: m('ד"ר תבורי אלי', "Dr. Eli Tavori"),
    title: m('ד"ר', "Dr."),
    email: "e.tavori@raphael.co.il",
    mobile: "0526654389",
    licenseNumber: "1-61027",
    departmentId: "dep-5",
    managedByMe: true,
  },
  {
    id: "doc-7",
    firstName: m("אלון", "Alon"),
    lastName: m("בורג", "Burg"),
    displayName: m('ד"ר בורג אלון', "Dr. Alon Burg"),
    title: m('ד"ר', "Dr."),
    email: "a.burg@raphael.co.il",
    mobile: "0546672310",
    licenseNumber: "1-44519",
    departmentId: "dep-2",
    managedByMe: true,
  },
  {
    id: "doc-8",
    firstName: m("אילת", "Ayelet"),
    lastName: m("פריאל", "Priel"),
    displayName: m('ד"ר פריאל אילת', "Dr. Ayelet Priel"),
    title: m('ד"ר', "Dr."),
    email: "a.priel@raphael.co.il",
    mobile: "0503318842",
    licenseNumber: "1-58733",
    departmentId: "dep-6",
    managedByMe: true,
  },
];

/**
 * מנתחים נוספים שנוצרים דטרמיניסטית - כדי שהסרגל, היומן הכולל
 * והתצוגה החודשית ירגישו כמו מערכת חיה עם עשרות מנתחים.
 */
/** בעברית התואר ושם המשפחה קודמים, באנגלית התואר ואחריו השם הפרטי */
function displayName(title: string, first: string, last: string): string {
  return (isEnglish ? `${title} ${first} ${last}` : `${title} ${last} ${first}`).trim();
}

const EXTRA_NAMES: [first: string, last: string][] = [
  [m("יעל", "Yael"), m("אברמסון", "Abramson")], [m("רון", "Ron"), m("גולדברג", "Goldberg")], [m("מיכל", "Michal"), m("שטרן", "Stern")], [m("איתן", "Eitan"), m("לביא", "Lavi")],
  [m("נועם", "Noam"), m("רוזנברג", "Rosenberg")], [m("דנה", "Dana"), m("פלדמן", "Feldman")], [m("עומר", "Omer"), m("קציר", "Katzir")], [m("שירה", "Shira"), m("אלמוג", "Almog")],
  [m("גיא", "Guy"), m("ברנשטיין", "Bernstein")], [m("ליאת", "Liat"), m("שקד", "Shaked")], [m("אורי", "Uri"), m("מלמד", "Melamed")], [m("הילה", "Hila"), m("נבון", "Navon")],
  [m("יובל", "Yuval"), m("כרמי", "Carmi")], [m("טל", "Tal"), m("אשכנזי", "Ashkenazi")], [m("רועי", "Roi"), m("זילבר", "Zilber")], [m("מאיה", "Maya"), m("הראל", "Harel")],
  [m("אסף", "Asaf"), m("גורן", "Goren")], [m("ענת", "Anat"), m("ליבוביץ", "Leibovitz")], [m("ניר", "Nir"), m("שמעוני", "Shimoni")], [m("רותם", "Rotem"), m("אדלר", "Adler")],
  [m("עדי", "Adi"), m("ברק", "Barak")], [m("אלה", "Ella"), m("וייס", "Weiss")], [m("דור", "Dor"), m("פרידמן", "Friedman")], [m("נטע", "Neta"), m("רביד", "Ravid")],
  [m("עידו", "Ido"), m("סגל", "Segal")], [m("קרן", "Keren"), m("אופיר", "Ofir")], [m("תומר", "Tomer"), m("גלבוע", "Gilboa")], [m("מור", "Mor"), m("אילון", "Ilon")],
];

const GENERATED_DOCTORS: Doctor[] = EXTRA_NAMES.map(([first, last], i) => {
  const title = i % 5 === 0 ? m("פרופ'", "Prof.") : m('ד"ר', "Dr.");
  const id = `doc-${i + 9}`;
  return {
    id,
    firstName: first,
    lastName: last,
    displayName: displayName(title, first, last),
    title,
    email: `doctor${i + 9}@raphael.co.il`,
    mobile: `05${(2 + (i % 3))}${String(1000000 + i * 53791).slice(0, 7)}`,
    licenseNumber: `1-${60000 + i * 137}`,
    departmentId: `dep-${(i % 6) + 1}`,
    managedByMe: true,
  };
});

/**
 * מיעוט המנתחים ללא תמונת פרופיל - עבורם מוצג אייקון רופא/ה
 * במקום התמונה, כדי לוודא שגם המצב הזה נבדק בממשק.
 */
const WITHOUT_AVATAR = new Set(["doc-4", "doc-8", "doc-13", "doc-21", "doc-27", "doc-33"]);

export const doctors: Doctor[] = [...BASE_DOCTORS, ...GENERATED_DOCTORS].map((d) =>
  WITHOUT_AVATAR.has(d.id)
    ? d
    : {
        ...d,
        // סדרת פורטרטים אחידה לממשק; תשעת הצילומים חוזרים במחזור כדי
        // לשמור על גיוון בלי לייצר מאגר תמונות כבד עבור המוקאפ.
        avatarUrl: `/avatars/generated/doctor-${((Number(d.id.replace("doc-", "")) - 1) % 9) + 1}.png`,
      },
);

export function doctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

/** המשתמש המחובר למערכת - קבוע בכל המסכים, בנפרד מהמנתח הנצפה */
export const CURRENT_DOCTOR_ID = "doc-1";
export const currentDoctor: Doctor = doctors.find((d) => d.id === CURRENT_DOCTOR_ID)!;
