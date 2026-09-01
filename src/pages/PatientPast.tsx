import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
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
import { appointments } from "../mock/appointments";
import { MOCK_TODAY } from "../mock/doctors";
import { useFakeLoading } from "../lib/useFakeLoading";
import { he } from "../i18n/he";

/** אפיון 7.10 - תורים קודמים: מיון מהחדש לישן, כרטיסים מאופקים, אותו סינון. */
export function PatientPast() {
  const loading = useFakeLoading(450);
  const [filters, setFilters] = useState(emptyFilters());

  const pastAll = useMemo(
    () =>
      appointments
        .filter((a) => a.status !== "upcoming")
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [],
  );

  const filtered = applyFilters(pastAll, filters);
  const groups = groupByDate(filtered, MOCK_TODAY);
  const hasFilter = filters.departments.length > 0 || filters.doctors.length > 0;

  if (loading) {
    return (
      <PatientShell>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton variant="block" className="h-32" />
          <Skeleton variant="block" className="h-32" />
        </div>
      </PatientShell>
    );
  }

  return (
    <PatientShell>
      <PageHeader
        title={he.patient.pastTitle}
        subtitle={he.patient.appointmentsCount(pastAll.length)}
        display
      />

      <div className="rounded-xl border border-line bg-surface px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-caption font-semibold text-body">
            <SlidersHorizontal className="h-4 w-4 text-primary-600" aria-hidden />
            סינון התורים
          </div>
          <AppointmentFilters appointments={pastAll} value={filters} onChange={setFilters} />
        </div>
      </div>

      {hasFilter && (
        <p className="mt-3 flex items-center gap-3 px-1 text-caption text-muted" aria-live="polite">
          {he.patient.filteredCount(filtered.length, pastAll.length)}
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
          title={he.patient.emptyPastFiltered}
          action={
            <Button variant="secondary" onClick={() => setFilters(emptyFilters())}>
              {he.common.clearFilter}
            </Button>
          }
        />
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {groups.map((group) => (
            <section key={group.date} aria-label={group.full}>
              <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-h3 text-ink">{group.relative}</span>
                <span className="text-caption text-muted">{group.full}</span>
              </h2>
              <div className="flex flex-col gap-3">
                {group.items.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} muted />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PatientShell>
  );
}
