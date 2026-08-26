import { useEffect, useState } from "react";

/**
 * מדמה טעינת נתונים קצרה כדי שמצבי ה-Skeleton יהיו מוחשיים.
 * מופעל מחדש כשה-key משתנה (למשל מעבר בין מנתחים).
 */
export function useFakeLoading(ms = 500, key: unknown = null): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [ms, key]);
  return loading;
}
