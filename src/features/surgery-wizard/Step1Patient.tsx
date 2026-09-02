import { useMemo, useState } from "react";
import { Input } from "../../components/primitives/Input";
import { Select } from "../../components/primitives/Select";
import { RadioGroup } from "../../components/primitives/Radio";
import { Toggle } from "../../components/primitives/Toggle";
import { DatePicker } from "../../components/form/DatePicker";
import { Chip } from "../../components/data/Chip";
import { lookups } from "../../mock/lookups";
import { searchPatients } from "../../mock/patients";
import { he } from "../../i18n/he";
import type { Patient } from "../../types";
import type { WizardErrors, WizardState } from "./wizardState";

const t = he.wizard.step1;

export interface Step1Props {
  state: WizardState;
  errors: WizardErrors;
  onChange: (patch: Partial<WizardState>) => void;
}

export function Step1Patient({ state, errors, onChange }: Step1Props) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(
    () => (showSuggestions ? searchPatients(state.firstName) : []),
    [showSuggestions, state.firstName],
  );

  function pickPatient(p: Patient) {
    onChange({
      existingPatientId: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      idType: p.idType,
      idNumber: p.idNumber,
      phone: p.phone,
      birthDate: p.birthDate,
      gender: p.gender,
      hmo: p.hmo,
      payer: p.payer,
    });
    setShowSuggestions(false);
  }

  function clearExisting() {
    onChange({
      existingPatientId: null,
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      birthDate: null,
      gender: null,
      hmo: null,
      payer: null,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {state.existingPatientId && (
        <div>
          <Chip color="primary" onRemove={clearExisting}>
            {he.wizard.existingPatient}
          </Chip>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative" data-error={errors.firstName ? "true" : undefined}>
          <Input
            label={t.firstName}
            value={state.firstName}
            autoComplete="off"
            onChange={(e) => {
              onChange({ firstName: e.target.value, existingPatientId: null });
              setShowSuggestions(e.target.value.trim().length >= 2);
            }}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
            error={errors.firstName}
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full z-30 mt-1 w-full overflow-hidden rounded-md border border-line bg-surface py-1 shadow-md">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pickPatient(p);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-start text-body transition-colors duration-fast hover:bg-primary-50"
                  >
                    <span>
                      {p.firstName} {p.lastName}
                    </span>
                    <span className="text-caption text-muted tnum">{p.idNumber}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div data-error={errors.lastName ? "true" : undefined}>
          <Input
            label={t.lastName}
            value={state.lastName}
            autoComplete="off"
            onChange={(e) => onChange({ lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          label={t.idType}
          name="idType"
          options={[
            { value: "id", label: t.idTypeId },
            { value: "passport", label: t.idTypePassport },
          ]}
          value={state.idType}
          onChange={(v) => onChange({ idType: v as "id" | "passport" })}
        />
        <div data-error={errors.idNumber ? "true" : undefined}>
          <Input
            label={t.idNumber}
            inputMode={state.idType === "id" ? "numeric" : "text"}
            dir="ltr"
            maxLength={9}
            value={state.idNumber}
            onChange={(e) =>
              onChange({
                idNumber:
                  state.idType === "id"
                    ? e.target.value.replace(/\D/g, "").slice(0, 9)
                    : e.target.value,
              })
            }
            error={errors.idNumber}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div data-error={errors.phone ? "true" : undefined}>
          <Input
            label={t.phone}
            type="tel"
            inputMode="tel"
            dir="ltr"
            value={state.phone}
            onChange={(e) => onChange({ phone: e.target.value.replace(/[^\d-]/g, "") })}
            error={errors.phone}
          />
        </div>
        <DatePicker
          label={t.birthDate}
          value={state.birthDate}
          onChange={(d) => onChange({ birthDate: d })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          label={t.gender}
          name="gender"
          options={[
            { value: "male", label: t.male },
            { value: "female", label: t.female },
          ]}
          value={state.gender}
          onChange={(v) => onChange({ gender: v })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={t.hmo}
          options={lookups.hmos.map((h) => ({ value: h, label: h }))}
          value={state.hmo}
          onChange={(v) => onChange({ hmo: v as string | null })}
        />
        <Select
          label={t.payer}
          options={lookups.payers.map((p) => ({ value: p, label: p }))}
          value={state.payer}
          onChange={(v) => onChange({ payer: v as string | null })}
        />
      </div>

      <div className="rounded-md border border-line bg-surface-2 p-4">
        <Toggle
          checked={state.feeEnabled}
          onChange={(v) => onChange({ feeEnabled: v })}
          label={t.surgeonFee}
        />
        {state.feeEnabled && (
          <div className="mt-2 max-w-56" data-error={errors.feeAmount ? "true" : undefined}>
            <Input
              label={t.feeAmount}
              inputMode="numeric"
              dir="ltr"
              value={state.feeAmount}
              onChange={(e) => onChange({ feeAmount: e.target.value.replace(/\D/g, "") })}
              error={errors.feeAmount}
              hint={t.surgeonFeeNote}
            />
          </div>
        )}
      </div>
    </div>
  );
}
