import { t } from "../i18n";

/**
 * גרסאות הפונט של הפרוטוטייפ. שתיהן דו-לשוניות (עברית ולטינית),
 * והבחירה נשמרת בדפדפן כדי שאפשר יהיה להשוות ביניהן לאורך זמן.
 */
export interface FontVersion {
  key: "assistant" | "heebo";
  /** שם הפונט כפי שהוא מוצג במעבר בין הגרסאות */
  name: string;
  /** תיאור קצר של האופי שלו */
  note: string;
}

export const FONT_VERSIONS: FontVersion[] = [
  { key: "assistant", name: "Assistant", note: t.ui.fonts.assistant },
  { key: "heebo", name: "Heebo", note: t.ui.fonts.heebo },
];

const STORAGE_KEY = "medica:font";

export function currentFont(): FontVersion {
  const saved = typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
  return FONT_VERSIONS.find((f) => f.key === saved) ?? FONT_VERSIONS[0];
}

export function otherFont(font: FontVersion): FontVersion {
  return FONT_VERSIONS.find((f) => f.key !== font.key) ?? FONT_VERSIONS[0];
}

/** מחיל את הגרסה על המסמך כולו ושומר אותה */
export function applyFont(font: FontVersion) {
  document.documentElement.dataset.font = font.key;
  try {
    localStorage.setItem(STORAGE_KEY, font.key);
  } catch {
    // גלישה פרטית - הבחירה פשוט לא נשמרת
  }
}
