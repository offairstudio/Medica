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
        "rounded-md px-2 py-1 text-caption text-muted transition-colors duration-fast hover:text-body",
        className,
      )}
    >
      {next.name}
    </button>
  );
}
