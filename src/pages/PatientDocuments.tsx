import { useMemo, useState } from "react";
import { format } from "date-fns";
import { he as heLocale } from "date-fns/locale/he";
import { Search } from "lucide-react";
import { PatientShell } from "../components/layout/AppShell";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterChip } from "../components/data/Chip";
import { EmptyState } from "../components/data/EmptyState";
import { Skeleton } from "../components/data/Skeleton";
import { DocumentRow } from "../features/patient-documents/DocumentRow";
import { documents } from "../mock/documents";
import { useFakeLoading } from "../lib/useFakeLoading";
import { toDate } from "../lib/date";
import { he } from "../i18n/he";

export function PatientDocuments() {
  const loading = useFakeLoading(450);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const types = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of documents) map.set(d.typeKey, d.typeLabel);
    return [...map.entries()].map(([key, label]) => ({ key, label }));
  }, []);

  const filtered = useMemo(() => {
    return documents
      .filter((d) => {
        if (typeFilter && d.typeKey !== typeFilter) return false;
        const q = query.trim();
        if (q && !d.fileName.includes(q) && !d.typeLabel.includes(q)) return false;
        return true;
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [typeFilter, query]);

  /** קיבוץ לפי חודש */
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const d of filtered) {
      const label = format(toDate(d.uploadedAt), "MMMM yyyy", { locale: heLocale });
      const list = map.get(label) ?? [];
      list.push(d);
      map.set(label, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <PatientShell>
      <PageHeader
        title={he.patient.documentsTitle}
        subtitle={`${documents.length} מסמכים`}
        display
      />

      {/* חיפוש חופשי */}
      <div className="relative mb-3 max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={he.patient.searchDocuments}
          aria-label={he.patient.searchDocuments}
          className="h-[52px] w-full rounded-md border border-line bg-surface ps-10 pe-3 text-ink placeholder:text-muted transition-colors duration-fast hover:border-primary-300 focus:border-primary-500"
        />
      </div>

      {/* סינון לפי סוג מסמך */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="סינון לפי סוג מסמך">
        <FilterChip active={!typeFilter} onClick={() => setTypeFilter(null)}>
          {he.patient.filterAll}
        </FilterChip>
        {types.map((t) => (
          <FilterChip
            key={t.key}
            active={typeFilter === t.key}
            onClick={() => setTypeFilter(typeFilter === t.key ? null : t.key)}
          >
            {t.label}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="mt-5 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="block" className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="file"
          title={
            typeFilter || query ? "לא נמצאו מסמכים תואמים" : he.patient.emptyDocuments
          }
        />
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {groups.map(([label, docs]) => (
            <section key={label} aria-label={label}>
              <h2 className="mb-2 text-h3 text-muted">{label}</h2>
              <ul className="rounded-lg border border-line bg-surface px-4 shadow-sm">
                {docs.map((d) => (
                  <DocumentRow key={d.id} doc={d} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PatientShell>
  );
}
