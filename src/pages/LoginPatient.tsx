import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../features/auth/AuthLayout";
import { Input } from "../components/primitives/Input";
import { Button } from "../components/primitives/Button";
import { he } from "../i18n/he";

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
      setError(he.common.requiredField);
      valid = false;
    } else if (idNumber.length < 9) {
      setError(he.login.idInvalid);
      valid = false;
    }
    if (!phone.trim()) {
      setPhoneError(he.common.requiredField);
      valid = false;
    } else if (phone.replace(/\D/g, "").length !== 10) {
      setPhoneError(he.login.phoneInvalid);
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
          <h1 className="text-display text-ink">{he.login.patientTitle}</h1>
          <p className="mt-2 text-muted">{he.login.patientSubtitle}</p>
        </div>

        <Input
          label={he.login.idLabel}
          placeholder={he.login.idPlaceholder}
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          dir="ltr"
          className="[&_input]:text-right"
          tall
          value={idNumber}
          onChange={(e) => {
            setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 9));
            setError(undefined);
          }}
          error={error}
        />

        <Input
          label={he.login.phoneLabel}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          maxLength={10}
          dir="ltr"
          className="[&_input]:text-right"
          tall
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
            setPhoneError(undefined);
          }}
          error={phoneError}
          hint={he.login.voiceFallbackNote}
        />

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          {he.login.patientCta}
        </Button>

        <p className="text-center text-caption text-muted">
          {he.login.supportLine}{" "}
          <span dir="ltr" className="tnum font-semibold">03-697-3904</span>
        </p>

        <Link
          to="/login"
          className="text-center text-caption font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
        >
          {he.login.doctorLink}
        </Link>
      </form>
    </AuthLayout>
  );
}
