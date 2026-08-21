# 💰 FinTrack - Frontend Mobile Application

[![React Native](https://img.shields.io/badge/React_Native-0.76.7-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Backend Status](https://img.shields.io/badge/Backend-Next.js%20on%20Vercel-000000?style=flat-square&logo=vercel)](https://fin-track-topaz-six.vercel.app)

**FinTrack** adalah aplikasi mobile berbasis **React Native** yang dirancang untuk membantu pengguna mencatat, memantau, dan menganalisis keuangan pribadi (Pemasukan & Pengeluaran) secara real-time, fleksibel, dan modern.

---

## 📌 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Integrasi API & Endpoint](#-integrasi-api--endpoint)
- [Panduan Memulai](#-panduan-memulai)
- [Desain & Antarmuka](#-desain--antarmuka)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

Aplikasi mobile **FinTrack** ini berfungsi sebagai antarmuka utama pengguna (Frontend) yang menyajikan tampilan finansial yang bersih, intuitif, dan responsif. Aplikasi ini mengintegrasikan seluruh data keuangan melalui backend Next.js yang terhubung ke Google Apps Script dan Google Spreadsheet sebagai basis data terpusat.

### Keunggulan FinTrack:
- 🎨 **Desain Minimalis & Modern**: Mengusung skema warna oranye yang dinamis, kartu berlekuk halus (*rounded card*), dan tipografi yang jelas.
- ⚡ **Performa Tinggi & Ringan**: Dibangun dengan React Native modern (0.76+) dan TypeScript untuk keamanan tipe data.
- 🔄 **Real-Time Synchronized**: Data langsung disinkronkan dengan database cloud via RESTful API.

---

## 🏗️ Arsitektur Sistem

Frontend mobile **tidak berkomunikasi langsung** dengan Google Spreadsheet atau Google Apps Script, melainkan melalui API Gateway Next.js yang di-host di Vercel demi keamanan dan performa terbaik.

```text
┌───────────────────────────┐
│   React Native Android    │  (FinTrack Frontend App)
└─────────────┬─────────────┘
              │  HTTPS REST Requests
              ▼
┌───────────────────────────┐
│   Next.js API di Vercel   │  (Backend Middleware)
└─────────────┬─────────────┘
              │  API Gateway Call
              ▼
┌───────────────────────────┐
│   Google Apps Script      │  (Data Connector)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│    Google Spreadsheet     │  (Central Database Storage)
└───────────────────────────┘
```

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| 🏠 **Beranda (Home)** | Menampilkan ringkasan saldo utama, total pemasukan & pengeluaran bulan berjalan, serta daftar transaksi terbaru. |
| 📜 **Riwayat (History)** | Riwayat seluruh transaksi dengan fitur filter bulan & tahun serta pencarian transaksi. |
| ➕ **Tambah Transaksi** | Formulir pencatatan transaksi baru (Pemasukan / Pengeluaran) lengkap dengan pemilih kategori, tanggal, dan catatan. |
| ✏️ **Edit & Detail Transaksi** | Melihat rincian lengkap transaksi, memperbarui data, atau menghapus transaksi dengan konfirmasi aman. |
| 📊 **Ringkasan (Summary)** | Visualisasi statistik dan analisis alokasi dana per kategori secara persentase dan nominal. |
| 👤 **Profil Pengguna** | Halaman profil yang memuat informasi akun pengguna, status koneksi API, dan konfigurasi aplikasi. |

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: React Native `0.76.7`
- **Bahasa**: TypeScript `5.0.4`
- **Navigasi**: React Navigation v7 (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **State Management**: React Context API (`TransactionContext`)
- **Utilitas Input & UI**:
  - `@react-native-community/datetimepicker`
  - `react-native-safe-area-context`
  - `react-native-screens`

---

## 📁 Struktur Proyek

```text
frontend/
├── App.tsx                      # Entry point aplikasi & Provider setup
├── index.js                     # Registry React Native Root
├── package.json                 # Dependensi proyek & npm scripts
├── src/
│   ├── assets/                  # Asset gambar & logo
│   ├── components/
│   │   └── fintrack/            # Komponen reusabel (Card, Input, Modal, MonthSelector, State)
│   ├── config/                  # Konfigurasi aplikasi & Base URL API
│   ├── context/                 # TransactionContext untuk Global State
│   ├── doc/                     # Dokumentasi teknis proyek
│   ├── navigation/              # BottomTabNavigator & RootNavigator (Stack)
│   ├── screens/                 # Halaman utama aplikasi (Home, History, Add, Edit, Detail, Summary, Profile)
│   ├── services/                # Layer integrasi API (transactionService, categoryService)
│   ├── types/                   # Definisi tipe TypeScript (Transaction, Category, Navigation)
│   └── utils/                   # Formatter (Currency IDR, Format Tanggal Indonesia)
```

---

## 🌐 Integrasi API & Endpoint

Aplikasi terhubung ke backend Next.js yang berjalan pada URL:
`https://fin-track-topaz-six.vercel.app`

### Daftar Endpoint:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/transactions` | Mengambil seluruh daftar transaksi |
| `POST` | `/api/transactions` | Menambahkan transaksi baru |
| `PUT` | `/api/transactions/[id]` | Memperbarui data transaksi berdasarkan ID |
| `DELETE` | `/api/transactions/[id]` | Menghapus transaksi berdasarkan ID |
| `GET` | `/api/categories` | Mengambil daftar kategori transaksi |

---

## 🚀 Panduan Memulai

### Prasyarat

Pastikan perangkat Anda sudah terpasang:
- **Node.js** (v18 atau lebih baru)
- **npm** atau **yarn**
- **Android Studio** (untuk emulator Android & Android SDK)
- **Java Development Kit (JDK)** 17

### Langkah Instalasi

1. **Klon repositori:**
   ```bash
   git clone https://github.com/zakiahmadbasyary/Frontend-FinTrack.git
   cd Frontend-FinTrack
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Metro Bundler:**
   ```bash
   npm start
   ```

4. **Jalankan di emulator / perangkat Android:**
   ```bash
   npm run android
   ```

---

## 🎨 Desain & Antarmuka

- **Warna Utama**: `#F97316` (Vibrant Orange)
- **Warna Latar Belakang**: `#F8FAFC` / `#FFFFFF`
- **Warna Teks**: `#0F172A` (Dark Slate)
- **Card & Border**: Rounded corners (12px - 16px) dengan efek *soft elevation/shadow*.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).

