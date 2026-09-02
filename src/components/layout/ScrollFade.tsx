import { cn } from "../../lib/cn";

/**
 * דהייה לבנה בקצה אזור גלילה: התוכן נמוג אל תוך הרקע במקום להיחתך
 * בקו חד. מונח מעל אזור הגלילה, ואינו קולט עכבר.
 */
export function ScrollFade({
  edge = "top",
  className,
}: {
  edge?: "top" | "bottom";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 h-8",
        edge === "top" ? "top-0 bg-gradient-to-b" : "bottom-0 bg-gradient-to-t",
        "from-canvas via-canvas/70 to-transparent",
        className,
      )}
    />
  );
}
