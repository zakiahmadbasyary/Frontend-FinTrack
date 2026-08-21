import { API_BASE_URL } from "../config/api";
import {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "../types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/api/transactions`);

  if (!response.ok) {
    throw new Error("Gagal mengambil daftar transaksi");
  }

  const result = await response.json();
  const data = result.data ?? result;
  
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

export async function createTransaction(
  data: CreateTransactionInput
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menambahkan transaksi");
  }

  return result.data ?? result;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionInput
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui transaksi");
  }

  return result.data ?? result;
}

export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menghapus transaksi");
  }
}
