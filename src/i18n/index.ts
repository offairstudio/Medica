import { heStrings, type Strings } from "./he.strings";
import { enStrings } from "./en.strings";
import { currentLocale } from "./locale";

/**
 * מילון המחרוזות של השפה הפעילה. נקבע פעם אחת בטעינת העמוד;
 * החלפת שפה (setLocale) טוענת את העמוד מחדש.
 */
export const t: Strings = currentLocale() === "en" ? enStrings : heStrings;

export type { Strings };
export { heStrings, enStrings };
