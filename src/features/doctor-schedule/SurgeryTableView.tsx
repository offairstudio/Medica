import { useMemo, useState } from "react";
import { Download, EllipsisVertical, Pencil, ArrowLeftRight, Trash2, Monitor, FileSpreadsheet } from "lucide-react";
import { Button } from "../../components/primitives/Button";
import { Select } from "../../components/primitives/Select";
import { DatePicker } from "../../components/form/DatePicker";
import { Table, type TableColumn } from "../../components/data/Table";
import { HospitalChip } from "../../components/data/Chip";
import { EmptyState } from "../../components/data/EmptyState";
import { Dropdown } from "../../components/overlay/Dropdown";
import { useToast } from "../../components/overlay/Toast";
import { HOSPITALS, HOSPITAL_LIST } from "../../mock/hospitals";
import { doctorById } from "../../mock/doctors";
import { lookups } from "../../mock/lookups";
import { formatNumericDate } from "../../lib/date";
import { he } from "../../i18n/he";
import type { ISODate, Surgery } from "../../types";

export interface SurgeryTableViewProps {
  surgeries: Surgery[];
  /** ביומן הכולל מתווספת עמודת המנתח */
  isAll: boolean;
  onView: (surgery: Surgery) => void;
  onEdit: (surgery: Surgery) => void;
  onSwap: (surgery: Surgery) => void;
  onDelete: (surgery: Surgery) => void;
}

/**
 * תצוגת טבלה: כל מאפייני הניתוח בשורה אחת, על פני טווח תאריכים -
 * לאיתור, השוואה וייצוא. משלימה את תצוגת היומן שמשרתת את היום עצמו.
 */
export function SurgeryTableView({
  surgeries,
  isAll,
  onView,
  onEdit,
  onSwap,
  onDelete,
}: SurgeryTableViewProps) {
  const { toast } = useToast();
  const [nameFilter, setNameFilter] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<ISODate | null>(null);
  const [toDate, setToDate] = useState<ISODate | null>(null);
  const [hospitalFilter, setHospitalFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);

  const hasFilter = nameFilter.length > 0 || Boolean(fromDate) || Boolean(toDate) || Boolean(hospitalFilter);

  const filtered = useMemo(
    () =>
      surgeries
        .filter((s) => {
          if (nameFilter.length > 0 && !s.procedures.some((p) => nameFilter.includes(p.name))) return false;
          if (fromDate && s.date < fromDate) return false;
          if (toDate && s.date > toDate) return false;
          if (hospitalFilter && s.hospital !== hospitalFilter) return false;
          return true;
        })
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [surgeries, nameFilter, fromDate, toDate, hospitalFilter],
  );

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  function clearFilters() {
    setVisibleCount(30);
    setNameFilter([]);
    setFromDate(null);
    setToDate(null);
    setHospitalFilter(null);
  }

  function exportCsv() {
    const header = ["בית חולים", "קוד", "שם הניתוח", "מנתח", "שם מטופל", "ת.ז / דרכון", "תאריך", "שעה", "משך (דקות)"];
    const rows = filtered.map((s) => [
      HOSPITALS[s.hospital].name,
      s.code,
      s.procedures.map((p) => p.name).join(" + "),
      doctorById(s.doctorId)?.displayName ?? "",
      `${s.patient.firstName} ${s.patient.lastName}`,
      s.patient.idNumber,
      formatNumericDate(s.date),
      s.startTime,
      String(s.durationMinutes),
    ]);
    const csv = "﻿" + [header, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "surgeries.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("success", he.toast.exportStarted);
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

  const c = he.allSurgeries.columns;
  const columns: TableColumn<Surgery>[] = [
    { key: "hospital", header: c.hospital, render: (s) => <HospitalChip hospital={s.hospital} compact />, sortValue: (s) => s.hospital },
    { key: "code", header: c.code, numeric: true, className: "!px-2", render: (s) => s.code, sortValue: (s) => s.code },
    { key: "name", header: c.name, className: "min-w-44 max-w-72 !whitespace-normal", render: (s) => s.procedures.map((p) => p.name).join(" + ") },
    ...(isAll
      ? [
          {
            key: "doctor",
            header: "מנתח",
            render: (s: Surgery) => doctorById(s.doctorId)?.displayName ?? "",
            sortValue: (s: Surgery) => doctorById(s.doctorId)?.displayName ?? "",
          },
        ]
      : []),
    { key: "patient", header: c.patient, render: (s) => `${s.patient.firstName} ${s.patient.lastName}`, sortValue: (s) => s.patient.lastName },
    { key: "idNumber", header: c.idNumber, numeric: true, render: (s) => s.patient.idNumber },
    { key: "date", header: c.date, numeric: true, render: (s) => formatNumericDate(s.date), sortValue: (s) => s.date },
    { key: "time", header: c.time, numeric: true, render: (s) => s.startTime, sortValue: (s) => s.startTime },
    { key: "duration", header: c.duration, numeric: true, className: "!px-2 text-center", render: (s) => s.durationMinutes, sortValue: (s) => s.durationMinutes },
    { key: "summary", header: c.summary, className: "!px-1.5 text-center", render: (s) => downloadCell(s.summaryUrl, `הורדת סיכום ניתוח ${s.code}`) },
    { key: "discharge", header: c.discharge, className: "!px-1.5 text-center", render: (s) => downloadCell(s.dischargeLetterUrl, `הורדת מכתב שחרור ${s.code}`) },
    {
      key: "actions",
      header: c.actions,
      className: "!px-1.5",
      render: (s) => (
        <Dropdown
          portal
          trigger={
            <button
              type="button"
              aria-label={`פעולות לניתוח של ${s.patient.firstName} ${s.patient.lastName}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-primary-50 hover:text-primary-700"
            >
              <EllipsisVertical className="h-4 w-4" />
            </button>
          }
          items={[
            { key: "view", label: he.schedule.actions.view, icon: <Monitor />, onSelect: () => onView(s) },
            { key: "edit", label: he.schedule.actions.edit, icon: <Pencil />, onSelect: () => onEdit(s) },
            { key: "swap", label: he.schedule.actions.swap, icon: <ArrowLeftRight />, onSelect: () => onSwap(s) },
            { key: "delete", label: he.schedule.actions.delete, icon: <Trash2 />, danger: true, onSelect: () => onDelete(s) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* סינון - מוחל אוטומטית בשינוי */}
      <div className="rounded-lg border border-line bg-surface p-4 shadow-sm">
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
          <DatePicker label={he.allSurgeries.filterTo} value={toDate} onChange={setToDate} />
          <Select
            label={he.allSurgeries.filterHospital}
            options={HOSPITAL_LIST.map((h) => ({ value: h.key, label: h.name }))}
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-muted tnum" aria-live="polite">
          {he.allSurgeries.resultsCount(filtered.length)}
        </p>
        <Button
          variant="secondary"
          size="sm"
          icon={<FileSpreadsheet className="h-4 w-4" />}
          onClick={exportCsv}
          disabled={filtered.length === 0}
        >
          {he.allSurgeries.exportXl}
        </Button>
      </div>

      <Table
        columns={columns}
        rows={visible}
        rowKey={(s) => s.id}
        onRowClick={onView}
        caption="טבלת הניתוחים, כולל סינון ומיון"
        empty={
          <div className="rounded-lg border border-line bg-surface shadow-sm">
            <EmptyState
              illustration="search"
              title={he.allSurgeries.emptyTitle}
              action={
                hasFilter ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    {he.common.clearFilter}
                  </Button>
                ) : undefined
              }
            />
          </div>
        }
      />

      {remaining > 0 && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((n) => n + 30)}>
            {he.schedule.moreCount(remaining)}
          </Button>
        </div>
      )}
    </div>
  );
}
