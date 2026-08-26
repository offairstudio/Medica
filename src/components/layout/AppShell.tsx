import { useState, type ReactNode } from "react";
import { Users } from "lucide-react";
import { TopBar } from "./TopBar";
import { DoctorSidebar } from "./DoctorSidebar";
import { PatientNav } from "./PatientNav";
import { Drawer } from "../overlay/Drawer";
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

/** מסגרת מסכי המטופל: ניווט עליון + עמודה מרכזית */
export function PatientShell({ children }: { children: ReactNode }) {
  return (
    <div className="clinical-surface flex min-h-screen flex-col">
      <PatientNav />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 pb-24 pt-8 md:pb-12 md:pt-10">
        {children}
      </main>
    </div>
  );
}
