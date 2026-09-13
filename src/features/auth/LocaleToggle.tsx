import { Languages } from "lucide-react";
import { cn } from "../../lib/cn";
import { currentLocale, otherLocale, setLocale } from "../../i18n/locale";

/**
 * מעבר בין שפות הממשק. מוצג לצד מעבר גרסאות הפונט במסך הכניסה,
 * כדי שאפשר יהיה לבחון את הפונטים בעברית ובאנגלית.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const next = otherLocale(currentLocale());

  return (
    <button
      type="button"
      onClick={() => setLocale(next.key)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-caption font-semibold text-body transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700",
        className,
      )}
    >
      <Languages className="h-4 w-4" aria-hidden />
      {next.name}
    </button>
  );
}
