import type { Doctor } from "../types";

/**
 * "היום" של המוקאפ. כל הנתונים מסודרים סביב התאריך הזה,
 * כך שההדגמה תמיד נראית עדכנית.
 */
export const MOCK_TODAY = "2026-07-26";

const BASE_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    firstName: "אולג",
    lastName: "דוחנו",
    displayName: 'ד"ר דוחנו אולג',
    title: 'ד"ר',
    avatarUrl: "/avatars/doc-1.svg",
    email: "oleg.dohno@raphael.co.il",
    mobile: "0523372667",
    licenseNumber: "1-47382",
    departmentId: "dep-1",
    managedByMe: true,
  },
  {
    id: "doc-2",
    firstName: "מיכאל",
    lastName: "דרקסלר",
    displayName: "פרופ' דרקסלר מיכאל",
    title: "פרופ'",
    avatarUrl: "/avatars/doc-2.svg",
    email: "m.drexler@raphael.co.il",
    mobile: "0528114923",
    licenseNumber: "1-29847",
    departmentId: "dep-2",
    managedByMe: true,
  },
  {
    id: "doc-3",
    firstName: "",
    lastName: "טיינין",
    displayName: "פרופ' טיינין",
    title: "פרופ'",
    avatarUrl: "/avatars/doc-3.svg",
    email: "tainin@raphael.co.il",
    mobile: "0542218837",
    licenseNumber: "1-31205",
    departmentId: "dep-3",
    managedByMe: true,
  },
  {
    id: "doc-4",
    firstName: "שלווה",
    lastName: "בניקם",
    displayName: 'ד"ר בניקם שלווה',
    title: 'ד"ר',
    email: "s.benikam@raphael.co.il",
    mobile: "0537761204",
    licenseNumber: "1-52918",
    departmentId: "dep-4",
    managedByMe: true,
  },
  {
    id: "doc-5",
    firstName: "דוד",
    lastName: "חזן",
    displayName: "פרופ' חזן דוד",
    title: "פרופ'",
    avatarUrl: "/avatars/doc-5.svg",
    email: "d.hazan@raphael.co.il",
    mobile: "0509923471",
    licenseNumber: "1-18463",
    departmentId: "dep-1",
    managedByMe: true,
  },
  {
    id: "doc-6",
    firstName: "אלי",
    lastName: "תבורי",
    displayName: 'ד"ר תבורי אלי',
    title: 'ד"ר',
    email: "e.tavori@raphael.co.il",
    mobile: "0526654389",
    licenseNumber: "1-61027",
    departmentId: "dep-5",
    managedByMe: true,
  },
  {
    id: "doc-7",
    firstName: "אלון",
    lastName: "בורג",
    displayName: 'ד"ר בורג אלון',
    title: 'ד"ר',
    avatarUrl: "/avatars/doc-7.svg",
    email: "a.burg@raphael.co.il",
    mobile: "0546672310",
    licenseNumber: "1-44519",
    departmentId: "dep-2",
    managedByMe: true,
  },
  {
    id: "doc-8",
    firstName: "אילת",
    lastName: "פריאל",
    displayName: 'ד"ר פריאל אילת',
    title: 'ד"ר',
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
const EXTRA_NAMES: [first: string, last: string][] = [
  ["יעל", "אברמסון"], ["רון", "גולדברג"], ["מיכל", "שטרן"], ["איתן", "לביא"],
  ["נועם", "רוזנברג"], ["דנה", "פלדמן"], ["עומר", "קציר"], ["שירה", "אלמוג"],
  ["גיא", "ברנשטיין"], ["ליאת", "שקד"], ["אורי", "מלמד"], ["הילה", "נבון"],
  ["יובל", "כרמי"], ["טל", "אשכנזי"], ["רועי", "זילבר"], ["מאיה", "הראל"],
  ["אסף", "גורן"], ["ענת", "ליבוביץ"], ["ניר", "שמעוני"], ["רותם", "אדלר"],
  ["עדי", "ברק"], ["אלה", "וייס"], ["דור", "פרידמן"], ["נטע", "רביד"],
  ["עידו", "סגל"], ["קרן", "אופיר"], ["תומר", "גלבוע"], ["מור", "אילון"],
];

const GENERATED_DOCTORS: Doctor[] = EXTRA_NAMES.map(([first, last], i) => {
  const title = i % 5 === 0 ? ("פרופ'" as const) : ('ד"ר' as const);
  const id = `doc-${i + 9}`;
  return {
    id,
    firstName: first,
    lastName: last,
    displayName: `${title} ${last} ${first}`,
    title,
    email: `doctor${i + 9}@raphael.co.il`,
    mobile: `05${(2 + (i % 3))}${String(1000000 + i * 53791).slice(0, 7)}`,
    licenseNumber: `1-${60000 + i * 137}`,
    departmentId: `dep-${(i % 6) + 1}`,
    managedByMe: true,
  };
});

export const doctors: Doctor[] = [...BASE_DOCTORS, ...GENERATED_DOCTORS];

export function doctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}

/** המשתמש המחובר למערכת - קבוע בכל המסכים, בנפרד מהמנתח הנצפה */
export const CURRENT_DOCTOR_ID = "doc-1";
export const currentDoctor: Doctor = doctors.find((d) => d.id === CURRENT_DOCTOR_ID)!;
