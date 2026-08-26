import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/primitives/Button";
import { he } from "../i18n/he";

export function NoAccess() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <ShieldAlert className="h-8 w-8 text-danger" aria-hidden />
          </span>
          <p className="text-h3 text-ink">{he.errors.noAccessTitle}</p>
          <p className="max-w-sm text-body text-muted">{he.errors.noAccessBody}</p>
          <div className="mt-2">
            <Button onClick={() => navigate(-1)}>{he.common.back}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
