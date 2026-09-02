import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { AppointmentCard } from "../features/patient-appointments/AppointmentCard";
import { groupByDate } from "../features/patient-appointments/grouping";
import { appointments } from "../mock/appointments";
import { MOCK_TODAY } from "../mock/doctors";
import { currentPatient } from "../mock/patients";
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

function WelcomeBanner({ nextRelative }: { nextRelative?: string }) {
  return (
    <section
      aria-labelledby="patient-welcome-title"
      className="relative isolate grid min-h-[176px] overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-l from-primary-50 via-white to-[#ecf9f8] px-6 py-5 shadow-sm sm:grid-cols-[minmax(0,1fr)_230px] sm:items-center sm:px-8"
    >
      <div className="relative z-10 max-w-xl py-2">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-caption font-semibold text-primary-700 shadow-sm ring-1 ring-primary-100">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          האזור האישי שלך
        </span>
        <h2 id="patient-welcome-title" className="text-h1 text-ink">
          היי {currentPatient.firstName}, טוב לראות אותך
        </h2>
        <p className="mt-2 max-w-lg text-body text-muted">
          כל התורים, ההכנות והמידע הרפואי שלך מחכים כאן במקום אחד.
        </p>
        {nextRelative && (
          <p className="mt-4 inline-flex items-center gap-2 text-caption font-semibold text-primary-800">
            <CalendarDays className="h-4 w-4 text-primary-500" aria-hidden />
            התור הבא שלך {nextRelative}
          </p>
        )}
      </div>

      <img
        src="/brand/patient-welcome-line-art.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -left-10 z-0 h-56 w-56 object-contain opacity-75 sm:static sm:h-[168px] sm:w-full sm:opacity-100"
      />
    </section>
  );
}

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
      <div className="flex flex-col gap-8">
        {mode === "upcoming" && <WelcomeBanner nextRelative={groups[0]?.relative} />}

        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton variant="block" className="h-32" />
            <Skeleton variant="block" className="h-32" />
            <Skeleton variant="block" className="h-32" />
          </div>
        ) : (
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
        )}
      </div>
    </PatientShell>
  );
}
