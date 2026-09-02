import { useRef, useState } from "react";
import { FileText, FileImage, File as FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatFileSize } from "../../lib/format";
import { he } from "../../i18n/he";

export interface UploadedFile {
  name: string;
  sizeKb: number;
}

export interface FileUploadProps {
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  error?: string;
  className?: string;
}

const MAX_SIZE_KB = 4.5 * 1024;

function fileIcon(name: string) {
  if (/\.(png|jpe?g|tiff?|gif|webp)$/i.test(name)) return FileImage;
  if (/\.(pdf|docx?)$/i.test(name)) return FileText;
  return FileIcon;
}

export function FileUpload({ value, onChange, error, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  function accept(file: File | undefined) {
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    if (sizeKb > MAX_SIZE_KB) {
      setSizeError("הקובץ גדול מ-4.5 מגה");
      return;
    }
    setSizeError(null);
    onChange({ name: file.name, sizeKb: Math.max(sizeKb, 1) });
  }

  if (value) {
    const Icon = fileIcon(value.name);
    return (
      <div className={cn("flex items-center gap-3 rounded-md border border-line bg-surface-2 p-3", className)}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100">
          <Icon className="h-5 w-5 text-primary-600" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-strong font-semibold text-ink">{value.name}</span>
          <span dir="ltr" className="block text-caption text-muted tnum">{formatFileSize(value.sizeKb)}</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={`הסרת הקובץ ${value.name}`}
          className="shrink-0 rounded-md p-2 text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        aria-invalid={error || sizeError ? true : undefined}
        className={cn(
          "flex min-h-[96px] w-full flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed bg-surface px-4 py-5 transition-colors duration-fast",
          dragOver
            ? "border-primary-500 bg-primary-50"
            : error || sizeError
              ? "border-danger"
              : "border-primary-300 hover:border-primary-500 hover:bg-primary-50",
        )}
      >
        <UploadCloud className="h-6 w-6 text-primary-400" aria-hidden />
        <span className="text-body">{he.wizard.step3.dropHere}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.tif,.tiff,.png,.jpg,.jpeg"
        className="sr-only"
        aria-label="בחירת קובץ"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {(error || sizeError) && <p className="text-caption text-danger">{sizeError ?? error}</p>}
    </div>
  );
}
