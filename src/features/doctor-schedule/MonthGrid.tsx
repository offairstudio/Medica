import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Plus } from "lucide-react";
import { cn } from "../../lib/cn";
import { toISO } from "../../lib/date";
import { doctorById, MOCK_TODAY } from "../../mock/doctors";
import { blocks } from "../../mock/blocks";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";
import type { Hospital, ISODate, Surgery } from "../../types";

const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const MAX_ENTRIES = 3;

export interface MonthGridProps {
  /** תאריך כלשהו בחודש המוצג */
  month: Date;
  doctorId: string;
  /** מעבר לתצוגה יומית של יום */
  onOpenDay: (date: ISODate) => void;
  /** פתיחת אשף יצירה עם תאריך ממולא */
  onCreate: (date: ISODate) => void;
  /** פתיחת פרטי ניתוח (פופאפ) */
  onOpenSurgery: (surgery: Surgery) => void;
}

/**
 * תצוגת חודש רחבה בסגנון יומן מלא: כל תא יום מציג את הניתוחים שלו,
 * אינדיקציית שעות פנויות לפי בית חולים, ויצירה מהירה בלחיצת +.
 */
export function MonthGrid({ month, doctorId, onOpenDay, onCreate, onOpenSurgery }: MonthGridProps) {
  const { surgeries } = useData();
  const isAll = doctorId === "all";

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
      }),
    [month],
  );

  const surgeriesByDay = useMemo(() => {
    const map: Record<ISODate, Surgery[]> = {};
    for (const s of surgeries) {
      if ((!isAll && s.doctorId !== doctorId) || s.status === "cancelled") continue;
      (map[s.date] ??= []).push(s);
    }
    for (const list of Object.values(map)) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [surgeries, doctorId, isAll]);

  const freeHospitalsByDay = useMemo(() => {
    const map: Record<ISODate, Hospital[]> = {};
    for (const b of blocks) {
      if (!(isAll || b.doctorId === doctorId)) continue;
      if (b.state === "full") continue;
      const list = map[b.date] ?? [];
      if (!list.includes(b.hospital)) list.push(b.hospital);
      map[b.date] = list;
    }
    return map;
  }, [doctorId, isAll]);

  return (
    <div>
      {/* שורת ימי השבוע */}
      <div className="grid grid-cols-7 border-b border-line bg-canvas/60">
        {WEEKDAYS.map((d) => (
          <span key={d} className="px-2 py-2 text-center text-caption font-semibold text-muted">
            {d}
          </span>
        ))}
      </div>

      {/* רשת הימים */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = toISO(day);
          const inMonth = isSameMonth(day, month);
          const isToday = iso === MOCK_TODAY;
          const daySurgeries = surgeriesByDay[iso] ?? [];
          const freeHospitals = freeHospitalsByDay[iso] ?? [];
          const overflow = daySurgeries.length - MAX_ENTRIES;

          return (
            <div
              key={iso}
              className={cn(
                "group/cell relative flex min-h-[118px] flex-col gap-1 border-b border-e border-line p-1.5 transition-colors duration-fast [&:nth-child(7n)]:border-e-0",
                inMonth ? "bg-surface" : "bg-canvas/50",
                isToday && "bg-primary-50/70",
              )}
            >
              {/* מספר היום - לחיצה עוברת לתצוגה היומית */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenDay(iso)}
                  aria-label={`מעבר לתצוגה יומית של ${iso}`}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-caption font-semibold tnum transition-colors duration-fast hover:bg-primary-100",
                    isToday && "bg-primary-700 text-white hover:bg-primary-800",
                    !inMonth && "text-muted/60",
                  )}
                >
                  {day.getDate()}
                </button>

                {/* יצירה מהירה - מופיע בריחוף */}
                {inMonth && (
                  <button
                    type="button"
                    onClick={() => onCreate(iso)}
                    aria-label={`יצירת ניתוח ב-${iso}`}
                    className="rounded-md p-1 text-primary-500 opacity-0 transition-opacity duration-fast hover:bg-primary-100 focus-visible:opacity-100 group-hover/cell:opacity-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* רשומות הניתוחים */}
              <div className="flex min-h-0 flex-1 flex-col gap-0.5">
                {daySurgeries.slice(0, MAX_ENTRIES).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onOpenSurgery(s)}
                    title={`${s.startTime} · ${s.patient.firstName} ${s.patient.lastName} · ${s.procedures.map((p) => p.name).join(" + ")}${isAll ? ` · ${doctorById(s.doctorId)?.displayName ?? ""}` : ""}`}
                    className={cn(
                      "flex items-center gap-1 rounded px-1 py-0.5 text-start text-[11px] leading-tight transition-colors duration-fast",
                      s.hospital === "refael"
                        ? "bg-hospital-refael/10 text-hospital-refael hover:bg-hospital-refael/20"
                        : "bg-hospital-elisha/10 text-hospital-elisha hover:bg-hospital-elisha/20",
                    )}
                  >
                    <span dir="ltr" className="shrink-0 font-bold tnum">
                      {s.startTime}
                    </span>
                    <span className="truncate font-semibold">
                      {s.patient.firstName} {s.patient.lastName}
                    </span>
                  </button>
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={() => onOpenDay(iso)}
                    className="rounded px-1 text-start text-[11px] font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
                  >
                    {he.schedule.moreCount(overflow)}
                  </button>
                )}
              </div>

              {/* אינדיקציית שעות פנויות לפי בית חולים */}
              {freeHospitals.length > 0 && inMonth && (
                <button
                  type="button"
                  onClick={() => onOpenDay(iso)}
                  title={freeHospitals.map((h) => `שעות פנויות ב${he.hospitals[h]}`).join(", ")}
                  className="flex items-center gap-1 rounded px-1 text-start text-[10px] font-semibold text-success transition-colors duration-fast hover:bg-success/10"
                >
                  {he.schedule.free}
                  {freeHospitals.map((h) => (
                    <span
                      key={h}
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        h === "refael" ? "bg-hospital-refael" : "bg-hospital-elisha",
                      )}
                    />
                  ))}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* מקרא */}
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span aria-hidden className="h-2 w-2 rounded-full bg-hospital-refael" />
          {he.hospitals.refael}
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden className="h-2 w-2 rounded-full bg-hospital-elisha" />
          {he.hospitals.elisha}
        </span>
        <span className="text-success">פנוי = שעות פנויות בבלוק</span>
        <span>לחיצה על מספר יום עוברת לתצוגה יומית</span>
      </p>
    </div>
  );
}
