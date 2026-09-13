import { X } from "lucide-react";
import { Select } from "../../components/primitives/Select";
import { Button } from "../../components/primitives/Button";
import { FileUpload } from "../../components/form/FileUpload";
import { SectionCard } from "../../components/data/SectionCard";
import { lookups } from "../../mock/lookups";
import { t } from "../../i18n";
import type { WizardErrors, WizardState } from "./wizardState";

const s3 = t.wizard.step3;

export interface Step3Props {
  state: WizardState;
  errors: WizardErrors;
  onChange: (patch: Partial<WizardState>) => void;
}

export function Step3Documents({ state, errors, onChange }: Step3Props) {
  function updateDoc(id: number, patch: Partial<WizardState["extraDocs"][number]>) {
    onChange({
      extraDocs: state.extraDocs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
  }

  const nextId = state.extraDocs.reduce((max, d) => Math.max(max, d.id), 0) + 1;

  return (
    <div className="flex flex-col gap-6">
      {/* אזור עליון - חובה */}
      <div data-error={errors.anamnesis ? "true" : undefined}>
        <SectionCard title={`${s3.anamnesisLabel} *`}>
          <FileUpload
            value={state.anamnesisFile}
            onChange={(f) => onChange({ anamnesisFile: f })}
            error={errors.anamnesis}
          />
        </SectionCard>
      </div>

      {/* מסמכים נוספים */}
      <SectionCard title={s3.moreDocuments} bodyClassName="flex flex-col gap-3 px-5 py-4">

        {state.extraDocs.map((docRow) => (
          <div
            key={docRow.id}
            className="relative grid gap-3 rounded-md border border-line bg-canvas p-4 sm:grid-cols-[240px,1fr]"
          >
            <button
              type="button"
              aria-label={t.ui.a11y.removeDocumentRow}
              onClick={() =>
                onChange({ extraDocs: state.extraDocs.filter((d) => d.id !== docRow.id) })
              }
              className="absolute end-2 top-2 z-10 rounded-md p-1.5 text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
            <Select
              label={s3.docType}
              options={lookups.documentTypes.map((d) => ({ value: d.key, label: d.label }))}
              value={docRow.typeKey}
              onChange={(v) => updateDoc(docRow.id, { typeKey: v as string | null })}
              searchable
            />
            <div className="sm:pt-6">
              <FileUpload
                value={docRow.file}
                onChange={(f) => updateDoc(docRow.id, { file: f })}
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
                extraDocs: [...state.extraDocs, { id: nextId, typeKey: null, file: null }],
              })
            }
          >
            {s3.addDocument}
          </Button>
        </div>

        <p className="text-caption text-muted">{s3.limitsNote}</p>
      </SectionCard>
    </div>
  );
}
