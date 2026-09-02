import { useState } from "react";
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
import { he } from "../../i18n/he";
import type { Hospital, ISODate } from "../../types";

export interface MonthCalendarProps {
  selectedDate?: ISODate | null;
  /** "היום" של המוקאפ */
  today: ISODate;
  /** נקודות סימון: תאריך → צבע בית חולים */
  markedDates?: Record<ISODate, Hospital>;
  /** תגי עומס: תאריך → שעות מתוכננות ("2.66") */
  loadBadges?: Record<ISODate, string>;
  onSelect?: (date: ISODate) => void;
  /** מגביל בחירה לתאריכים עם סימון (למודל ההחלפה) */
  selectableOnly?: boolean;
  className?: string;
}

const WEEKDAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

export function MonthCalendar({
  selectedDate,
  today,
  markedDates = {},
  loadBadges = {},
  onSelect,
  selectableOnly,
  className,
}: MonthCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(toDate(selectedDate ?? today)),
  );

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewMonth)),
    end: endOfWeek(endOfMonth(viewMonth)),
  });

  const todayDate = toDate(today);
  const selected = selectedDate ? toDate(selectedDate) : null;

  return (
    <div className={cn("select-none", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          aria-label="חודש קודם"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-h3 text-ink">{formatMonthYear(viewMonth)}</p>
          {selectedDate && (
            <p className="text-caption text-muted">{formatFullDate(selectedDate)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          aria-label="חודש הבא"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-0.5 text-center">
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
          const badge = loadBadges[iso];
          const disabled = !inMonth || (selectableOnly && !mark);

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled && !isToday}
              onClick={() => onSelect?.(iso)}
              aria-label={iso}
              aria-pressed={isSelected}
              className={cn(
                "relative mx-auto flex h-11 w-10 flex-col items-center justify-start rounded-md pt-1 transition-colors duration-fast",
                !inMonth && "invisible",
                disabled && inMonth && "cursor-default opacity-40",
                !disabled && "hover:bg-primary-50",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full tnum transition-colors duration-fast",
                  // הבחירה היא הסימון החזק; היום הנוכחי מסומן בטבעת
                  isSelected && "bg-primary-700 font-bold text-white",
                  isToday && !isSelected && "font-bold text-primary-800 ring-2 ring-primary-500",
                  isToday && isSelected && "ring-2 ring-primary-300 ring-offset-1",
                )}
              >
                {day.getDate()}
              </span>
              {badge ? (
                <span className="mt-px rounded-full bg-primary-200 px-1 text-[11px] font-semibold leading-tight text-primary-800 tnum">
                  {badge}
                </span>
              ) : mark ? (
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 h-1.5 w-1.5 rounded-full",
                    mark === "refael" ? "bg-hospital-refael" : "bg-hospital-elisha",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {onSelect && (
        <button
          type="button"
          onClick={() => {
            setViewMonth(startOfMonth(todayDate));
            onSelect(today);
          }}
          className="mt-2 inline-flex min-h-[40px] w-full items-center justify-center rounded-md text-caption font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50 hover:text-primary-800"
        >
          {he.schedule.backToToday}
        </button>
      )}
    </div>
  );
}
