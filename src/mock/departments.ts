import type { Department } from "../types";

export const departments: Department[] = [
  { id: "dep-1", name: "כירורגיה כללית" },
  { id: "dep-2", name: "אורתופדיה" },
  { id: "dep-3", name: "כירורגיה בריאטרית" },
  { id: "dep-4", name: "כירורגיית שד" },
  { id: "dep-5", name: "אורולוגיה" },
  { id: "dep-6", name: "כירורגיית כלי דם" },
];

export function departmentName(id: string): string {
  return departments.find((d) => d.id === id)?.name ?? "";
}
