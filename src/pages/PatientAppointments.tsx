import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { PatientShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { AppointmentCard } from "../features/patient-appointments/AppointmentCard";
import { groupByDate } from "../features/patient-appointments/grouping";
import { appointments } from "../mock/appointments";
import { MOCK_TODAY } from "../mock/doctors";
import {
  ScreenHeader,
  tabClass,
  tabCountClass,
} from "../components/layout/ScreenHeader";
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
  const groups = groupByDate(all, MOCK_TODAY);

  const header = (
    <ScreenHeader
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
            {all.length === 0 ? (
              <EmptyState illustration="calendar" title={he.patient.emptyUpcoming} />
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
        </div>
      )}
    </PatientShell>
  );
}
