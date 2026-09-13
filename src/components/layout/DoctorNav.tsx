import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AtSign,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Languages,
  LogOut,
  Search,
  Smartphone,
  Type,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar, AllDoctorsAvatar } from "../data/Avatar";
import { Tooltip } from "../overlay/Tooltip";
import { Dropdown } from "../overlay/Dropdown";
import { BrandMark } from "./BrandMark";
import { currentDoctor, doctors, MOCK_TODAY } from "../../mock/doctors";
import { departmentName } from "../../mock/departments";
import { useData } from "../../state/data";
import { formatPhone } from "../../lib/format";
import { t } from "../../i18n";
import { currentLocale, otherLocale, setLocale } from "../../i18n/locale";
import { applyFont, currentFont, otherFont } from "../../lib/font";

const STORAGE_KEY = "medica:doctor-nav-collapsed";

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function AccountMenu({
  collapsed,
  variant,
}: {
  collapsed?: boolean;
  /** "avatar" - האווטר בלבד עם חץ, לאדר העליון במובייל */
  variant?: "avatar";
}) {
  const navigate = useNavigate();
  // גרסת הפונט נשמרת בסטייט מקומי כדי שתווית הפריט תתעדכן מיד אחרי המעבר
  const [font, setFont] = useState(() => currentFont());
  const nextFont = otherFont(font);

  return (
    <Dropdown
      portal
      align="start"
      menuClassName="w-72 max-w-[calc(100vw-2rem)]"
      className={collapsed ? undefined : "w-full"}
      trigger={
        <button
          type="button"
          aria-label={t.ui.a11y.userMenu(currentDoctor.displayName)}
          title={collapsed ? currentDoctor.displayName : undefined}
          className={cn(
            "flex min-h-[44px] items-center gap-1.5 text-start transition-colors duration-fast hover:bg-surface-2",
            collapsed && "min-h-[52px] justify-center rounded-full p-1.5",
            variant === "avatar" && "rounded-full p-1 pe-2",
            !collapsed && !variant && "min-h-[52px] w-full gap-2.5 rounded-md p-2 pe-3",
          )}
        >
          <Avatar name={currentDoctor.displayName} src={currentDoctor.avatarUrl} size="md" />
          {variant === "avatar" && <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />}
          {!collapsed && !variant && (
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
              {t.ui.nav.license} <span dir="ltr" className="tnum">{currentDoctor.licenseNumber}</span>
            </span>
          </div>
        </div>
      }
      items={[
        {
          key: "language",
          label: `${t.ui.auth.language}: ${otherLocale(currentLocale()).name}`,
          icon: <Languages />,
          onSelect: () => setLocale(otherLocale(currentLocale()).key),
        },
        {
          key: "font",
          label: `${t.ui.auth.font}: ${nextFont.name}`,
          icon: <Type />,
          onSelect: () => {
            applyFont(nextFont);
            setFont(nextFont);
          },
        },
        {
          key: "logout",
          label: t.common.logout,
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
            aria-label={t.ui.a11y.brandHomeDoctor}
          >
            <BrandMark mark={collapsed} />
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t.ui.a11y.expandNav : t.ui.a11y.collapseNav}
            aria-expanded={!collapsed}
            title={collapsed ? t.ui.a11y.expandNav : t.ui.a11y.collapseNav}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-body"
          >
            <ToggleIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav
          className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}
          aria-label={t.schedule.managedDoctors}
        >
          {/* מנתחים בניהולי - הקטגוריה היחידה בתפריט */}
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              {/* בתצוגה מצומצמת השם מופיע בבועית לצד האווטר */}
              <Tooltip content={t.schedule.allDoctors} placement="end">
                <Link
                  to="/doctor/all/schedule"
                  aria-current={doctorId === "all" ? "page" : undefined}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-fast",
                    doctorId === "all" ? "bg-primary-50 text-primary-700" : "text-muted hover:bg-surface-2",
                  )}
                >
                  <AllDoctorsAvatar size="sm" className={doctorId === "all" ? undefined : "opacity-80"} />
                  <span className="sr-only">{t.schedule.allDoctors}</span>
                </Link>
              </Tooltip>
              {managed.map((d) => (
                <Tooltip key={d.id} content={d.displayName} placement="end">
                  <Link
                    to={`/doctor/${d.id}/schedule`}
                    aria-current={d.id === doctorId ? "page" : undefined}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-fast",
                      d.id === doctorId ? "bg-primary-50 ring-1 ring-primary-300" : "hover:bg-surface-2",
                    )}
                  >
                    <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
                    <span className="sr-only">{d.displayName}</span>
                  </Link>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div>
              {/* החיפוש נדבק לראש הרשימה; ברשימה קצרה אין בו צורך כלל */}
              {showSearch && (
                <div className="sticky top-0 z-10 -mx-1 bg-surface px-1 pb-2">
                  <div className="relative px-1">
                  <Search
                    className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.schedule.searchDoctor}
                    aria-label={t.schedule.searchDoctor}
                      className="h-10 w-full rounded-md border border-line bg-surface ps-9 pe-3 text-caption text-ink placeholder:text-muted focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              <Link
                to="/doctor/all/schedule"
                aria-current={doctorId === "all" ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
                  doctorId === "all"
                    ? "bg-primary-50 font-semibold text-primary-800"
                    : "text-body hover:bg-surface-2",
                )}
              >
                <AllDoctorsAvatar size="sm" />
                <span className="min-w-0 flex-1 truncate">{t.schedule.allDoctors}</span>
              </Link>

              {visibleDoctors.length === 0 ? (
                <p className="px-3 py-2 text-caption text-muted">{t.schedule.noDoctorsFound}</p>
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
                          : "text-body hover:bg-surface-2",
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
          aria-label={t.ui.a11y.brandHomeDoctor}
        >
          <BrandMark />
        </Link>
        <AccountMenu variant="avatar" />
      </header>

    </>
  );
}
