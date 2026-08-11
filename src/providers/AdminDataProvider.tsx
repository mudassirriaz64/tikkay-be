"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Database } from "@/lib/data/defaults";

const STORAGE_KEY = "tikkay-shikkay-admin-db-v1";

interface AdminDataContextValue {
  data: Database;
  updateSlice: <K extends keyof Database>(key: K, value: Database[K]) => void;
  resetAll: () => void;
  isHydrated: boolean;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({
  initialData,
  children,
}: {
  initialData: Database;
  children: ReactNode;
}) {
  const [data, setData] = useState<Database>(initialData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.settings && parsed.menu) {
          setData({ ...initialData, ...parsed });
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setIsHydrated(true);
  }, [initialData]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // storage may be unavailable
      }
    }
  }, [data, isHydrated]);

  const updateSlice = useCallback(<K extends keyof Database>(key: K, value: Database[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  const value = useMemo(
    () => ({ data, updateSlice, resetAll, isHydrated }),
    [data, updateSlice, resetAll, isHydrated],
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }
  return ctx;
}
