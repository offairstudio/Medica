import { formatFullDate, relativeDayLabel } from "../../lib/date";
import type { Appointment } from "../../types";

export interface DateGroup {
  date: string;
  /** 'היום' / 'מחר' / 'בעוד 3 ימים' */
  relative: string;
  /** 'יום רביעי, 29 ביולי 2026' */
  full: string;
  items: Appointment[];
}

/**
 * קיבוץ לפי תאריך בפועל, כותרת לכל יום.
 * סדר הקבוצות נגזר מסדר הקלט - כך שרשימה עולה ורשימה יורדת עובדות זהה.
 */
export function groupByDate(appointments: Appointment[], today: string): DateGroup[] {
  const map = new Map<string, Appointment[]>();
  for (const a of appointments) {
    const list = map.get(a.date);
    if (list) list.push(a);
    else map.set(a.date, [a]);
  }
  return [...map.entries()].map(([date, items]) => ({
    date,
    relative: relativeDayLabel(date, today),
    full: formatFullDate(date),
    items,
  }));
}
