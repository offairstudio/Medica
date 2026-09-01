import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Check, ChevronDown, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../../components/data/Avatar";
import { Dropdown } from "../../components/overlay/Dropdown";
import { doctors, MOCK_TODAY } from "../../mock/doctors";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";

export interface DoctorPickerProps {
  /** המנתח הנצפה, או "all" ליומן הכולל */
  activeDoctorId: string;
  /** לאן מנווטים בבחירה */
  section: "schedule" | "all";
}

/**
 * בחירת המנתח הנצפה.
 * רוב המשתמשים מנהלים מנתחים בודדים, ולכן זו בחירה מהירה בכותרת
 * ולא עמודה קבועה; החיפוש נכנס לפעולה רק כשהרשימה ארוכה.
 */
export function DoctorPicker({ activeDoctorId, section }: DoctorPickerProps) {
  const navigate = useNavigate();
  const { surgeries } = useData();
  const [query, setQuery] = useState("");

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

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of surgeries) {
      if (s.date === MOCK_TODAY && s.status === "scheduled") {
        map[s.doctorId] = (map[s.doctorId] ?? 0) + 1;
      }
    }
    return map;
  }, [surgeries]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return managed;
    return managed.filter((d) => d.displayName.includes(q));
  }, [managed, query]);

  const isAll = activeDoctorId === "all";
  const active = managed.find((d) => d.id === activeDoctorId);
  // חיפוש נחוץ רק כשהרשימה באמת ארוכה
  const showSearch = managed.length > 6;

  function select(id: string) {
    navigate(`/doctor/${id}/${section === "all" ? "all" : "schedule"}`);
    setQuery("");
  }

  return (
    <Dropdown
      portal
      align="start"
      menuClassName="w-[min(92vw,320px)] p-1"
      trigger={
        <button
          type="button"
          aria-label={`בחירת מנתח. נבחר כעת: ${isAll ? he.schedule.allDoctors : active?.displayName ?? ""}`}
          className="flex min-h-[44px] w-full items-center gap-2.5 rounded-md border border-line bg-surface px-3 text-start font-semibold text-ink transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 md:w-auto md:min-w-56"
        >
          {isAll ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <CalendarRange className="h-4 w-4" aria-hidden />
            </span>
          ) : (
            <Avatar name={active?.displayName ?? ""} src={active?.avatarUrl} size="sm" />
          )}
          <span className="min-w-0 flex-1 truncate">
            {isAll ? he.schedule.allDoctors : active?.displayName}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
        </button>
      }
    >
      {showSearch && (
        <div className="relative p-1.5">
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={he.schedule.searchDoctor}
            aria-label={he.schedule.searchDoctor}
            className="h-10 w-full rounded-md border border-line bg-surface ps-9 pe-3 text-ink placeholder:text-muted focus:border-primary-500"
          />
        </div>
      )}

      <button
        type="button"
        role="menuitem"
        onClick={() => select("all")}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start transition-colors duration-fast",
          isAll ? "bg-primary-50 text-primary-800" : "text-body hover:bg-canvas",
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <CalendarRange className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 truncate font-semibold">{he.schedule.allDoctors}</span>
        {isAll && <Check className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />}
      </button>

      <div className="my-1 h-px bg-line" aria-hidden />

      {filtered.length === 0 ? (
        <p className="px-2.5 py-3 text-caption text-muted">{he.schedule.noDoctorsFound}</p>
      ) : (
        filtered.map((d) => {
          const isActive = d.id === activeDoctorId;
          const count = counts[d.id] ?? 0;
          return (
            <button
              key={d.id}
              type="button"
              role="menuitem"
              onClick={() => select(d.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start transition-colors duration-fast",
                isActive ? "bg-primary-50 text-primary-800" : "text-body hover:bg-canvas",
              )}
            >
              <Avatar name={d.displayName} src={d.avatarUrl} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{d.displayName}</span>
                <span className="block text-caption text-muted">
                  {he.schedule.surgeriesToday(count)}
                </span>
              </span>
              {isActive && <Check className="h-4 w-4 shrink-0 text-primary-600" aria-hidden />}
            </button>
          );
        })
      )}
    </Dropdown>
  );
}
