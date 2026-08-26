import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ISODate, Surgery, Time } from "../types";
import { initialSurgeries } from "../mock/surgeries";

interface DataContextValue {
  surgeries: Surgery[];
  addSurgery: (surgery: Surgery) => void;
  updateSurgery: (id: string, patch: Partial<Surgery>) => void;
  deleteSurgery: (id: string) => Surgery | undefined;
  restoreSurgery: (surgery: Surgery) => void;
  swapSurgery: (id: string, date: ISODate, time: Time) => void;
  /** ניתוח שהשתנה כרגע - להבהוב חד פעמי ברשימה */
  highlightId: string | null;
  setHighlightId: (id: string | null) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData חייב להיות בתוך DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [surgeries, setSurgeries] = useState<Surgery[]>(initialSurgeries);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const addSurgery = useCallback((surgery: Surgery) => {
    setSurgeries((list) => [...list, surgery]);
  }, []);

  const updateSurgery = useCallback((id: string, patch: Partial<Surgery>) => {
    setSurgeries((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const deleteSurgery = useCallback(
    (id: string) => {
      const found = surgeries.find((s) => s.id === id);
      setSurgeries((list) => list.filter((s) => s.id !== id));
      return found;
    },
    [surgeries],
  );

  const restoreSurgery = useCallback((surgery: Surgery) => {
    setSurgeries((list) => [...list, surgery]);
  }, []);

  const swapSurgery = useCallback((id: string, date: ISODate, time: Time) => {
    setSurgeries((list) =>
      list.map((s) => (s.id === id ? { ...s, date, startTime: time } : s)),
    );
  }, []);

  const value = useMemo(
    () => ({
      surgeries,
      addSurgery,
      updateSurgery,
      deleteSurgery,
      restoreSurgery,
      swapSurgery,
      highlightId,
      setHighlightId,
    }),
    [surgeries, addSurgery, updateSurgery, deleteSurgery, restoreSurgery, swapSurgery, highlightId],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
