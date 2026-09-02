import { X } from "lucide-react";
import { Input } from "../../components/primitives/Input";
import { Select } from "../../components/primitives/Select";
import { RadioGroup } from "../../components/primitives/Radio";
import { Toggle } from "../../components/primitives/Toggle";
import { Checkbox } from "../../components/primitives/Checkbox";
import { Textarea } from "../../components/primitives/Textarea";
import { Button } from "../../components/primitives/Button";
import { DatePicker } from "../../components/form/DatePicker";
import { TimePicker } from "../../components/form/TimePicker";
import { lookups } from "../../mock/lookups";
import { doctors } from "../../mock/doctors";
import { he } from "../../i18n/he";
import { typicalDurations, type WizardErrors, type WizardState } from "./wizardState";

const t = he.wizard.step2;

export interface Step2Props {
  state: WizardState;
  errors: WizardErrors;
  onChange: (patch: Partial<WizardState>) => void;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mt-2 border-b border-line pb-2">
      <h3 className="text-h3 text-ink">{children}</h3>
    </div>
  );
}

export function Step2Surgery({ state, errors, onChange }: Step2Props) {
  function updateProcedure(index: number, patch: Partial<WizardState["procedures"][number]>) {
    const procedures = state.procedures.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange({ procedures });
  }

  function pickProcedureName(index: number, name: string) {
    updateProcedure(index, { name });
    // הצעת משך אוטומטית לפי הפרוצדורה, רק אם המשך טרם הוזן
    if (index === 0 && !state.duration && typicalDurations[name]) {
      onChange({
        procedures: state.procedures.map((p, i) => (i === index ? { ...p, name } : p)),
        duration: String(typicalDurations[name]),
      });
    }
  }

  const firstDuration = state.procedures[0]?.name
    ? typicalDurations[state.procedures[0].name]
    : undefined;

  return (
    <div className="flex flex-col gap-5">
      {/* אזור א - הניתוח */}
      <SectionTitle>{t.sectionSurgery}</SectionTitle>

      {state.procedures.map((proc, i) => (
        <div key={i} className="relative rounded-md border border-line bg-surface-2/60 p-4">
          {i > 0 && (
            <button
              type="button"
              aria-label={`הסרת ניתוח ${i + 1}`}
              onClick={() =>
                onChange({ procedures: state.procedures.filter((_, j) => j !== i) })
              }
              className="absolute end-2 top-2 rounded-md p-1.5 text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2" data-error={errors[`procedure-${i}`] ? "true" : undefined}>
              <Select
                label={t.surgeryName}
                options={lookups.surgeryNames.map((n) => ({ value: n, label: n }))}
                value={proc.name || null}
                onChange={(v) => pickProcedureName(i, (v as string) ?? "")}
                searchable
                error={errors[`procedure-${i}`]}
              />
            </div>
            <Select
              label={t.organ}
              options={lookups.organs.map((o) => ({ value: o, label: o }))}
              value={proc.organ}
              onChange={(v) => updateProcedure(i, { organ: v as string | null })}
              clearable
            />
            <Select
              label={t.side}
              options={[
                { value: "right", label: t.sideRight },
                { value: "left", label: t.sideLeft },
                { value: "none", label: t.sideNone },
              ]}
              value={proc.side}
              onChange={(v) => updateProcedure(i, { side: v as string | null })}
            />
          </div>
        </div>
      ))}

      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            onChange({
              procedures: [...state.procedures, { name: "", organ: null, side: null }],
            })
          }
        >
          {t.addProcedure}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div data-error={errors.date ? "true" : undefined}>
          <DatePicker
            label={t.date}
            value={state.date}
            onChange={(d) => onChange({ date: d })}
            error={errors.date}
          />
        </div>
        <div data-error={errors.time ? "true" : undefined}>
          <TimePicker
            label={t.time}
            value={state.time}
            onChange={(v) => onChange({ time: v })}
            error={errors.time}
          />
        </div>
      </div>

      {/* אזור ב - ביצוע */}
      <SectionTitle>{t.sectionExecution}</SectionTitle>

      <div className="grid gap-4 sm:grid-cols-2">
        <div data-error={errors.duration ? "true" : undefined}>
          <Input
            label={t.duration}
            type="number"
            inputMode="numeric"
            min={1}
            dir="ltr"
            value={state.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
            error={errors.duration}
            hint={firstDuration ? `ממוצע לפרוצדורה זו: ${firstDuration} דק'` : undefined}
          />
        </div>
        <Input
          label={t.backupDoctor}
          value={state.backupDoctorName}
          list="backup-doctors"
          autoComplete="off"
          onChange={(e) => onChange({ backupDoctorName: e.target.value })}
        />
        <datalist id="backup-doctors">
          {doctors.map((d) => (
            <option key={d.id} value={d.displayName} />
          ))}
        </datalist>
      </div>

      <Toggle
        checked={state.combined}
        onChange={(v) => onChange({ combined: v })}
        label={t.combined}
      />

      {/* אזור ג - הרדמה, ציוד ודרישות */}
      <SectionTitle>{t.sectionAnesthesia}</SectionTitle>

      <div data-error={errors.anesthesia ? "true" : undefined}>
        <RadioGroup
          label={t.anesthesia}
          name="anesthesia"
          options={lookups.anesthesiaTypes.map((a) => ({ value: a.key, label: a.label }))}
          value={state.anesthesia}
          onChange={(v) => onChange({ anesthesia: v })}
          error={errors.anesthesia}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t.capitalEquipment}
          options={lookups.capitalEquipment.map((c) => ({ value: c, label: c }))}
          value={state.capitalEquipment}
          onChange={(v) => onChange({ capitalEquipment: v as string | null })}
          clearable
        />
        <RadioGroup
          label={t.treatmentType}
          name="treatmentType"
          options={lookups.treatmentTypes.map((x) => ({ value: x, label: x }))}
          value={state.treatmentType}
          onChange={(v) => onChange({ treatmentType: v })}
        />
      </div>

      <Textarea
        label={t.additionalEquipment}
        rows={2}
        value={state.additionalEquipment}
        onChange={(e) => onChange({ additionalEquipment: e.target.value })}
      />

      <fieldset>
        <legend className="mb-1 text-caption font-semibold text-body">{t.requirements}</legend>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {lookups.requirements.map((r) => (
            <Checkbox
              key={r.key}
              label={r.label}
              checked={state.requirements.includes(r.key)}
              onChange={(e) =>
                onChange({
                  requirements: e.target.checked
                    ? [...state.requirements, r.key]
                    : state.requirements.filter((k) => k !== r.key),
                })
              }
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
