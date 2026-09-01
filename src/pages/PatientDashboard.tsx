import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Eye,
  Info,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PatientPageHeader } from "../components/layout/PatientPageHeader";
import { Skeleton } from "../components/data/Skeleton";
import { EmptyState } from "../components/data/EmptyState";
import { AppointmentCard } from "../features/patient-appointments/AppointmentCard";
import { appointments } from "../mock/appointments";
import { currentPatient } from "../mock/patients";
import { MOCK_TODAY } from "../mock/doctors";
import { useFakeLoading } from "../lib/useFakeLoading";
import { formatFullDate, relativeDayLabel } from "../lib/date";
import { he } from "../i18n/he";

/** אריח סיכום שמוביל לאזור המתאים */
function StatTile({
  to,
  icon: Icon,
  value,
  label,
}: {
  to: string;
  icon: typeof CalendarClock;
  value: number;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-sm transition-all duration-fast hover:border-primary-300 hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-h2 font-bold leading-none text-ink tnum">{value}</span>
        <span className="mt-1 block truncate text-caption text-muted">{label}</span>
      </span>
      <ArrowLeft className="ms-auto h-4 w-4 shrink-0 text-muted transition-transform duration-fast group-hover:-translate-x-0.5 group-hover:text-primary-600" aria-hidden />
    </Link>
  );
}

function SectionHeader({ title, to }: { title: string; to?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-h2 text-ink">{title}</h2>
      {to && (
        <Link
          to={to}
          className="-me-2 inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-md px-2 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50 hover:text-primary-800"
        >
          {he.common.showAll}
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/**
 * דף הבית של המטופל - סקירה.
 * מרכז את מה שדורש תשומת לב עכשיו: התור הקרוב וההכנות אליו,
 * ומתחת סיכומים קצרים של התורים, התוצאות והמסמכים.
 */
export function PatientDashboard() {
  const loading = useFakeLoading(450);

  const upcoming = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "upcoming")
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [],
  );
  const results = useMemo(
    () =>
      appointments
        .filter((a) => a.status === "completed" && a.resultSummary)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );

  const next = upcoming[0];
  const following = upcoming.slice(1, 4);
  const prep = next?.preparation ?? [];

  if (loading) {
    return (
      <PatientShell>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-56" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton variant="block" className="h-20 rounded-xl" />
            <Skeleton variant="block" className="h-20 rounded-xl" />
            <Skeleton variant="block" className="h-20 rounded-xl" />
          </div>
          <Skeleton variant="block" className="h-44 rounded-xl" />
          <Skeleton variant="block" className="h-32" />
        </div>
      </PatientShell>
    );
  }

  const header = (
    <PatientPageHeader
      title={he.patient.greeting(currentPatient.firstName)}
      subtitle={
        next
          ? `התור הקרוב שלך ${relativeDayLabel(next.date, MOCK_TODAY)} · ${next.doctorName}`
          : he.patient.emptyUpcoming
      }
    />
  );

  return (
    <PatientShell header={header}>
      <div className="flex flex-col gap-8">
        {/* סיכומים */}
        <div className="grid gap-3 sm:grid-cols-2">
          <StatTile to="/p/appointments" icon={CalendarClock} value={upcoming.length} label="תורים עתידיים" />
          <StatTile to="/p/results" icon={ClipboardList} value={results.length} label="תוצאות וסיכומים" />
        </div>

        {/* התור הקרוב + הכנות */}
        {next ? (
          <section aria-label={he.patient.nextAppointment}>
            <SectionHeader title={he.patient.nextAppointment} />
            <AppointmentCard
              appointment={next}
              featured
              featuredLabel={relativeDayLabel(next.date, MOCK_TODAY)}
              extra={
                prep.length > 0 && (
                  <>
                    <span className="flex items-center gap-2 text-caption font-semibold text-primary-800">
                      <Info className="h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                      {he.patient.preparation} · {prep.length}
                    </span>
                    <span className="mt-2 flex flex-col gap-1">
                      {prep.map((p) => (
                        <span key={p} className="flex gap-2 text-caption text-primary-800">
                          <span
                            aria-hidden
                            className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary-400"
                          />
                          {p}
                        </span>
                      ))}
                    </span>
                  </>
                )
              }
            />
          </section>
        ) : (
          <EmptyState illustration="calendar" title={he.patient.emptyUpcoming} />
        )}

        {/* שתי עמודות: התורים הבאים + תוצאות ומסמכים */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0" aria-label="התורים הבאים">
            <SectionHeader title="התורים הבאים" to="/p/appointments" />
            {following.length === 0 ? (
              <p className="rounded-lg border border-line bg-surface px-4 py-6 text-center text-caption text-muted">
                אין תורים נוספים אחרי התור הקרוב
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {following.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            )}
          </section>

          <div className="flex min-w-0 flex-col gap-8">
            <section className="min-w-0" aria-label="תוצאות אחרונות">
              <SectionHeader title="תוצאות אחרונות" to="/p/results" />
              <ul className="rounded-lg border border-line bg-surface px-4 shadow-sm">
                {results.slice(0, 3).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 border-b border-line py-3 last:border-b-0"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-caption text-muted">
                        {formatFullDate(r.date)}
                      </span>
                    </span>
                    <Link
                      to="/p/results"
                      aria-label={`צפייה בתוצאה: ${r.title}`}
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md px-3 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                      צפייה
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </div>
      </div>
    </PatientShell>
  );
}
