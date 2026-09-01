import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarClock,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutGrid,
  LogOut,
  UserRound,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { currentPatient } from "../../mock/patients";
import { appointments } from "../../mock/appointments";
import { documents } from "../../mock/documents";
import { he } from "../../i18n/he";
import { BrandMark } from "./BrandMark";
import { Dropdown } from "../overlay/Dropdown";
import { ProfileDrawer } from "../../features/patient-profile/ProfileDrawer";

const upcomingCount = appointments.filter((a) => a.status === "upcoming").length;
const resultsCount = appointments.filter(
  (a) => a.status === "completed" && a.resultSummary,
).length;

/** פריטי הניווט; `match` נדרש כי "תורים" פעיל גם בטאב הקודמים ובפרטי תור */
const tabs = [
  {
    to: "/p",
    label: he.patient.tabs.home,
    icon: LayoutGrid,
    count: 0,
    match: (p: string) => p === "/p",
  },
  {
    to: "/p/appointments",
    label: he.patient.tabs.appointments,
    icon: CalendarClock,
    count: upcomingCount,
    match: (p: string) => p.startsWith("/p/appointments") || p.startsWith("/p/appointment/"),
  },
  {
    to: "/p/results",
    label: he.patient.tabs.results,
    icon: ClipboardList,
    count: resultsCount,
    match: (p: string) => p.startsWith("/p/results"),
  },
  {
    to: "/p/documents",
    label: he.patient.tabs.documents,
    icon: FileText,
    count: documents.length,
    match: (p: string) => p.startsWith("/p/documents"),
  },
];

/** תפריט החשבון - משותף לסרגל הצד ולסרגל המובייל */
function AccountMenu({ onProfile, compact }: { onProfile: () => void; compact?: boolean }) {
  const navigate = useNavigate();
  const initials = `${currentPatient.firstName[0]}${currentPatient.lastName[0]}`;

  return (
    <Dropdown
      portal
      align="start"
      menuClassName="min-w-56"
      trigger={
        <button
          type="button"
          aria-label="תפריט המשתמש"
          className={cn(
            "flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-canvas p-1.5 text-start transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50",
            compact ? "pe-2.5" : "w-full pe-3",
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-caption font-bold text-white">
            {initials}
          </span>
          <span className={cn("min-w-0 flex-1 leading-tight", compact && "hidden sm:block")}>
            <span className="block text-[11px] text-muted">האזור האישי</span>
            <span className="block max-w-32 truncate text-caption font-semibold text-ink">
              {currentPatient.firstName} {currentPatient.lastName}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        </button>
      }
      items={[
        {
          key: "profile",
          label: he.patient.profile.menuLabel,
          icon: <UserRound />,
          onSelect: onProfile,
        },
        {
          key: "logout",
          label: he.common.logout,
          icon: <LogOut />,
          danger: true,
          onSelect: () => navigate("/p/login"),
        },
      ]}
    />
  );
}

export function PatientNav() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* ===== סרגל צד אנכי - דסקטופ ===== */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-e border-line bg-surface md:flex">
        <div className="px-5 py-6">
          <Link to="/p" className="rounded-md" aria-label="Medica - האזור האישי">
            <BrandMark />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="ניווט ראשי">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.match(pathname);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[46px] items-center gap-3 rounded-md px-3 font-semibold transition-colors duration-fast",
                  isActive
                    ? "bg-primary-50 text-primary-800"
                    : "text-muted hover:bg-canvas hover:text-body",
                )}
              >
                <Icon
                  className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary-600" : "text-muted")}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "tnum shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                      isActive ? "bg-primary-700 text-white" : "bg-canvas text-muted",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <AccountMenu onProfile={() => setProfileOpen(true)} />
        </div>
      </aside>

      {/* ===== סרגל עליון - מובייל ===== */}
      <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-line bg-surface px-4 md:hidden">
        <Link to="/p" className="rounded-md" aria-label="Medica - האזור האישי">
          <BrandMark />
        </Link>
        <AccountMenu onProfile={() => setProfileOpen(true)} compact />
      </header>

      {/* ===== ניווט תחתון מקובע - מובייל ===== */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(26,26,34,.06)] md:hidden"
        aria-label="ניווט תחתון"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.match(pathname);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors duration-fast",
                isActive ? "text-primary-700" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <ProfileDrawer
        patient={currentPatient}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
