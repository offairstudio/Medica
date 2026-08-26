import type { Block } from "../types";

/**
 * בלוקים לשבועיים קדימה מ"היום" של המוקאפ (26/07),
 * בשלושת המצבים: מלא / חלקי / פנוי, בשני בתי החולים.
 * הבלוק של 29/07 ברפאל (16:00-23:00) מייצר את החלון הפנוי 20:20-23:00.
 */
export const blocks: Block[] = [
  { id: "blk-1", hospital: "refael", date: "2026-07-26", startTime: "08:00", endTime: "14:00", doctorId: "doc-1", state: "partial" },
  { id: "blk-15", hospital: "elisha", date: "2026-07-26", startTime: "09:00", endTime: "13:00", doctorId: "doc-7", state: "open" },
  { id: "blk-2", hospital: "elisha", date: "2026-07-26", startTime: "15:00", endTime: "18:00", doctorId: "doc-1", state: "full" },
  { id: "blk-3", hospital: "refael", date: "2026-07-27", startTime: "13:00", endTime: "17:00", doctorId: "doc-1", state: "partial" },
  { id: "blk-4", hospital: "elisha", date: "2026-07-28", startTime: "08:00", endTime: "13:00", doctorId: "doc-1", state: "open" },
  { id: "blk-5", hospital: "refael", date: "2026-07-29", startTime: "16:00", endTime: "23:00", doctorId: "doc-1", state: "partial" },
  { id: "blk-6", hospital: "elisha", date: "2026-07-30", startTime: "08:00", endTime: "14:00", doctorId: "doc-1", state: "open" },
  { id: "blk-7", hospital: "refael", date: "2026-07-31", startTime: "08:00", endTime: "12:00", doctorId: "doc-1", state: "open" },
  { id: "blk-8", hospital: "elisha", date: "2026-08-02", startTime: "08:00", endTime: "12:00", doctorId: "doc-1", state: "partial" },
  { id: "blk-9", hospital: "refael", date: "2026-08-03", startTime: "14:00", endTime: "20:00", doctorId: "doc-1", state: "open" },
  { id: "blk-10", hospital: "refael", date: "2026-08-04", startTime: "08:00", endTime: "14:00", doctorId: "doc-1", state: "full" },
  { id: "blk-11", hospital: "elisha", date: "2026-08-05", startTime: "10:00", endTime: "16:00", doctorId: "doc-1", state: "open" },
  { id: "blk-12", hospital: "refael", date: "2026-08-06", startTime: "08:00", endTime: "14:00", doctorId: "doc-1", state: "partial" },
  { id: "blk-13", hospital: "elisha", date: "2026-08-07", startTime: "08:00", endTime: "12:00", doctorId: "doc-1", state: "open" },
  { id: "blk-14", hospital: "refael", date: "2026-08-09", startTime: "08:00", endTime: "14:00", doctorId: "doc-1", state: "open" },
];

/** בלוקים שנוצרים דטרמיניסטית לחלק מהמנתחים הנוספים - זמינות ברחבי היומן */
const GEN_BLOCK_DATES = [
  "2026-07-27", "2026-07-29", "2026-07-31", "2026-08-03", "2026-08-05", "2026-08-07",
];
const STATES: Block["state"][] = ["open", "partial", "full"];

const generatedBlocks: Block[] = Array.from({ length: 12 }, (_, i) => {
  const docNum = 9 + i;
  return GEN_BLOCK_DATES.filter((_, j) => (i + j) % 3 === 0).map((date, j) => ({
    id: `blk-gen-${docNum}-${j}`,
    hospital: (i + j) % 2 === 0 ? ("refael" as const) : ("elisha" as const),
    date,
    startTime: (i + j) % 2 === 0 ? "08:00" : "14:00",
    endTime: (i + j) % 2 === 0 ? "14:00" : "20:00",
    doctorId: `doc-${docNum}`,
    state: STATES[(i + j) % STATES.length],
  }));
}).flat();

blocks.push(...generatedBlocks);

export function blocksForDate(date: string, doctorId: string): Block[] {
  return blocks.filter((b) => b.date === date && b.doctorId === doctorId);
}
