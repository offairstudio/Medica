import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { currentPatient } from "../../mock/patients";
import { he } from "../../i18n/he";
import { BrandMark } from "./BrandMark";

/** אפיון 7.8: לוגו, שם המטופל, כפתור יציאה. מתחת - הלשוניות. */
const tabs = [
  { to: "/p", label: he.patient.tabs.upcoming, icon: CalendarClock, end: true },
  { to: "/p/past", label: he.patient.tabs.past, icon: CalendarCheck },
  { to: "/p/results", label: he.patient.tabs.results, icon: ClipboardList },
  { to: "/p/documents", label: he.patient.tabs.documents, icon: FileText },
];

export function PatientNav() {
  const navigate = useNavigate();
  const initials = `${currentPatient.firstName[0]}${currentPatient.lastName[0]}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-[1120px] items-center justify-between px-4">
          <Link to="/p" className="rounded-md" aria-label="Medica - האזור האישי">
            <BrandMark />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-canvas p-1.5 pe-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-caption font-bold text-white">
                {initials}
              </span>
              <span className="hidden min-w-0 leading-tight sm:block">
                <span className="block text-[11px] text-muted">האזור האישי</span>
                <span className="block max-w-32 truncate text-caption font-semibold text-ink">
                  {currentPatient.firstName} {currentPatient.lastName}
                </span>
              </span>
            </span>

            <button
              type="button"
              onClick={() => navigate("/p/login")}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line bg-surface px-3 font-semibold text-body transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 sm:px-4"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{he.common.logout}</span>
            </button>
          </div>
        </div>

        {/* לשוניות - Desktop */}
        <nav className="mx-auto hidden w-full max-w-[1120px] items-center gap-1 px-4 pb-2 md:flex" aria-label="ניווט ראשי">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-[40px] items-center rounded-full px-4 font-semibold transition-colors duration-fast",
                  isActive ? "bg-primary-50 text-primary-800" : "text-muted hover:bg-canvas hover:text-body",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  {isActive && <span aria-hidden className="absolute inset-x-5 -bottom-2 h-0.5 rounded-full bg-primary-600" />}
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
