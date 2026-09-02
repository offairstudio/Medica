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

/**
 * צללית רופא/ה - ראש וחלוק עם מפתח V, באותה גיאומטריה של האווטרים
 * המאוירים, כדי שמנתח ללא תמונה ייראה חלק מאותה משפחה ולא כחריג.
 */
function DoctorGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="currentColor" aria-hidden focusable="false">
      <circle cx="48" cy="37" r="17.5" />
      <path
        fillRule="evenodd"
        d="M12,96 C12,77 27.5,66.5 48,66.5 C68.5,66.5 84,77 84,96 Z M41,67.6 L48,84 L55,67.6 L48,66.9 Z"
      />
    </svg>
  );
}

/**
 * שתי צלליות - הסימון של "כל המנתחים", באותה שפה של אווטר יחיד
 * כדי שהשורה תיקרא כמו שורת מנתח ולא כפריט תפריט זר.
 */
function DoctorsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="currentColor" aria-hidden focusable="false">
      <g opacity=".45">
        <circle cx="64" cy="33" r="12" />
        <path d="M42,96 C42,79.5 51.5,70.5 64,70.5 C76.5,70.5 86,79.5 86,96 Z" />
      </g>
      <circle cx="39" cy="38" r="15" />
      <path
        fillRule="evenodd"
        d="M9,96 C9,80 21.5,71.5 39,71.5 C56.5,71.5 69,80 69,96 Z M33.5,72.2 L39,85 L44.5,72.2 L39,71.8 Z"
      />
    </svg>
  );
}

/** עיגול בגודל אווטר עם סימון "כל המנתחים" */
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
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700",
        sizes[size ?? "md"],
        className,
      )}
    >
      <DoctorsGlyph className="h-full w-full" />
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
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700",
        sizes[size],
        className,
      )}
    >
      <DoctorGlyph className="h-full w-full" />
    </span>
  );
}
