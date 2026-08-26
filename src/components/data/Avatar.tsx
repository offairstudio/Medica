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

/** ראשי תיבות משם מלא, מדלג על תארים */
function initials(name: string): string {
  const words = name
    .replace(/ד"ר|פרופ'|פרופ׳/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return src ? (
    <img
      src={src}
      alt={name}
      className={cn("shrink-0 rounded-full object-cover", sizes[size], className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary-200 font-semibold text-primary-800",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
