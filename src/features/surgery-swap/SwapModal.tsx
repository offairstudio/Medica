import { useMemo, useState } from "react";
import { Hash, User, CalendarDays, Clock, CreditCard } from "lucide-react";
import { Sheet } from "../../components/overlay/Sheet";
import { Button } from "../../components/primitives/Button";
import { MonthCalendar } from "../../components/calendar/MonthCalendar";
import { BlockLegend } from "../../components/calendar/BlockLegend";
import { cn } from "../../lib/cn";
import { formatNumericDate } from "../../lib/date";
import { MOCK_TODAY } from "../../mock/doctors";
import { blocks } from "../../mock/blocks";
import { useData } from "../../state/data";
import { useToast } from "../../components/overlay/Toast";
import { computeFreeSlots, slotStartOptions } from "../doctor-schedule/slots";
import { he } from "../../i18n/he";
import { HOSPITALS } from "../../mock/hospitals";
import type { Hospital, ISODate, Surgery, Time } from "../../types";

export interface SwapModalProps {
  surgery: Surgery | null;
  onClose: () => void;
}

export function SwapModal({ surgery, onClose }: SwapModalProps) {
  const { surgeries, swapSurgery, setHighlightId } = useData();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<ISODate | null>(null);
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);

  const markedDates = useMemo(() => {
    const map: Record<ISODate, Hospital> = {};
    if (!surgery) return map;
    for (const b of blocks) {
      if (b.doctorId === surgery.doctorId && b.state !== "full" && b.date !== surgery.date) {
        map[b.date] = b.hospital;
      }
    }
    return map;
  }, [surgery]);

  const timeOptions = useMemo(() => {
    if (!surgery || !selectedDate) return [];
    const free = computeFreeSlots(selectedDate, surgery.doctorId, surgeries);
    return free.flatMap((slot) =>
      slotStartOptions(slot, surgery.durationMinutes).map((start) => ({
        start,
        hospital: slot.hospital,
      })),
    );
  }, [surgery, selectedDate, surgeries]);

  if (!surgery) return null;

  function confirm() {
    if (!surgery || !selectedDate || !selectedTime) return;
    swapSurgery(surgery.id, selectedDate, selectedTime);
    setHighlightId(surgery.id);
    window.setTimeout(() => setHighlightId(null), 1500);
    toast("success", he.swap.success(formatNumericDate(selectedDate), selectedTime));
    onClose();
  }

  const summaryItems = [
    { icon: Hash, label: `${he.swap.codeLabel} ${surgery.code}` },
    { icon: User, label: `${surgery.patient.firstName} ${surgery.patient.lastName}` },
    { icon: CalendarDays, label: formatNumericDate(surgery.date) },
    { icon: Clock, label: surgery.startTime },
    { icon: CreditCard, label: `${he.swap.idLabel} ${surgery.patient.idNumber}` },
  ];

  return (
    <Sheet open onClose={onClose} title={he.swap.title} size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>{he.common.cancel}</Button>
          <Button disabled={!selectedDate || !selectedTime} onClick={confirm}>
            {he.swap.submit}
          </Button>
        </>
      }
    >
      {/* שורת סיכום הניתוח */}
      <div className="mb-5 flex flex-wrap items-center rounded-md bg-primary-50 px-4 py-3">
        {summaryItems.map((item, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-3 h-4 w-px bg-primary-200" />}
            <span className="flex items-center gap-1.5 text-primary-800">
              <item.icon className="h-4 w-4 text-primary-400" aria-hidden />
              <span className="tnum">{item.label}</span>
            </span>
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h3 className="mb-2 text-h3 text-ink">{he.swap.pickDay}</h3>
          <MonthCalendar
            today={MOCK_TODAY}
            selectedDate={selectedDate}
            markedDates={markedDates}
            selectableOnly
            onSelect={(d) => {
              setSelectedDate(d);
              setSelectedTime(null);
            }}
          />
        </section>

        <section>
          <h3 className="mb-2 text-h3 text-ink">{he.swap.pickTime}</h3>
          {!selectedDate ? (
            <p className="rounded-md bg-canvas px-4 py-6 text-center text-caption text-muted">
              יש לבחור קודם יום החלפה
            </p>
          ) : timeOptions.length === 0 ? (
            <p className="rounded-md bg-canvas px-4 py-6 text-center text-caption text-muted">
              {he.swap.noSlots}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.start}
                  type="button"
                  onClick={() => setSelectedTime(opt.start)}
                  aria-pressed={selectedTime === opt.start}
                  className={cn(
                    "flex h-11 items-center justify-center gap-1.5 rounded-md border tnum transition-colors duration-fast",
                    selectedTime === opt.start
                      ? "border-primary-700 bg-primary-700 font-semibold text-white"
                      : "border-line bg-surface text-body hover:border-primary-400 hover:bg-primary-50",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 rounded-full",
                      HOSPITALS[opt.hospital].dotClass,
                      selectedTime === opt.start && "bg-white",
                    )}
                  />
                  {opt.start}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <BlockLegend />
      </div>
    </Sheet>
  );
}
