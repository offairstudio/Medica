import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "../data/Avatar";
import { doctors, MOCK_TODAY } from "../../mock/doctors";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";

export interface DoctorSidebarProps {
  activeDoctorId: string;
  /** אליו מנווטים בבחירת מנתח: schedule או all */
  section: "schedule" | "all";
  className?: string;
  onNavigate?: () => void;
}

export function DoctorSidebar({ activeDoctorId, section, className, onNavigate }: DoctorSidebarProps) {
  const navigate = useNavigate();
  const { surgeries } = useData();
  const [query, setQuery] = useState("");

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
    const managed = doctors
      .filter((d) => d.managedByMe)
      .sort((a, b) => a.lastName.localeCompare(b.lastName, "he") || a.firstName.localeCompare(b.firstName, "he"));
    if (!q) return managed;
    return managed.filter((d) => d.displayName.includes(q));
  }, [query]);

  /** קיבוץ לפי אות ראשונה של שם המשפחה - לניווט מהיר ברשימה ארוכה */
  const letterGroups = useMemo(() => {
    const groups: { letter: string; items: typeof filtered }[] = [];
    for (const d of filtered) {
      const letter = d.lastName[0] ?? "";
      const last = groups[groups.length - 1];
      if (last && last.letter === letter) last.items.push(d);
      else groups.push({ letter, items: [d] });
    }
    return groups;
  }, [filtered]);

  return (
    <aside
      className={cn(
        "flex w-full flex-col overflow-hidden bg-surface lg:w-[264px] lg:shrink-0 lg:rounded-lg lg:border lg:border-line lg:shadow-sm",
        className,
      )}
      aria-label={he.schedule.managedDoctors}
    >
      <h2 className="px-4 pb-2 pt-4 text-h3 text-ink">{he.schedule.managedDoctors}</h2>

      {/* חיפוש - תוספת חדשה, הרשימה במערכת הקיימת ארוכה מאוד */}
      <div className="relative px-4 pb-3">
        <Search className="pointer-events-none absolute start-7 top-1/2 h-4 w-4 -translate-y-[65%] text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={he.schedule.searchDoctor}
          aria-label={he.schedule.searchDoctor}
          className="h-10 w-full rounded-md border border-line bg-canvas ps-9 pe-3 text-ink placeholder:text-muted transition-colors duration-fast hover:border-primary-300 focus:border-primary-500 focus:bg-surface"
        />
      </div>

      {/* יומן כולל לכל המנתחים - פריט מוצמד */}
      <div className="border-b border-line pb-1">
        <button
          type="button"
          onClick={() => {
            navigate(`/doctor/all/${section}`);
            onNavigate?.();
          }}
          aria-current={activeDoctorId === "all" ? "true" : undefined}
          className={cn(
            "relative flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors duration-fast",
            activeDoctorId === "all" ? "bg-primary-100" : "hover:bg-primary-50",
          )}
        >
          {activeDoctorId === "all" && (
            <span aria-hidden className="absolute inset-y-1 start-0 w-[3px] rounded-e bg-primary-700" />
          )}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700">
            <CalendarRange className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate",
                activeDoctorId === "all" ? "font-semibold text-primary-800" : "text-ink",
              )}
            >
              {he.schedule.allDoctors}
            </span>
            <span className="block text-caption text-muted tnum">
              {he.schedule.surgeriesToday(
                Object.values(counts).reduce((sum, n) => sum + n, 0),
              )}
            </span>
          </span>
        </button>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto pb-2">
        {filtered.length === 0 && (
          <li className="px-4 py-3 text-caption text-muted">לא נמצאו מנתחים</li>
        )}
        {letterGroups.map((group) => (
          <li key={group.letter}>
            {/* כותרת אות - דביקה בזמן גלילה */}
            <div className="sticky top-0 z-10 border-b border-line bg-canvas px-4 py-1 text-caption font-bold text-primary-700">
              {group.letter}
            </div>
            <ul>
              {group.items.map((d) => {
                const active = d.id === activeDoctorId;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/doctor/${d.id}/${section}`);
                        onNavigate?.();
                      }}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "relative flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors duration-fast",
                        active ? "bg-primary-100" : "hover:bg-primary-50",
                      )}
                    >
                      {active && (
                        <span aria-hidden className="absolute inset-y-1 start-0 w-[3px] rounded-e bg-primary-700" />
                      )}
                      <Avatar name={d.displayName} src={d.avatarUrl} size="md" />
                      <span className="min-w-0">
                        <span className={cn("block truncate", active ? "font-semibold text-primary-800" : "text-ink")}>
                          {d.displayName}
                        </span>
                        <span className="block text-caption text-muted tnum">
                          {he.schedule.surgeriesToday(counts[d.id] ?? 0)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}
