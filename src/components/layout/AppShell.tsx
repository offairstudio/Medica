import type { ReactNode } from "react";
import { PatientNav } from "./PatientNav";
import { DoctorNav } from "./DoctorNav";
import { ScrollFade } from "./ScrollFade";
import { cn } from "../../lib/cn";

/**
 * מסגרת מסכי המנתח: סרגל ניווט אנכי + עמודת תוכן.
 * זהה בהתנהגות לאזור המטופל - העמוד אינו נגלל, הגלילה בתוך אזור התוכן,
 * וה-header נשאר קבוע בראש המסך.
 */
export function DoctorShell({
  doctorId,
  header,
  children,
}: {
  /** המנתח הנצפה - קובע את יעדי הניווט בסרגל */
  doctorId: string;
  /** כותרת קבועה מעל אזור הגלילה */
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas md:flex-row">
      <DoctorNav doctorId={doctorId} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header && (
          <div className="shrink-0 px-4 pt-4 md:px-6 md:pt-6">
            <div className="mx-auto w-full max-w-[1400px]">{header}</div>
          </div>
        )}
        <div className="relative min-h-0 flex-1">
          <main className="h-full overflow-y-auto px-4 pb-24 pt-6 md:px-6 md:pb-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
          <ScrollFade />
        </div>
      </div>
    </div>
  );
}

/**
 * מסגרת מסכי המטופל: סרגל צד אנכי + עמודת תוכן.
 * העמוד עצמו אינו נגלל - הגלילה מתבצעת בתוך אזור התוכן בלבד,
 * כך ש-`header` נשאר קבוע בראש המסך והתוכן נחתך בקצה שלו ולא עובר מתחתיו.
 */
export function PatientShell({
  header,
  children,
}: {
  /** כותרת קבועה מעל אזור הגלילה */
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas md:flex-row">
      <PatientNav />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header && (
          <div className="shrink-0 px-4 pt-4 md:px-8 md:pt-6">
            <div className="mx-auto w-full max-w-[1000px]">{header}</div>
          </div>
        )}
        <div className="relative min-h-0 flex-1">
          <main
            className={cn(
              "h-full overflow-y-auto px-4 pb-24 md:px-8 md:pb-12",
              header ? "pt-6" : "pt-6 md:pt-10",
            )}
          >
            <div className="mx-auto w-full max-w-[1000px]">{children}</div>
          </main>
          <ScrollFade />
        </div>
      </div>
    </div>
  );
}
