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
import { he } from "../../i18n/he";
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
  const t = he.patient.profile;

  const rows = [
    { icon: UserRound, label: t.fullName, value: `${patient.firstName} ${patient.lastName}` },
    {
      icon: BadgeCheck,
      label: t.idNumber,
      value: (
        <span dir="ltr" className="tnum">
          {patient.idNumber}
        </span>
      ),
    },
    {
      icon: Phone,
      label: t.phone,
      value: (
        <span dir="ltr" className="tnum">
          {formatPhone(patient.phone)}
        </span>
      ),
    },
    { icon: CakeSlice, label: t.birthDate, value: formatFullDate(patient.birthDate) },
    { icon: ShieldPlus, label: t.hmo, value: patient.hmo },
    { icon: CreditCard, label: t.payer, value: patient.payer },
  ];

  return (
    <Drawer open={open} onClose={onClose} title={t.title}>
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
        {t.note}
      </p>
    </Drawer>
  );
}
