import {
  BadgeCheck,
  CakeSlice,
  CreditCard,
  Phone,
  ShieldPlus,
  UserRound,
} from "lucide-react";
import { Drawer } from "../../components/overlay/Drawer";
import { formatFullDate } from "../../lib/date";
import { formatPhone } from "../../lib/format";
import { t } from "../../i18n";
import type { Patient } from "../../types";

export interface ProfileDrawerProps {
  patient: Patient;
  open: boolean;
  onClose: () => void;
}

/**
 * הפרטים האישיים של המטופל - תצוגה בלבד.
 * הנתונים מגיעים ממערכת בתי החולים ואינם ניתנים לעריכה באזור האישי.
 */
export function ProfileDrawer({ patient, open, onClose }: ProfileDrawerProps) {
  const p = t.patient.profile;

  const rows = [
    { icon: UserRound, label: p.fullName, value: `${patient.firstName} ${patient.lastName}` },
    {
      icon: BadgeCheck,
      label: p.idNumber,
      value: (
        <span dir="ltr" className="tnum">
          {patient.idNumber}
        </span>
      ),
    },
    {
      icon: Phone,
      label: p.phone,
      value: (
        <span dir="ltr" className="tnum">
          {formatPhone(patient.phone)}
        </span>
      ),
    },
    { icon: CakeSlice, label: p.birthDate, value: formatFullDate(patient.birthDate) },
    { icon: ShieldPlus, label: p.hmo, value: patient.hmo },
    { icon: CreditCard, label: p.payer, value: patient.payer },
  ];

  return (
    <Drawer open={open} onClose={onClose} title={p.title}>
      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex min-h-[52px] items-center gap-3 border-b border-line py-3 last:border-b-0"
          >
            <row.icon className="h-5 w-5 shrink-0 text-primary-600" aria-hidden />
            <dt className="w-28 shrink-0 font-semibold text-body">{row.label}</dt>
            <dd className="min-w-0 flex-1 font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 rounded-md bg-primary-50 px-4 py-3 text-caption text-primary-800">
        {p.note}
      </p>
    </Drawer>
  );
}
