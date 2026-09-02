import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AtSign,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Smartphone,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar, AllDoctorsAvatar } from "../data/Avatar";
import { Dropdown } from "../overlay/Dropdown";
import { BrandMark } from "./BrandMark";
import { currentDoctor, doctors, MOCK_TODAY } from "../../mock/doctors";
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
  const [query, setQuery] = useState("");
  const { surgeries } = useData();

  const managed = useMemo(
    () =>
      doctors
        .filter((d) => d.managedByMe)
        .sort(
          (a, b) =>
            a.lastName.localeCompare(b.lastName, "he") ||
            a.firstName.localeCompare(b.firstName, "he"),
        ),
    [],
  );
  // רוב המשתמשים מנהלים מנתחים בודדים; חיפוש נחוץ רק ברשימה ארוכה
  const showSearch = managed.length > 10;
  const activeDoctor = managed.find((d) => d.id === doctorId);
  const visibleDoctors = useMemo(() => {
    const q = query.trim();
    return q ? managed.filter((d) => d.displayName.includes(q)) : managed;
  }, [managed, query]);

  const todayByDoctor = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of surgeries) {
      if (s.date === MOCK_TODAY && s.status === "scheduled") {
        map[s.doctorId] = (map[s.doctorId] ?? 0) + 1;
      }
    }
    return map;
  }, [surgeries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* מצב הסרגל הוא נוחות בלבד */
    }
  }, [collapsed]);


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
          aria-label={he.schedule.managedDoctors}
        >
          {/* מנתחים בניהולי - הקטגוריה היחידה בתפריט */}
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <Link
                to="/doctor/all/schedule"
                aria-current={doctorId === "all" ? "page" : undefined}
                title={he.schedule.allDoctors}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-fast",
                  doctorId === "all" ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-canvas",
                )}
              >
                <AllDoctorsAvatar size="sm" className={doctorId === "all" ? undefined : "opacity-80"} />
                <span className="sr-only">{he.schedule.allDoctors}</span>
              </Link>
              {managed.map((d) => (
                <Link
                  key={d.id}
                  to={`/doctor/${d.id}/schedule`}
                  aria-current={d.id === doctorId ? "page" : undefined}
                  title={d.displayName}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-fast",
                    d.id === doctorId ? "bg-primary-50 ring-1 ring-primary-300" : "hover:bg-canvas",
                  )}
                >
                  <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
                  <span className="sr-only">{d.displayName}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <div className="sticky top-0 z-10 -mx-1 bg-surface px-1 pb-2">
                <p className="px-3 pb-1 text-caption font-semibold text-muted">
                  {he.schedule.managedDoctors}
                </p>

                {showSearch && (
                  <div className="relative px-1">
                  <Search
                    className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={he.schedule.searchDoctor}
                    aria-label={he.schedule.searchDoctor}
                      className="h-10 w-full rounded-md border border-line bg-surface ps-9 pe-3 text-caption text-ink placeholder:text-muted focus:border-primary-500"
                    />
                  </div>
                )}
              </div>

              <Link
                to="/doctor/all/schedule"
                aria-current={doctorId === "all" ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
                  doctorId === "all"
                    ? "bg-primary-50 font-semibold text-primary-800"
                    : "text-body hover:bg-canvas",
                )}
              >
                <AllDoctorsAvatar size="sm" />
                <span className="min-w-0 flex-1 truncate">{he.schedule.allDoctors}</span>
              </Link>

              {visibleDoctors.length === 0 ? (
                <p className="px-3 py-2 text-caption text-muted">{he.schedule.noDoctorsFound}</p>
              ) : (
                visibleDoctors.map((d) => {
                  const isActive = d.id === doctorId;
                  const count = todayByDoctor[d.id] ?? 0;
                  return (
                    <Link
                      key={d.id}
                      to={`/doctor/${d.id}/schedule`}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
                        isActive
                          ? "bg-primary-50 font-semibold text-primary-800"
                          : "text-body hover:bg-canvas",
                      )}
                    >
                      <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
                      <span className="min-w-0 flex-1 truncate">{d.displayName}</span>
                      {count > 0 && (
                        <span className="tnum shrink-0 text-caption text-muted">{count}</span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>
          )}
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
        <div className="flex items-center gap-2">
          <Dropdown
            portal
            align="start"
            menuClassName="w-[min(92vw,320px)] p-1"
            trigger={
              <button
                type="button"
                aria-label={`בחירת מנתח. נבחר כעת: ${doctorId === "all" ? he.schedule.allDoctors : activeDoctor?.displayName ?? ""}`}
                className="flex min-h-[44px] max-w-44 items-center gap-2 rounded-md border border-line bg-surface px-2.5 font-semibold text-ink transition-colors duration-fast hover:border-primary-300"
              >
                {doctorId === "all" ? (
                  <AllDoctorsAvatar size="sm" />
                ) : (
                  <Avatar name={activeDoctor?.displayName ?? ""} src={activeDoctor?.avatarUrl} size="sm" />
                )}
                <span className="min-w-0 flex-1 truncate text-caption">
                  {doctorId === "all" ? he.schedule.allDoctors : activeDoctor?.displayName}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              </button>
            }
          >
            <Link
              to="/doctor/all/schedule"
              className="flex min-h-[44px] items-center gap-2.5 rounded-md px-3 text-body transition-colors duration-fast hover:bg-canvas"
            >
              <AllDoctorsAvatar size="sm" />
              {he.schedule.allDoctors}
            </Link>
            {managed.map((d) => (
              <Link
                key={d.id}
                to={`/doctor/${d.id}/schedule`}
                className={cn(
                  "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
                  d.id === doctorId ? "bg-primary-50 font-semibold text-primary-800" : "text-body hover:bg-canvas",
                )}
              >
                <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
                <span className="min-w-0 flex-1 truncate">{d.displayName}</span>
              </Link>
            ))}
          </Dropdown>
          <AccountMenu />
        </div>
      </header>

    </>
  );
}
