import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  MapPin,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Button } from "../components/primitives/Button";
import { AppointmentCard } from "../features/patient-appointments/AppointmentCard";
import { ExternalAction } from "../features/patient-appointments/ExternalAction";
import {
  AppointmentFilters,
  applyFilters,
  emptyFilters,
} from "../features/patient-appointments/AppointmentFilters";
import { groupUpcoming } from "../features/patient-appointments/grouping";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { appointments } from "../mock/appointments";
import { documents } from "../mock/documents";
import { currentPatient } from "../mock/patients";
import { MOCK_TODAY } from "../mock/doctors";
import { useFakeLoading } from "../lib/useFakeLoading";
import { formatFullDate, relativeDayLabel } from "../lib/date";
import { cn } from "../lib/cn";
import { he } from "../i18n/he";

/**
 * מסך הבית של המטופל = מסך התורים.
 * מרכז את התור הקרוב, כל התורים (עתידיים/קודמים) עם סינון,
 * ומסמכים אחרונים - כך שהניווט מסתכם ב"תורים" ו"מסמכים".
 */
export function PatientHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: "care" | "specialists" = searchParams.get("view") === "specialists" ? "specialists" : "care";
  const loading = useFakeLoading(500);
  const [filters, setFilters] = useState(emptyFilters());

  const upcomingAll = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "upcoming")
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [],
  );
  const next = upcomingAll[0];
  const all = upcomingAll.filter((appointment) =>
    tab === "care"
      ? appointment.kind === "test" || appointment.kind === "surgery"
      : appointment.kind === "consult" || appointment.kind === "followup",
  );
  const filtered = applyFilters(all, filters);
  const groups = groupUpcoming(filtered, MOCK_TODAY);
  const hasFilter = filters.departments.length > 0 || filters.doctors.length > 0;

  const recentDocs = useMemo(
    () => [...documents].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 3),
    [],
  );

  function switchTab(nextTab: "care" | "specialists") {
    setSearchParams(nextTab === "specialists" ? { view: "specialists" } : {}, { replace: true });
    setFilters(emptyFilters());
  }

  if (loading) {
    return (
      <PatientShell>
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 w-32" />
          </div>
          <Skeleton variant="block" className="h-48 rounded-xl" />
          <Skeleton variant="block" className="h-32" />
          <Skeleton variant="block" className="h-32" />
        </div>
      </PatientShell>
    );
  }

  return (
    <PatientShell>
      <div className="flex flex-col gap-8">
        {/* ברכה + זימון תור במערכת החיצונית */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-display text-ink">
              {he.patient.greeting(currentPatient.firstName)}
            </h1>
            <p className="mt-1 text-muted">{he.patient.upcomingCount(upcomingAll.length)}</p>
          </div>
          <ExternalAction label={he.patient.externalBooking} />
        </div>

        {/* כרטיס התור הקרוב */}
        {next ? (
          <section
            aria-label={he.patient.nextAppointment}
            className="rounded-xl bg-gradient-to-l from-primary-700 to-primary-600 p-6 text-white shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-caption font-semibold uppercase tracking-wide text-white/70">
                {he.patient.nextAppointment}
              </p>
              <span className="rounded-full bg-white/15 px-3 py-1 text-caption font-semibold">
                {relativeDayLabel(next.date, MOCK_TODAY)}
              </span>
            </div>

            <h2 className="mt-2 text-h1 font-bold">{next.title}</h2>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-white/70" aria-hidden />
                {formatFullDate(next.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/70" aria-hidden />
                <span className="tnum">{next.time}</span>
              </span>
              <span className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-white/70" aria-hidden />
                {next.doctorName}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/85">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-white/60" aria-hidden />
                {next.departmentName}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/60" aria-hidden />
                {next.location}
              </span>
            </div>

            <Link
              to={`/p/appointment/${next.id}`}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-md bg-white px-5 font-semibold text-primary-700 transition-colors duration-fast hover:bg-primary-50"
            >
              {he.patient.toAppointment}
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        ) : (
          <EmptyState
            illustration="calendar"
            title={he.patient.emptyUpcoming}
            description={he.patient.emptyUpcomingSub}
          />
        )}

        {/* תורים עתידיים - בדיקות וניתוחים / מומחים */}
        <section aria-label={he.patient.appointmentsTitle}>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-h2 text-ink">תורים עתידיים</h2>
              <p className="mt-1 text-caption text-muted">בדיקות וניתוחים מוצגים יחד; ביקורי מומחים בטאב נפרד</p>
            </div>
            <Link to="/p/results" className="font-semibold text-primary-600 hover:text-primary-800">לתוצאות וסיכומים</Link>
          </div>

          <div
            role="group"
            aria-label="סוג התורים"
            className="mb-4 inline-flex items-center rounded-md border border-line bg-canvas p-1"
          >
            {(
              [
                { key: "care", label: `בדיקות וניתוחים (${upcomingAll.filter((a) => a.kind === "test" || a.kind === "surgery").length})` },
                { key: "specialists", label: `מומחים (${upcomingAll.filter((a) => a.kind === "consult" || a.kind === "followup").length})` },
              ] as const
            ).map((seg) => (
              <button
                key={seg.key}
                type="button"
                aria-pressed={tab === seg.key}
                onClick={() => switchTab(seg.key)}
                className={cn(
                  "min-h-[44px] rounded px-5 font-semibold transition-colors duration-fast tnum",
                  tab === seg.key
                    ? "bg-surface text-primary-700 shadow-sm"
                    : "text-muted hover:text-body",
                )}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <AppointmentFilters appointments={all} value={filters} onChange={setFilters} />

          {hasFilter && (
            <p className="mt-3 flex items-center gap-3 text-caption text-muted" aria-live="polite">
              {he.patient.filteredCount(filtered.length, all.length)}
              <button
                type="button"
                onClick={() => setFilters(emptyFilters())}
                className="rounded font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
              >
                {he.common.clearFilter}
              </button>
            </p>
          )}

          {filtered.length === 0 ? (
            <EmptyState
              illustration="calendar"
              title={
                "אין תורים עתידיים התואמים לסינון"
              }
              action={
                <Button variant="secondary" onClick={() => setFilters(emptyFilters())}>
                  {he.common.clearFilter}
                </Button>
              }
            />
          ) : (
            <div className="mt-5 flex flex-col gap-6">
              {groups.map((group) => (
                <section key={group.label} aria-label={group.label}>
                  <h3 className="mb-3 text-h3 text-muted">{group.label}</h3>
                  <div className="flex flex-col gap-3">
                    {group.items.map((a) => (
                      <AppointmentCard key={a.id} appointment={a} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>

        {/* מסמכים אחרונים */}
        {recentDocs.length > 0 && (
          <section aria-label={he.patient.recentDocuments}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-h2 text-ink">{he.patient.recentDocuments}</h2>
              <Link
                to="/p/documents"
                className="flex items-center gap-1 rounded font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
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
    </PatientShell>
  );
}
