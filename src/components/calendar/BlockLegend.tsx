import { cn } from "../../lib/cn";
import { HOSPITAL_LIST } from "../../mock/hospitals";
import { he } from "../../i18n/he";

/**
 * מקרא הלוח: משמעות תג השעות, ומפתח הצבעים של בתי החולים -
 * אותו צבע שממנו נגזרות רשומות היומן.
 */
export function BlockLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 text-caption text-body", className)}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="tnum rounded-full bg-primary-100 px-1.5 text-[11px] font-semibold text-primary-800"
        >
          {he.schedule.load.legendSample}
        </span>
        {he.schedule.calendarLegend.hours}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {HOSPITAL_LIST.map((h) => (
          <span key={h.key} className="flex items-center gap-2" title={h.fullName}>
            <span aria-hidden className={cn("h-2.5 w-2.5 rounded-full", h.dotClass)} />
            <span className="font-semibold text-body">{h.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
