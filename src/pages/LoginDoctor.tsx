import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IdCard } from "lucide-react";
import { AuthLayout } from "../features/auth/AuthLayout";
import { Input } from "../components/primitives/Input";
import { Button } from "../components/primitives/Button";
import { t } from "../i18n";

export function LoginDoctor() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!idNumber.trim()) {
      setError(t.common.requiredField);
      return;
    }
    if (idNumber.length < 9) {
      setError(t.login.idInvalid);
      return;
    }
    setSubmitting(true);
    // אימות מדומה - כל ת.ז מתקבלת
    window.setTimeout(() => navigate("/verify"), 400);
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <h1 className="text-h1 text-ink">{t.login.doctorTitle}</h1>
          <p className="mt-1 text-caption text-muted">{t.login.doctorSubtitle}</p>
        </div>

        <Input
          label={t.login.idLabel}
          icon={<IdCard />}
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          value={idNumber}
          onChange={(e) => {
            setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 9));
            setError(undefined);
          }}
          error={error}
        />

        <Button type="submit" fullWidth loading={submitting}>
          {t.common.continue}
        </Button>

        <Link
          to="/p/login"
          className="inline-flex min-h-[24px] items-center justify-center self-center rounded text-caption font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
        >
          {t.login.patientLink}
        </Link>
      </form>
    </AuthLayout>
  );
}
