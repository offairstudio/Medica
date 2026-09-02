import { useState } from "react";
import { cn } from "../../lib/cn";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-caption",
  md: "h-9 w-9 text-caption",
  lg: "h-12 w-12 text-[15px]",
};

/** אייקון רופא/ה קווי דו־גוני, עבור פרופיל שלא הועלתה לו תמונה. */
function DoctorGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="36" cy="20" r="9.5" />
        <path d="M13 64c1.2-17 9.5-27 23-27s21.8 10 23 27" />
        <path d="m25.5 39.5 10.5 12 10.5-12M36 52v12" />
      </g>
      <path
        d="M22 43c-5.5 4.8-8.4 11.8-9 21h13V43.5L22 43Z"
        fill="currentColor"
        opacity=".08"
      />
      <rect x="43" y="48" width="10" height="12" rx="2.5" stroke="#9A89C8" strokeWidth="2.6" />
      <path d="M48 51v6m-3-3h6" stroke="#9A89C8" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** שני רופאים בקו אחיד - מצב "כל המנתחים". */
function DoctorsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden focusable="false">
      <g stroke="#9A89C8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="49" cy="18" r="8" />
        <path d="M38 35c3-3.3 6.6-5 11-5 10.2 0 16.5 8.2 17.5 22" />
        <path d="m42 32.5 7 8 7-8" />
      </g>
      <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="27" cy="24" r="9" />
        <path d="M6 65c1-16.5 8.6-26 21-26s20 9.5 21 26" />
        <path d="m17 41.5 10 11 10-11M27 52.5V65" />
      </g>
      <path d="M11 49c-2.8 4.4-4.4 9.7-5 16h11V43.5c-2.3 1.5-4.3 3.3-6 5.5Z" fill="currentColor" opacity=".08" />
      <rect x="34" y="51" width="9" height="10" rx="2" stroke="#9A89C8" strokeWidth="2.4" />
    </svg>
  );
}

/** אייקון בגודל אווטר עם סימון "כל המנתחים" */
export function AllDoctorsAvatar({
  size = "md",
  className,
}: {
  size?: AvatarProps["size"];
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        // אותו עיגול של תמונת פרופיל, והאייקון יושב בתוכו עם שוליים
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700",
        sizes[size ?? "md"],
        className,
      )}
    >
      <DoctorsGlyph className="h-[72%] w-[72%]" />
    </span>
  );
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [broken, setBroken] = useState(false);

  // השם תמיד מוצג לצד האווטר, ולכן התמונה דקורטיבית ואינה נקראת פעמיים
  return src && !broken ? (
    <img
      src={src}
      alt=""
      aria-hidden
      title={name}
      onError={() => setBroken(true)}
      className={cn("shrink-0 rounded-full bg-primary-50 object-cover", sizes[size], className)}
    />
  ) : (
    <span
      aria-hidden
      title={name}
      className={cn(
        // אותו עיגול של תמונת פרופיל, והאייקון יושב בתוכו עם שוליים
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700",
        sizes[size],
        className,
      )}
    >
      <DoctorGlyph className="h-[72%] w-[72%]" />
    </span>
  );
}
