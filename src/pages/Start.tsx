import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Stethoscope, UserRound } from "lucide-react";
import { cn } from "../lib/cn";
import { applyFont, currentFont, FONT_VERSIONS, type FontVersion } from "../lib/font";
import { currentLocale, LOCALES, setLocale, type Locale } from "../i18n/locale";
import { t } from "../i18n";

/** כותרת שלב ממוספרת - שומרת על הקריאה כתפריט בחירה קצר */
function Step({
  index,
  title,
  hint,
}: {
  index: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700 tnum">
        {index}
      </span>
      <h2 className="text-h3 text-ink">{title}</h2>
      {hint && <span className="text-caption text-muted">{hint}</span>}
    </div>
  );
}

/** סימון "נבחר" - עיגול וי בפינת האפשרות הפעילה */
function SelectedMark({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-fast",
        active ? "border-primary-600 bg-primary-600 text-white" : "border-line text-transparent",
      )}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  );
}

/**
 * מסך בחירה מקדים לפרוטוטייפ.
 * מאפשר ללקוח לראות את שתי גרסאות הפונט זו לצד זו, לבחור שפה,
 * ולהיכנס לאזור המטופל או לאזור הרופא - בלי לעבור דרך מסכי הכניסה.
 */
export function Start() {
  const [font, setFont] = useState<FontVersion>(() => currentFont());
  const locale = currentLocale();
  const isRtl = locale === "he";
  const EnterArrow = isRtl ? ArrowLeft : ArrowRight;

  function pickFont(next: FontVersion) {
    applyFont(next);
    setFont(next);
  }

  function pickLocale(next: Locale) {
    if (next === locale) return;
    setLocale(next);
  }

  return (
    <div className="clinical-surface min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[640px]">
        {/* לוגו + הסבר קצר */}
        <header className="flex flex-col items-center text-center">
          <img
            src="/brand/medica-logo-wide.svg"
            alt="Medica"
            className="w-[168px] sm:w-[190px]"
          />
        </header>

        <div className="mt-9 flex flex-col gap-5">
          {/* ===== פונט ===== */}
          <section
            aria-label={t.ui.start.fontStep}
            className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6"
          >
            <Step index={1} title={t.ui.start.fontStep} hint={t.ui.start.fontHint} />

            <div className="grid gap-3 sm:grid-cols-2">
              {FONT_VERSIONS.map((option) => {
                const active = option.key === font.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => pickFont(option)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col gap-3 rounded-lg border p-4 text-start transition-colors duration-fast",
                      active
                        ? "border-primary-500 bg-primary-50/60 ring-1 ring-primary-500"
                        : "border-line bg-surface hover:border-primary-300 hover:bg-primary-50/40",
                    )}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{option.name}</span>
                        <span className="mt-0.5 block text-caption text-muted">{option.note}</span>
                      </span>
                      <SelectedMark active={active} />
                    </span>

                    {/* דוגמית בפונט עצמו - כך ששתי הגרסאות נראות זו לצד זו */}
                    <span
                      className="block border-t border-line pt-3"
                      style={{ fontFamily: `"${option.name}", system-ui, sans-serif` }}
                    >
                      <span className="block text-[17px] font-semibold text-ink" dir="rtl">
                        {t.ui.start.specimenHe}
                      </span>
                      <span className="mt-1 block text-caption text-body" dir="ltr">
                        {t.ui.start.specimenEn}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== שפה ===== */}
          <section
            aria-label={t.ui.start.localeStep}
            className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6"
          >
            <Step index={2} title={t.ui.start.localeStep} hint={t.ui.start.localeHint} />

            <div className="grid gap-3 sm:grid-cols-2">
              {LOCALES.map((option) => {
                const active = option.key === locale;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => pickLocale(option.key)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border p-4 text-start transition-colors duration-fast",
                      active
                        ? "border-primary-500 bg-primary-50/60 ring-1 ring-primary-500"
                        : "border-line bg-surface hover:border-primary-300 hover:bg-primary-50/40",
                    )}
                  >
                    <span className="min-w-0">
                      <span
                        className="block font-semibold text-ink"
                        dir={option.dir}
                      >
                        {option.name}
                      </span>
                      <span className="mt-0.5 block text-caption uppercase tracking-wide text-muted">
                        {option.key}
                      </span>
                    </span>
                    <SelectedMark active={active} />
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== כניסה ===== */}
          <section
            aria-label={t.ui.start.enterStep}
            className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6"
          >
            <Step index={3} title={t.ui.start.enterStep} />

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  to: "/p/login",
                  icon: UserRound,
                  title: t.ui.start.patientArea,
                  note: t.ui.start.patientAreaNote,
                },
                {
                  to: "/login",
                  icon: Stethoscope,
                  title: t.ui.start.doctorArea,
                  note: t.ui.start.doctorAreaNote,
                },
              ].map((area) => {
                const Icon = area.icon;
                return (
                  <Link
                    key={area.to}
                    to={area.to}
                    className="group flex min-h-[72px] items-center gap-3 rounded-lg bg-primary-700 p-4 text-white shadow-sm transition-colors duration-fast hover:bg-primary-800"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{area.title}</span>
                      <span className="mt-0.5 block text-caption text-white/75">{area.note}</span>
                    </span>
                    <EnterArrow
                      className="h-5 w-5 shrink-0 text-white/70 transition-colors duration-fast group-hover:text-white"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <p className="mt-6 text-center text-caption text-muted">{t.ui.start.note}</p>
      </div>
    </div>
  );
}
