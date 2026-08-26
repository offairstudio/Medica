import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
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
import { groupUpcoming } from "../features/patient-appointments/grouping";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { appointments } from "../mock/appointments";
import { documents } from "../mock/documents";
import { currentPatient } from "../mock/patients";
import { MOCK_TODAY } from "../mock/doctors";
import { useFakeLoading } from "../lib/useFakeLoading";
import { relativeDayLabel } from "../lib/date";
import { he } from "../i18n/he";

/**
 * מסך הבית של המטופל = מסך התורים.
 * מרכז את התור הקרוב, כל התורים (עתידיים/קודמים) עם סינון,
 * ומסמכים אחרונים - כך שהניווט מסתכם ב"תורים" ו"מסמכים".
 */
export function PatientHome() {
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
  const filtered = applyFilters(upcomingAll, filters);
  const groups = groupUpcoming(filtered, MOCK_TODAY);
  const hasFilter = filters.category !== "all" || filters.departments.length > 0 || filters.doctors.length > 0;

  const recentDocs = useMemo(
    () => [...documents].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 3),
    [],
  );

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
        {/* ברכה */}
        <div>
          <h1 className="text-display text-ink">
            {he.patient.greeting(currentPatient.firstName)}
          </h1>
          <p className="mt-1 text-muted">{he.patient.upcomingCount(upcomingAll.length)}</p>
        </div>

        {/* כל התורים העתידיים ברשימה אחת */}
        <section aria-label={he.patient.appointmentsTitle}>
          <div className="mb-4">
            <h2 className="text-h2 text-ink">התורים שלי</h2>
            <p className="mt-1 text-caption text-muted">כל התורים העתידיים לפי סדר, עם התור הקרוב בראש הרשימה</p>
          </div>

          <div className="rounded-xl border border-line bg-surface px-4 py-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center gap-2 text-caption font-semibold text-body">
                <SlidersHorizontal className="h-4 w-4 text-primary-600" aria-hidden />
                סינון התורים
              </div>
              <AppointmentFilters appointments={upcomingAll} value={filters} onChange={setFilters} />
            </div>
          </div>

          {hasFilter && (
            <p className="mt-3 flex items-center gap-3 px-1 text-caption text-muted" aria-live="polite">
              {he.patient.filteredCount(filtered.length, upcomingAll.length)}
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
            <div className="mt-6 flex flex-col gap-6">
              {groups.map((group) => (
                <section key={group.label} aria-label={group.label}>
                  <h3 className="mb-3 text-h3 text-muted">{group.label}</h3>
                  <div className="flex flex-col gap-3">
                    {group.items.map((a) => (
                      <AppointmentCard
                        key={a.id}
                        appointment={a}
                        featured={a.id === next?.id}
                        featuredLabel={a.id === next?.id ? relativeDayLabel(a.date, MOCK_TODAY) : undefined}
                      />
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
