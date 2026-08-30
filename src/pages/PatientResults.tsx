import { useMemo, useState } from "react";
import {
  CalendarRange,
  Eye,
  Image as ImageIcon,
  Stethoscope,
} from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/data/EmptyState";
import { Button } from "../components/primitives/Button";
import { useToast } from "../components/overlay/Toast";
import { appointments } from "../mock/appointments";
import { formatFullDate } from "../lib/date";
import { cn } from "../lib/cn";
import type { Appointment } from "../types";

type ResultsTab = "tests" | "specialists";

/**
 * תוצאות וסיכומים - שתי קטגוריות בלבד לפי הדרישות: בדיקות ורופאים מומחים.
 * לכל תוצאה: תאריך, שם הבדיקה ואפשרויות צפייה (תוצאה / צילום). ללא הורדה.
 */
export function PatientResults() {
  const { toast } = useToast();
  const [tab, setTab] = useState<ResultsTab>("tests");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const allResults = useMemo(
    () => appointments.filter((item) => item.status === "completed" && item.resultSummary),
    [],
  );

  const filtered = useMemo(
    () =>
      allResults
        .filter((item) => (tab === "tests" ? item.kind === "test" : item.kind === "consult" || item.kind === "followup"))
        .filter((item) => !from || item.date >= from)
        .filter((item) => !to || item.date <= to)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [allResults, from, tab, to],
  );

  function openResult(item: Appointment) {
    window.open(item.documents[0]?.fileUrl ?? "/mock-files/mri-result.pdf", "_blank", "noopener,noreferrer");
  }

  function openImaging() {
    window.open("/mock-files/mri-result.pdf", "_blank", "noopener,noreferrer");
    toast("info", "MyVue נפתח בטאב חדש (מדומה בפרוטוטייפ)");
  }

  return (
    <PatientShell>
      <PageHeader title="תוצאות וסיכומים" subtitle="כל המידע הרפואי שהתקבל לאחר הביקורים והבדיקות" display />

      <div className="mb-5 flex gap-1 rounded-lg border border-line bg-canvas p-1" role="tablist" aria-label="סוג תוצאה">
        <TabButton active={tab === "tests"} onClick={() => setTab("tests")} icon={ImageIcon}>בדיקות וצילומים</TabButton>
        <TabButton active={tab === "specialists"} onClick={() => setTab("specialists")} icon={Stethoscope}>סיכומי מומחים</TabButton>
      </div>

      <section className="mb-6 rounded-lg border border-line bg-surface p-4 shadow-sm" aria-label="סינון לפי תאריכים">
        <div className="mb-3 flex items-center gap-2 font-semibold text-ink">
          <CalendarRange className="h-4 w-4 text-primary-500" /> סינון לפי תאריכים
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <DateField label="מתאריך" value={from} onChange={setFrom} />
          <DateField label="עד תאריך" value={to} onChange={setTo} />
          {(from || to) && <Button variant="ghost" onClick={() => { setFrom(""); setTo(""); }}>ניקוי הסינון</Button>}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState illustration="file" title="לא נמצאו תוצאות בטווח שנבחר" />
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
                    <Button size="sm" icon={<Eye className="h-4 w-4" />} onClick={() => openResult(item)}>צפייה בתוצאה</Button>
                    {item.imagingAvailable && (
                      <Button size="sm" variant="ghost" icon={<ImageIcon className="h-4 w-4" />} onClick={openImaging}>צפייה בצילום</Button>
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

function TabButton({ active, onClick, icon: Icon, children }: { active: boolean; onClick: () => void; icon: typeof ImageIcon; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn("flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md px-3 font-semibold transition-colors", active ? "bg-surface text-primary-700 shadow-sm" : "text-muted hover:text-body")}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block min-w-[170px] flex-1">
      <span className="mb-1 block text-caption font-semibold text-body">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-line bg-surface px-3 text-ink focus:border-primary-500" />
    </label>
  );
}
