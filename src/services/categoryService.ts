import { API_BASE_URL } from "../config/api";
import { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data kategori");
  }

  const result = await response.json();
  const data = result.data ?? result;

  if (Array.isArray(data)) {
    return data;
  }
  return [];
}
