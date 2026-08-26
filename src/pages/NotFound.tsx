import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/data/EmptyState";
import { Button } from "../components/primitives/Button";
import { he } from "../i18n/he";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-sm">
        <EmptyState
          illustration="search"
          title={he.common.notFoundTitle}
          description={he.common.notFoundBody}
          action={<Button onClick={() => navigate("/")}>{he.common.backHome}</Button>}
        />
      </div>
    </div>
  );
}
