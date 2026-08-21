import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionContext } from "@/context/TransactionContext";
import { formatCurrency } from "@/utils/currency";
import { LoadingState } from "@/components/fintrack/LoadingState";
import { ErrorState } from "@/components/fintrack/ErrorState";
import { EmptyState } from "@/components/fintrack/EmptyState";

export default function SummaryScreen() {
  const { transactions, loading, error, refreshData, getCategoryById } =
    useTransactionContext();

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalBalance = totalIncome - totalExpense;

  const expenseByCategory = useMemo(() => {
    const expenseTrx = transactions.filter((t) => t.type === "expense");
    const map: Record<string, number> = {};

    expenseTrx.forEach((t) => {
      const catId = t.category_id || "Uncategorized";
      map[catId] = (map[catId] || 0) + Number(t.amount || 0);
    });

    const items = Object.keys(map).map((catId) => {
      const category = getCategoryById(catId);
      const amount = map[catId];
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        catId,
        name: category?.name || catId,
        amount,
        percentage,
      };
    });

    return items.sort((a, b) => b.amount - a.amount);
  }, [transactions, totalExpense, getCategoryById]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ringkasan Keuangan</Text>
        <Text style={styles.subtitle}>
          Analisis keseluruhan pengeluaran & pemasukan
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} colors={["#F97316"]} />
        }
      >
        {loading && transactions.length === 0 ? (
          <LoadingState message="Membuat laporan ringkasan..." />
        ) : error && transactions.length === 0 ? (
          <ErrorState message={error} onRetry={refreshData} />
        ) : transactions.length === 0 ? (
          <EmptyState message="Belum ada data transaksi." />
        ) : (
          <>
            <View style={styles.overviewGrid}>
              <View style={[styles.overviewCard, styles.balanceCard]}>
                <Text style={styles.overviewLabel}>Total Sisa Saldo</Text>
                <Text style={styles.balanceValue}>{formatCurrency(totalBalance)}</Text>
              </View>

              <View style={styles.rowGrid}>
                <View style={[styles.overviewCard, styles.halfCard, styles.incomeCard]}>
                  <Text style={styles.overviewLabel}>Pemasukan</Text>
                  <Text style={styles.incomeValue}>{formatCurrency(totalIncome)}</Text>
                </View>

                <View style={[styles.overviewCard, styles.halfCard, styles.expenseCard]}>
                  <Text style={styles.overviewLabel}>Pengeluaran</Text>
                  <Text style={styles.expenseValue}>{formatCurrency(totalExpense)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Pengeluaran per Kategori</Text>
              <Text style={styles.sectionSubtitle}>
                Analisis persentase dari keseluruhan pengeluaran
              </Text>

              {expenseByCategory.length === 0 ? (
                <Text style={styles.noDataText}>
                  Belum ada transaksi pengeluaran.
                </Text>
              ) : (
                expenseByCategory.map((item) => (
                  <View key={item.catId} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{item.name}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)
                      </Text>
                    </View>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${Math.min(100, Math.max(0, item.percentage))}%` },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
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
    paddingBottom: 12,
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
  overviewGrid: {
    marginBottom: 16,
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceCard: {
    backgroundColor: "#1E293B",
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  rowGrid: {
    flexDirection: "row",
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  incomeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
  },
  expenseValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 13,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  categoryItem: {
    marginBottom: 14,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 4,
  },
});
