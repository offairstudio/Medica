import { cn } from "../../lib/cn";
import { HOSPITALS, CHIP_SHOWS_MARK } from "../../mock/hospitals";
import type { Hospital } from "../../types";

/**
 * ציור וקטורי שנטען כמסכה, כדי שאפשר יהיה לצבוע אותו - הלוגו הרשמי
 * מגיע בסגול אחיד, וכאן הוא צריך להופיע בלבן או בצבע המרכז.
 */
function MaskedArt({
  src,
  ratio,
  height,
  className,
}: {
  src: string;
  ratio: number;
  height: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block shrink-0", className)}
      style={{
        height: `${height}px`,
        width: `${Math.round(height * ratio)}px`,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/**
 * חתימת המרכז: הלוגו הרשמי שלו בגודל שנקרא בשורת יומן.
 * בעברית - סמל medica ושורת שם המרכז מתוך הלוגו; באנגלית - הלוקאפ
 * הרוחבי השלם, שבו שם המרכז יושב באותה שורה עם המילה medica.
 */
export function CentreSignature({
  hospital,
  height = 11,
  tone,
}: {
  hospital: Hospital;
  /** גובה הציור בפיקסלים */
  height?: number;
  /** צבע הציור - בלבן על צבע המרכז, או בצבע המרכז על רקע בהיר */
  tone: "white" | "centre";
}) {
  const info = HOSPITALS[hospital];
  const paint = tone === "white" ? "bg-white" : info.accentClass;

  return (
    <>
      {CHIP_SHOWS_MARK && (
        <MaskedArt src="/brand/medica-mark.svg" ratio={0.88} height={height + 2} className={paint} />
      )}
      <MaskedArt src={info.nameArt} ratio={info.nameRatio} height={height} className={paint} />
    </>
  );
}

/** הלוגו הרוחבי המלא של המרכז - למקומות שיש בהם מקום לקרוא אותו */
export function CentreLogo({
  hospital,
  className,
}: {
  hospital: Hospital;
  className?: string;
}) {
  const info = HOSPITALS[hospital];
  return <img src={info.wideLogo} alt={info.fullName} className={cn("block h-7 w-auto", className)} />;
}
