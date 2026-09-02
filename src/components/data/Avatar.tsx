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

/** צללית רופא/ה עם תג זיהוי וחלוק, עבור פרופיל שלא הועלתה לו תמונה. */
function DoctorGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden focusable="false">
      <circle cx="48" cy="48" r="48" fill="currentColor" opacity=".12" />
      <circle cx="48" cy="34" r="15" fill="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14 92c1.4-15.5 15.4-26.5 34-26.5S80.6 76.5 82 92H14Zm26.5-25.8L48 80l7.5-13.8-7.5-1.3-7.5 1.3Z"
      />
      <path d="M39 67.2 48 80l9-12.8-4.8-2.3h-8.4L39 67.2Z" fill="white" opacity=".92" />
      <rect x="55" y="73" width="16" height="12" rx="3" fill="white" />
      <path d="M63 76v6m-3-3h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** קבוצת רופאים עם תג קטן - מצב "כל המנתחים". */
function DoctorsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden focusable="false">
      <circle cx="48" cy="48" r="48" fill="currentColor" opacity=".12" />
      <g fill="currentColor" opacity=".58">
        <circle cx="66" cy="33" r="11" />
        <path d="M48 75c1.2-12.7 8.5-20.7 18-20.7S82.8 62.3 84 75H48Z" />
      </g>
      <circle cx="38" cy="38" r="14" fill="currentColor" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 85c1.2-14.5 11.9-24.4 26-24.4S62.8 70.5 64 85H12Zm20.2-23.6L38 73l5.8-11.6L38 60.5l-5.8.9Z"
      />
      <path d="m30.8 61.8 7.2 11.5 7.2-11.5-3.8-1.7h-6.8l-3.8 1.7Z" fill="white" opacity=".92" />
      <circle cx="69" cy="70" r="11" fill="white" />
      <path d="M69 64.8v10.4m-5.2-5.2h10.4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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
