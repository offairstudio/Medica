import { useMemo, useState } from "react";
import { Input } from "../../components/primitives/Input";
import { Select } from "../../components/primitives/Select";
import { RadioGroup } from "../../components/primitives/Radio";
import { Toggle } from "../../components/primitives/Toggle";
import { DatePicker } from "../../components/form/DatePicker";
import { Chip } from "../../components/data/Chip";
import { SectionCard } from "../../components/data/SectionCard";
import { lookups } from "../../mock/lookups";
import { searchPatients } from "../../mock/patients";
import { t } from "../../i18n";
import type { Patient } from "../../types";
import type { WizardErrors, WizardState } from "./wizardState";

const s1 = t.wizard.step1;

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
            {t.wizard.existingPatient}
          </Chip>
        </div>
      )}

      <SectionCard title={s1.sectionDetails} bodyClassName="flex flex-col gap-4 px-5 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative" data-error={errors.firstName ? "true" : undefined}>
          <Input
            label={s1.firstName}
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
            label={s1.lastName}
            value={state.lastName}
            autoComplete="off"
            onChange={(e) => onChange({ lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          label={s1.idType}
          name="idType"
          options={[
            { value: "id", label: s1.idTypeId },
            { value: "passport", label: s1.idTypePassport },
          ]}
          value={state.idType}
          onChange={(v) => onChange({ idType: v as "id" | "passport" })}
        />
        <div data-error={errors.idNumber ? "true" : undefined}>
          <Input
            label={s1.idNumber}
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
            label={s1.phone}
            type="tel"
            inputMode="tel"
            dir="ltr"
            value={state.phone}
            onChange={(e) => onChange({ phone: e.target.value.replace(/[^\d-]/g, "") })}
            error={errors.phone}
          />
        </div>
        <DatePicker
          label={s1.birthDate}
          value={state.birthDate}
          onChange={(d) => onChange({ birthDate: d })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RadioGroup
          label={s1.gender}
          name="gender"
          options={[
            { value: "male", label: s1.male },
            { value: "female", label: s1.female },
          ]}
          value={state.gender}
          onChange={(v) => onChange({ gender: v })}
        />
      </div>

      </SectionCard>

      <SectionCard title={s1.sectionBilling} bodyClassName="flex flex-col gap-4 px-5 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={s1.hmo}
          options={lookups.hmos.map((h) => ({ value: h, label: h }))}
          value={state.hmo}
          onChange={(v) => onChange({ hmo: v as string | null })}
        />
        <Select
          label={s1.payer}
          options={lookups.payers.map((p) => ({ value: p, label: p }))}
          value={state.payer}
          onChange={(v) => onChange({ payer: v as string | null })}
        />
      </div>

      <div className="rounded-md border border-line bg-surface-2 p-4">
        <Toggle
          checked={state.feeEnabled}
          onChange={(v) => onChange({ feeEnabled: v })}
          label={s1.surgeonFee}
        />
        {state.feeEnabled && (
          <div className="mt-2 max-w-56" data-error={errors.feeAmount ? "true" : undefined}>
            <Input
              label={s1.feeAmount}
              inputMode="numeric"
              dir="ltr"
              value={state.feeAmount}
              onChange={(e) => onChange({ feeAmount: e.target.value.replace(/\D/g, "") })}
              error={errors.feeAmount}
              hint={s1.surgeonFeeNote}
            />
          </div>
        )}
      </div>
      </SectionCard>
    </div>
  );
}
