import { useState, type ReactNode } from "react";
import { Users } from "lucide-react";
import { TopBar } from "./TopBar";
import { DoctorSidebar } from "./DoctorSidebar";
import { PatientNav } from "./PatientNav";
import { Drawer } from "../overlay/Drawer";
import { cn } from "../../lib/cn";
import { he } from "../../i18n/he";
import { currentDoctor } from "../../mock/doctors";
import type { Doctor } from "../../types";

/**
 * מסגרת מסכי המנתח: TopBar + סרגל מנתחים + תוכן.
 * ה-TopBar מציג תמיד את המשתמש המחובר; המנתח הנצפה מיוצג
 * בסרגל (בחירה) ובכותרת התוכן של כל מסך.
 */
export function DoctorShell({
  doctor,
  section,
  children,
  activeDoctorId,
}: {
  /** המנתח הנצפה - קובע את ברירת המחדל לסימון בסרגל */
  doctor: Doctor;
  /** נשמר לתאימות - הכותרת אינה מוצגת עוד ב-TopBar */
  screenTitle?: string;
  section: "schedule" | "all";
  children: ReactNode;
  /** מזהה הפריט הפעיל בסרגל - ברירת מחדל: המנתח המוצג. "all" ליומן הכולל */
  activeDoctorId?: string;
  /** נשמר לתאימות - ההקשר מוצג בכותרת התוכן */
  centerLabel?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarActiveId = activeDoctorId ?? doctor.id;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar doctor={currentDoctor} />

      {/* מתחת ל-1024px: סרגל המנתחים הופך לכפתור שפותח מגירה */}
      <div className="border-b border-line bg-surface px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-md px-3 font-semibold text-primary-700 transition-colors duration-fast hover:bg-primary-50"
        >
          <Users className="h-4 w-4" aria-hidden />
          {he.schedule.managedDoctors}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-[1760px] flex-1 items-start gap-5 p-4 lg:p-6">
        <div className="sticky top-[84px] hidden max-h-[calc(100vh-104px)] lg:block">
          <DoctorSidebar activeDoctorId={sidebarActiveId} section={section} className="max-h-[calc(100vh-104px)]" />
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <Drawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={he.schedule.managedDoctors}
      >
        <DoctorSidebar
          activeDoctorId={sidebarActiveId}
          section={section}
          onNavigate={() => setSidebarOpen(false)}
        />
      </Drawer>
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
    <div className="clinical-surface flex h-dvh flex-col overflow-hidden md:flex-row">
      <PatientNav />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header && (
          <div className="shrink-0 px-4 pt-4 md:px-8 md:pt-6">
            <div className="mx-auto w-full max-w-[1000px]">{header}</div>
          </div>
        )}
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-12",
            header ? "pt-6" : "pt-6 md:pt-10",
          )}
        >
          <div className="mx-auto w-full max-w-[1000px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
