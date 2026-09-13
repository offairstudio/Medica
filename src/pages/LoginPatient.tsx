import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IdCard, Phone } from "lucide-react";
import { AuthLayout } from "../features/auth/AuthLayout";
import { Input } from "../components/primitives/Input";
import { Button } from "../components/primitives/Button";
import { t } from "../i18n";

export function LoginPatient() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!idNumber.trim()) {
      setError(t.common.requiredField);
      valid = false;
    } else if (idNumber.length < 9) {
      setError(t.login.idInvalid);
      valid = false;
    }
    if (!phone.trim()) {
      setPhoneError(t.common.requiredField);
      valid = false;
    } else if (phone.replace(/\D/g, "").length !== 10) {
      setPhoneError(t.login.phoneInvalid);
      valid = false;
    }
    if (!valid) return;
    setSubmitting(true);
    window.setTimeout(() => navigate("/p/verify"), 400);
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div>
          <h1 className="text-display text-ink">{t.login.patientTitle}</h1>
          <p className="mt-2 text-muted">{t.login.patientSubtitle}</p>
        </div>

        <Input
          label={t.login.idLabel}
          icon={<IdCard />}
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          tall
          value={idNumber}
          onChange={(e) => {
            setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 9));
            setError(undefined);
          }}
          error={error}
        />

        <Input
          label={t.login.phoneLabel}
          icon={<Phone />}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          maxLength={10}
          tall
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
            setPhoneError(undefined);
          }}
          error={phoneError}
          hint={t.login.voiceFallbackNote}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {t.login.patientCta}
        </Button>

        <p className="text-center text-caption text-muted">
          {t.login.supportLine}{" "}
          <span dir="ltr" className="tnum font-semibold">03-697-3904</span>
        </p>

        <Link
          to="/login"
          className="inline-flex min-h-[24px] items-center justify-center self-center rounded text-caption font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
        >
          {t.login.doctorLink}
        </Link>
      </form>
    </AuthLayout>
  );
}
