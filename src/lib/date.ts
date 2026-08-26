import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { he } from "date-fns/locale/he";
import type { ISODate, Time } from "../types";

/** '2026-07-29' → Date */
export function toDate(iso: ISODate): Date {
  return parseISO(iso);
}

/** Date → '2026-07-29' */
export function toISO(date: Date): ISODate {
  return format(date, "yyyy-MM-dd");
}

/** '29/07/26' */
export function formatShortDate(iso: ISODate): string {
  return format(toDate(iso), "dd/MM/yy");
}

/** '29/07/2026' */
export function formatNumericDate(iso: ISODate): string {
  return format(toDate(iso), "dd/MM/yyyy");
}

/** 'יום רביעי' */
export function formatWeekday(iso: ISODate): string {
  return format(toDate(iso), "EEEE", { locale: he });
}

/** 'יום רביעי, 29 ביולי 2026' */
export function formatFullDate(iso: ISODate): string {
  return format(toDate(iso), "EEEE, d בMMMM yyyy", { locale: he });
}

/** 'יולי 2026' */
export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy", { locale: he });
}

/** '29' + 'יולי' לבלוק תאריך בכרטיס */
export function formatDateBlock(iso: ISODate): { day: string; month: string } {
  const d = toDate(iso);
  return { day: format(d, "d"), month: format(d, "MMMM", { locale: he }) };
}

/** '16:00' + משך → '16:00-17:15' */
export function timeRange(start: Time, durationMinutes: number): string {
  return `${start}-${addMinutes(start, durationMinutes)}`;
}

export function addMinutes(time: Time, minutes: number): Time {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function timeToMinutes(time: Time): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** 260 דקות → '4:20 שעות' */
export function formatTotalHours(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${String(m).padStart(2, "0")} שעות`;
}

/** מספר ימים עד תאריך, יחסית ל"היום" של המוקאפ */
export function daysUntil(iso: ISODate, from: ISODate): number {
  return differenceInCalendarDays(toDate(iso), toDate(from));
}

/** 'בעוד 3 ימים' / 'היום' / 'מחר' */
export function relativeDayLabel(iso: ISODate, from: ISODate): string {
  const diff = daysUntil(iso, from);
  if (diff === 0) return "היום";
  if (diff === 1) return "מחר";
  if (diff > 1) return `בעוד ${diff} ימים`;
  if (diff === -1) return "אתמול";
  return `לפני ${Math.abs(diff)} ימים`;
}
