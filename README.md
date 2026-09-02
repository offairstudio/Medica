# Medica - פרוטוטייפ

פרוטוטייפ front-end למערכת Medica של רשת בתי החולים: מתיחת פנים למסכי המנתח + אזור מטופל חדש. נבנה לפי [MEDICA_SPEC.md](./MEDICA_SPEC.md) - מקור האמת של הפרויקט.

**דמו חי:** https://medica-vert-iota.vercel.app

**אין backend.** כל הנתונים מגיעים מ-`src/mock/`, מצב נשמר ב-React state בלבד.

## גרסאות סקופ

| ענף | סקופ |
|---|---|
| `design/v1-spec-baseline` | דרישות עסקיות + MEDICA_SPEC.md בלבד |
| `design/v1-clinical-calm` | הגרסה המורחבת - כולל 27 יכולות שמעבר לדרישות |

שתי הגרסאות זהות בשפה העיצובית. הפירוט המלא: [docs/SCOPE.md](./docs/SCOPE.md).

## הרצה

```bash
npm install
npm run dev
```

נפתח על `http://localhost:5173`.

## כניסה מהירה

| מסך | כתובת | הערות |
|---|---|---|
| כניסת מנתח | `/login` | כל ת.ז בת 9 ספרות מתקבלת. בפינה למטה - מעבר בין שתי גרסאות הפונט |
| אימות OTP | `/verify` | כל קוד מתקבל; `000000` מדגים שגיאה |
| יומן מנתח | `/doctor/doc-1/schedule` | תצוגה יומית: בלוקי זמן בצבע בית החולים, לוח חודשי ומגירת פרטים |
| יומן כולל | `/doctor/all/schedule` | כל המנתחים - טבלה עם כל המאפיינים, סינון, מיון וייצוא CSV |
| אשף יצירת ניתוח | `/surgery/new` | הקלדת "עיד" בשם פרטי מדגימה autocomplete |
| אזור מטופל | `/p` | המטופלת המחוברת: עידית גאז |
| כל הרכיבים | `/kitchen-sink` | עמוד פיתוח, אינו חלק מהמוצר |

## מבנה הקוד

```
src/
  i18n/he.ts          כל מחרוזות הממשק (מזהים באנגלית, טקסט בעברית)
  types/              מודל הנתונים המלא
  mock/               נתוני דמה - מנתחים, ניתוחים, תורים, בלוקים, מסמכים, בתי חולים
  lib/                תאריכים בעברית, פורמטים, cn
  state/data.tsx      state גלובלי של הניתוחים (הוספה/עריכה/מחיקה/החלפה)
  components/
    primitives/       Button, Input, Select, Checkbox, Radio, Toggle, Textarea
    data/             Table, Card, Chip, Badge, Avatar, EmptyState, Skeleton
    overlay/          Sheet (מגירה), Modal, Drawer, Dropdown, Tooltip, Toast
    form/             Field, DatePicker, TimePicker, FileUpload, Stepper
    calendar/         MonthCalendar, BlockLegend
    layout/           AppShell, ScreenHeader, ScrollArea, DoctorNav, PatientNav, BrandMark
  features/           לוגיקת המסכים (יומן, אשף, החלפה, אזור מטופל)
  pages/              קומפוננטת route לכל מסך
```

## מוסכמות

- **RTL מלא**: `dir="rtl"` על ה-html; כל ה-layout ב-`start`/`end`. מספרים, שעות וטלפונים עטופים ב-`dir="ltr"` + `tabular-nums`.
- **טוקנים**: מוגדרים ב-`tailwind.config.js` וב-`src/styles/tokens.css`. אין ספריות UI חיצוניות.
- **"היום" של המוקאפ**: `MOCK_TODAY` ב-`src/mock/doctors.ts` (26/07/2026). כל נתוני הדמה מסודרים סביבו.
- **מצבים**: לכל מסך יש מצב תוכן / ריק / טעינה (מדומה ב-`useFakeLoading`).
- **בתי חולים**: ארבעת המרכזים מוגדרים ב-`src/mock/hospitals.ts` - שם, צבע, גוון רקע ופס. הצבעים נגזרים מפלטת המותג בלבד (נייבי, תכלת, סגול), ורשומת ניתוח נצבעת לפי המרכז שלה.
- **נתוני היומן**: `src/mock/schedulePlan.ts` מחולל דטרמיניסטית ימי ניתוח לכל המנתחים מ-13/07/2026 עד 30/09/2026, ומשמש מקור יחיד גם לניתוחים וגם לבלוקים - כך שהחלונות הפנויים נגזרים מאותה מציאות.
- **פונטים**: שתי גרסאות דו-לשוניות - Assistant ו-Heebo. הבחירה נשמרת ב-localStorage ומוחלת ב-`src/lib/font.ts`.
- **אווטרים**: תצלומי סטוק ב-`public/avatars/`; מי שאין לו תמונה מקבל אייקון רופא/ה. המקורות מתועדים ב-[public/SOURCES.md](./public/SOURCES.md).

## נקודות חיבור לצוות הפיתוח

- החלפת `src/mock/*` בקריאות API היא נקודת החיבור המרכזית; הטיפוסים ב-`src/types` מגדירים את החוזה.
- פעולות כתיבה (יצירה, עריכה, מחיקה, החלפה) עוברות דרך `src/state/data.tsx` - שם מחברים mutations אמיתיים.
- הורדות קבצים מפנות ל-`public/mock-files/`.
- אין ניהול משתמשים אמיתי: מסכי הכניסה מקבלים כל קלט תקין, ואין שמירת session.
