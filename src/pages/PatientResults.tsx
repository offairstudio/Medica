import { useMemo, useState } from "react";
import {
  CalendarRange,
  Check,
  ChevronDown,
  Eye,
  Image as ImageIcon,
  Stethoscope,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import {
  ScreenHeader,
  tabClass,
  tabCountClass,
} from "../components/layout/ScreenHeader";
import { EmptyState } from "../components/data/EmptyState";
import { FilterChip } from "../components/data/Chip";
import { Dropdown } from "../components/overlay/Dropdown";
import { Button } from "../components/primitives/Button";
import { useToast } from "../components/overlay/Toast";
import { appointments } from "../mock/appointments";
import { MOCK_TODAY } from "../mock/doctors";
import { daysUntil, formatFullDate, formatShortMonth } from "../lib/date";
import { t } from "../i18n";
import type { Appointment } from "../types";

type ResultsTab = "tests" | "specialists";

const TABS: { key: ResultsTab; label: string; icon: typeof ImageIcon }[] = [
  { key: "tests", label: t.ui.results.tabTests, icon: ImageIcon },
  { key: "specialists", label: t.ui.results.tabSummaries, icon: Stethoscope },
];

/** טווחים מוכנים - קריאים יותר משני שדות תאריך, ולא תלויים בפורמט של הדפדפן */
const PERIODS = [
  { key: "all", label: t.ui.results.periods.all, chip: t.ui.results.periods.all, days: null },
  { key: "30", label: t.ui.results.periods.month, chip: t.ui.results.periods.month, days: 30 },
  { key: "90", label: t.ui.results.periods.threeMonths, chip: t.ui.results.periods.threeMonthsShort, days: 90 },
  { key: "180", label: t.ui.results.periods.halfYear, chip: t.ui.results.periods.halfYearShort, days: 180 },
  { key: "365", label: t.ui.results.periods.year, chip: t.ui.results.periods.yearShort, days: 365 },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

/**
 * תוצאות וסיכומים - שתי קטגוריות בלבד לפי הדרישות: בדיקות ורופאים מומחים.
 * לכל תוצאה: תאריך, שם הבדיקה ואפשרויות צפייה (תוצאה / צילום). ללא הורדה.
 */
export function PatientResults() {
  const { toast } = useToast();
  const [tab, setTab] = useState<ResultsTab>("tests");
  const [period, setPeriod] = useState<PeriodKey>("all");

  const allResults = useMemo(
    () => appointments.filter((item) => item.status === "completed" && item.resultSummary),
    [],
  );

  const counts = useMemo(
    () => ({
      tests: allResults.filter((i) => i.kind === "test").length,
      specialists: allResults.filter((i) => i.kind === "consult" || i.kind === "followup").length,
    }),
    [allResults],
  );

  const filtered = useMemo(
    () =>
      allResults
        .filter((item) => (tab === "tests" ? item.kind === "test" : item.kind === "consult" || item.kind === "followup"))
        .filter((item) => {
          const days = PERIODS.find((p) => p.key === period)!.days;
          return days === null || daysUntil(MOCK_TODAY, item.date) <= days;
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [allResults, period, tab],
  );

  function openResult(item: Appointment) {
    window.open(item.documents[0]?.fileUrl ?? "/mock-files/mri-result.pdf", "_blank", "noopener,noreferrer");
  }

  function openImaging() {
    window.open("/mock-files/mri-result.pdf", "_blank", "noopener,noreferrer");
    toast("info", t.ui.results.myVue);
  }

  const header = (
    <ScreenHeader
      title={t.ui.results.title}
      subtitle={t.ui.results.subtitle}
      start={
        <div className="flex items-center gap-1" role="tablist" aria-label={t.ui.results.resultType}>
          {TABS.map((item) => {
            const active = tab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.key)}
                className={tabClass(active)}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
                <span className={tabCountClass(active)}>{counts[item.key]}</span>
              </button>
            );
          })}
        </div>
      }
      end={
        <div className="pb-2">
          <Dropdown
            align="start"
            portal
            menuClassName="min-w-56"
            trigger={
              <FilterChip
                active={period !== "all"}
                ariaHasPopup
                onClear={period !== "all" ? () => setPeriod("all") : undefined}
              >
                <CalendarRange className="h-4 w-4" aria-hidden />
                {PERIODS.find((p) => p.key === period)!.chip}
                <ChevronDown className="h-4 w-4" aria-hidden />
              </FilterChip>
            }
            items={PERIODS.map((p) => ({
              key: p.key,
              label: p.label,
              icon: <Check className={period === p.key ? "text-primary-600" : "opacity-0"} />,
              onSelect: () => setPeriod(p.key),
            }))}
          />
        </div>
      }
    />
  );

  return (
    <PatientShell header={header}>
      {filtered.length === 0 ? (
        <EmptyState illustration="file" title={t.ui.results.empty} />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-primary-100 text-primary-700">
                  <span className="text-caption font-semibold">{formatShortMonth(item.date)}</span>
                  <span className="text-h2 font-bold leading-none tnum">{item.date.slice(-2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-h3 text-ink">{item.title}</h2>
                  <p className="mt-1 text-caption text-muted">{formatFullDate(item.date)}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    <Button icon={<Eye className="h-4 w-4" />} onClick={() => openResult(item)}>{t.ui.results.view}</Button>
                    {item.imagingAvailable && (
                      <Button variant="ghost" icon={<ImageIcon className="h-4 w-4" />} onClick={openImaging}>{t.ui.results.viewImaging}</Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PatientShell>
  );
}


