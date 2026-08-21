import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionContext } from "@/context/TransactionContext";
import { TransactionCard } from "@/components/fintrack/TransactionCard";
import { LoadingState } from "@/components/fintrack/LoadingState";
import { ErrorState } from "@/components/fintrack/ErrorState";
import { EmptyState } from "@/components/fintrack/EmptyState";
import MonthSelector from "@/components/fintrack/MonthSelector";
import { isSameMonthYear, getMonthYearName } from "@/utils/date";
import Icon from "@/components/fintrack/Icon";

type FilterType = "all" | "income" | "expense";

export default function HistoryScreen() {
  const { transactions, loading, error, refreshData } = useTransactionContext();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [showAllMonths, setShowAllMonths] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const handleChangeMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowAllMonths(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Filter Bulan & Tahun jika tidak pilih "Semua Bulan"
      if (!showAllMonths) {
        if (!isSameMonthYear(t.date, selectedYear, selectedMonth)) {
          return false;
        }
      }

      // Filter Tipe Transaksi
      if (filterType !== "all" && t.type !== filterType) {
        return false;
      }

      // Filter Pencarian
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const descMatch = t.description?.toLowerCase().includes(query);
        const catMatch = t.category_id?.toLowerCase().includes(query);
        const amountMatch = t.amount?.toString().includes(query);
        return descMatch || catMatch || amountMatch;
      }

      return true;
    });
  }, [transactions, selectedYear, selectedMonth, showAllMonths, filterType, searchQuery]);

  const monthYearLabel = getMonthYearName(selectedYear, selectedMonth);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <Text style={styles.subtitle}>Daftar seluruh catatan pemasukan & pengeluaran</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} colors={["#F97316"]} />
        }
      >
        {/* Toggle & Filter Bulan */}
        <View style={styles.monthSection}>
          <View style={styles.monthHeaderRow}>
            <Text style={styles.sectionLabel}>
              {showAllMonths
                ? "Menampilkan: Semua Bulan"
                : `Menampilkan: ${monthYearLabel}`}
            </Text>

            <TouchableOpacity
              style={[
                styles.allMonthsChip,
                showAllMonths && styles.allMonthsChipActive,
              ]}
              onPress={() => setShowAllMonths(!showAllMonths)}
            >
              <Text
                style={[
                  styles.allMonthsChipText,
                  showAllMonths && styles.allMonthsChipTextActive,
                ]}
              >
                {showAllMonths ? "✓ Semua Bulan" : "Lihat Semua Bulan"}
              </Text>
            </TouchableOpacity>
          </View>

          {!showAllMonths && (
            <MonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onChangeMonth={handleChangeMonth}
            />
          )}
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={{ marginRight: 8 }}>
            <Icon name="search" size={16} color="#94A3B8" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transaksi atau kategori..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tipe Transaksi */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filterType === "all" && styles.filterChipActive]}
            onPress={() => setFilterType("all")}
          >
            <Text style={[styles.filterText, filterType === "all" && styles.filterTextActive]}>
              Semua Tipe
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterType === "income" && styles.filterChipActive]}
            onPress={() => setFilterType("income")}
          >
            <Text style={[styles.filterText, filterType === "income" && styles.filterTextActive]}>
              Pemasukan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterType === "expense" && styles.filterChipActive]}
            onPress={() => setFilterType("expense")}
          >
            <Text style={[styles.filterText, filterType === "expense" && styles.filterTextActive]}>
              Pengeluaran
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hasil Transaksi */}
        {loading && transactions.length === 0 ? (
          <LoadingState message="Memuat riwayat transaksi..." />
        ) : error && transactions.length === 0 ? (
          <ErrorState message={error} onRetry={refreshData} />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            message={
              searchQuery.length > 0
                ? "Tidak ada transaksi yang cocok dengan pencarian."
                : showAllMonths
                ? "Belum ada riwayat transaksi."
                : `Tidak ada transaksi pada bulan ${monthYearLabel}.`
            }
            showAddButton={searchQuery.length === 0 && showAllMonths}
          />
        ) : (
          filteredTransactions.map((trx) => <TransactionCard key={trx.id} transaction={trx} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  monthSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  monthHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  allMonthsChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  allMonthsChipActive: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FFEDD5",
  },
  allMonthsChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  allMonthsChipTextActive: {
    color: "#F97316",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  clearIcon: {
    fontSize: 14,
    color: "#94A3B8",
    padding: 4,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
});
