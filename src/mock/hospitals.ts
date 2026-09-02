import type { Hospital } from "../types";

export interface HospitalInfo {
  key: Hospital;
  /** שם קצר לצ'יפ ולמקרא */
  name: string;
  /** השם המלא כפי שהוא מופיע באתר הרשת */
  fullName: string;
  /** רקע הצ'יפ - טקסט לבן על כולם */
  chipClass: string;
  /** נקודת סימון בלוח ובפס הימים */
  dotClass: string;
}

/**
 * מרכזי רשת medica כפי שהם מופיעים באתר הרשת.
 * גווני הצ'יפ נבחרו למרחק ויזואלי מרבי ביניהם - רפאל ואלישע בצבעי המותג
 * המתועדים, ותל אביב ועפולה בגוונים משלימים לצורך הפרוטוטייפ.
 */
export const HOSPITALS: Record<Hospital, HospitalInfo> = {
  refael: {
    key: "refael",
    name: "רפאל",
    fullName: "medica רפאל, תל אביב",
    chipClass: "bg-hospital-refael",
    dotClass: "bg-hospital-refael",
  },
  elisha: {
    key: "elisha",
    name: "אלישע",
    fullName: "medica - בית חולים אלישע, חיפה",
    chipClass: "bg-hospital-elisha",
    dotClass: "bg-hospital-elisha",
  },
  telAviv: {
    key: "telAviv",
    name: "תל אביב",
    fullName: "medica תל אביב, הברזל 28",
    chipClass: "bg-hospital-telaviv",
    dotClass: "bg-hospital-telaviv",
  },
  rmc: {
    key: "rmc",
    name: "עפולה",
    fullName: "medica RMC, עפולה",
    chipClass: "bg-hospital-rmc",
    dotClass: "bg-hospital-rmc",
  },
};

export const HOSPITAL_LIST = Object.values(HOSPITALS);
