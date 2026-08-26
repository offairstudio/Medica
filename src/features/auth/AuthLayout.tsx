import type { ReactNode } from "react";

/**
 * מסך מפוצל: שני שלישים רקע primary-700 עם הלוגו,
 * שליש כרטיס לבן עם הטופס. במובייל - עמודה אחת.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="flex items-center justify-center bg-primary-700 py-10 md:min-h-screen md:w-2/3">
        <div className="flex flex-col items-center gap-3 text-white">
          <span className="text-[56px] font-bold leading-none tracking-tight md:text-[72px]">
            Medica
          </span>
          <span className="text-white/70">בתי החולים רפאל ואלישע</span>
        </div>
      </div>
      <div className="flex flex-1 items-start justify-center bg-canvas px-4 py-10 md:items-center">
        <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6 shadow-sm md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
