import { useEffect, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatFullDate, formatMonthYear, toDate, toISO } from "../../lib/date";
import { HOSPITALS } from "../../mock/hospitals";
import { he } from "../../i18n/he";
import type { Hospital, ISODate } from "../../types";

export interface MonthCalendarProps {
  selectedDate?: ISODate | null;
  /** "היום" של המוקאפ */
  today: ISODate;
  /** נקודות סימון: תאריך → צבע בית חולים */
  markedDates?: Record<ISODate, Hospital>;
  /** עומס יומי: תאריך → סך דקות הניתוח המתוכננות */
  loadMinutes?: Record<ISODate, number>;
  onSelect?: (date: ISODate) => void;
  /** מגביל בחירה לתאריכים עם סימון (למודל ההחלפה) */
  selectableOnly?: boolean;
  className?: string;
}

const WEEKDAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

/**
 * תג העומס נקרא בתוך משבצת של 28px, ולכן הוא מעוגל לשעה שלמה
 * ונושא סימון יחידה ("ש׳") כדי שלא ייקרא כשעת יום. הערך המדויק
 * נמסר במקביל ב-title וב-aria-label של היום.
 */
function loadBadgeLabel(minutes: number): string {
  return minutes < 60 ? he.schedule.load.badgeMinutes(minutes) : he.schedule.load.badgeHours(Math.round(minutes / 60));
}

export function MonthCalendar({
  selectedDate,
  today,
  markedDates = {},
  loadMinutes = {},
  onSelect,
  selectableOnly,
  className,
}: MonthCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(toDate(selectedDate ?? today)));

  /**
   * הלוח משקף תמיד את החודש שבו נמצאים: מעבר ליום אחר ברשימה או בפס
   * הימים מזיז גם את הלוח. דפדוף ידני בחודשים נשאר עד לבחירת יום חדש.
   */
  const selectedMonthKey = selectedDate ? formatMonthYear(toDate(selectedDate)) : null;
  useEffect(() => {
    if (selectedDate) setViewMonth(startOfMonth(toDate(selectedDate)));
  }, [selectedMonthKey]);

  const isBrowsingAway =
    selectedDate != null && formatMonthYear(viewMonth) !== formatMonthYear(toDate(selectedDate));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth)),
    end: endOfWeek(endOfMonth(viewMonth)),
  });

  const todayDate = toDate(today);
  const selected = selectedDate ? toDate(selectedDate) : null;

  return (
    <div className={cn("select-none", className)}>
      <div className="mb-3 flex items-center justify-between">
        {/* הכותרת מציגה את החודש שמוצג, ולחיצה עליה מחזירה לחודש של היום הנבחר */}
        <button
          type="button"
          onClick={() => selectedDate && setViewMonth(startOfMonth(toDate(selectedDate)))}
          disabled={!isBrowsingAway}
          title={isBrowsingAway ? `חזרה ל${formatFullDate(selectedDate!)}` : undefined}
          className={cn(
            "rounded-md px-1 py-0.5 text-h3 font-semibold text-ink transition-colors duration-fast",
            isBrowsingAway && "text-primary-700 hover:bg-primary-50",
          )}
        >
          {formatMonthYear(viewMonth)}
        </button>
        {/* שני החצים יחד בקצה שמאל: קודם מימין, הבא משמאלו */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            aria-label="חודש קודם"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            aria-label="חודש הבא"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-caption font-semibold text-muted">
            {d}
          </span>
        ))}
        {days.map((day) => {
          const iso = toISO(day);
          const inMonth = isSameMonth(day, viewMonth);
          const isToday = isSameDay(day, todayDate);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const mark = markedDates[iso];
          const minutes = loadMinutes[iso];
          const disabled = !inMonth || (selectableOnly && !mark);

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled && !isToday}
              onClick={() => onSelect?.(iso)}
              aria-label={minutes ? `${iso}, ${he.schedule.load.exact(minutes)}` : iso}
              title={minutes ? he.schedule.load.exact(minutes) : undefined}
              aria-pressed={isSelected}
              className={cn(
                "relative mx-auto flex h-12 w-full flex-col items-center justify-start rounded-md pt-1 transition-colors duration-fast",
                !inMonth && "invisible",
                disabled && inMonth && "cursor-default opacity-40",
                // ימים עם ניתוחים נצבעים כגלולה, כך שהחודש נקרא במבט אחד
                minutes ? "bg-primary-100" : !disabled && "hover:bg-primary-50",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full tnum transition-colors duration-fast",
                  // הבחירה היא הסימון החזק; היום הנוכחי מסומן בטבעת
                  minutes && !isSelected && "text-primary-800",
                  isSelected && "bg-primary-700 font-bold text-white",
                  isToday && !isSelected && "font-bold text-primary-800 ring-2 ring-primary-500",
                  isToday && isSelected && "ring-2 ring-primary-300 ring-offset-1",
                )}
              >
                {day.getDate()}
              </span>
              {minutes ? (
                <span
                  aria-hidden
                  className="mt-px px-1 text-[11px] font-semibold leading-tight text-primary-800 tnum"
                >
                  {loadBadgeLabel(minutes)}
                </span>
              ) : mark ? (
                <span aria-hidden className={cn("mt-0.5 h-1.5 w-1.5 rounded-full", HOSPITALS[mark].dotClass)} />
              ) : null}
            </button>
          );
        })}
      </div>

    </div>
  );
}
