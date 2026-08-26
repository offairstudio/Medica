import { MoreVertical, Pencil, ArrowLeftRight, Trash2, Monitor } from "lucide-react";
import { cn } from "../../lib/cn";
import { HospitalChip } from "../../components/data/Chip";
import { Dropdown } from "../../components/overlay/Dropdown";
import { Tooltip } from "../../components/overlay/Tooltip";
import { addMinutes } from "../../lib/date";
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
 * שורת ניתוח בפריסת "יומן יומי": עמודת זמן קבועה בתחילת השורה,
 * אחריה צ'יפ בית חולים - כך הזמנים והתגיות נסרקים בטור ישר.
 * לחיצה על השורה פותחת צפייה; תפריט הפעולות בקצה השמאלי.
 */
export function SurgeryRow({ surgery, doctorName, highlighted, onView, onEdit, onSwap, onDelete }: SurgeryRowProps) {
  const description = surgery.procedures.map((p) => p.name).join(" + ");
  const endTime = addMinutes(surgery.startTime, surgery.durationMinutes);

  function openView(e: React.MouseEvent | React.KeyboardEvent) {
    if ((e.target as HTMLElement).closest("button, a, [role='menu']")) return;
    onView(surgery);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`צפייה בניתוח של ${surgery.patient.firstName} ${surgery.patient.lastName}`}
      onClick={openView}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) openView(e);
      }}
      className={cn(
        "group relative flex min-h-[72px] cursor-pointer items-center gap-4 border-b border-line px-4 py-2 transition-colors duration-fast last:border-b-0 hover:bg-primary-50",
        "max-md:flex-col max-md:items-stretch max-md:gap-2 max-md:rounded-md max-md:border max-md:border-line max-md:py-3",
        highlighted && "flash-success",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 start-0 w-[3px] bg-primary-500 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
      />

      {/* עמודת זמן - שעת התחלה מודגשת, סיום מתחת */}
      <div className="flex shrink-0 items-baseline gap-1 max-md:pe-10 md:w-[64px] md:flex-col md:gap-0">
        <span dir="ltr" className="text-mono-num font-semibold text-ink tnum">
          {surgery.startTime}
        </span>
        <span aria-hidden className="text-caption text-muted md:hidden">
          -
        </span>
        <span dir="ltr" className="text-caption text-muted tnum">
          {endTime}
        </span>
      </div>

      {/* עמודת בית חולים */}
      <div className="shrink-0 md:w-16">
        <HospitalChip hospital={surgery.hospital} />
      </div>

      {/* תיאור הניתוח (+ שם המנתח ביומן הכולל) */}
      <div className="min-w-0 flex-1">
        <Tooltip content={description} className="max-w-full">
          <p className="truncate text-body">{description}</p>
        </Tooltip>
        {doctorName && (
          <p className="truncate text-caption font-semibold text-primary-700">{doctorName}</p>
        )}
      </div>

      {/* מטופל */}
      <div className="md:w-40 md:shrink-0">
        <p className="truncate text-body-strong font-semibold text-ink">
          {surgery.patient.firstName} {surgery.patient.lastName}
        </p>
        <p className="text-caption text-muted tnum">{surgery.patient.idNumber}</p>
      </div>

      {/* תפריט פעולות - בקצה השמאלי של השורה */}
      <div className="max-md:absolute max-md:end-2 max-md:top-2 md:w-9 md:shrink-0">
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label={`פעולות לניתוח של ${surgery.patient.firstName} ${surgery.patient.lastName}`}
              className="rounded-md p-2 text-muted transition-colors duration-fast hover:bg-primary-100 hover:text-primary-700"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          }
          items={[
            {
              key: "edit",
              label: he.schedule.actions.edit,
              icon: <Pencil />,
              onSelect: () => onEdit(surgery),
            },
            {
              key: "swap",
              label: he.schedule.actions.swap,
              icon: <ArrowLeftRight />,
              onSelect: () => onSwap(surgery),
            },
            {
              key: "delete",
              label: he.schedule.actions.delete,
              icon: <Trash2 />,
              danger: true,
              onSelect: () => onDelete(surgery),
            },
            {
              key: "view",
              label: he.schedule.actions.view,
              icon: <Monitor />,
              onSelect: () => onView(surgery),
            },
          ]}
        />
      </div>
    </div>
  );
}
