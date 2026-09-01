import { Link, useNavigate } from "react-router-dom";
import { AtSign, Smartphone, BadgeCheck, ChevronDown, LogOut } from "lucide-react";
import { Avatar } from "../data/Avatar";
import { Dropdown } from "../overlay/Dropdown";
import { formatPhone } from "../../lib/format";
import { departmentName } from "../../mock/departments";
import { he } from "../../i18n/he";
import type { Doctor } from "../../types";
import { BrandMark } from "./BrandMark";

export interface TopBarProps {
  /** המשתמש המחובר למערכת - לא המנתח הנצפה */
  doctor: Doctor;
}

export function TopBar({ doctor }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/95 backdrop-blur-xl">
      <div className="flex h-[68px] items-center justify-between gap-4 px-4 lg:px-6">
        <Link
          to={`/doctor/${doctor.id}/schedule`}
          className="rounded-md"
          aria-label="Medica - מסך הבית"
        >
          <BrandMark />
        </Link>

        {/* זהות המשתמש - אווטאר, שם ומחלקה, ותפריט */}
        <Dropdown
          portal
          menuClassName="w-72 max-w-[calc(100vw-2rem)]"
          trigger={
            <button
              type="button"
              aria-label="תפריט משתמש"
              className="flex items-center gap-2.5 rounded-full border border-transparent bg-canvas py-1 ps-1.5 pe-2.5 transition-colors duration-fast hover:border-line hover:bg-primary-50"
            >
              <Avatar name={doctor.displayName} src={doctor.avatarUrl} size="md" />
              <span className="hidden flex-col items-start text-start leading-tight sm:flex">
                <span className="font-semibold text-ink">{doctor.displayName}</span>
                <span className="text-[12px] text-muted">
                  {departmentName(doctor.departmentId)}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted sm:block" aria-hidden />
            </button>
          }
          header={
            <div className="border-b border-line p-4">
              <div className="flex items-center gap-3">
                <Avatar name={doctor.displayName} src={doctor.avatarUrl} size="lg" />
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-semibold text-ink">{doctor.displayName}</span>
                  <span className="block text-caption text-muted">{departmentName(doctor.departmentId)}</span>
                </span>
              </div>
              <div className="mt-4 space-y-2 text-caption text-muted">
                <span className="flex min-w-0 items-center gap-2">
                  <AtSign className="h-3.5 w-3.5" aria-hidden />
                  <span dir="ltr" className="min-w-0 truncate">{doctor.email}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Smartphone className="h-3.5 w-3.5" aria-hidden />
                  <span dir="ltr" className="tnum">{formatPhone(doctor.mobile)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  מספר רישיון <span dir="ltr" className="tnum">{doctor.licenseNumber}</span>
                </span>
              </div>
            </div>
          }
          items={[
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
    </header>
  );
}
