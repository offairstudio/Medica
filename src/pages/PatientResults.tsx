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
  PatientPageHeader,
  tabClass,
  tabCountClass,
} from "../components/layout/PatientPageHeader";
import { EmptyState } from "../components/data/EmptyState";
import { FilterChip } from "../components/data/Chip";
import { Dropdown } from "../components/overlay/Dropdown";
import { Button } from "../components/primitives/Button";
import { useToast } from "../components/overlay/Toast";
import { appointments } from "../mock/appointments";
import { MOCK_TODAY } from "../mock/doctors";
import { daysUntil, formatFullDate } from "../lib/date";
import type { Appointment } from "../types";

type ResultsTab = "tests" | "specialists";

const TABS: { key: ResultsTab; label: string; icon: typeof ImageIcon }[] = [
  { key: "tests", label: "בדיקות וצילומים", icon: ImageIcon },
  { key: "specialists", label: "סיכומי מומחים", icon: Stethoscope },
];

/** טווחים מוכנים - קריאים יותר משני שדות תאריך, ולא תלויים בפורמט של הדפדפן */
const PERIODS = [
  { key: "all", label: "כל התקופות", chip: "כל התקופות", days: null },
  { key: "30", label: "החודש האחרון", chip: "החודש האחרון", days: 30 },
  { key: "90", label: "3 החודשים האחרונים", chip: "3 חודשים אחרונים", days: 90 },
  { key: "180", label: "חצי השנה האחרונה", chip: "חצי שנה אחרונה", days: 180 },
  { key: "365", label: "השנה האחרונה", chip: "שנה אחרונה", days: 365 },
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
    toast("info", "MyVue נפתח בטאב חדש (מדומה בפרוטוטייפ)");
  }

  const header = (
    <PatientPageHeader
      title="תוצאות וסיכומים"
      subtitle="כל המידע הרפואי שהתקבל לאחר הביקורים והבדיקות"
      start={
        <div className="flex items-center gap-1" role="tablist" aria-label="סוג תוצאה">
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={tabClass(active)}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {t.label}
                <span className={tabCountClass(active)}>{counts[t.key]}</span>
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
        <EmptyState illustration="file" title="לא נמצאו תוצאות בתקופה שנבחרה" />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-primary-100 text-primary-700">
                  <span className="text-caption font-semibold">{new Date(`${item.date}T12:00:00`).toLocaleDateString("he-IL", { month: "short" })}</span>
                  <span className="text-h2 font-bold leading-none tnum">{item.date.slice(-2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-h3 text-ink">{item.title}</h2>
                  <p className="mt-1 text-caption text-muted">{formatFullDate(item.date)}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    <Button icon={<Eye className="h-4 w-4" />} onClick={() => openResult(item)}>צפייה בתוצאה</Button>
                    {item.imagingAvailable && (
                      <Button variant="ghost" icon={<ImageIcon className="h-4 w-4" />} onClick={openImaging}>צפייה בצילום</Button>
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


