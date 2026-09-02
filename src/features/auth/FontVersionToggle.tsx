import { useState } from "react";
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
        "rounded-md px-2 py-1 text-caption text-muted transition-colors duration-fast hover:text-body",
        className,
      )}
    >
      מעבר לגרסת {next.name}
    </button>
  );
}
