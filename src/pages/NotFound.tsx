import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/data/EmptyState";
import { Button } from "../components/primitives/Button";
import { t } from "../i18n";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-sm">
        {/* כותרת הדף לקוראי מסך - הכותרת הוויזואלית היא חלק ממצב הריק */}
        <h1 className="sr-only">{t.common.notFoundTitle}</h1>
        <EmptyState
          illustration="search"
          title={t.common.notFoundTitle}
          description={t.common.notFoundBody}
          action={<Button onClick={() => navigate("/")}>{t.common.backHome}</Button>}
        />
      </div>
    </main>
  );
}
