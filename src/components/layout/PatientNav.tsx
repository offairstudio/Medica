import { Link, NavLink, useNavigate } from "react-router-dom";
import { CalendarClock, FileText, LogOut, ClipboardList } from "lucide-react";
import { cn } from "../../lib/cn";
import { currentPatient } from "../../mock/patients";
import { he } from "../../i18n/he";

/** מסך הבית הוא מסך התורים - הניווט מסתכם ב"תורים" ו"מסמכים" */
const tabs = [
  { to: "/p", label: he.patient.tabs.appointments, icon: CalendarClock, end: true },
  { to: "/p/results", label: "תוצאות וסיכומים", icon: ClipboardList },
  { to: "/p/documents", label: he.patient.tabs.documents, icon: FileText },
];

export function PatientNav() {
  const navigate = useNavigate();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-[880px] items-center justify-between px-4">
          <Link to="/p" className="rounded-md text-h2 font-bold text-primary-700">
            Medica
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-body sm:block">
              {currentPatient.firstName} {currentPatient.lastName}
            </span>
            <button
              type="button"
              onClick={() => navigate("/p/login")}
              className="flex min-h-[44px] items-center gap-1.5 rounded-md px-3 text-muted transition-colors duration-fast hover:bg-canvas hover:text-danger"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {he.common.logout}
            </button>
          </div>
        </div>

        {/* לשוניות - Desktop */}
        <nav className="mx-auto hidden w-full max-w-[880px] items-center gap-1 px-4 md:flex" aria-label="ניווט ראשי">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-[44px] items-center px-4 font-semibold transition-colors duration-fast",
                  isActive ? "text-primary-700" : "text-muted hover:text-body",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  {isActive && (
                    <span aria-hidden className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-primary-700" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ניווט תחתון מקובע - מובייל */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(26,26,34,.06)] md:hidden"
        aria-label="ניווט תחתון"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors duration-fast",
                  isActive ? "text-primary-700" : "text-muted",
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              {tab.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
