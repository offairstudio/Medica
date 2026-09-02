import { EllipsisVertical, Pencil, ArrowLeftRight, Trash2, Monitor, Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import { HospitalChip } from "../../components/data/Chip";
import { Dropdown } from "../../components/overlay/Dropdown";
import { addMinutes } from "../../lib/date";
import { formatDuration } from "../../lib/format";
import { he } from "../../i18n/he";
import type { Surgery } from "../../types";

export interface SurgeryRowProps {
  surgery: Surgery;
  /** שם המנתח - מוצג ביומן הכולל של כל המנתחים */
  doctorName?: string;
  highlighted?: boolean;
  onView: (surgery: Surgery) => void;
  onEdit: (surgery: Surgery) => void;
  onSwap: (surgery: Surgery) => void;
  onDelete: (surgery: Surgery) => void;
}

/**
 * רשומת ניתוח ביום - כרטיס בדפוס של כרטיס התור באזור המטופל:
 * בלוק שעה בימין, שם המטופל ככותרת, תיאור הניתוח מתחתיו ושורת מטא אחת.
 */
export function SurgeryRow({
  surgery,
  doctorName,
  highlighted,
  onView,
  onEdit,
  onSwap,
  onDelete,
}: SurgeryRowProps) {
  const description = surgery.procedures.map((p) => p.name).join(" + ");
  const endTime = addMinutes(surgery.startTime, surgery.durationMinutes);
  const patientName = `${surgery.patient.firstName} ${surgery.patient.lastName}`;

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`צפייה בניתוח של ${patientName}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a, [role='menu']")) return;
        onView(surgery);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) onView(surgery);
      }}
      className={cn(
        "group cursor-pointer rounded-lg border border-line bg-surface p-4 shadow-sm transition-all duration-fast hover:border-primary-300 hover:shadow-md",
        highlighted && "flash-success",
      )}
    >
      <div className="flex items-start gap-4">
        {/* בלוק שעה - מקביל לבלוק התאריך בכרטיס התור */}
        <span className="flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-md bg-primary-100">
          <span dir="ltr" className="text-h3 font-bold leading-none text-primary-700 tnum">
            {surgery.startTime}
          </span>
          <span dir="ltr" className="mt-0.5 text-[12px] font-semibold text-primary-600 tnum">
            {endTime}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-h3 text-ink">{patientName}</span>
          <span className="mt-0.5 block truncate text-muted">{description}</span>

          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
            <HospitalChip hospital={surgery.hospital} compact />
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatDuration(surgery.durationMinutes)}
            </span>
            <span className="tnum">{surgery.patient.idNumber}</span>
            {doctorName && (
              <span className="truncate font-semibold text-primary-700">{doctorName}</span>
            )}

            <span className="ms-auto shrink-0">
              <Dropdown
                portal
                trigger={
                  <button
                    type="button"
                    aria-label={`פעולות לניתוח של ${patientName}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-primary-100 hover:text-primary-700"
                  >
                    <EllipsisVertical className="h-5 w-5" />
                  </button>
                }
                items={[
                  { key: "view", label: he.schedule.actions.view, icon: <Monitor />, onSelect: () => onView(surgery) },
                  { key: "edit", label: he.schedule.actions.edit, icon: <Pencil />, onSelect: () => onEdit(surgery) },
                  { key: "swap", label: he.schedule.actions.swap, icon: <ArrowLeftRight />, onSelect: () => onSwap(surgery) },
                  { key: "delete", label: he.schedule.actions.delete, icon: <Trash2 />, danger: true, onSelect: () => onDelete(surgery) },
                ]}
              />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
