import { useMemo } from "react";
import { addDays } from "date-fns";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { toDate, toISO } from "../../lib/date";
import { MOCK_TODAY } from "../../mock/doctors";
import { blocks } from "../../mock/blocks";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";
import type { Hospital, ISODate } from "../../types";

const WEEKDAY_LABELS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
/** חלון של שבוע סביב היום הנבחר, בדומה לפס הימים ביומן */
const WINDOW = 7;

export interface DayStripProps {
  doctorId: string;
  selectedDate: ISODate;
  onSelect: (date: ISODate) => void;
}

/**
 * פס ימים אופקי לניווט מהיר: שבעה ימים סביב היום הנבחר, כשהיום
 * הנבחר מסומן בעיגול מלא. החצים מזיזים שבוע. הסדר הוא RTL -
 * היום המוקדם ביותר בימין, כמו בכל שאר הממשק.
 */
export function DayStrip({ doctorId, selectedDate, onSelect }: DayStripProps) {
  const { surgeries } = useData();
  const isAll = doctorId === "all";

  const days = useMemo(() => {
    // היום הנבחר יושב במרכז החלון
    const first = addDays(toDate(selectedDate), -Math.floor(WINDOW / 2));
    return Array.from({ length: WINDOW }, (_, i) => {
      const date = addDays(first, i);
      return { iso: toISO(date), weekday: WEEKDAY_LABELS[date.getDay()], dayNum: date.getDate() };
    });
  }, [selectedDate]);

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

  function dayAriaLabel(iso: ISODate): string {
    const parts = [iso];
    const count = countByDay[iso] ?? 0;
    parts.push(count > 0 ? `${count} ניתוחים` : "אין ניתוחים");
    for (const h of freeHospitalsByDay[iso] ?? []) parts.push(`שעות פנויות ב${he.hospitals[h]}`);
    return parts.join(", ");
  }

  function shift(weeks: number) {
    onSelect(toISO(addDays(toDate(selectedDate), weeks * WINDOW)));
  }

  const arrowClass =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-ink";

  return (
    <div role="group" aria-label="ניווט מהיר בין ימים" className="flex items-center gap-1">
      <button type="button" aria-label="שבוע קודם" onClick={() => shift(-1)} className={arrowClass}>
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      {days.map((d, i) => {
        const selected = d.iso === selectedDate;
        const isToday = d.iso === MOCK_TODAY;
        return (
          <button
            key={d.iso}
            type="button"
            onClick={() => onSelect(d.iso)}
            aria-pressed={selected}
            aria-label={dayAriaLabel(d.iso)}
            title={dayAriaLabel(d.iso)}
            className={cn(
              "group flex w-11 shrink-0 flex-col items-center gap-0.5 rounded-md py-1",
              // במסך צר מציגים חמישה ימים סביב הנבחר, כדי לשמור על מטרות מגע רחבות
              (i === 0 || i === days.length - 1) && "hidden sm:flex",
            )}
          >
            <span
              className={cn(
                "text-[11px] font-semibold uppercase leading-none transition-colors duration-fast",
                selected ? "text-primary-700" : "text-muted",
              )}
            >
              {d.weekday}
            </span>
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-[17px] leading-none tnum transition-colors duration-fast",
                selected
                  ? "bg-primary-700 font-bold text-white"
                  : isToday
                    ? "font-bold text-primary-800 ring-1 ring-primary-400 group-hover:bg-primary-50"
                    : "font-semibold text-body group-hover:bg-surface-2",
              )}
            >
              {d.dayNum}
            </span>
          </button>
        );
      })}

      <button type="button" aria-label="שבוע הבא" onClick={() => shift(1)} className={arrowClass}>
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}
