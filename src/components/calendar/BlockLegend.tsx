import { cn } from "../../lib/cn";
import { he } from "../../i18n/he";

/**
 * מקרא בלוקים - שורה לכל בית חולים, שם בית החולים בצבע הזהות שלו
 * והסמלים בגודל אחיד (שיפור על המקרא המבלבל במערכת הקיימת).
 */
export function BlockLegend({ className }: { className?: string }) {
  const rows = [
    { key: "refael" as const, color: "text-hospital-refael", dot: "bg-hospital-refael", border: "border-hospital-refael" },
    { key: "elisha" as const, color: "text-hospital-elisha", dot: "bg-hospital-elisha", border: "border-hospital-elisha" },
  ];

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-4 text-caption text-body">
          <span className={cn("w-10 shrink-0 text-body-strong font-semibold", row.color)}>
            {he.hospitals[row.key]}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className={cn("h-3 w-3 rounded-full", row.dot)} />
            {he.schedule.blockLegend.full}
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className={cn("h-3 w-3 rounded-full border-2 bg-transparent", row.border)} />
            {he.schedule.blockLegend.block}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn("h-3 w-3 rounded-full border-2", row.border)}
              style={{
                background: `linear-gradient(90deg, var(--hospital-${row.key}) 50%, transparent 50%)`,
              }}
            />
            {he.schedule.blockLegend.partial}
          </span>
        </div>
      ))}
    </div>
  );
}
