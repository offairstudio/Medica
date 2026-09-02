import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LogOut,
  UserRound,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { currentPatient } from "../../mock/patients";
import { appointments } from "../../mock/appointments";
import { he } from "../../i18n/he";
import { BrandMark } from "./BrandMark";
import { Dropdown } from "../overlay/Dropdown";
import { ProfileDrawer } from "../../features/patient-profile/ProfileDrawer";

const upcomingCount = appointments.filter((a) => a.status === "upcoming").length;
const resultsCount = appointments.filter(
  (a) => a.status === "completed" && a.resultSummary,
).length;

/**
 * פריטי הניווט. "ראשי" (הדשבורד) מוסתר לפי החלטת הלקוח - מסך התורים הוא מסך הנחיתה.
 * `match` נדרש כי "תורים" פעיל גם בטאב הקודמים וגם כשמגירת פרטי התור פתוחה.
 */
const tabs = [
  {
    to: "/p/appointments",
    label: he.patient.tabs.appointments,
    icon: CalendarClock,
    count: upcomingCount,
    match: (p: string) => p === "/p" || p.startsWith("/p/appointments") || p.startsWith("/p/appointment/"),
  },
  {
    to: "/p/results",
    label: he.patient.tabs.results,
    icon: ClipboardList,
    count: resultsCount,
    match: (p: string) => p.startsWith("/p/results"),
  },
];

const STORAGE_KEY = "medica:nav-collapsed";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function AccountMenu({
  onProfile,
  variant,
}: {
  onProfile: () => void;
  variant: "sidebar" | "collapsed" | "mobile";
}) {
  const navigate = useNavigate();
  const initials = `${currentPatient.firstName[0]}${currentPatient.lastName[0]}`;
  const fullName = `${currentPatient.firstName} ${currentPatient.lastName}`;
  const iconOnly = variant === "collapsed";

  return (
    <Dropdown
      portal
      align="start"
      menuClassName="min-w-56"
      className={variant === "sidebar" ? "w-full" : undefined}
      trigger={
        <button
          type="button"
          aria-label={`תפריט המשתמש: ${fullName}`}
          title={iconOnly ? fullName : undefined}
          className={cn(
            "flex min-h-[52px] items-center gap-2.5 border border-line bg-surface-2 text-start transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50",
            iconOnly
              ? "justify-center rounded-full p-1.5"
              : variant === "sidebar"
                ? "w-full rounded-md p-2 pe-3"
                : "rounded-full p-2 pe-2.5",
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 font-bold text-white">
            {initials}
          </span>
          {!iconOnly && (
            <>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate font-semibold text-ink",
                  variant === "mobile" && "hidden sm:block",
                )}
              >
                {fullName}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            </>
          )}
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
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* מצב הסרגל הוא נוחות בלבד - אין טעם להיכשל אם האחסון חסום */
    }
  }, [collapsed]);

  const ToggleIcon = collapsed ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* ===== סרגל צד אנכי - דסקטופ ===== */}
      <aside
        className={cn(
          "hidden h-full shrink-0 flex-col border-e border-line bg-surface transition-[width] duration-base md:flex",
          collapsed ? "w-[72px]" : "w-[232px]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 py-5",
            collapsed ? "flex-col px-2" : "justify-between px-4",
          )}
        >
          <Link
            to="/p/appointments"
            className="inline-flex min-h-[44px] items-center rounded-md"
            aria-label="Medica - האזור האישי"
          >
            <BrandMark mark={collapsed} />
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "הרחבת סרגל הניווט" : "מזעור סרגל הניווט"}
            aria-expanded={!collapsed}
            title={collapsed ? "הרחבת סרגל הניווט" : "מזעור סרגל הניווט"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-body"
          >
            <ToggleIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav
          className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}
          aria-label="ניווט ראשי"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.match(pathname);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? tab.label : undefined}
                className={cn(
                  "flex min-h-[46px] items-center rounded-md font-semibold transition-colors duration-fast",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-primary-50 text-primary-800"
                    : "text-muted hover:bg-surface-2 hover:text-body",
                )}
              >
                <span className="relative inline-flex shrink-0">
                  <Icon
                    className={cn("h-[18px] w-[18px]", isActive ? "text-primary-600" : "text-muted")}
                    aria-hidden
                  />
                  {collapsed && tab.count > 0 && (
                    <span
                      aria-hidden
                      className={cn(
                        "tnum absolute -end-2.5 -top-2 rounded-full px-1 text-[11px] font-bold leading-[15px]",
                        isActive ? "bg-primary-700 text-white" : "bg-surface-2 text-body",
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                    {tab.count > 0 && (
                      <span
                        className={cn(
                          "tnum shrink-0 rounded-full px-2 py-0.5 text-[12px] font-bold",
                          isActive ? "bg-primary-700 text-white" : "bg-surface-2 text-muted",
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </>
                )}
                {collapsed && <span className="sr-only">{`${tab.label}, ${tab.count}`}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={cn("border-t border-line", collapsed ? "flex justify-center p-2" : "p-3")}>
          <AccountMenu
            onProfile={() => setProfileOpen(true)}
            variant={collapsed ? "collapsed" : "sidebar"}
          />
        </div>
      </aside>

      {/* ===== סרגל עליון - מובייל ===== */}
      <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
        <Link
          to="/p/appointments"
          className="inline-flex min-h-[44px] items-center rounded-md"
          aria-label="Medica - האזור האישי"
        >
          <BrandMark />
        </Link>
        <AccountMenu onProfile={() => setProfileOpen(true)} variant="mobile" />
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
                "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[12px] font-semibold transition-colors duration-fast",
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
