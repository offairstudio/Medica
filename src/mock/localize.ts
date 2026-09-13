import { currentLocale } from "../i18n/locale";

/** האם הממשק מוצג כעת באנגלית - נקבע פעם אחת בטעינת העמוד */
export const isEnglish = currentLocale() === "en";

/**
 * נתוני דמה דו-לשוניים. המחרוזת העברית היא המקור; כשהממשק באנגלית
 * מוצגת המקבילה האנגלית, כך שאפשר להשוות את שתי השפות על אותו תוכן.
 */
export function m(he: string, en: string): string {
  return isEnglish ? en : he;
}
