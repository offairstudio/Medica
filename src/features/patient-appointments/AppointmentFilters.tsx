import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { FilterChip } from "../../components/data/Chip";
import { Dropdown } from "../../components/overlay/Dropdown";
import { Checkbox } from "../../components/primitives/Checkbox";
import { he } from "../../i18n/he";
import type { Appointment } from "../../types";

export interface AppointmentFiltersState {
  departments: string[];
  doctors: string[];
}

export interface AppointmentFiltersProps {
  appointments: Appointment[];
  value: AppointmentFiltersState;
  onChange: (value: AppointmentFiltersState) => void;
}

export function emptyFilters(): AppointmentFiltersState {
  return { departments: [], doctors: [] };
}

export function applyFilters(
  appointments: Appointment[],
  f: AppointmentFiltersState,
): Appointment[] {
  return appointments.filter((a) => {
    if (f.departments.length > 0 && !f.departments.includes(a.departmentId)) return false;
    if (f.doctors.length > 0 && !f.doctors.includes(a.doctorId)) return false;
    return true;
  });
}

/**
 * סינון בצ'יפים (ולא ב-Select) - נוח בהרבה במובייל.
 * [ הכל ] [ מחלקה ▾ ] [ רופא ▾ ]
 */
export function AppointmentFilters({ appointments, value, onChange }: AppointmentFiltersProps) {
  const departments = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of appointments) map.set(a.departmentId, a.departmentName);
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [appointments]);

  const doctors = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of appointments) map.set(a.doctorId, a.doctorName);
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [appointments]);

  const hasFilter = value.departments.length > 0 || value.doctors.length > 0;

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="סינון תורים">
      <FilterChip active={!hasFilter} onClick={() => onChange(emptyFilters())}>
        {he.patient.filterAll}
      </FilterChip>

      <Dropdown
        align="start"
        portal
        menuClassName="min-w-56 p-2"
        trigger={
          <FilterChip active={value.departments.length > 0} ariaHasPopup ariaExpanded={undefined}
            onClear={
              value.departments.length > 0
                ? () => onChange({ ...value, departments: [] })
                : undefined
            }
          >
            {he.patient.filterDepartment}
            {value.departments.length > 0 && ` (${value.departments.length})`}
            <ChevronDown className="h-4 w-4" aria-hidden />
          </FilterChip>
        }
      >
        {departments.map((d) => (
          <Checkbox
            key={d.id}
            label={d.name}
            checked={value.departments.includes(d.id)}
            onChange={() => onChange({ ...value, departments: toggle(value.departments, d.id) })}
          />
        ))}
      </Dropdown>

      <Dropdown
        align="start"
        portal
        menuClassName="min-w-56 p-2"
        trigger={
          <FilterChip active={value.doctors.length > 0} ariaHasPopup ariaExpanded={undefined}
            onClear={
              value.doctors.length > 0 ? () => onChange({ ...value, doctors: [] }) : undefined
            }
          >
            {he.patient.filterDoctor}
            {value.doctors.length > 0 && ` (${value.doctors.length})`}
            <ChevronDown className="h-4 w-4" aria-hidden />
          </FilterChip>
        }
      >
        {doctors.map((d) => (
          <Checkbox
            key={d.id}
            label={d.name}
            checked={value.doctors.includes(d.id)}
            onChange={() => onChange({ ...value, doctors: toggle(value.doctors, d.id) })}
          />
        ))}
      </Dropdown>
    </div>
  );
}
