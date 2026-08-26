import { differenceInCalendarDays } from "date-fns";
import { toDate } from "../../lib/date";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

export interface AppointmentGroup {
  label: string;
  items: Appointment[];
}

/** קיבוץ תורים עתידיים: השבוע / החודש / בהמשך */
export function groupUpcoming(appointments: Appointment[], today: string): AppointmentGroup[] {
  const groups: Record<string, Appointment[]> = {};
  for (const a of appointments) {
    const diff = differenceInCalendarDays(toDate(a.date), toDate(today));
    const label =
      diff <= 7
        ? he.patient.groups.thisWeek
        : diff <= 31
          ? he.patient.groups.thisMonth
          : he.patient.groups.later;
    (groups[label] ??= []).push(a);
  }
  const order = [he.patient.groups.thisWeek, he.patient.groups.thisMonth, he.patient.groups.later];
  return order.filter((l) => groups[l]).map((l) => ({ label: l, items: groups[l] }));
}

/** קיבוץ תורים קודמים: החודש / שלושת החודשים האחרונים / מוקדם יותר */
export function groupPast(appointments: Appointment[], today: string): AppointmentGroup[] {
  const groups: Record<string, Appointment[]> = {};
  for (const a of appointments) {
    const diff = differenceInCalendarDays(toDate(today), toDate(a.date));
    const label =
      diff <= 31
        ? he.patient.groups.thisMonth
        : diff <= 92
          ? he.patient.groups.lastThreeMonths
          : he.patient.groups.earlier;
    (groups[label] ??= []).push(a);
  }
  const order = [
    he.patient.groups.thisMonth,
    he.patient.groups.lastThreeMonths,
    he.patient.groups.earlier,
  ];
  return order.filter((l) => groups[l]).map((l) => ({ label: l, items: groups[l] }));
}
