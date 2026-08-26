import { Link, useNavigate } from "react-router-dom";
import { AtSign, Smartphone, BadgeCheck, ChevronDown, LogOut, User } from "lucide-react";
import { Avatar } from "../data/Avatar";
import { Dropdown } from "../overlay/Dropdown";
import { formatPhone } from "../../lib/format";
import { departmentName } from "../../mock/departments";
import { he } from "../../i18n/he";
import type { Doctor } from "../../types";

export interface TopBarProps {
  /** המשתמש המחובר למערכת - לא המנתח הנצפה */
  doctor: Doctor;
}

export function TopBar({ doctor }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="flex h-14 items-center justify-between gap-4 bg-primary-700 px-4 text-white lg:px-6">
        <Link
          to={`/doctor/${doctor.id}/schedule`}
          className="rounded-md text-h2 font-bold tracking-tight"
          aria-label="Medica - מסך הבית"
        >
          Medica
        </Link>

        {/* זהות המשתמש - אווטאר, שם ומחלקה, ותפריט */}
        <Dropdown
          trigger={
            <button
              type="button"
              aria-label="תפריט משתמש"
              className="flex items-center gap-2.5 rounded-full py-1 ps-1.5 pe-2.5 transition-colors duration-fast hover:bg-white/10"
            >
              <Avatar name={doctor.displayName} src={doctor.avatarUrl} size="md" />
              <span className="hidden flex-col items-start text-start leading-tight sm:flex">
                <span className="font-semibold">{doctor.displayName}</span>
                <span className="text-[11px] text-white/70">
                  {departmentName(doctor.departmentId)}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-white/70 sm:block" aria-hidden />
            </button>
          }
          items={[
            {
              key: "profile",
              label: doctor.displayName,
              icon: <User />,
              onSelect: () => {},
            },
            {
              key: "logout",
              label: he.common.logout,
              icon: <LogOut />,
              danger: true,
              onSelect: () => navigate("/login"),
            },
          ]}
        />
      </div>

      {/* שורת מטא מובנית - במקום פרטי הקשר הצפים במערכת הקיימת */}
      <div className="flex h-8 items-center justify-center gap-5 overflow-x-auto bg-primary-800 px-4 text-caption text-white/75 lg:px-6">
        <span className="flex shrink-0 items-center gap-1.5" dir="ltr">
          <AtSign className="h-3.5 w-3.5" aria-hidden />
          {doctor.email}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5" aria-hidden />
          <span dir="ltr" className="tnum">{formatPhone(doctor.mobile)}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
          מספר רישיון <span dir="ltr" className="tnum">{doctor.licenseNumber}</span>
        </span>
      </div>
    </header>
  );
}
