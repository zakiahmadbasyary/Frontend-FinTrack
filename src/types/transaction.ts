export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category_id: string;
  amount: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionInput {
  date: string;
  type: TransactionType;
  category_id: string;
  amount: number;
  description?: string;
}

export interface UpdateTransactionInput extends CreateTransactionInput {}
