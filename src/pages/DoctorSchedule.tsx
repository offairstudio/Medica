import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { addDays } from "date-fns";
import {
  Info,
  Plus,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  ClipboardList,
  Phone,
  Mail,
} from "lucide-react";
import { DoctorShell } from "../components/layout/AppShell";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { Button } from "../components/primitives/Button";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { Modal } from "../components/overlay/Modal";
import { useToast } from "../components/overlay/Toast";
import { MonthCalendar } from "../components/calendar/MonthCalendar";
import { BlockLegend } from "../components/calendar/BlockLegend";
import { SurgeryRow } from "../features/doctor-schedule/SurgeryRow";
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
import { Avatar, AllDoctorsAvatar } from "../components/data/Avatar";
import { doctorById, MOCK_TODAY } from "../mock/doctors";
import { useData } from "../state/data";
import { useFakeLoading } from "../lib/useFakeLoading";
import {
  formatFullDate,
  formatTotalHours,
  timeToMinutes,
  toDate,
  toISO,
} from "../lib/date";
import { cn } from "../lib/cn";
import { he } from "../i18n/he";
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

  const [selectedDate, setSelectedDate] = useState<ISODate>(MOCK_TODAY);
  /** לוח החודש נפתח ונסגר מהכפתור שבשורת הבקרות */
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [swapTarget, setSwapTarget] = useState<Surgery | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Surgery | null>(null);
  const [wizardPrefill, setWizardPrefill] = useState<WizardPrefill | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<{ id: string; edit: boolean } | null>(null);

  const loading = useFakeLoading(500, `${doctorId}-${selectedDate}`);

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


  const { markedDates, dayLoadMinutes } = useMemo(() => {
    const marked: Record<ISODate, Hospital> = {};
    /** דקות ניתוח מצטברות לכל יום - הלוח מעצב מהן את תג העומס */
    const perDay: Record<ISODate, number> = {};
    for (const s of surgeries) {
      if ((!isAll && s.doctorId !== doctorId) || s.status === "cancelled") continue;
      marked[s.date] = s.hospital;
      perDay[s.date] = (perDay[s.date] ?? 0) + s.durationMinutes;
    }
    return { markedDates: marked, dayLoadMinutes: perDay };
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

  /** כפתורי הניווט היומי - אותה צורה לשלושתם */
  const navButtonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-body transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700";

  function navPrev() {
    setSelectedDate(toISO(addDays(toDate(selectedDate), -1)));
  }

  function navNext() {
    setSelectedDate(toISO(addDays(toDate(selectedDate), 1)));
  }

  function openDay(date: ISODate) {
    setSelectedDate(date);
  }

  return (
    <DoctorShell
      doctorId={doctorId}
      header={
        <ScreenHeader
          compact
          divider={false}
          title={isAll ? he.schedule.combinedSchedule : doctor.displayName}
          media={
            isAll ? (
              <AllDoctorsAvatar size="lg" />
            ) : (
              <Avatar name={doctor.displayName} src={doctor.avatarUrl} size="lg" />
            )
          }
          titleDivider
          meta={
            isAll ? undefined : (
              <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted">
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="tnum">{doctor.licenseNumber}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span dir="ltr" className="tnum">{doctor.mobile}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span dir="ltr">{doctor.email}</span>
                </span>
              </div>
            )
          }
          titleEnd={
            <button
              type="button"
              onClick={() => toast("info", "שינוי הל\"ז אינו חלק מהפרוטוטייפ")}
              className="inline-flex h-10 shrink-0 items-center rounded-md border border-line px-3 font-semibold text-body transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
            >
              {he.schedule.changeSchedule}
            </button>
          }
          start={
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1">
              <span className="text-h3 font-semibold text-ink">{formatFullDate(selectedDate)}</span>
              {daySurgeries.length > 0 && (
                <span className="text-h3 font-semibold text-muted">
                  {he.schedule.daySummary(daySurgeries.length, formatTotalHours(totalMinutes))}
                </span>
              )}
            </div>
          }
          end={
            <div className="flex items-center gap-2 py-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="יום קודם"
                  onClick={navPrev}
                  className={navButtonClass}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(MOCK_TODAY)}
                  disabled={selectedDate === MOCK_TODAY}
                  className={cn(navButtonClass, "w-auto px-3 font-semibold disabled:cursor-default disabled:opacity-45 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-body")}
                >
                  {he.schedule.backToToday}
                </button>
                <button
                  type="button"
                  aria-label="יום הבא"
                  onClick={navNext}
                  className={navButtonClass}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {/* הצגה והסתרה של לוח החודש שלצד הרשימה */}
              <button
                type="button"
                onClick={() => setCalendarOpen((open) => !open)}
                aria-pressed={calendarOpen}
                aria-label={he.schedule.calendar}
                title={he.schedule.calendar}
                className={cn(
                  // הלוח עצמו מוצג רק במסך רחב, ולכן גם הכפתור שמפעיל אותו
                  "hidden h-10 w-10 items-center justify-center rounded-md transition-colors duration-fast xl:inline-flex",
                  calendarOpen
                    ? "bg-primary-100 text-primary-800"
                    : "border border-line text-body hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700",
                )}
              >
                <CalendarDays className="h-5 w-5" aria-hidden />
              </button>
            </div>
          }
        />
      }
    >
      <div className="flex items-start gap-4">
        <section className="min-w-0 flex-1">
          {/* ===== תצוגה יומית ===== */}
          <>
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
                <div className="flex flex-col gap-3">
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
                        className="group w-full rounded-lg border border-dashed border-line p-4 text-start transition-colors duration-fast hover:border-primary-300 hover:bg-primary-50"
                      >
                        <span className="flex items-start gap-4">
                          {/* פס נייטרלי - אותו מקום שבו יושב פס בית החולים ברשומה תפוסה */}
                          <span aria-hidden className="w-1 shrink-0 self-stretch rounded-full bg-line" />

                          <span className="flex h-14 w-16 shrink-0 flex-col items-center justify-center">
                            <span dir="ltr" className="text-h3 font-bold leading-none text-body tnum">
                              {item.slot.start}
                            </span>
                            <span dir="ltr" className="mt-0.5 text-[12px] font-semibold text-muted tnum">
                              {item.slot.end}
                            </span>
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-h3 text-muted">{he.schedule.free}</span>
                            <span className="mt-0.5 block truncate text-muted">
                              {freeDurationLabel(item.slot)}
                              {isAll && item.slot.doctorIds.length > 0 && (
                                <>
                                  {" · "}
                                  {item.slot.doctorIds.length === 1
                                    ? doctorById(item.slot.doctorIds[0])?.displayName
                                    : he.schedule.freeDoctorsCount(item.slot.doctorIds.length)}
                                </>
                              )}
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
                              <HospitalChip hospital={item.slot.hospital} compact />
                              <span className="ms-auto flex shrink-0 items-center gap-1 font-semibold text-primary-600 transition-colors duration-fast group-hover:text-primary-800">
                                <Plus className="h-4 w-4" aria-hidden />
                                {he.schedule.createSurgery}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}

              {/* באנר ניתוח משולב - רלוונטי ליומן האישי בלבד */}
              {!isAll && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
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
        </section>

        {/* לוח שנה צדדי - בורר תאריך במסכים רחבים */}
        <aside
          hidden={!calendarOpen}
          className={cn(
            "sticky top-0 max-h-[calc(100dvh-7rem)] w-[320px] shrink-0 self-start overflow-y-auto rounded-lg bg-surface p-4",
            calendarOpen ? "hidden xl:block" : "hidden",
          )}
        >
          {/* הלוח אינו נטען מחדש במעבר יום - רק הבחירה בתוכו מתעדכנת */}
          <MonthCalendar
            today={MOCK_TODAY}
            selectedDate={selectedDate}
            markedDates={markedDates}
            loadMinutes={dayLoadMinutes}
            onSelect={setSelectedDate}
          />
          <div className="mt-5">
            <BlockLegend />
          </div>
        </aside>
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
