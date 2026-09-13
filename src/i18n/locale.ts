/**
 * שפת הממשק. הבחירה נשמרת בדפדפן ומוחלת על המסמך כולו -
 * כולל כיוון הכתיבה - כך שאפשר להשוות את הפונטים בשתי השפות.
 */
export type Locale = "he" | "en";

export interface LocaleOption {
  key: Locale;
  /** שם השפה בשפה עצמה */
  name: string;
  dir: "rtl" | "ltr";
}

export const LOCALES: LocaleOption[] = [
  { key: "he", name: "עברית", dir: "rtl" },
  { key: "en", name: "English", dir: "ltr" },
];

const STORAGE_KEY = "medica:locale";

export function currentLocale(): Locale {
  const saved = typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
  return saved === "en" ? "en" : "he";
}

export function localeOption(key: Locale): LocaleOption {
  return LOCALES.find((l) => l.key === key) ?? LOCALES[0];
}

export function otherLocale(key: Locale): LocaleOption {
  return LOCALES.find((l) => l.key !== key) ?? LOCALES[0];
}

/** מחיל את כיוון הכתיבה ואת קוד השפה על המסמך */
export function applyLocaleAttributes(key: Locale) {
  const option = localeOption(key);
  document.documentElement.lang = option.key;
  document.documentElement.dir = option.dir;
}

/**
 * החלפת שפה. המחרוזות נקראות בזמן טעינת המודול, ולכן העמוד נטען
 * מחדש - מה שגם מבטיח שכיוון הכתיבה מוחל על כל העץ.
 */
export function setLocale(key: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // גלישה פרטית - הבחירה לא נשמרת, אבל הרענון עדיין יחיל אותה
  }
  applyLocaleAttributes(key);
  window.location.reload();
}
