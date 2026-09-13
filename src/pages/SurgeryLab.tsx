import type { ReactNode } from "react";
import {
  Banknote,
  Bed,
  Boxes,
  CalendarDays,
  Clock,
  Hospital,
  IdCard,
  Info,
  Package,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Timer,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Chip } from "../components/data/Chip";
import { CentreSignature } from "../components/data/CentreArt";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { HOSPITALS } from "../mock/hospitals";
import { initialSurgeries } from "../mock/surgeries";
import { doctorById } from "../mock/doctors";
import { departmentName } from "../mock/departments";
import { lookups } from "../mock/lookups";
import { formatFullDate, timeRange } from "../lib/date";
import { cn } from "../lib/cn";
import { t } from "../i18n";
import type { Surgery } from "../types";

/**
 * עמוד השוואה: ארבע דרכים לארגן את מגירת פרטי הניתוח.
 * אותו ניתוח בכל אחת, בגודל האמיתי של המגירה.
 */

const base = initialSurgeries.find((s) => s.id === "sur-7")!;
const surgery: Surgery = {
  ...base,
  requirements: ["preOp", "bloodTypeCross", "icu", "nerveMonitoring"],
  combined: true,
  backupDoctorName: 'ד"ר בורג אלון',
  capitalEquipment: lookups.capitalEquipment[0],
  surgeonFee: { enabled: true, amount: 4200 },
};

const hospital = HOSPITALS[surgery.hospital];
const doctor = doctorById(surgery.doctorId);
const anesthesia = lookups.anesthesiaTypes.find((a) => a.key === surgery.anesthesia)?.label ?? "";
const requirementLabels = surgery.requirements
  .map((k) => lookups.requirements.find((r) => r.key === k)?.label)
  .filter(Boolean) as string[];
const title = `${surgery.procedures.map((p) => p.name).join(" + ")} · ${t.swap.codeLabel} ${surgery.code}`;

/** נתוני המגירה, כדי שכל האפשרויות יציגו בדיוק את אותו תוכן */
const when: { icon: LucideIcon; label: string; value: ReactNode }[] = [
  { icon: CalendarDays, label: t.ui.fields.date, value: formatFullDate(surgery.date) },
  {
    icon: Clock,
    label: t.ui.fields.time,
    value: (
      <span dir="ltr" className="tnum">
        {timeRange(surgery.startTime, surgery.durationMinutes)}
      </span>
    ),
  },
  { icon: Timer, label: t.ui.fields.duration, value: <span className="tnum">{t.ui.fmt.minutes(surgery.durationMinutes)}</span> },
  {
    icon: Hospital,
    label: t.ui.fields.centre,
    value: (
      <span className="inline-flex items-center gap-1.5">
        <CentreSignature hospital={surgery.hospital} tone="centre" height={12} />
        <span className="sr-only">{hospital.name}</span>
      </span>
    ),
  },
  {
    icon: Stethoscope,
    label: t.ui.fields.surgeon,
    value: doctor ? (
      <>
        {doctor.displayName}
        <span className="font-normal text-muted"> · {departmentName(doctor.departmentId)}</span>
      </>
    ) : null,
  },
];

const patient: { icon: LucideIcon; label: string; value: ReactNode }[] = [
  { icon: UserRound, label: t.ui.fields.fullName, value: `${surgery.patient.firstName} ${surgery.patient.lastName}` },
  { icon: IdCard, label: t.ui.fields.idNumber, value: <span className="tnum">{surgery.patient.idNumber}</span> },
  { icon: Phone, label: t.ui.fields.phone, value: <span dir="ltr" className="tnum">{surgery.patient.phone}</span> },
  { icon: ShieldCheck, label: t.ui.fields.hmo, value: surgery.patient.hmo },
  { icon: Wallet, label: t.ui.fields.payer, value: surgery.patient.payer },
  { icon: Banknote, label: t.wizard.step1.surgeonFee, value: <span className="tnum">₪{surgery.surgeonFee?.amount}</span> },
];

const execution: { icon: LucideIcon; label: string; value: ReactNode }[] = [
  { icon: Syringe, label: t.ui.fields.anesthesia, value: anesthesia },
  { icon: Bed, label: t.ui.fields.treatmentType, value: surgery.treatmentType },
  { icon: Package, label: t.wizard.step2.capitalEquipment, value: surgery.capitalEquipment },
  { icon: Boxes, label: t.wizard.step2.additionalEquipment, value: "—" },
  { icon: Users, label: t.ui.fields.combined, value: surgery.backupDoctorName },
];


/* ---------- אפשרויות לכותרת המגירה ---------- */

const patientName = `${surgery.patient.firstName} ${surgery.patient.lastName}`;
const procedureName = surgery.procedures.map((p) => p.name).join(" + ");
const codeText = `${t.swap.codeLabel} ${surgery.code}`;

/** פס העובדות הקצר שמופיע בחלק מהאפשרויות */
function FactsRow() {
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
      <span className="rounded-full bg-surface px-2 py-0.5 font-semibold tnum">{codeText}</span>
      <span>{formatFullDate(surgery.date)}</span>
      <span dir="ltr" className="tnum font-semibold text-ink">
        {timeRange(surgery.startTime, surgery.durationMinutes)}
      </span>
      <CentreSignature hospital={surgery.hospital} tone="centre" height={11} />
    </span>
  );
}

const HEADERS: { n: string; title: string; note: string; recommended?: boolean; render: ReactNode }[] = [
  {
    n: "1",
    title: "הפרוצדורה ראשית",
    note: "כמו היום: שם הניתוח והקוד. המטופל אינו מופיע בכותרת אלא רק בתוך הפרטים.",
    render: <h2 className="text-h2 text-ink">{`${procedureName} · ${codeText}`}</h2>,
  },
  {
    n: "2",
    title: "שם המטופל ראשי",
    note: "המטופל הוא מה שמזהה את הרשומה, והניתוח הוא מה שעושים לו.",
    render: (
      <>
        <h2 className="text-h2 text-ink">{patientName}</h2>
        <span className="mt-0.5 block text-muted">
          {procedureName} · <span className="tnum">{codeText}</span>
        </span>
      </>
    ),
  },
  {
    n: "3",
    title: "מטופל, ומתחת שורת עובדות",
    note: "שם המטופל בגדול, הניתוח מתחתיו, ושורה קצרה עם קוד, תאריך, שעה והמרכז - כך שהכותרת עונה על \"מי, מה, מתי ואיפה\" עוד לפני הגלילה.",
    recommended: true,
    render: (
      <>
        <h2 className="text-h2 text-ink">{patientName}</h2>
        <span className="block text-muted">{procedureName}</span>
        <FactsRow />
      </>
    ),
  },
  {
    n: "4",
    title: "מטופל ומועד",
    note: "בלי שם הניתוח בכותרת - הוא ממילא מופיע בכרטיס הניתוחים. מתאים אם רוצים כותרת שקטה.",
    render: (
      <>
        <h2 className="text-h2 text-ink">{patientName}</h2>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
          <span>{formatFullDate(surgery.date)}</span>
          <span dir="ltr" className="tnum font-semibold text-ink">
            {timeRange(surgery.startTime, surgery.durationMinutes)}
          </span>
          <CentreSignature hospital={surgery.hospital} tone="centre" height={11} />
          <span className="tnum">{codeText}</span>
        </span>
      </>
    ),
  },
];

/* ---------- אבני בניין ---------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
      <div className={cn("px-5 py-4", hospital.softClass)}>
        <h2 className="text-h2 text-ink">{title}</h2>
      </div>
      <div className="bg-canvas p-5">{children}</div>
      <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
        <span className="text-caption text-muted">{t.common.close}</span>
        <span className="rounded-md bg-primary-900 px-3 py-2 text-caption font-semibold text-white">
          {t.surgeryView.edit}
        </span>
      </div>
    </div>
  );
}

function Card({ title: cardTitle, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-lg border border-line bg-surface p-5 shadow-sm", className)}>
      {cardTitle && <h3 className="mb-1 text-h3 text-ink">{cardTitle}</h3>}
      {children}
    </section>
  );
}

/** שורה מלאה: אייקון, תווית בעמודה קבועה, ערך */
function WideRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 border-b border-line py-2 last:border-b-0">
      <Icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
      <dt className="w-28 shrink-0 font-semibold text-body">{label}</dt>
      <dd className="min-w-0 flex-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}

/** שורה דחוסה: תווית קטנה מעל הערך */
function StackedField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Requirements() {
  return (
    <section className="rounded-lg border border-primary-200 bg-primary-50 p-5">
      <h3 className="mb-2 flex items-center gap-2 text-h3 text-primary-800">
        <Info className="h-4 w-4 text-primary-500" aria-hidden />
        {t.wizard.step2.requirements}
      </h3>
      <div className="flex flex-wrap gap-2">
        {requirementLabels.map((label) => (
          <Chip key={label} color="primary">
            {label}
          </Chip>
        ))}
      </div>
    </section>
  );
}

function Documents() {
  return (
    <Card title={t.surgeryView.documents}>
      <ul>
        {surgery.documents.map((d) => (
          <DocumentRow key={d.id} doc={d} />
        ))}
      </ul>
    </Card>
  );
}

/* ---------- האפשרויות ---------- */

/** א · כמו היום: כרטיס מועד מלא, ומתחתיו שני כרטיסים */
function OptionA() {
  return (
    <div className="flex flex-col gap-6">
      <Card title={t.surgeryView.when}>
        <dl>
          {when.map((r) => (
            <WideRow key={r.label} {...r} />
          ))}
        </dl>
      </Card>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card title={t.surgeryView.patient}>
          <dl>
            {patient.map((r) => (
              <WideRow key={r.label} {...r} />
            ))}
          </dl>
        </Card>
        <Card title={t.surgeryView.execution}>
          <dl>
            {execution.map((r) => (
              <WideRow key={r.label} {...r} />
            ))}
          </dl>
        </Card>
      </div>
      <Requirements />
      <Documents />
    </div>
  );
}

/** ב · פס סיכום למעלה, ואז הפרטים */
function OptionB() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <StackedField label={t.ui.fields.date} value={formatFullDate(surgery.date)} />
          <StackedField
            label={t.ui.fields.time}
            value={
              <span dir="ltr" className="tnum">
                {timeRange(surgery.startTime, surgery.durationMinutes)}
              </span>
            }
          />
          <StackedField label={t.ui.fields.duration} value={<span className="tnum">{t.ui.fmt.minutes(surgery.durationMinutes)}</span>} />
          <StackedField
            label={t.ui.fields.centre}
            value={<CentreSignature hospital={surgery.hospital} tone="centre" height={12} />}
          />
          <StackedField label={t.ui.fields.surgeon} value={doctor?.displayName} />
          <StackedField label={t.ui.fields.anesthesia} value={anesthesia} />
        </dl>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card title={t.surgeryView.patient}>
          <dl>
            {patient.map((r) => (
              <WideRow key={r.label} {...r} />
            ))}
          </dl>
        </Card>
        <Card title={t.surgeryView.execution}>
          <dl>
            {execution.map((r) => (
              <WideRow key={r.label} {...r} />
            ))}
          </dl>
        </Card>
      </div>
      <Requirements />
      <Documents />
    </div>
  );
}

/** ג · רשימה אחת רציפה, בלי קופסאות פנימיות */
function OptionC() {
  const groups: { title: string; rows: typeof when }[] = [
    { title: t.surgeryView.when, rows: when },
    { title: t.surgeryView.patient, rows: patient },
    { title: t.surgeryView.execution, rows: execution },
  ];
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-line bg-surface px-5 shadow-sm">
        {groups.map((g) => (
          <div key={g.title} className="border-b border-line py-4 last:border-b-0">
            <h3 className="mb-1 text-caption font-bold uppercase tracking-wide text-muted">{g.title}</h3>
            <dl>
              {g.rows.map((r) => (
                <div key={r.label} className="flex min-h-[40px] items-center gap-3 py-1">
                  <r.icon className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                  <dt className="w-28 shrink-0 text-body">{r.label}</dt>
                  <dd className="min-w-0 flex-1 font-semibold text-ink">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </section>
      <Requirements />
      <Documents />
    </div>
  );
}

/** ד · כרטיסים דחוסים: תווית מעל הערך, שניים בשורה */
function OptionD() {
  const cards: { title: string; rows: typeof when }[] = [
    { title: t.surgeryView.when, rows: when },
    { title: t.surgeryView.patient, rows: patient },
    { title: t.surgeryView.execution, rows: execution },
  ];
  return (
    <div className="flex flex-col gap-6">
      {cards.map((c) => (
        <Card key={c.title} title={c.title}>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {c.rows.map((r) => (
              <StackedField key={r.label} label={r.label} value={r.value} />
            ))}
          </dl>
        </Card>
      ))}
      <Requirements />
      <Documents />
    </div>
  );
}

const OPTIONS = [
  { letter: "א", title: "כמו היום", note: "כרטיס מועד מלא בשורות רחבות, ומתחתיו מטופל וביצוע זה לצד זה.", render: <OptionA /> },
  { letter: "ב", title: "פס סיכום למעלה", note: "מה שצריך במבט ראשון - תאריך, שעה, משך, מרכז, מנתח והרדמה - בשורה אחת דחוסה; הפרטים המלאים מתחת.", render: <OptionB /> },
  { letter: "ג", title: "רשימה אחת רציפה", note: "קופסה אחת במקום שלוש. הקבוצות מופרדות בכותרת קטנה ובקו, והעין קוראת בעמודה אחת.", render: <OptionC /> },
  { letter: "ד", title: "כרטיסים דחוסים", note: "תווית קטנה מעל הערך, שניים-שלושה בשורה. הכי קצר לגלילה, פחות הפרדה בין שדה לשדה.", render: <OptionD /> },
];

export default function SurgeryLab() {
  return (
    <div className="min-h-screen bg-canvas px-6 py-10 lg:px-10">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-h1 text-ink">ארגון מגירת הניתוח</h1>
        <p className="mt-2 max-w-3xl text-body text-muted">
          אותו ניתוח בארבעה ארגונים שונים, בגודל האמיתי של המגירה. הצבע בראש המגירה הוא של המרכז
          שבו הניתוח מתקיים, בכל האפשרויות.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-6xl">
        <h2 className="text-h2 text-ink">מה כתוב בראש המגירה</h2>
        <p className="mb-4 mt-1 max-w-3xl text-caption text-muted">
          ארבע אפשרויות לכותרת, כולן על גוון המרכז. שימו לב: ככל שהכותרת נושאת יותר פרטי זיהוי,
          כך הכרטיס "מועד ומקום" שבגוף המגירה נחוץ פחות.
        </p>
        <div className="grid max-w-[720px] gap-4">
          {HEADERS.map((h) => (
            <div key={h.n}>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700">
                  {h.n}
                </span>
                <h3 className="text-h3 text-ink">{h.title}</h3>
                {h.recommended && (
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-caption font-semibold text-success">
                    ההמלצה שלי
                  </span>
                )}
              </div>
              <p className="mb-2 text-caption text-muted">{h.note}</p>
              <div className="overflow-hidden rounded-xl border border-line shadow-sm">
                <div className={cn("px-5 py-4", hospital.softClass)}>{h.render}</div>
                <div className="bg-canvas px-5 py-3 text-caption text-muted">גוף המגירה...</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-6xl gap-10">
        <h2 className="text-h2 text-ink">איך מסודר גוף המגירה</h2>
        {OPTIONS.map((o) => (
          <section key={o.letter}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
                {o.letter}
              </span>
              <h2 className="text-h3 text-ink">{o.title}</h2>
            </div>
            <p className="mb-3 mt-1 max-w-3xl text-caption text-muted">{o.note}</p>
            <div className="max-w-[720px]">
              <Frame>{o.render}</Frame>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
