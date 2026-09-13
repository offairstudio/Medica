import { Clock } from "lucide-react";
import { CentreSignature } from "../components/data/CentreArt";
import { HOSPITALS } from "../mock/hospitals";
import { cn } from "../lib/cn";
import type { Hospital } from "../types";

/**
 * עמוד השוואה: איך הלוגו של כל מרכז נכנס לרשומת יומן.
 * כל האפשרויות מוצגות בגודל האמיתי של הממשק, זו מתחת לזו.
 */

const WIDE: Record<Hospital, string> = {
  refael: "/brand/centres/refael-wide.svg",
  telAviv: "/brand/centres/telaviv-wide.svg",
  rmc: "/brand/centres/rmc-wide.svg",
  elisha: "/brand/centres/elisha-wide.png",
};

const SAMPLES: { hospital: Hospital; patient: string; procedure: string; start: string; end: string }[] = [
  { hospital: "refael", patient: "דניאל כהן", procedure: "כריתת כיס מרה בלפרוסקופיה", start: "09:00", end: "10:30" },
  { hospital: "telAviv", patient: "תמר גולדשטיין", procedure: "תיקון בקע טבורי בלפרוסקופיה", start: "11:00", end: "12:00" },
  { hospital: "elisha", patient: "יוסי אברהמי", procedure: "מיני מעקף קיבה בלפרוסקופיה", start: "13:30", end: "15:20" },
  { hospital: "rmc", patient: "רחל ברקוביץ", procedure: "החלפת מפרק ברך", start: "15:30", end: "17:50" },
];

function Row({
  sample,
  badge,
}: {
  sample: (typeof SAMPLES)[number];
  badge: (hospital: Hospital) => React.ReactNode;
}) {
  const hospital = HOSPITALS[sample.hospital];
  return (
    <div className={cn("rounded-lg p-4", hospital.softClass)}>
      <div className="flex items-start gap-4">
        <span aria-hidden className={cn("w-1 shrink-0 self-stretch rounded-full", hospital.accentClass)} />
        <span className={cn("flex h-14 w-16 shrink-0 flex-col items-center justify-center", hospital.textClass)}>
          <span dir="ltr" className="text-h3 font-bold leading-none tnum">{sample.start}</span>
          <span dir="ltr" className="mt-0.5 text-[12px] font-semibold tnum">{sample.end}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-h3 text-ink">{sample.patient}</span>
          <span className="mt-0.5 block truncate text-muted">{sample.procedure}</span>
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
            {badge(sample.hospital)}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              90 דק'
            </span>
            <span className="tnum">312845679</span>
          </span>
        </span>
      </div>
    </div>
  );
}

function Option({
  letter,
  title,
  note,
  live,
  badge,
}: {
  letter: string;
  title: string;
  note: string;
  live?: boolean;
  badge: (hospital: Hospital) => React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
          {letter}
        </span>
        <h2 className="text-h3 text-ink">{title}</h2>
        {live && (
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-caption font-semibold text-success">
            מוצג כרגע במערכת
          </span>
        )}
      </div>
      <p className="mb-3 mt-1 text-caption text-muted">{note}</p>
      <div className="space-y-2">
        {SAMPLES.map((s) => (
          <Row key={s.hospital} sample={s} badge={badge} />
        ))}
      </div>
    </section>
  );
}

export default function LogoLab() {
  return (
    <div className="min-h-screen bg-canvas px-6 py-10 lg:px-10">
      <header className="mx-auto max-w-5xl">
        <h1 className="text-h1 text-ink">הלוגו של המרכזים בתוך היומן</h1>
        <p className="mt-2 max-w-3xl text-body text-muted">
          כל רשומה ביומן צריכה לומר באיזה מרכז הניתוח מתקיים. האילוץ: בלוגו העברי שם המרכז יושב
          בשורה משנית קטנה מתחת למילה medica, ולכן בגודל של תגית בשורה הוא אינו נקרא, וארבעת
          המרכזים נראים זהים. באנגלית הלוקאפ הרשמי הוא שורה אחת (medica | Tel Aviv) והוא נקרא היטב.
          להלן האפשרויות, כולן בגודל האמיתי.
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-5xl gap-6">
        <Option
          letter="א"
          title="הלוגו הרשמי המלא בתוך השורה"
          note="הלוגו הרוחבי של המרכז בגובה שרשומה מאפשרת (16 פיקסלים). כאן רואים את הבעיה: שם המרכז והסלוגן אינם נקראים, ושלושה מרכזים נראים אותו דבר."
          badge={(h) => (
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-2.5 py-1 shadow-sm">
              <img src={WIDE[h]} alt={HOSPITALS[h].fullName} className="h-4 w-auto" />
            </span>
          )}
        />

        <Option
          letter="ב"
          title="חתימת הלוגו בלבן, על צבע המרכז"
          live
          note="שם המרכז נלקח מתוך הלוגו עצמו - אותה טיפוגרפיה, עם סמל medica - ומוצג בלבן על צבע המרכז. הצבע הוא מה שמאפשר לסרוק יום שלם במבט אחד."
          badge={(h) => (
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1", HOSPITALS[h].chipClass)}>
              <CentreSignature hospital={h} tone="white" height={11} />
            </span>
          )}
        />

        <Option
          letter="ג"
          title="חתימת הלוגו בצבע המרכז, על לבן"
          note="אותה חתימה, בגרסה שקטה יותר: הכרטיס נושא את הצבע והתגית נשארת לבנה. עדין יותר, אך הזיהוי מהיר פחות."
          badge={(h) => (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 shadow-sm">
              <CentreSignature hospital={h} tone="centre" height={11} />
            </span>
          )}
        />

        <Option
          letter="ד"
          title="נקודה ושם בלבד"
          note="בלי לוגו בשורה: נקודה בצבע המרכז ושם קצר בפונט הממשק. הכי קומפקטי, והלוגו המלא מוצג פעם אחת בראש המסך ובמגירת הפרטים."
          badge={(h) => (
            <span className="inline-flex items-center gap-1.5 font-semibold text-body">
              <span aria-hidden className={cn("h-2 w-2 rounded-full", HOSPITALS[h].dotClass)} />
              {HOSPITALS[h].name}
            </span>
          )}
        />

        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-h3 text-ink">הלוגו המלא, במקומות שיש בהם מקום</h2>
          <p className="mb-4 mt-1 text-caption text-muted">
            ראש מגירת הפרטים, כותרת יום או מקרא - שם הלוגו מוצג בגובה 28 עד 40 פיקסלים ונקרא במלואו,
            כולל הסלוגן. זה נכון בכל אחת מהאפשרויות שלמעלה.
          </p>
          <div className="space-y-3">
            {(Object.keys(HOSPITALS) as Hospital[]).map((h) => (
              <div key={h} className={cn("flex items-center gap-4 rounded-lg p-4", HOSPITALS[h].softClass)}>
                <span aria-hidden className={cn("w-1 shrink-0 self-stretch rounded-full", HOSPITALS[h].accentClass)} />
                <img src={WIDE[h]} alt={HOSPITALS[h].fullName} className="h-7 w-auto" />
                <img src={WIDE[h]} alt="" aria-hidden className="ms-auto hidden h-10 w-auto sm:block" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
