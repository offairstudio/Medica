import { cn } from "../../lib/cn";
import { HOSPITAL_LIST } from "../../mock/hospitals";
import { he } from "../../i18n/he";

/**
 * מקרא הלוח - מסביר בדיוק את מה שמצויר בו:
 * מצב היום הנבחר והיום הנוכחי, ולאחריהם משמעות הסימונים תחת המספר.
 */
export function BlockLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 text-caption text-body", className)}>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-[11px] font-bold text-white"
          >
            5
          </span>
          {he.schedule.calendarLegend.selected}
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-primary-800 ring-2 ring-primary-500"
          >
            5
          </span>
          {he.schedule.calendarLegend.today}
        </span>
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-2">
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="tnum rounded-full bg-primary-100 px-1.5 text-[11px] font-semibold text-primary-800"
          >
            {he.schedule.load.badgeHours(4)}
          </span>
          {he.schedule.calendarLegend.hours}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-caption text-muted">{he.schedule.calendarLegend.blockDot}</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {HOSPITAL_LIST.map((h) => (
            <span key={h.key} className="flex items-center gap-2" title={h.fullName}>
              <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full", h.dotClass)} />
              <span className="font-semibold text-body">{h.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
