import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import { Avatar, AllDoctorsAvatar } from "../../components/data/Avatar";
import { Dropdown } from "../../components/overlay/Dropdown";
import { doctors } from "../../mock/doctors";
import { cn } from "../../lib/cn";
import { t } from "../../i18n";

/** המנתחים שבניהול המשתמש, ממוינים לפי שם משפחה */
function useManagedDoctors() {
  return useMemo(
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
}

/**
 * כותרת המסך כבורר מנתחים - במובייל בלבד: שם המנתח הנצפה ופרטיו הם
 * כפתור אחד, ובלחיצה נפתחת רשימת המנתחים. בדסקטופ הרשימה כבר יושבת
 * בסרגל הצד, ולכן הכותרת שם נשארת כותרת.
 */
export function DoctorPicker({
  doctorId,
  meta,
}: {
  doctorId: string;
  /** שורת הפרטים מתחת לשם */
  meta?: ReactNode;
}) {
  const managed = useManagedDoctors();
  const [query, setQuery] = useState("");
  const showSearch = managed.length > 10;
  const isAll = doctorId === "all";
  const active = managed.find((d) => d.id === doctorId);
  const title = isAll ? t.schedule.allDoctors : active?.displayName ?? "";

  const visible = useMemo(() => {
    const q = query.trim();
    return q ? managed.filter((d) => d.displayName.includes(q)) : managed;
  }, [managed, query]);

  return (
    <Dropdown
        portal
        align="start"
        className="min-w-0 flex-1"
        menuClassName="w-[min(92vw,340px)] max-h-[70vh] overflow-y-auto p-1"
        trigger={
          <button
            type="button"
            aria-label={t.ui.a11y.pickSurgeon(title)}
            className="flex w-full min-w-0 items-center gap-3 rounded-lg p-1.5 text-start transition-colors duration-fast hover:bg-surface-2"
          >
            {isAll ? (
              <AllDoctorsAvatar size="lg" />
            ) : (
              <Avatar name={title} src={active?.avatarUrl} size="lg" />
            )}
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-h1 text-ink">{title}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted" aria-hidden />
              </span>
              {meta}
            </span>
          </button>
        }
      >
        {showSearch && (
          <div className="sticky top-0 z-10 bg-surface p-1 pb-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
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
          className={cn(
            "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
            isAll ? "bg-primary-50 font-semibold text-primary-800" : "text-body hover:bg-surface-2",
          )}
        >
          <AllDoctorsAvatar size="sm" />
          {t.schedule.allDoctors}
        </Link>

        {visible.map((d) => (
          <Link
            key={d.id}
            to={`/doctor/${d.id}/schedule`}
            className={cn(
              "flex min-h-[44px] items-center gap-2.5 rounded-md px-3 transition-colors duration-fast",
              d.id === doctorId ? "bg-primary-50 font-semibold text-primary-800" : "text-body hover:bg-surface-2",
            )}
          >
            <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
            <span className="min-w-0 flex-1 truncate">{d.displayName}</span>
          </Link>
        ))}
    </Dropdown>
  );
}
