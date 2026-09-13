import { useState } from "react";
import { Type } from "lucide-react";
import { cn } from "../../lib/cn";
import { applyFont, currentFont, otherFont, type FontVersion } from "../../lib/font";

/**
 * מעבר בין שתי גרסאות הפונט. מוצג בקטן בפינת מסך הכניסה,
 * כדי שאפשר יהיה להשוות בין הגרסאות בלי להיכנס להגדרות.
 */
export function FontVersionToggle({ className }: { className?: string }) {
  const [font, setFont] = useState<FontVersion>(() => currentFont());
  const next = otherFont(font);

  return (
    <button
      type="button"
      onClick={() => {
        applyFont(next);
        setFont(next);
      }}
      title={`${next.name} · ${next.note}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-caption font-semibold text-body transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700",
        className,
      )}
    >
      <Type className="h-4 w-4" aria-hidden />
      {next.name}
    </button>
  );
}
