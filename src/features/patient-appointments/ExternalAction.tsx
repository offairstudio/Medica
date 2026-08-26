import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Modal } from "../../components/overlay/Modal";
import { Button } from "../../components/primitives/Button";
import { useToast } from "../../components/overlay/Toast";
import { cn } from "../../lib/cn";
import { he } from "../../i18n/he";

export interface ExternalActionProps {
  label: string;
  /** button - כפתור בולט; link - קישור טקסט שקט */
  variant?: "button" | "link";
  className?: string;
}

/**
 * פעולה שמתבצעת מחוץ למערכת (למשל זימון תור במערכת חיצונית).
 * מציגה מסך ביניים שמסביר את המעבר בין המערכות לפני היציאה -
 * הטיפול העיצובי במעבר שהוגדר בבריף.
 */
export function ExternalAction({ label, variant = "button", className }: ExternalActionProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  function proceed() {
    setOpen(false);
    toast("info", he.patient.externalOpened);
  }

  return (
    <>
      {variant === "button" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 rounded-md border border-primary-300 bg-surface px-4 font-semibold text-primary-700 transition-colors duration-fast hover:border-primary-500 hover:bg-primary-50",
            className,
          )}
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-2 text-caption font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50 hover:text-primary-800",
            className,
          )}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={he.patient.externalModalTitle}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {he.common.cancel}
            </Button>
            <Button icon={<ExternalLink className="h-4 w-4" />} onClick={proceed}>
              {he.patient.externalContinue}
            </Button>
          </>
        }
      >
        <p className="text-body">{he.patient.externalModalBody}</p>
      </Modal>
    </>
  );
}
