/** '037336278' → תצוגת ת.ז */
export function formatIdNumber(id: string): string {
  return id;
}

/** '0523372667' → '052-337-2667' */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

/** '0523372667' → 'xxx-xxx-2667' להסתרת מספר במסך OTP */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `xxx-xxx-${digits.slice(-4)}`;
}

/** 75 → '75 דק\'' */
export function formatDuration(minutes: number): string {
  return `${minutes} דק'`;
}

/** 420 → '420 KB' / 1740 → '1.7 MB' */
export function formatFileSize(sizeKb: number): string {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

/** ולידציית תעודת זהות ישראלית (ספרת ביקורת) */
export function isValidIsraeliId(id: string): boolean {
  const digits = id.replace(/\D/g, "");
  if (digits.length !== 9) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let n = Number(digits[i]) * (i % 2 === 0 ? 1 : 2);
    if (n > 9) n -= 9;
    sum += n;
  }
  return sum % 10 === 0;
}
