import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FontVersionToggle } from "./FontVersionToggle";
import { LocaleToggle } from "./LocaleToggle";
import { t } from "../../i18n";
import "../../styles/auth.css";

/**
 * מסך מפוצל RTL: הטופס מימין וארט המותג משמאל.
 * הלוגו יושב בפינת הפתיחה של המסך - מימין בעברית, משמאל באנגלית -
 * כדי שזהות המותג תיקרא ראשונה. במובייל הארט מתקצר לכותרת מעל הטופס,
 * ואז הלוגו מוצג עליו בגרסה הלבנה.
 */
export function AuthLayout({ children, audience = "patient" }: { children: ReactNode; audience?: "doctor" | "patient" }) {
  return (
    <div className="medica-auth flex min-h-screen flex-col md:flex-row-reverse">
      <div className="relative min-h-[240px] overflow-hidden bg-primary-900 md:min-h-screen md:w-[58%]">
        <img
          src={audience === "doctor" ? "/brand/medica-auth-operating-room-empty-v2.webp" : "/brand/medica-auth-lounge-v2.jpg"}
          alt=""
          className={`auth-scene-image absolute inset-0 h-full w-full object-cover ${audience === "doctor" ? "object-top" : "object-[center_58%]"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/25 via-primary-900/5 to-primary-900/75" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-l from-primary-900/20 to-transparent" aria-hidden />

        <div className="auth-scene-caption relative z-10 flex h-full min-h-[240px] flex-col justify-between p-6 text-white md:min-h-screen md:justify-end md:p-10 lg:p-14">
          <Link to="/" aria-label="Medica — עמוד הבית" className="w-fit rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 md:hidden"><img src="/brand/medica-logo-wide.svg" alt="Medica" className="w-[150px] brightness-0 invert" /></Link>

          <div className="max-w-md pb-1 md:pb-4">
            <h2 className="text-[28px] font-bold leading-tight md:text-[38px]">
              {audience === "doctor" ? t.ui.auth.doctorHeroTitle : t.ui.auth.heroTitle}
              <br />
              {audience === "doctor" ? t.ui.auth.doctorHeroTitleSecond : t.ui.auth.heroTitleSecond}
            </h2>
            <p className="mt-3 hidden max-w-sm text-white/80 md:block">
              {audience === "doctor" ? t.ui.auth.doctorHeroText : t.ui.auth.heroText}
            </p>
          </div>
        </div>
      </div>

      <main className="clinical-surface relative flex flex-1 items-start justify-center px-4 py-8 pb-14 md:w-[42%] md:items-center md:px-8 md:py-10">
        {/* הלוגו בפינה העליונה של צד הטופס - נקודת הפתיחה של קריאת המסך */}
        <Link to="/" aria-label="Medica — עמוד הבית" className="auth-brand-entry absolute top-8 start-8 hidden w-[168px] rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 md:block lg:top-10 lg:start-10 lg:w-[184px]"><img src="/brand/medica-logo-wide.svg" alt="Medica" className="w-full" /></Link>

        <div className="auth-form-entry w-full max-w-[430px] rounded-xl border border-line bg-surface p-6 shadow-md md:p-8 lg:p-9">
          {children}
        </div>

        {/* מעבר בין גרסאות הפונט ובין שפות - בפינה, בקטן */}
        <div className="absolute bottom-3 start-4 flex items-center gap-2 md:start-6">
          <LocaleToggle />
          <FontVersionToggle />
        </div>
      </main>
    </div>
  );
}
