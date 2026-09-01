import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Button } from "../components/primitives/Button";
import { AppointmentCard } from "../features/patient-appointments/AppointmentCard";
import {
  AppointmentFilters,
  applyFilters,
  emptyFilters,
} from "../features/patient-appointments/AppointmentFilters";
import { groupByDate } from "../features/patient-appointments/grouping";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { appointments } from "../mock/appointments";
import { documents } from "../mock/documents";
import { MOCK_TODAY } from "../mock/doctors";
import {
  PatientPageHeader,
  tabClass,
  tabCountClass,
} from "../components/layout/PatientPageHeader";
import { useFakeLoading } from "../lib/useFakeLoading";
import { he } from "../i18n/he";

export type AppointmentsMode = "upcoming" | "past";

const upcomingCount = appointments.filter((a) => a.status === "upcoming").length;
const pastCount = appointments.filter((a) => a.status !== "upcoming").length;

const TABS: { to: string; label: string; count: number; end: boolean }[] = [
  { to: "/p/appointments", label: he.patient.segUpcoming, count: upcomingCount, end: true },
  { to: "/p/appointments/past", label: he.patient.segPast, count: pastCount, end: false },
];

/**
 * מסך התורים - עתידיים וקודמים תחת טאבים.
 * הכותרת, הטאבים והסינון יושבים בסרגל קבוע בראש המסך; רק הרשימה נגללת.
 */
export function PatientAppointments({ mode }: { mode: AppointmentsMode }) {
  const loading = useFakeLoading(450);
  const [filters, setFilters] = useState(emptyFilters());

  // מעבר בין טאבים מאפס את הסינון - אחרת המסך נראה ריק בלי סיבה נראית לעין
  useEffect(() => setFilters(emptyFilters()), [mode]);

  const all = useMemo(() => {
    const list = appointments.filter((a) =>
      mode === "upcoming" ? a.status === "upcoming" : a.status !== "upcoming",
    );
    return list.sort((a, b) =>
      mode === "upcoming"
        ? (a.date + a.time).localeCompare(b.date + b.time)
        : (b.date + b.time).localeCompare(a.date + a.time),
    );
  }, [mode]);

  const next = mode === "upcoming" ? all[0] : undefined;
  const filtered = applyFilters(all, filters);
  const groups = groupByDate(filtered, MOCK_TODAY);
  const hasFilter = filters.departments.length > 0 || filters.doctors.length > 0;

  const recentDocs = useMemo(
    () => [...documents].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 3),
    [],
  );

  const header = (
    <PatientPageHeader
      title={he.patient.tabs.appointments}
      start={
        <nav className="flex items-center gap-1" aria-label="סוג התורים">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => tabClass(isActive)}>
              {({ isActive }) => (
                <>
                  {tab.label}
                  <span className={tabCountClass(isActive)}>{tab.count}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      }
      end={
        <div className="pb-2">
          <AppointmentFilters appointments={all} value={filters} onChange={setFilters} />
        </div>
      }
    />
  );

  return (
    <PatientShell header={header}>
      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton variant="block" className="h-32" />
          <Skeleton variant="block" className="h-32" />
          <Skeleton variant="block" className="h-32" />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <section aria-label={he.patient.appointmentsTitle}>
            {hasFilter && (
              <p className="mb-4 flex items-center gap-3 px-1 text-caption text-muted" aria-live="polite">
                {he.patient.filteredCount(filtered.length, all.length)}
                <button
                  type="button"
                  onClick={() => setFilters(emptyFilters())}
                  className="inline-flex min-h-[44px] items-center rounded-md px-2 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50 hover:text-primary-800"
                >
                  {he.common.clearFilter}
                </button>
              </p>
            )}

            {filtered.length === 0 ? (
              <EmptyState
                illustration="calendar"
                title={
                  hasFilter
                    ? mode === "upcoming"
                      ? he.patient.emptyFiltered
                      : he.patient.emptyPastFiltered
                    : he.patient.emptyUpcoming
                }
                action={
                  hasFilter ? (
                    <Button variant="secondary" onClick={() => setFilters(emptyFilters())}>
                      {he.common.clearFilter}
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="flex flex-col gap-6">
                {groups.map((group) => (
                  <section key={group.date} aria-label={group.full}>
                    <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-h3 text-ink">{group.relative}</span>
                      <span className="text-caption text-muted">{group.full}</span>
                    </h2>
                    <div className="flex flex-col gap-3">
                      {group.items.map((a) => (
                        <AppointmentCard
                          key={a.id}
                          appointment={a}
                          muted={mode === "past"}
                          featured={a.id === next?.id}
                          featuredBadge={a.id === next?.id ? he.patient.nextAppointment : undefined}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>

          {/* מסמכים אחרונים - רק בתורים העתידיים */}
          {mode === "upcoming" && recentDocs.length > 0 && (
            <section aria-label={he.patient.recentDocuments}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-h2 text-ink">{he.patient.recentDocuments}</h2>
                <Link
                  to="/p/documents"
                  className="-me-2 inline-flex min-h-[44px] items-center gap-1 rounded-md px-2 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50 hover:text-primary-800"
                >
                  {he.common.showAll}
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <ul className="rounded-lg border border-line bg-surface px-4 shadow-sm">
                {recentDocs.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </PatientShell>
  );
}
