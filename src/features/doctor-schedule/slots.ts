import type { Hospital, ISODate, Surgery, Time } from "../../types";
import { blocks, blocksForDate } from "../../mock/blocks";
import { addMinutes, timeToMinutes } from "../../lib/date";

export interface FreeSlot {
  start: Time;
  end: Time;
  hospital: Hospital;
  /** בעל הבלוק - רלוונטי ליומן הכולל */
  doctorId?: string;
}

const MIN_SLOT_MINUTES = 30;

/**
 * חלונות פנויים ביום: הבלוקים של המנתח פחות הניתוחים המשובצים.
 */
export function computeFreeSlots(
  date: ISODate,
  doctorId: string,
  surgeries: Surgery[],
): FreeSlot[] {
  const dayBlocks = blocksForDate(date, doctorId).filter((b) => b.state !== "full");
  const daySurgeries = surgeries
    .filter((s) => s.doctorId === doctorId && s.date === date && s.status === "scheduled")
    .map((s) => ({
      start: timeToMinutes(s.startTime),
      end: timeToMinutes(s.startTime) + s.durationMinutes,
    }))
    .sort((a, b) => a.start - b.start);

  const free: FreeSlot[] = [];
  for (const block of dayBlocks) {
    let cursor = timeToMinutes(block.startTime);
    const blockEnd = timeToMinutes(block.endTime);
    for (const s of daySurgeries) {
      if (s.end <= cursor || s.start >= blockEnd) continue;
      if (s.start - cursor >= MIN_SLOT_MINUTES) {
        free.push({
          start: minutesToTime(cursor),
          end: minutesToTime(s.start),
          hospital: block.hospital,
        });
      }
      cursor = Math.max(cursor, s.end);
    }
    if (blockEnd - cursor >= MIN_SLOT_MINUTES) {
      free.push({
        start: minutesToTime(cursor),
        end: minutesToTime(blockEnd),
        hospital: block.hospital,
      });
    }
  }
  return free;
}

/**
 * חלונות פנויים של כל המנתחים ביום נתון - ליומן הכולל.
 * כל חלון מתויג במנתח שהבלוק שייך לו.
 */
export function computeFreeSlotsForAll(date: ISODate, surgeries: Surgery[]): FreeSlot[] {
  const doctorIds = [...new Set(blocks.filter((b) => b.date === date).map((b) => b.doctorId))];
  return doctorIds.flatMap((id) =>
    computeFreeSlots(date, id, surgeries).map((s) => ({ ...s, doctorId: id })),
  );
}

/** חלונות זמן לבחירה במודל ההחלפה - רשת של שעות התחלה אפשריות */
export function slotStartOptions(slot: FreeSlot, durationMinutes: number, step = 30): Time[] {
  const out: Time[] = [];
  const end = timeToMinutes(slot.end);
  for (
    let m = timeToMinutes(slot.start);
    m + durationMinutes <= end;
    m += step
  ) {
    out.push(minutesToTime(m));
  }
  // גם אם החלון קצר מהצעד, שעת ההתחלה עצמה תקפה
  if (out.length === 0 && end - timeToMinutes(slot.start) >= durationMinutes) {
    out.push(slot.start);
  }
  return out;
}

function minutesToTime(m: number): Time {
  return addMinutes("00:00", m);
}
