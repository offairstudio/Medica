# Medica - פרוטוטייפ

פרוטוטייפ front-end למערכת Medica של בתי החולים רפאל ואלישע: מתיחת פנים למסכי המנתח + אזור מטופל חדש. נבנה לפי [MEDICA_SPEC.md](./MEDICA_SPEC.md) - מקור האמת של הפרויקט.

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
| כניסת מנתח | `/login` | כל ת.ז בת 9 ספרות מתקבלת |
| אימות OTP | `/verify` | כל קוד מתקבל; `000000` מדגים שגיאה |
| יומן ניתוחים | `/doctor/doc-1/schedule` | מסך הבית של המנתח. יום `29/07/2026` משחזר את המערכת הקיימת |
| כל הניתוחים | `/doctor/doc-1/all` | טבלה, סינון, ייצוא CSV |
| אשף יצירת ניתוח | `/surgery/new` | הקלדת "עיד" בשם פרטי מדגימה autocomplete |
| אזור מטופל | `/p` | המטופלת המחוברת: עידית גאז |
| כל הרכיבים | `/kitchen-sink` | עמוד פיתוח, אינו חלק מהמוצר |

## מבנה הקוד

```
src/
  i18n/he.ts          כל מחרוזות הממשק (מזהים באנגלית, טקסט בעברית)
  types/              מודל הנתונים המלא
  mock/               נתוני דמה - מנתחים, ניתוחים, תורים, בלוקים, מסמכים
  lib/                תאריכים בעברית, פורמטים, cn
  state/data.tsx      state גלובלי של הניתוחים (הוספה/עריכה/מחיקה/החלפה)
  components/
    primitives/       Button, Input, Select, Checkbox, Radio, Toggle, Textarea
    data/             Table, Card, Chip, Badge, Avatar, EmptyState, Skeleton
    overlay/          Modal, Drawer, Dropdown, Tooltip, Toast
    form/             Field, DatePicker, TimePicker, FileUpload, Stepper
    calendar/         MonthCalendar, BlockLegend
    layout/           AppShell, TopBar, DoctorSidebar, PatientNav, PageHeader
  features/           לוגיקת המסכים (יומן, אשף, החלפה, אזור מטופל)
  pages/              קומפוננטת route לכל מסך
```

## מוסכמות

- **RTL מלא**: `dir="rtl"` על ה-html; כל ה-layout ב-`start`/`end`. מספרים, שעות וטלפונים עטופים ב-`dir="ltr"` + `tabular-nums`.
- **טוקנים**: מוגדרים ב-`tailwind.config.js` וב-`src/styles/tokens.css`. אין ספריות UI חיצוניות.
- **"היום" של המוקאפ**: `MOCK_TODAY` ב-`src/mock/doctors.ts` (26/07/2026). כל נתוני הדמה מסודרים סביבו.
- **מצבים**: לכל מסך יש מצב תוכן / ריק / טעינה (מדומה ב-`useFakeLoading`).

## נקודות חיבור לצוות הפיתוח

- החלפת `src/mock/*` בקריאות API היא נקודת החיבור המרכזית; הטיפוסים ב-`src/types` מגדירים את החוזה.
- פעולות כתיבה (יצירה, עריכה, מחיקה, החלפה) עוברות דרך `src/state/data.tsx` - שם מחברים mutations אמיתיים.
- הורדות קבצים מפנות ל-`public/mock-files/`.
