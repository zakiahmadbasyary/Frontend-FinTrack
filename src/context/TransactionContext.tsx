import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Transaction } from "../types/transaction";
import { Category } from "../types/category";
import { getTransactions } from "../services/transactionService";
import { getCategories } from "../services/categoryService";

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  categories: [],
  loading: false,
  error: null,
  refreshData: async () => {},
  getCategoryById: () => undefined,
});

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trxData, catData] = await Promise.all([
        getTransactions().catch((err) => {
          console.error("Error fetching transactions:", err);
          return [] as Transaction[];
        }),
        getCategories().catch((err) => {
          console.error("Error fetching categories:", err);
          return [] as Category[];
        }),
      ]);

      setTransactions(trxData);
      setCategories(catData);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find((c) => c.id === id);
  }, [categories]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        loading,
        error,
        refreshData: fetchData,
        getCategoryById,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => useContext(TransactionContext);
