import type { ReactNode } from "react";
import { FontVersionToggle } from "./FontVersionToggle";

/**
 * מסך מפוצל RTL: הטופס מימין וארט המותג משמאל.
 * במובייל הארט מתקצר לכותרת ויזואלית מעל הטופס.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row-reverse">
      <div className="relative min-h-[240px] overflow-hidden bg-primary-900 md:min-h-screen md:w-[58%]">
        <img
          src="/brand/medica-auth-hero-v1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/25 via-primary-900/5 to-primary-900/75" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-l from-primary-900/20 to-transparent" aria-hidden />

        <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-between p-6 text-white md:min-h-screen md:p-10 lg:p-14">
          <img
            src="/brand/medica-logo.svg"
            alt="Medica"
            className="w-[170px] brightness-0 invert md:w-[205px]"
          />

          <div className="max-w-md pb-1 md:pb-4">
            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-caption font-semibold backdrop-blur-sm">
              האזור הרפואי המאובטח שלך
            </span>
            <h2 className="mt-4 text-[28px] font-bold leading-tight md:text-[38px]">
              כל המידע הרפואי.<br />במקום אחד.
            </h2>
            <p className="mt-3 hidden max-w-sm text-white/80 md:block">
              תורים, הכנות, מסמכים ותוצאות — זמינים בצורה ברורה ובטוחה לאורך כל הדרך.
            </p>
          </div>
        </div>
      </div>

      <div className="clinical-surface relative flex flex-1 items-start justify-center px-4 py-8 pb-14 md:w-[42%] md:items-center md:px-8 md:py-10">
        <div className="w-full max-w-[430px] rounded-xl border border-line bg-surface p-6 shadow-md md:p-8 lg:p-9">
          {children}
        </div>

        {/* מעבר בין גרסאות הפונט - בפינה, בקטן */}
        <FontVersionToggle className="absolute bottom-3 start-4 md:start-6" />
      </div>
    </div>
  );
}
