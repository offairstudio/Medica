import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Sheet } from "../../components/overlay/Sheet";
import { Stepper } from "../../components/form/Stepper";
import { Button } from "../../components/primitives/Button";
import { useToast } from "../../components/overlay/Toast";
import { Step1Patient } from "./Step1Patient";
import { Step2Surgery } from "./Step2Surgery";
import { Step3Documents } from "./Step3Documents";
import {
  emptyWizardState,
  validateStep1,
  validateStep2,
  validateStep3,
  type WizardErrors,
  type WizardState,
} from "./wizardState";
import { documentTypeLabel } from "../../mock/lookups";
import { useData } from "../../state/data";
import { he } from "../../i18n/he";
import type { ISODate, Surgery, Time } from "../../types";

export interface WizardPrefill {
  date?: ISODate;
  time?: Time;
  /** המנתח שאליו משויך הניתוח - למשל בעל הבלוק של החלון הפנוי שנלחץ */
  doctorId?: string;
}

export interface SurgeryWizardModalProps {
  open: boolean;
  prefill?: WizardPrefill;
  doctorId: string;
  onClose: () => void;
  /** נקרא אחרי יצירה מוצלחת - למשל כדי לקפוץ ליום הניתוח החדש */
  onCreated?: (surgery: Surgery) => void;
}

/** אשף יצירת ניתוח בן שלושה שלבים - כמודל שנפתח מעל היומן */
export function SurgeryWizardModal({ open, prefill, doctorId, onClose, onCreated }: SurgeryWizardModalProps) {
  if (!open) return null;
  return (
    <WizardInner prefill={prefill} doctorId={doctorId} onClose={onClose} onCreated={onCreated} />
  );
}

function WizardInner({
  prefill,
  doctorId,
  onClose,
  onCreated,
}: Omit<SurgeryWizardModalProps, "open">) {
  const { surgeries, addSurgery, setHighlightId } = useData();
  const { toast } = useToast();
  const bodyRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(() => emptyWizardState(prefill));
  const [errors, setErrors] = useState<WizardErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(() => [validateStep1, validateStep2, validateStep3], []);

  function onChange(patch: Partial<WizardState>) {
    setState((s) => ({ ...s, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      if ("procedures" in patch) {
        for (const k of Object.keys(next)) if (k.startsWith("procedure-")) delete next[k];
      }
      if ("anamnesisFile" in patch) delete next.anamnesis;
      return next;
    });
  }

  function tryAdvance() {
    const stepErrors = validators[step](state);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      toast("error", he.wizard.fixErrors);
      window.setTimeout(() => {
        bodyRef.current
          ?.querySelector('[data-error="true"]')
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    if (step < 2) {
      setStep(step + 1);
      bodyRef.current?.closest(".overflow-y-auto")?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      finish();
    }
  }

  function finish() {
    setSubmitting(true);
    const id = `sur-new-${Date.now() % 100000}`;
    const surgery: Surgery = {
      id,
      code: String(200000 + (surgeries.length + 1)),
      hospital: "refael",
      doctorId: prefill?.doctorId ?? (doctorId === "all" ? "doc-1" : doctorId),
      patient: {
        id: state.existingPatientId ?? `pat-new-${id}`,
        firstName: state.firstName.trim(),
        lastName: state.lastName.trim(),
        idType: state.idType,
        idNumber: state.idNumber,
        phone: state.phone,
        birthDate: state.birthDate ?? "1980-01-01",
        gender: (state.gender as "male" | "female") ?? "female",
        hmo: state.hmo ?? "",
        payer: state.payer ?? "",
      },
      procedures: state.procedures
        .filter((p) => p.name)
        .map((p, i) => ({
          id: `${id}-proc-${i + 1}`,
          name: p.name,
          organ: p.organ ?? undefined,
          side: (p.side as "right" | "left" | "none" | null) ?? "none",
        })),
      date: state.date!,
      startTime: state.time!,
      durationMinutes: Number(state.duration),
      combined: state.combined,
      backupDoctorName: state.backupDoctorName || undefined,
      anesthesia: (state.anesthesia as Surgery["anesthesia"]) ?? "general",
      capitalEquipment: state.capitalEquipment ?? undefined,
      additionalEquipment: state.additionalEquipment || undefined,
      requirements: state.requirements as Surgery["requirements"],
      treatmentType: state.treatmentType ?? "אשפוז יום",
      surgeonFee: state.feeEnabled
        ? { enabled: true, amount: Number(state.feeAmount) || 0 }
        : undefined,
      documents: state.extraDocs
        .filter((d) => d.file)
        .map((d, i) => ({
          id: `${id}-doc-${i + 1}`,
          typeKey: d.typeKey ?? "medical",
          typeLabel: documentTypeLabel(d.typeKey ?? "medical"),
          fileName: d.file!.name,
          fileUrl: "/mock-files/referral.pdf",
          sizeKb: d.file!.sizeKb,
          uploadedAt: state.date!,
          source: "doctor",
        })),
      status: "scheduled",
    };

    window.setTimeout(() => {
      addSurgery(surgery);
      toast("success", he.wizard.created);
      setHighlightId(id);
      window.setTimeout(() => setHighlightId(null), 2000);
      onCreated?.(surgery);
      onClose();
    }, 500);
  }

  const stepContent = [
    <Step1Patient key="s1" state={state} errors={errors} onChange={onChange} />,
    <Step2Surgery key="s2" state={state} errors={errors} onChange={onChange} />,
    <Step3Documents key="s3" state={state} errors={errors} onChange={onChange} />,
  ];

  return (
    <Sheet
      open
      onClose={onClose}
      title={he.schedule.createSurgery}
      size="xl"
      footer={
        <div className="flex w-full items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setStep(step - 1);
                setErrors({});
              }}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-md px-3 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
              {he.common.back}
            </button>
          ) : (
            <span />
          )}
          <Button onClick={tryAdvance} loading={submitting} className="min-w-32">
            {step === 2 ? he.wizard.finish : he.common.continue}
          </Button>
        </div>
      }
    >
      <div ref={bodyRef}>
        <Stepper
          steps={he.wizard.stepNames}
          current={step}
          onStepClick={(i) => {
            setStep(i);
            setErrors({});
          }}
          className="mb-6"
        />
        {stepContent[step]}
      </div>
    </Sheet>
  );
}
