import type { Department } from "../types";
import { m } from "./localize";

export const departments: Department[] = [
  { id: "dep-1", name: m("כירורגיה כללית", "General Surgery") },
  { id: "dep-2", name: m("אורתופדיה", "Orthopaedics") },
  { id: "dep-3", name: m("כירורגיה בריאטרית", "Bariatric Surgery") },
  { id: "dep-4", name: m("כירורגיית שד", "Breast Surgery") },
  { id: "dep-5", name: m("אורולוגיה", "Urology") },
  { id: "dep-6", name: m("כירורגיית כלי דם", "Vascular Surgery") },
];

export function departmentName(id: string): string {
  return departments.find((d) => d.id === id)?.name ?? "";
}
