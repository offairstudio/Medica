import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AtSign,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Smartphone,
  Table as TableIcon,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../data/Avatar";
import { Dropdown } from "../overlay/Dropdown";
import { BrandMark } from "./BrandMark";
import { currentDoctor, MOCK_TODAY } from "../../mock/doctors";
import { departmentName } from "../../mock/departments";
import { useData } from "../../state/data";
import { formatPhone } from "../../lib/format";
import { he } from "../../i18n/he";

const STORAGE_KEY = "medica:doctor-nav-collapsed";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function AccountMenu({ collapsed }: { collapsed?: boolean }) {
  const navigate = useNavigate();

  return (
    <Dropdown
      portal
      align="start"
      menuClassName="w-72 max-w-[calc(100vw-2rem)]"
      className={collapsed ? undefined : "w-full"}
      trigger={
        <button
          type="button"
          aria-label={`תפריט המשתמש: ${currentDoctor.displayName}`}
          title={collapsed ? currentDoctor.displayName : undefined}
          className={cn(
            "flex min-h-[52px] items-center gap-2.5 border border-line bg-canvas text-start transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50",
            collapsed ? "justify-center rounded-full p-1.5" : "w-full rounded-md p-2 pe-3",
          )}
        >
          <Avatar name={currentDoctor.displayName} src={currentDoctor.avatarUrl} size="md" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate font-semibold text-ink">
                {currentDoctor.displayName}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
            </>
          )}
        </button>
      }
      header={
        <div className="border-b border-line p-4">
          <div className="flex items-center gap-3">
            <Avatar name={currentDoctor.displayName} src={currentDoctor.avatarUrl} size="lg" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-semibold text-ink">{currentDoctor.displayName}</span>
              <span className="block text-caption text-muted">
                {departmentName(currentDoctor.departmentId)}
              </span>
            </span>
          </div>
          <div className="mt-4 space-y-2 text-caption text-muted">
            <span className="flex min-w-0 items-center gap-2">
              <AtSign className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span dir="ltr" className="min-w-0 truncate">{currentDoctor.email}</span>
            </span>
            <span className="flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span dir="ltr" className="tnum">{formatPhone(currentDoctor.mobile)}</span>
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
              מספר רישיון <span dir="ltr" className="tnum">{currentDoctor.licenseNumber}</span>
            </span>
          </div>
        </div>
      }
      items={[
        {
          key: "logout",
          label: he.common.logout,
          icon: <LogOut />,
          danger: true,
          onSelect: () => navigate("/login"),
        },
      ]}
    />
  );
}

/** ניווט ראשי למסכי המנתח - אותו מבנה כמו באזור המטופל */
export function DoctorNav({ doctorId }: { doctorId: string }) {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const { pathname } = useLocation();
  const { surgeries } = useData();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* מצב הסרגל הוא נוחות בלבד */
    }
  }, [collapsed]);

  const todayCount = surgeries.filter(
    (s) => s.doctorId === doctorId && s.date === MOCK_TODAY && s.status === "scheduled",
  ).length;
  const allCount = surgeries.filter((s) => s.doctorId === doctorId).length;

  const tabs = [
    {
      to: `/doctor/${doctorId}/schedule`,
      label: he.schedule.title,
      icon: CalendarDays,
      count: todayCount,
      match: (p: string) => p.includes("/schedule") || p.startsWith("/surgery/"),
    },
    {
      to: `/doctor/${doctorId}/all`,
      label: he.allSurgeries.title,
      icon: TableIcon,
      count: allCount,
      match: (p: string) => p.endsWith("/all"),
    },
  ];

  const ToggleIcon = collapsed ? ChevronLeft : ChevronRight;

  return (
    <>
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
            to={`/doctor/${doctorId}/schedule`}
            className="inline-flex min-h-[44px] items-center rounded-md"
            aria-label="Medica - מסך הבית"
          >
            <BrandMark mark={collapsed} />
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "הרחבת סרגל הניווט" : "מזעור סרגל הניווט"}
            aria-expanded={!collapsed}
            title={collapsed ? "הרחבת סרגל הניווט" : "מזעור סרגל הניווט"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-canvas hover:text-body"
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
                    : "text-muted hover:bg-canvas hover:text-body",
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
                        isActive ? "bg-primary-700 text-white" : "bg-canvas text-body",
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
                          isActive ? "bg-primary-700 text-white" : "bg-canvas text-muted",
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
          <AccountMenu collapsed={collapsed} />
        </div>
      </aside>

      {/* מובייל */}
      <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-line bg-surface px-4 md:hidden">
        <Link
          to={`/doctor/${doctorId}/schedule`}
          className="inline-flex min-h-[44px] items-center rounded-md"
          aria-label="Medica - מסך הבית"
        >
          <BrandMark />
        </Link>
        <AccountMenu />
      </header>

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
    </>
  );
}
