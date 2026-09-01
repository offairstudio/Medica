import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Download,
  FileSpreadsheet,
  MoreVertical,
  Pencil,
  ArrowLeftRight,
  Trash2,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { DoctorShell } from "../components/layout/AppShell";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { Button } from "../components/primitives/Button";
import { Select } from "../components/primitives/Select";
import { DatePicker } from "../components/form/DatePicker";
import { Table, type TableColumn } from "../components/data/Table";
import { HospitalChip } from "../components/data/Chip";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Modal } from "../components/overlay/Modal";
import { Dropdown } from "../components/overlay/Dropdown";
import { useToast } from "../components/overlay/Toast";
import { SwapModal } from "../features/surgery-swap/SwapModal";
import { SurgeryDetailsModal } from "../features/surgery-details/SurgeryDetailsModal";
import { doctorById } from "../mock/doctors";
import { lookups } from "../mock/lookups";
import { useData } from "../state/data";
import { useFakeLoading } from "../lib/useFakeLoading";
import { formatNumericDate } from "../lib/date";
import { he } from "../i18n/he";
import { cn } from "../lib/cn";
import type { ISODate, Surgery } from "../types";

export function DoctorAllSurgeries() {
  const { doctorId = "" } = useParams();
  const isAll = doctorId === "all";
  const doctor = doctorById(isAll ? "doc-1" : doctorId);
  const { surgeries, deleteSurgery, restoreSurgery } = useData();
  const { toast } = useToast();
  const loading = useFakeLoading(500, doctorId);

  const [nameFilter, setNameFilter] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<ISODate | null>(null);
  const [toDateFilter, setToDateFilter] = useState<ISODate | null>(null);
  const [hospitalFilter, setHospitalFilter] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<Surgery | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<{ id: string; edit: boolean } | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const [deleteTarget, setDeleteTarget] = useState<Surgery | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const hasFilter = nameFilter.length > 0 || fromDate || toDateFilter || hospitalFilter;

  const filtered = useMemo(() => {
    return surgeries
      .filter((s) => isAll || s.doctorId === doctorId)
      .filter((s) => {
        if (nameFilter.length > 0 && !s.procedures.some((p) => nameFilter.includes(p.name))) {
          return false;
        }
        if (fromDate && s.date < fromDate) return false;
        if (toDateFilter && s.date > toDateFilter) return false;
        if (hospitalFilter && s.hospital !== hospitalFilter) return false;
        return true;
      })
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
  }, [surgeries, doctorId, isAll, nameFilter, fromDate, toDateFilter, hospitalFilter]);

  if (!doctor) return <Navigate to="/doctor/doc-1/all" replace />;

  /** דפדוף הדרגתי - הרשימה המלאה יכולה להכיל מאות ניתוחים */
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  function clearFilters() {
    setVisibleCount(30);
    setNameFilter([]);
    setFromDate(null);
    setToDateFilter(null);
    setHospitalFilter(null);
  }

  function exportCsv() {
    const header = [
      "בית חולים", "קוד", "שם הניתוח", "שם מטופל", "ת.ז / דרכון",
      "תאריך", "שעה", "משך (דקות)",
    ];
    const rows = filtered.map((s) => [
      he.hospitals[s.hospital],
      s.code,
      s.procedures.map((p) => p.name).join(" + "),
      `${s.patient.firstName} ${s.patient.lastName}`,
      s.patient.idNumber,
      formatNumericDate(s.date),
      s.startTime,
      String(s.durationMinutes),
    ]);
    const csv = "﻿" + [header, ...rows]
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "surgeries.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("success", he.toast.exportStarted);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const removed = deleteSurgery(deleteTarget.id);
    setDeleteTarget(null);
    toast(
      "success",
      he.schedule.deleteSuccess,
      removed ? { label: "ביטול פעולה", onUndo: () => restoreSurgery(removed) } : undefined,
    );
  }

  function downloadCell(url: string | undefined, label: string) {
    if (!url) return <span aria-hidden className="text-muted">–</span>;
    return (
      <a
        href={url}
        download
        onClick={(e) => e.stopPropagation()}
        aria-label={label}
        className="inline-flex rounded-md p-1.5 text-primary-600 transition-colors duration-fast hover:bg-primary-100"
      >
        <Download className="h-4 w-4" />
      </a>
    );
  }

  function actionsMenu(s: Surgery) {
    return (
      <Dropdown
        trigger={
          <button
            type="button"
            aria-label={`פעולות לניתוח ${s.code}`}
            className="rounded-md p-1.5 text-muted transition-colors duration-fast hover:bg-primary-100 hover:text-primary-700"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        }
        items={[
          { key: "edit", label: he.schedule.actions.edit, icon: <Pencil />, onSelect: () => setDetailsTarget({ id: s.id, edit: true }) },
          { key: "swap", label: he.schedule.actions.swap, icon: <ArrowLeftRight />, onSelect: () => setSwapTarget(s) },
          { key: "delete", label: he.schedule.actions.delete, icon: <Trash2 />, danger: true, onSelect: () => setDeleteTarget(s) },
          { key: "view", label: he.schedule.actions.view, icon: <Monitor />, onSelect: () => setDetailsTarget({ id: s.id, edit: false }) },
        ]}
      />
    );
  }

  const c = he.allSurgeries.columns;
  const columns: TableColumn<Surgery>[] = [
    { key: "hospital", header: c.hospital, render: (s) => <HospitalChip hospital={s.hospital} />, sortValue: (s) => s.hospital },
    { key: "code", header: c.code, numeric: true, className: "!px-2", render: (s) => s.code, sortValue: (s) => s.code },
    { key: "name", header: c.name, className: "min-w-44 max-w-72 !whitespace-normal", render: (s) => s.procedures.map((p) => p.name).join(" + ") },
    ...(isAll
      ? [{
          key: "doctor",
          header: "מנתח",
          render: (s: Surgery) => doctorById(s.doctorId)?.displayName ?? "",
          sortValue: (s: Surgery) => doctorById(s.doctorId)?.displayName ?? "",
        }]
      : []),
    { key: "patient", header: c.patient, render: (s) => `${s.patient.firstName} ${s.patient.lastName}`, sortValue: (s) => s.patient.lastName },
    { key: "idNumber", header: c.idNumber, numeric: true, render: (s) => s.patient.idNumber },
    { key: "date", header: c.date, numeric: true, render: (s) => formatNumericDate(s.date), sortValue: (s) => s.date },
    { key: "time", header: c.time, numeric: true, render: (s) => s.startTime, sortValue: (s) => s.startTime },
    { key: "duration", header: c.duration, numeric: true, className: "!px-2 text-center", render: (s) => s.durationMinutes, sortValue: (s) => s.durationMinutes },
    { key: "summary", header: c.summary, className: "!px-1.5 text-center", render: (s) => downloadCell(s.summaryUrl, `הורדת סיכום ניתוח ${s.code}`) },
    { key: "discharge", header: c.discharge, className: "!px-1.5 text-center", render: (s) => downloadCell(s.dischargeLetterUrl, `הורדת מכתב שחרור ${s.code}`) },
    { key: "actions", header: c.actions, className: "!px-1.5", render: (s) => actionsMenu(s) },
  ];

  const emptyState = (
    <div className="rounded-lg border border-line bg-surface shadow-sm">
      <EmptyState
        illustration="search"
        title={he.allSurgeries.emptyTitle}
        action={
          <Button variant="secondary" onClick={clearFilters}>
            {he.common.clearFilter}
          </Button>
        }
      />
    </div>
  );

  return (
    <DoctorShell
      doctorId={doctorId}
      header={
        <ScreenHeader
          title={he.allSurgeries.title}
          subtitle={isAll ? he.schedule.allDoctors : doctor.displayName}
        />
      }
    >

      {/* שורת סינון - מוחל אוטומטית בשינוי */}
      <div className="mb-4 rounded-md border border-line bg-surface p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label={he.allSurgeries.filterSurgeryName}
            options={lookups.surgeryNames.map((n) => ({ value: n, label: n }))}
            value={nameFilter}
            onChange={(v) => setNameFilter((v as string[]) ?? [])}
            searchable
            multiple
            placeholder="כל הניתוחים"
          />
          <DatePicker label={he.allSurgeries.filterFrom} value={fromDate} onChange={setFromDate} />
          <DatePicker label={he.allSurgeries.filterTo} value={toDateFilter} onChange={setToDateFilter} />
          <Select
            label={he.allSurgeries.filterHospital}
            options={[
              { value: "refael", label: he.hospitals.refael },
              { value: "elisha", label: he.hospitals.elisha },
            ]}
            value={hospitalFilter}
            onChange={(v) => setHospitalFilter(v as string | null)}
            clearable
            placeholder={he.allSurgeries.allHospitals}
          />
        </div>
        {hasFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 rounded text-caption font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
          >
            {he.common.clearFilter}
          </button>
        )}
      </div>

      <p className="mb-2 text-caption text-muted tnum" aria-live="polite">
        {he.allSurgeries.resultsCount(filtered.length)}
      </p>

      {loading ? (
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      ) : (
        <>
          {/* טבלה - Desktop */}
          <div className="hidden lg:block">
            <Table
              columns={columns}
              rows={visible}
              rowKey={(s) => s.id}
              caption="טבלת כל הניתוחים של המנתח, כולל סינון ומיון"
              empty={emptyState}
            />
          </div>

          {/* כרטיסים - מתחת ל-1024px */}
          <div className="flex flex-col gap-3 lg:hidden">
            {filtered.length === 0 && emptyState}
            {visible.map((s) => {
              const expanded = expandedCard === s.id;
              return (
                <div key={s.id} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-body-strong font-semibold text-ink">
                        {s.procedures.map((p) => p.name).join(" + ")}
                      </p>
                      <p className="mt-0.5 text-caption text-muted">
                        {s.patient.firstName} {s.patient.lastName} ·{" "}
                        <span className="tnum">{formatNumericDate(s.date)}</span> ·{" "}
                        <span className="tnum">{s.startTime}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <HospitalChip hospital={s.hospital} />
                      {actionsMenu(s)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedCard(expanded ? null : s.id)}
                    aria-expanded={expanded}
                    className="mt-2 flex items-center gap-1 rounded text-caption font-semibold text-primary-600"
                  >
                    פרטים נוספים
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-fast", expanded && "rotate-180")} />
                  </button>
                  {expanded && (
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-caption">
                      <div><dt className="text-muted">{c.code}</dt><dd className="tnum text-ink">{s.code}</dd></div>
                      <div><dt className="text-muted">{c.idNumber}</dt><dd className="tnum text-ink">{s.patient.idNumber}</dd></div>
                      <div><dt className="text-muted">{c.duration}</dt><dd className="tnum text-ink">{s.durationMinutes} דק'</dd></div>
                      <div className="flex items-center gap-2">
                        <dt className="text-muted">{c.summary}</dt>
                        <dd>{downloadCell(s.summaryUrl, `הורדת סיכום ניתוח ${s.code}`)}</dd>
                        <dt className="text-muted">{c.discharge}</dt>
                        <dd>{downloadCell(s.dischargeLetterUrl, `הורדת מכתב שחרור ${s.code}`)}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              );
            })}
          </div>

          {remaining > 0 && (
            <div className="mt-3 flex justify-center">
              <Button variant="secondary" onClick={() => setVisibleCount((c) => c + 30)}>
                הצג עוד ({remaining} נוספים)
              </Button>
            </div>
          )}

          {filtered.length > 0 && (
            <button
              type="button"
              onClick={exportCsv}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
            >
              <FileSpreadsheet className="h-4 w-4" aria-hidden />
              {he.allSurgeries.exportXl}
            </button>
          )}
        </>
      )}

      {detailsTarget && (
        <SurgeryDetailsModal
          key={detailsTarget.id}
          surgeryId={detailsTarget.id}
          startInEdit={detailsTarget.edit}
          onClose={() => setDetailsTarget(null)}
        />
      )}

      {swapTarget && <SwapModal surgery={swapTarget} onClose={() => setSwapTarget(null)} />}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={he.schedule.deleteConfirmTitle}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{he.common.cancel}</Button>
            <Button variant="danger" onClick={confirmDelete}>{he.schedule.actions.delete}</Button>
          </>
        }
      >
        {deleteTarget && (
          <p className="text-body">
            {he.schedule.deleteConfirmBody(
              `${deleteTarget.patient.firstName} ${deleteTarget.patient.lastName}`,
            )}
          </p>
        )}
      </Modal>
    </DoctorShell>
  );
}
