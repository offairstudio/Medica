import { useEffect, useMemo, useRef } from "react";
import { addDays } from "date-fns";
import { cn } from "../../lib/cn";
import { toDate, toISO } from "../../lib/date";
import { MOCK_TODAY } from "../../mock/doctors";
import { blocks } from "../../mock/blocks";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";
import type { Hospital, ISODate } from "../../types";

const WEEKDAY_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
/** שישה שבועות קדימה - גלילה על פני כל החודש הקרוב */
const DAYS_AHEAD = 42;

export interface DayStripProps {
  doctorId: string;
  selectedDate: ISODate;
  onSelect: (date: ISODate) => void;
}

/**
 * פס ימים אופקי - ניווט מהיר בין ימים כשהלוח החודשי אינו לצד הרשימה.
 * לכל יום: מספר הניתוחים, ונקודות זמינות בצבע בית החולים
 * (מוצגות רק כשקיים בלוק עם שעות פנויות - לא בלוק מלא).
 */
export function DayStrip({ doctorId, selectedDate, onSelect }: DayStripProps) {
  const { surgeries } = useData();
  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const isAll = doctorId === "all";

  const days = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, i) => {
        const date = toDate(MOCK_TODAY);
        const iso = toISO(addDays(date, i));
        return {
          iso,
          weekday: WEEKDAY_LETTERS[addDays(date, i).getDay()],
          dayNum: addDays(date, i).getDate(),
        };
      }),
    [],
  );

  const countByDay = useMemo(() => {
    const map: Record<ISODate, number> = {};
    for (const s of surgeries) {
      if ((isAll || s.doctorId === doctorId) && s.status !== "cancelled") {
        map[s.date] = (map[s.date] ?? 0) + 1;
      }
    }
    return map;
  }, [surgeries, doctorId, isAll]);

  /** בתי חולים עם שעות פנויות (בלוק שאינו מלא) לכל יום */
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

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedDate]);

  function dayAriaLabel(iso: ISODate): string {
    const parts = [iso];
    const count = countByDay[iso] ?? 0;
    if (count > 0) parts.push(`${count} ניתוחים`);
    for (const h of freeHospitalsByDay[iso] ?? []) {
      parts.push(`שעות פנויות ב${he.hospitals[h]}`);
    }
    return parts.join(", ");
  }

  return (
    <div>
      <div
        role="group"
        aria-label="ניווט מהיר בין ימים"
        className="flex gap-1.5 overflow-x-auto px-3 pt-2.5 pb-1.5 scrollbar-thin"
      >
        {days.map((d) => {
          const selected = d.iso === selectedDate;
          const isToday = d.iso === MOCK_TODAY;
          const count = countByDay[d.iso] ?? 0;
          const freeHospitals = freeHospitalsByDay[d.iso] ?? [];

          return (
            <button
              key={d.iso}
              ref={selected ? selectedRef : undefined}
              type="button"
              onClick={() => onSelect(d.iso)}
              aria-pressed={selected}
              aria-label={dayAriaLabel(d.iso)}
              title={dayAriaLabel(d.iso)}
              className={cn(
                "flex min-h-[64px] w-12 shrink-0 flex-col items-center justify-start gap-0.5 rounded-md border pt-1.5 transition-colors duration-fast",
                selected
                  ? "border-primary-700 bg-primary-700 text-white"
                  : isToday
                    ? "border-primary-400 bg-primary-50 text-primary-800 hover:bg-primary-100"
                    : "border-line bg-surface text-body hover:border-primary-300 hover:bg-primary-50",
              )}
            >
              <span className={cn("text-[11px] leading-none", selected ? "text-white/90" : "text-muted")}>
                {d.weekday}
              </span>
              <span className="text-[15px] font-semibold leading-tight tnum">{d.dayNum}</span>
              <span className="flex min-h-[14px] items-center gap-1">
                {count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-bold leading-[15px] tnum",
                      selected ? "bg-white/25 text-white" : "bg-primary-200 text-primary-800",
                    )}
                  >
                    {count}
                  </span>
                )}
                {freeHospitals.map((h) => (
                  <span
                    key={h}
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      selected
                        ? "bg-white/80"
                        : h === "refael"
                          ? "bg-hospital-refael"
                          : "bg-hospital-elisha",
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {/* מקרא קצר - מה אומרים הסימנים */}
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pb-2 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span aria-hidden className="inline-flex h-[15px] items-center rounded-full bg-primary-200 px-1.5 text-[11px] font-bold text-primary-800 tnum">3</span>
          ניתוחים ביום
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hospital-refael" />
          שעות פנויות ברפאל
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hospital-elisha" />
          שעות פנויות באלישע
        </span>
      </p>
    </div>
  );
}
