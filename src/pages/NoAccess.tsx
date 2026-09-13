import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/primitives/Button";
import { t } from "../i18n";

export function NoAccess() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <ShieldAlert className="h-8 w-8 text-danger" aria-hidden />
          </span>
          <p className="text-h3 text-ink">{t.errors.noAccessTitle}</p>
          <p className="max-w-sm text-body text-muted">{t.errors.noAccessBody}</p>
          <div className="mt-2">
            <Button onClick={() => navigate(-1)}>{t.common.back}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
