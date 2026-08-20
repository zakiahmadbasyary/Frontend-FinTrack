# Panduan Frontend Mobile FinTrack Menggunakan React Native

## 1. Tujuan

Dokumen ini menjadi panduan implementasi frontend mobile aplikasi **FinTrack** menggunakan **React Native** dan terhubung ke backend Next.js yang sudah tersedia.

Arsitektur:

```text
React Native Android
        │
        │ HTTPS Request
        ▼
Next.js API di Vercel
        │
        ▼
Google Apps Script
        │
        ▼
Google Spreadsheet
```

Base URL backend:

```text
https://fin-track-topaz-six.vercel.app
```

Frontend mobile **tidak mengakses Google Apps Script atau Google Spreadsheet secara langsung**. Semua request dilakukan melalui API Next.js.

---

# 2. Desain Aplikasi

Tampilan mengikuti referensi desain yang telah dibuat:

- Warna utama orange.
- Tampilan minimalis dan modern.
- Background putih atau abu muda.
- Card dengan sudut rounded.
- Nominal keuangan menggunakan typography yang tegas.
- Icon sederhana.
- Bottom navigation.
- Tombol utama menggunakan orange.

Halaman utama:

```text
Beranda
Riwayat
Tambah Transaksi
Ringkasan
Profil
```

Navigasi:

```text
Bottom Tabs
│
├── Beranda
├── Riwayat
│   └── Detail Transaksi
│       └── Edit Transaksi
├── Tambah Transaksi
├── Ringkasan
└── Profil
```

Gunakan Bottom Tab Navigator untuk halaman utama dan Stack Navigator untuk Detail serta Edit Transaksi.

---

# 3. Endpoint Backend

Backend yang sudah tersedia:

```text
GET     /api/transactions
POST    /api/transactions

PUT     /api/transactions/[id]
DELETE  /api/transactions/[id]

GET     /api/categories
```

Base URL:

```text
https://fin-track-topaz-six.vercel.app
```

Contoh:

```text
GET https://fin-track-topaz-six.vercel.app/api/transactions
```

---

# 4. Struktur Folder

Rekomendasi struktur:

```text
src/
├── config/
│   └── api.ts
├── services/
│   ├── transactionService.ts
│   └── categoryService.ts
├── types/
│   ├── transaction.ts
│   └── category.ts
├── hooks/
│   └── useTransactions.ts
├── utils/
│   ├── currency.ts
│   └── date.ts
├── components/
├── screens/
└── navigation/
```

---

# 5. Konfigurasi API

Buat file:

```text
src/config/api.ts
```

```ts
export const API_BASE_URL =
  "https://fin-track-topaz-six.vercel.app";
```

---

# 6. Type Data

## Transaction

```text
src/types/transaction.ts
```

```ts
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

export interface UpdateTransactionInput
  extends CreateTransactionInput {}
```

## Category

```text
src/types/category.ts
```

```ts
export interface Category {
  id: string;
  name: string;
  type?: "income" | "expense";
}
```

Sesuaikan field apabila response backend menggunakan struktur berbeda.

---

# 7. Transaction Service

Buat:

```text
src/services/transactionService.ts
```

```ts
import { API_BASE_URL } from "../config/api";
import {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from "../types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions`
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil transaksi");
  }

  const result = await response.json();

  return result.data ?? result;
}

export async function createTransaction(
  data: CreateTransactionInput
) {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menambahkan transaksi"
    );
  }

  return result;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionInput
) {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal memperbarui transaksi"
    );
  }

  return result;
}

export async function deleteTransaction(id: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menghapus transaksi"
    );
  }

  return result;
}
```

Jika API mengembalikan:

```json
{
  "status": "success",
  "data": []
}
```

gunakan `result.data`.

Jika API langsung mengembalikan array, gunakan `result`.

---

# 8. Category Service

Buat:

```text
src/services/categoryService.ts
```

```ts
import { API_BASE_URL } from "../config/api";
import { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/categories`
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil kategori");
  }

  const result = await response.json();

  return result.data ?? result;
}
```

Kategori harus diambil dari API, bukan dibuat hardcode pada setiap halaman.

---

# 9. Beranda

## Konsep Utama

**Beranda hanya menampilkan data bulan berjalan.**

Contoh apabila sekarang Agustus 2026:

```text
Beranda:
01 Agustus 2026
sampai
31 Agustus 2026
```

Yang ditampilkan:

- Saldo bulan ini.
- Total pemasukan bulan ini.
- Total pengeluaran bulan ini.
- Transaksi terbaru pada bulan ini.
- Maksimal sekitar 5 transaksi.
- Tombol `Lihat Semua` menuju Riwayat.

Transaksi bulan sebelumnya tidak ditampilkan pada daftar Beranda.

---

## 9.1 Alur Beranda

```text
GET /api/transactions
        ↓
Ambil semua transaksi
        ↓
Filter bulan berjalan
        ↓
Hitung income bulan ini
        ↓
Hitung expense bulan ini
        ↓
Hitung saldo bulan ini
        ↓
Urutkan tanggal terbaru
        ↓
Ambil 5 transaksi terbaru
        ↓
Tampilkan UI Beranda
```

## 9.2 Filter Bulan Berjalan

```ts
const now = new Date();

const currentMonthTransactions =
  transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);

    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  });
```

## 9.3 Total Pemasukan

```ts
const totalIncome = currentMonthTransactions
  .filter((item) => item.type === "income")
  .reduce(
    (total, item) => total + Number(item.amount),
    0
  );
```

## 9.4 Total Pengeluaran

```ts
const totalExpense = currentMonthTransactions
  .filter((item) => item.type === "expense")
  .reduce(
    (total, item) => total + Number(item.amount),
    0
  );
```

## 9.5 Saldo Bulan Ini

```ts
const balance = totalIncome - totalExpense;
```

Untuk MVP:

```text
Saldo Bulan Ini
= Total Pemasukan Bulan Ini
- Total Pengeluaran Bulan Ini
```

## 9.6 Transaksi Terakhir

```ts
const latestTransactions =
  [...currentMonthTransactions]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);
```

---

# 10. Riwayat Transaksi

Halaman Riwayat menampilkan seluruh transaksi.

Fitur:

```text
✓ Search
✓ Filter Semua
✓ Filter Pemasukan
✓ Filter Pengeluaran
✓ Kelompok berdasarkan tanggal
✓ Klik transaksi
✓ Detail Transaksi
```

Filter:

```text
Semua
Pemasukan
Pengeluaran
```

Contoh:

```ts
const filteredByType = transactions.filter((item) => {
  if (selectedFilter === "all") return true;

  return item.type === selectedFilter;
});
```

Search dapat mencari deskripsi dan, jika data kategori sudah dimapping, nama kategori.

---

# 11. Detail Transaksi

Data yang ditampilkan:

```text
← Detail Transaksi

[Icon Kategori]

Pemasukan / Pengeluaran

Rp 50.000

Kategori
Makanan

Tanggal
20 Agu 2026

Deskripsi
Makan Siang di Kantin

[Edit Transaksi]
```

Halaman ini menerima transaksi yang dipilih atau ID transaksi.

Tombol:

```text
Edit Transaksi
```

menuju halaman Edit.

---

# 12. Edit Transaksi

Form harus menampilkan data transaksi sebelumnya.

Contoh:

```ts
const [type, setType] =
  useState(transaction.type);

const [amount, setAmount] =
  useState(String(transaction.amount));

const [categoryId, setCategoryId] =
  useState(transaction.category_id);

const [date, setDate] =
  useState(transaction.date);

const [description, setDescription] =
  useState(transaction.description ?? "");
```

Saat klik `Simpan Perubahan`:

```ts
await updateTransaction(transaction.id, {
  type,
  amount: Number(amount),
  category_id: categoryId,
  date,
  description,
});
```

Endpoint:

```text
PUT /api/transactions/[id]
```

Setelah berhasil:

```text
PUT berhasil
    ↓
Refresh data
    ↓
Kembali ke Detail atau Riwayat
```

## Hapus Transaksi

Gunakan:

```text
DELETE /api/transactions/[id]
```

Sebelum menghapus, tampilkan konfirmasi:

```text
Apakah Anda yakin ingin menghapus transaksi ini?

[Batal] [Hapus]
```

Setelah berhasil:

```text
DELETE berhasil
    ↓
Refresh data
    ↓
Kembali ke Riwayat
```

---

# 13. Tambah Transaksi

Halaman Tambah menggunakan:

```text
POST /api/transactions
```

Form:

```text
Pemasukan / Pengeluaran
Jumlah
Kategori
Tanggal
Deskripsi atau Catatan

[Simpan Transaksi]
```

Contoh data:

```json
{
  "date": "2026-08-20",
  "type": "expense",
  "category_id": "CAT002",
  "amount": 50000,
  "description": "Makan siang"
}
```

Submit:

```ts
await createTransaction({
  date,
  type,
  category_id: categoryId,
  amount: Number(amount),
  description,
});
```

Validasi:

```text
✓ Tipe wajib dipilih
✓ Jumlah harus lebih dari 0
✓ Kategori wajib dipilih
✓ Tanggal wajib tersedia
```

---

# 14. Ringkasan

Ringkasan menampilkan visualisasi keuangan berdasarkan bulan.

Komponen:

```text
Total Saldo
Total Pemasukan
Total Pengeluaran
Pengeluaran per Kategori
Tren Bulanan
```

Perbedaan:

```text
Beranda
→ otomatis bulan berjalan.

Ringkasan
→ dapat dikembangkan untuk memilih bulan tertentu.
```

## Pengeluaran per Kategori

```ts
const categoryTotals = expenseTransactions.reduce(
  (result, item) => {
    const categoryId = item.category_id;

    result[categoryId] =
      (result[categoryId] || 0) +
      Number(item.amount);

    return result;
  },
  {} as Record<string, number>
);
```

Data dapat digunakan untuk:

```text
Donut Chart
Persentase
Legend kategori
```

## Tren Bulanan

Bandingkan:

```text
Pemasukan
vs
Pengeluaran
```

untuk beberapa bulan.

Contoh:

```text
Agu
Sep
Okt
```

---

# 15. Bottom Navigation

Urutan:

```text
Beranda
Riwayat
Tambah
Ringkasan
Profil
```

Tombol Tambah dibuat lebih menonjol dengan warna orange sesuai desain.

---

# 16. Format Mata Uang

Buat:

```text
src/utils/currency.ts
```

```ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
```

Contoh:

```text
50000
```

menjadi:

```text
Rp50.000
```

---

# 17. Loading, Error, dan Empty State

Setiap halaman yang menggunakan API harus menangani:

## Loading

```text
Mengambil data...
```

atau `ActivityIndicator`.

## Error

```text
Gagal mengambil data.

[Coba Lagi]
```

## Empty State

Jika belum ada transaksi pada bulan berjalan:

```text
Belum ada transaksi bulan ini.

[+ Tambah Transaksi]
```

---

# 18. Refresh Data

Setelah:

```text
POST
PUT
DELETE
```

data harus diperbarui.

Contoh:

```text
Tambah Transaksi
        ↓
POST berhasil
        ↓
Kembali ke Beranda
        ↓
Fetch ulang transaksi
        ↓
Data terbaru tampil
```

Hal yang sama berlaku untuk Edit dan Delete.

---

# 19. Mapping UI ke API

| Halaman | Data | API |
|---|---|---|
| Beranda | Transaksi bulan berjalan | `GET /api/transactions` |
| Beranda | Total pemasukan | Perhitungan frontend |
| Beranda | Total pengeluaran | Perhitungan frontend |
| Beranda | Saldo bulan ini | Perhitungan frontend |
| Riwayat | Semua transaksi | `GET /api/transactions` |
| Tambah | Kategori | `GET /api/categories` |
| Tambah | Tambah transaksi | `POST /api/transactions` |
| Edit | Update transaksi | `PUT /api/transactions/[id]` |
| Detail/Edit | Hapus transaksi | `DELETE /api/transactions/[id]` |
| Ringkasan | Data transaksi | `GET /api/transactions` |

---

# 20. Alur Data Final

```text
┌──────────────────────┐
│ React Native FinTrack│
│                      │
│ Beranda              │
│ Riwayat              │
│ Tambah               │
│ Detail               │
│ Edit                 │
│ Ringkasan            │
└──────────┬───────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────────────────┐
│ Next.js API - Vercel            │
│                                 │
│ /api/transactions               │
│ /api/transactions/[id]          │
│ /api/categories                 │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Google Apps Script              │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Google Spreadsheet              │
│ transactions                    │
│ categories                      │
└─────────────────────────────────┘
```

---

# 21. Ketentuan Implementasi

1. Jangan akses Spreadsheet langsung dari React Native.
2. Jangan akses Google Apps Script langsung dari mobile.
3. Semua request melalui Next.js API di Vercel.
4. Beranda hanya menampilkan dan menghitung data bulan berjalan.
5. Riwayat menampilkan seluruh transaksi.
6. Ringkasan menggunakan data transaksi untuk visualisasi.
7. Kategori diambil dari API.
8. Setelah POST, PUT, atau DELETE, data harus di-refresh.
9. Tampilkan loading, error, dan empty state.
10. Pertahankan desain orange, minimalis, rounded card, dan bottom navigation sesuai referensi.
11. Jangan mengubah endpoint backend yang sudah tersedia tanpa kebutuhan.

---

# 22. Urutan Implementasi

```text
1. Setup struktur React Native
        ↓
2. Konfigurasi API_BASE_URL
        ↓
3. GET /api/transactions
        ↓
4. Tampilkan data mentah untuk testing
        ↓
5. Implementasi Beranda
        ↓
6. Filter otomatis bulan berjalan
        ↓
7. Hitung pemasukan, pengeluaran, saldo
        ↓
8. Implementasi Riwayat
        ↓
9. Implementasi Tambah Transaksi
        ↓
10. Integrasi POST
        ↓
11. Detail Transaksi
        ↓
12. Edit dengan PUT
        ↓
13. Delete dengan DELETE
        ↓
14. Ringkasan dan visualisasi
```

---

# 23. Target MVP

Frontend dianggap mencapai MVP jika:

```text
✓ React Native terhubung ke API Vercel
✓ Beranda hanya menampilkan data bulan berjalan
✓ Total pemasukan dapat dihitung
✓ Total pengeluaran dapat dihitung
✓ Saldo bulan ini dapat dihitung
✓ Transaksi terbaru tampil
✓ Riwayat transaksi tampil
✓ Search dan filter berjalan
✓ Tambah transaksi berhasil
✓ Edit transaksi berhasil
✓ Hapus transaksi berhasil
✓ Kategori diambil dari API
✓ Ringkasan menampilkan perhitungan keuangan
✓ Data Spreadsheet berubah melalui alur API
✓ UI mengikuti desain FinTrack
```

---

# 24. Prioritas Saat Ini

Fokus implementasi pertama:

```text
1. API_BASE_URL
2. GET /api/transactions
3. Pastikan data berhasil tampil di React Native
4. Buat Beranda
5. Filter otomatis bulan berjalan
6. Hitung saldo, pemasukan, dan pengeluaran
```

Setelah alur data React Native → Next.js API di Vercel berhasil, baru lanjutkan ke Riwayat, Tambah, Edit, Delete, dan Ringkasan.
