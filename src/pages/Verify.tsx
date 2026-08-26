import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../features/auth/AuthLayout";
import { Button } from "../components/primitives/Button";
import { cn } from "../lib/cn";
import { maskPhone } from "../lib/format";
import { he } from "../i18n/he";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 47;

export function Verify({ audience }: { audience: "doctor" | "patient" }) {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [wrongCode, setWrongCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [secondsLeft]);

  function setDigit(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const next = [...d];
      next[index] = v;
      return next;
    });
    setWrongCode(false);
    if (v && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    setWrongCode(false);
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setWrongCode(true);
      return;
    }
    // הקוד 000000 מדמה קוד שגוי, כל קוד אחר מתקבל
    if (code === "000000") {
      setWrongCode(true);
      return;
    }
    setSubmitting(true);
    window.setTimeout(
      () => navigate(audience === "doctor" ? "/doctor/doc-1/schedule" : "/p"),
      400,
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <h1 className="text-h1 text-ink">{he.otp.title}</h1>
          <p className="mt-1 text-caption text-muted">
            {he.otp.sentTo} <span dir="ltr" className="tnum">{maskPhone("0523372667")}</span>
          </p>
        </div>

        <div dir="ltr" className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              inputMode="numeric"
              maxLength={1}
              aria-label={`ספרה ${i + 1}`}
              aria-invalid={wrongCode || undefined}
              className={cn(
                "h-12 w-11 rounded-md border bg-surface text-center text-h2 text-ink tnum transition-colors duration-fast",
                wrongCode
                  ? "border-danger bg-danger/5"
                  : "border-line hover:border-primary-300 focus:border-primary-500",
              )}
            />
          ))}
        </div>

        {wrongCode && (
          <p role="alert" className="text-center text-caption text-danger">
            {he.otp.wrongCode}
          </p>
        )}

        <div className="text-center text-caption text-muted">
          {secondsLeft > 0 ? (
            <>
              {he.otp.resendIn}{" "}
              <span dir="ltr" className="tnum font-semibold">
                00:{String(secondsLeft).padStart(2, "0")}
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setSecondsLeft(RESEND_SECONDS)}
              className="rounded font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-800"
            >
              {he.otp.resend}
            </button>
          )}
        </div>

        <Button type="submit" fullWidth loading={submitting}>
          {he.otp.submit}
        </Button>
      </form>
    </AuthLayout>
  );
}
