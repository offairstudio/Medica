import type { Hospital } from "../types";
import { m } from "./localize";

export interface HospitalInfo {
  key: Hospital;
  /** שם המרכז כולל שם המותג - לצ'יפ ולמקרא */
  name: string;
  /** השם המלא כפי שהוא מופיע באתר הרשת */
  fullName: string;
  /** כתובת המרכז - נתון דמה, יש להחליף בכתובות האמיתיות */
  address: string;
  /** רקע הצ'יפ - טקסט לבן על כולם */
  chipClass: string;
  /** נקודת סימון בלוח ובפס הימים */
  dotClass: string;
  /** רקע רשומת היומן - גוון בהיר של צבע בית החולים */
  softClass: string;
  /** פס הצד של הרשומה */
  accentClass: string;
  /** שעות הרשומה, בצבע בית החולים */
  textClass: string;
}

/**
 * מרכזי רשת medica כפי שהם מופיעים באתר הרשת.
 * גווני הצ'יפ נבחרו למרחק ויזואלי מרבי ביניהם - רפאל ואלישע בצבעי המותג
 * המתועדים, ותל אביב ועפולה בגוונים משלימים לצורך הפרוטוטייפ.
 */
export const HOSPITALS: Record<Hospital, HospitalInfo> = {
  refael: {
    key: "refael",
    name: m("medica רפאל", "medica Refael"),
    fullName: m("medica רפאל, תל אביב", "medica Refael, Tel Aviv"),
    address: m("דרך השלום 53, תל אביב", "53 Derech HaShalom St, Tel Aviv"),
    chipClass: "bg-hospital-refael",
    dotClass: "bg-hospital-refael",
    softClass: "bg-hospital-refael-soft",
    accentClass: "bg-hospital-refael",
    textClass: "text-hospital-refael",
  },
  elisha: {
    key: "elisha",
    name: m("medica אלישע", "medica Elisha"),
    fullName: m("medica - בית חולים אלישע, חיפה", "medica – Elisha Hospital, Haifa"),
    address: m("יאיר כץ 12, חיפה", "12 Yair Katz St, Haifa"),
    chipClass: "bg-hospital-elisha",
    dotClass: "bg-hospital-elisha",
    softClass: "bg-hospital-elisha-soft",
    accentClass: "bg-hospital-elisha",
    textClass: "text-hospital-elisha",
  },
  telAviv: {
    key: "telAviv",
    name: m("medica תל אביב", "medica Tel Aviv"),
    fullName: m("medica תל אביב, הברזל 28", "medica Tel Aviv, 28 HaBarzel St"),
    address: m("הברזל 28, תל אביב", "28 HaBarzel St, Tel Aviv"),
    chipClass: "bg-hospital-telaviv",
    dotClass: "bg-hospital-telaviv",
    softClass: "bg-hospital-telaviv-soft",
    accentClass: "bg-hospital-telaviv",
    textClass: "text-hospital-telaviv",
  },
  rmc: {
    key: "rmc",
    name: m("medica עפולה", "medica Afula"),
    fullName: m("medica RMC, עפולה", "medica RMC, Afula"),
    address: m("יהושע חנקין 5, עפולה", "5 Yehoshua Hankin St, Afula"),
    chipClass: "bg-hospital-rmc",
    dotClass: "bg-hospital-rmc",
    softClass: "bg-hospital-rmc-soft",
    accentClass: "bg-hospital-rmc",
    textClass: "text-hospital-rmc",
  },
};

export const HOSPITAL_LIST = Object.values(HOSPITALS);
