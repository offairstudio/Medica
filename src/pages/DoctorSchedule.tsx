import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { addDays, addMonths, startOfMonth } from "date-fns";
import {
  ChevronRight,
  ChevronLeft,
  Info,
  CalendarDays,
  CalendarRange,
  List,
  Plus,
} from "lucide-react";
import { Avatar } from "../components/data/Avatar";
import { departmentName } from "../mock/departments";
import { formatPhone } from "../lib/format";
import { doctors } from "../mock/doctors";
import { DoctorShell } from "../components/layout/AppShell";
import { Button } from "../components/primitives/Button";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Modal } from "../components/overlay/Modal";
import { useToast } from "../components/overlay/Toast";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { BlockLegend } from "../components/calendar/BlockLegend";
import { SurgeryRow } from "../features/doctor-schedule/SurgeryRow";
import { DayStrip } from "../features/doctor-schedule/DayStrip";
import { MonthGrid } from "../features/doctor-schedule/MonthGrid";
import { SwapModal } from "../features/surgery-swap/SwapModal";
import { SurgeryDetailsModal } from "../features/surgery-details/SurgeryDetailsModal";
import {
  SurgeryWizardModal,
  type WizardPrefill,
} from "../features/surgery-wizard/SurgeryWizardModal";
import {
  computeFreeSlots,
  computeFreeSlotsForAll,
  type FreeSlot,
} from "../features/doctor-schedule/slots";
import { HospitalChip } from "../components/data/Chip";
import { doctorById, MOCK_TODAY } from "../mock/doctors";
import { useData } from "../state/data";
import { useFakeLoading } from "../lib/useFakeLoading";
import {
  formatMonthYear,
  formatShortDate,
  formatWeekday,
  formatTotalHours,
  timeToMinutes,
  toDate,
  toISO,
} from "../lib/date";
import { he } from "../i18n/he";
import { cn } from "../lib/cn";
import type { Hospital, ISODate, Surgery } from "../types";

/** משך חלון פנוי בניסוח קריא: "45 דק'" / "שעה" / "2:40 שעות" */
function freeDurationLabel(slot: FreeSlot): string {
  const minutes = timeToMinutes(slot.end) - timeToMinutes(slot.start);
  if (minutes < 60) return `${minutes} דק'`;
  if (minutes === 60) return "שעה";
  return formatTotalHours(minutes);
}

export function DoctorSchedule() {
  const { doctorId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  /** "all" = יומן כולל לכל המנתחים; ה-TopBar מציג תמיד את המשתמש המחובר */
  const isAll = doctorId === "all";
  const doctor = doctorById(isAll ? "doc-1" : doctorId);
  const { surgeries, deleteSurgery, restoreSurgery, highlightId } = useData();
  const { toast } = useToast();

  const [view, setView] = useState<"day" | "month">("day");
  const [selectedDate, setSelectedDate] = useState<ISODate>(MOCK_TODAY);
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(toDate(MOCK_TODAY)));
  const [swapTarget, setSwapTarget] = useState<Surgery | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Surgery | null>(null);
  const [wizardPrefill, setWizardPrefill] = useState<WizardPrefill | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<{ id: string; edit: boolean } | null>(null);

  const loading = useFakeLoading(500, `${doctorId}-${view}-${selectedDate}`);

  // כניסה מ-URL של יצירת ניתוח (/surgery/new מפנה לכאן עם ?new=1)
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setWizardPrefill({
        date: (searchParams.get("date") as ISODate) ?? undefined,
        time: searchParams.get("time") ?? undefined,
      });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const daySurgeries = useMemo(
    () =>
      surgeries
        .filter(
          (s) =>
            (isAll || s.doctorId === doctorId) &&
            s.date === selectedDate &&
            s.status !== "cancelled",
        )
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [surgeries, doctorId, selectedDate, isAll],
  );

  const freeSlots = useMemo(
    () =>
      isAll
        ? computeFreeSlotsForAll(selectedDate, surgeries)
        : computeFreeSlots(selectedDate, doctorId, surgeries),
    [selectedDate, doctorId, surgeries, isAll],
  );

  /**
   * חלונות פנויים מאוחדים: ביומן הכולל, חלון זהה (שעות + בית חולים)
   * של כמה מנתחים הופך לשורה אחת עם ספירת המנתחים הפנויים.
   */
  const mergedFreeSlots = useMemo(() => {
    const map = new Map<string, FreeSlot & { doctorIds: string[] }>();
    for (const slot of freeSlots) {
      const key = `${slot.start}|${slot.end}|${slot.hospital}`;
      const entry = map.get(key) ?? { ...slot, doctorIds: [] };
      if (slot.doctorId && !entry.doctorIds.includes(slot.doctorId)) {
        entry.doctorIds.push(slot.doctorId);
      }
      map.set(key, entry);
    }
    return [...map.values()];
  }, [freeSlots]);

  /** ציר זמן ממוזג: ניתוחים וחלונות פנויים בסדר כרונולוגי */
  const dayItems = useMemo(() => {
    const items: (
      | { type: "surgery"; start: number; surgery: Surgery }
      | { type: "free"; start: number; slot: FreeSlot & { doctorIds: string[] } }
    )[] = [
      ...daySurgeries.map((s) => ({
        type: "surgery" as const,
        start: timeToMinutes(s.startTime),
        surgery: s,
      })),
      ...mergedFreeSlots.map((slot) => ({
        type: "free" as const,
        start: timeToMinutes(slot.start),
        slot,
      })),
    ];
    return items.sort((a, b) => a.start - b.start);
  }, [daySurgeries, mergedFreeSlots]);

  const totalMinutes = daySurgeries.reduce((sum, s) => sum + s.durationMinutes, 0);

  const monthSurgeryCount = useMemo(
    () =>
      surgeries.filter(
        (s) =>
          (isAll || s.doctorId === doctorId) &&
          s.status !== "cancelled" &&
          toDate(s.date).getMonth() === viewMonth.getMonth() &&
          toDate(s.date).getFullYear() === viewMonth.getFullYear(),
      ).length,
    [surgeries, doctorId, isAll, viewMonth],
  );

  const { markedDates, loadBadges } = useMemo(() => {
    const marked: Record<ISODate, Hospital> = {};
    const badges: Record<ISODate, string> = {};
    const perDay: Record<ISODate, number> = {};
    for (const s of surgeries) {
      if ((!isAll && s.doctorId !== doctorId) || s.status === "cancelled") continue;
      marked[s.date] = s.hospital;
      perDay[s.date] = (perDay[s.date] ?? 0) + s.durationMinutes;
    }
    for (const [date, minutes] of Object.entries(perDay)) {
      badges[date] = (minutes / 60).toFixed(2).replace(/\.?0+$/, "");
    }
    return { markedDates: marked, loadBadges: badges };
  }, [surgeries, doctorId, isAll]);

  if (!doctor) return <Navigate to="/doctor/doc-1/schedule" replace />;

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

  function openDay(date: ISODate) {
    setSelectedDate(date);
    setView("day");
  }

  function navPrev() {
    if (view === "day") setSelectedDate(toISO(addDays(toDate(selectedDate), -1)));
    else setViewMonth((m) => addMonths(m, -1));
  }

  function navNext() {
    if (view === "day") setSelectedDate(toISO(addDays(toDate(selectedDate), 1)));
    else setViewMonth((m) => addMonths(m, 1));
  }

  return (
    <DoctorShell doctor={doctor} section="schedule" activeDoctorId={doctorId}>
      <div className="flex items-start gap-4">
        <section className="min-w-0 flex-1 rounded-lg border border-line bg-surface shadow-sm">
          {/* כותרת הכרטיס */}
          <header className="rounded-t-[15px] bg-primary-700 px-4 py-3 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* זהות היומן הנצפה - בנפרד מהמשתמש המחובר שב-TopBar */}
              <div className="flex min-w-0 items-center gap-2.5">
                {isAll ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <CalendarRange className="h-4 w-4" aria-hidden />
                  </span>
                ) : (
                  <Avatar name={doctor.displayName} src={doctor.avatarUrl} size="md" />
                )}
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-semibold">
                    {isAll ? he.schedule.allDoctors : doctor.displayName}
                  </span>
                  <span className="block truncate text-[11px] text-white/70">
                    {isAll ? (
                      `${doctors.filter((d) => d.managedByMe).length} מנתחים`
                    ) : (
                      <>
                        {departmentName(doctor.departmentId)} ·{" "}
                        <span dir="ltr" className="tnum">{formatPhone(doctor.mobile)}</span>
                      </>
                    )}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* מתג תצוגה יומי / חודשי */}
                <div
                  role="group"
                  aria-label="בחירת תצוגה"
                  className="flex items-center rounded-md bg-white/10 p-0.5"
                >
                  <button
                    type="button"
                    aria-pressed={view === "day"}
                    onClick={() => setView("day")}
                    className={cn(
                      "flex items-center gap-1 rounded px-2.5 py-1 text-caption font-semibold transition-colors duration-fast",
                      view === "day" ? "bg-white text-primary-700" : "text-white/80 hover:text-white",
                    )}
                  >
                    <List className="h-3.5 w-3.5" aria-hidden />
                    {he.schedule.viewDay}
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === "month"}
                    onClick={() => {
                      setViewMonth(startOfMonth(toDate(selectedDate)));
                      setView("month");
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded px-2.5 py-1 text-caption font-semibold transition-colors duration-fast",
                      view === "month" ? "bg-white text-primary-700" : "text-white/80 hover:text-white",
                    )}
                  >
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {he.schedule.viewMonth}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toast("info", "שינוי הל\"ז אינו חלק מהפרוטוטייפ")}
                  className="rounded-md px-2.5 py-1.5 text-caption font-semibold underline-offset-2 transition-colors duration-fast hover:bg-white/10 hover:underline"
                >
                  {he.schedule.changeSchedule}
                </button>
              </div>
            </div>

            {/* שורת התאריך והסיכום */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={view === "day" ? "יום קודם" : "חודש קודם"}
                  onClick={navPrev}
                  className="rounded-md p-1.5 transition-colors duration-fast hover:bg-white/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {view === "day" ? (
                  <span dir="ltr" className="min-w-[84px] text-center text-h3 font-semibold tnum">
                    {formatShortDate(selectedDate)}
                  </span>
                ) : (
                  <span className="min-w-[100px] text-center text-h3 font-semibold">
                    {formatMonthYear(viewMonth)}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={view === "day" ? "יום הבא" : "חודש הבא"}
                  onClick={navNext}
                  className="rounded-md p-1.5 transition-colors duration-fast hover:bg-white/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <p className="text-caption text-white/75">
                {view === "day" ? (
                  <>
                    {formatWeekday(selectedDate)}
                    {daySurgeries.length > 0 && (
                      <>
                        {" "}
                        · {he.schedule.daySummary(daySurgeries.length, formatTotalHours(totalMinutes))}
                      </>
                    )}
                  </>
                ) : (
                  <>{monthSurgeryCount} ניתוחים החודש</>
                )}
              </p>
            </div>
          </header>

          {/* ===== תצוגה חודשית ===== */}
          {view === "month" ? (
            loading ? (
              <div className="grid grid-cols-7 gap-px p-2">
                {Array.from({ length: 35 }, (_, i) => (
                  <Skeleton key={i} variant="block" className="h-24 rounded-none" />
                ))}
              </div>
            ) : (
              <MonthGrid
                month={viewMonth}
                doctorId={doctorId}
                onOpenDay={openDay}
                onCreate={(date) => setWizardPrefill({ date })}
                onOpenSurgery={(s) => setDetailsTarget({ id: s.id, edit: false })}
              />
            )
          ) : (
            /* ===== תצוגה יומית ===== */
            <>
              {/* פס ימים - ניווט מהיר כשהלוח החודשי אינו מוצג בצד */}
              <div className="border-b border-line xl:hidden">
                <DayStrip doctorId={doctorId} selectedDate={selectedDate} onSelect={setSelectedDate} />
              </div>

              {loading ? (
                <div className="flex flex-col gap-4 p-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton variant="circle" className="h-9 w-9" />
                      <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="w-2/3" />
                        <Skeleton className="w-1/3" />
                      </div>
                      <Skeleton className="w-24" />
                    </div>
                  ))}
                </div>
              ) : daySurgeries.length === 0 && freeSlots.length === 0 ? (
                <EmptyState
                  illustration="calendar"
                  title={he.schedule.emptyDay}
                  action={
                    <Button
                      variant="secondary"
                      icon={<Plus className="h-4 w-4" />}
                      onClick={() => setWizardPrefill({ date: selectedDate })}
                    >
                      {he.schedule.createSurgery}
                    </Button>
                  }
                />
              ) : (
                <div className="max-md:flex max-md:flex-col max-md:gap-3 max-md:p-3">
                  {/* ציר זמן ממוזג: ניתוחים וחלונות פנויים לפי סדר השעות ביום */}
                  {dayItems.map((item) =>
                    item.type === "surgery" ? (
                      <SurgeryRow
                        key={item.surgery.id}
                        surgery={item.surgery}
                        doctorName={
                          isAll ? doctorById(item.surgery.doctorId)?.displayName : undefined
                        }
                        highlighted={highlightId === item.surgery.id}
                        onView={(s) => setDetailsTarget({ id: s.id, edit: false })}
                        onEdit={(s) => setDetailsTarget({ id: s.id, edit: true })}
                        onSwap={setSwapTarget}
                        onDelete={setDeleteTarget}
                      />
                    ) : (
                      // חלון פנוי - אותה פריסת עמודות כמו שורת ניתוח, לסריקה אחידה
                      <button
                        key={`free-${item.slot.hospital}-${item.slot.start}`}
                        type="button"
                        onClick={() =>
                          setWizardPrefill({
                            date: selectedDate,
                            time: item.slot.start,
                            doctorId: item.slot.doctorIds[0],
                          })
                        }
                        title={
                          isAll && item.slot.doctorIds.length > 0
                            ? item.slot.doctorIds
                                .map((id) => doctorById(id)?.displayName)
                                .filter(Boolean)
                                .join(", ")
                            : undefined
                        }
                        className={cn(
                          "relative flex min-h-[56px] w-full items-center gap-4 border-b border-line px-4 py-2 text-start transition-colors duration-fast last:border-b-0",
                          "bg-success/[.08] hover:bg-success/[.14]",
                          "max-md:rounded-md max-md:border max-md:border-success/30",
                        )}
                      >
                        <span aria-hidden className="absolute inset-y-0 start-0 w-[3px] bg-success" />

                        {/* עמודת זמן - מיושרת עם שורות הניתוחים */}
                        <span className="flex shrink-0 items-baseline gap-1 md:w-[64px] md:flex-col md:gap-0">
                          <span dir="ltr" className="text-mono-num font-semibold text-success tnum">
                            {item.slot.start}
                          </span>
                          <span aria-hidden className="text-caption text-success/70 md:hidden">
                            -
                          </span>
                          <span dir="ltr" className="text-caption text-success/70 tnum">
                            {item.slot.end}
                          </span>
                        </span>

                        {/* עמודת בית חולים - מיושרת עם הצ'יפים של הניתוחים */}
                        <span className="shrink-0 md:w-16">
                          <HospitalChip hospital={item.slot.hospital} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="text-body-strong font-semibold text-success">
                            {he.schedule.free}
                          </span>
                          <span className="text-caption text-success/80">
                            {" "}
                            · {freeDurationLabel(item.slot)}
                          </span>
                          {isAll && item.slot.doctorIds.length > 0 && (
                            <span className="block truncate text-caption font-semibold text-primary-700">
                              {item.slot.doctorIds.length === 1
                                ? doctorById(item.slot.doctorIds[0])?.displayName
                                : he.schedule.freeDoctorsCount(item.slot.doctorIds.length)}
                            </span>
                          )}
                        </span>

                        {/* אייקון הוספה - מיושר עם עמודת הפעולות */}
                        <span className="flex shrink-0 justify-center max-md:absolute max-md:end-3 max-md:top-3 md:w-9">
                          <Plus className="h-5 w-5 text-success" aria-hidden />
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}

              {/* באנר ניתוח משולב - רלוונטי ליומן האישי בלבד */}
              {!isAll && (
                <div className="m-4 flex items-start gap-2.5 rounded-md border border-primary-200 bg-primary-50 px-4 py-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden />
                  <p className="text-caption text-primary-800">
                    {he.schedule.combinedBanner('ד"ר בורג אלון')}{" "}
                    <button
                      type="button"
                      onClick={() => setWizardPrefill({ date: selectedDate })}
                      className="font-semibold text-primary-600 underline underline-offset-2 transition-colors duration-fast hover:text-primary-800"
                    >
                      {he.schedule.clickHere}
                    </button>
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* לוח שנה צדדי - בתצוגה היומית במסכים רחבים */}
        {view === "day" && (
          <aside className="sticky top-[104px] hidden w-[320px] shrink-0 rounded-lg border border-line bg-surface p-4 shadow-sm xl:block">
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="mx-auto w-32" />
                <Skeleton variant="block" className="h-64" />
                <Skeleton className="w-3/4" />
                <Skeleton className="w-3/4" />
              </div>
            ) : (
              <>
                <MonthCalendar
                  today={MOCK_TODAY}
                  selectedDate={selectedDate}
                  markedDates={markedDates}
                  loadBadges={loadBadges}
                  onSelect={setSelectedDate}
                />
                <div className="mt-4 border-t border-line pt-3">
                  <BlockLegend />
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* אשף יצירת ניתוח - פופאפ מעל היומן */}
      <SurgeryWizardModal
        open={!!wizardPrefill}
        prefill={wizardPrefill ?? undefined}
        doctorId={doctorId}
        onClose={() => setWizardPrefill(null)}
        onCreated={(s) => openDay(s.date)}
      />

      {/* פרטי ניתוח / עריכה - פופאפ מעל היומן */}
      {detailsTarget && (
        <SurgeryDetailsModal
          key={detailsTarget.id}
          surgeryId={detailsTarget.id}
          startInEdit={detailsTarget.edit}
          onClose={() => setDetailsTarget(null)}
        />
      )}

      {/* מודל החלפה */}
      {swapTarget && <SwapModal surgery={swapTarget} onClose={() => setSwapTarget(null)} />}

      {/* מודל אישור מחיקה */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={he.schedule.deleteConfirmTitle}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              {he.common.cancel}
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              {he.schedule.actions.delete}
            </Button>
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
