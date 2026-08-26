import { useState } from "react";
import { Check, Download, Eye, FileText, FileImage, Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatFileSize } from "../../lib/format";
import { formatNumericDate } from "../../lib/date";
import { he } from "../../i18n/he";
import type { MedicalDocument } from "../../types";

function typeIcon(doc: MedicalDocument) {
  if (doc.typeKey === "imaging" || doc.typeKey === "chestXray") return FileImage;
  return FileText;
}

/**
 * שורת מסמך רפואי עם מיקרו-אינטראקציית הורדה:
 * כפתור ← ספינר ← וי, בליווי הורדת הקובץ בפועל.
 */
export function DocumentRow({ doc }: { doc: MedicalDocument }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const Icon = typeIcon(doc);

  function download() {
    if (phase !== "idle") return;
    setPhase("loading");
    window.setTimeout(() => {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.fileName;
      a.click();
      setPhase("done");
      window.setTimeout(() => setPhase("idle"), 2000);
    }, 600);
  }

  return (
    <li className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-100">
        <Icon className="h-5 w-5 text-primary-600" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-strong font-semibold text-ink">
          {doc.fileName}
        </span>
        <span className="block truncate text-caption text-muted">
          {doc.typeLabel} · <span className="tnum">{formatNumericDate(doc.uploadedAt)}</span> ·{" "}
          <span dir="ltr" className="tnum">{formatFileSize(doc.sizeKb)}</span>
        </span>
      </span>
      {/* צפייה בהדמיה - למסמכי דימות, בנוסף להורדה */}
      {doc.typeKey === "imaging" && (
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${he.patient.viewImaging}: ${doc.fileName}`}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md px-3 font-semibold text-primary-600 transition-colors duration-fast hover:bg-primary-50"
        >
          <Eye className="h-4 w-4" aria-hidden />
          <span className="max-sm:hidden">{he.patient.viewImaging}</span>
        </a>
      )}
      <button
        type="button"
        onClick={download}
        aria-label={`הורדת ${doc.fileName}`}
        className={cn(
          "inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md px-3 font-semibold transition-colors duration-fast",
          phase === "done"
            ? "text-success"
            : "text-primary-600 hover:bg-primary-50",
        )}
      >
        {phase === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : phase === "done" ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Download className="h-4 w-4" aria-hidden />
        )}
        <span className="max-sm:hidden">{he.common.download}</span>
      </button>
    </li>
  );
}
