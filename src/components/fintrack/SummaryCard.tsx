import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatCurrency } from "@/utils/currency";

interface SummaryCardProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthName?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  balance,
  totalIncome,
  totalExpense,
  monthName,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Saldo Bulan Ini</Text>
        {monthName ? <Text style={styles.badgeText}>{monthName}</Text> : null}
      </View>

      <Text style={styles.balanceText}>{formatCurrency(balance)}</Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIconIncome}>
            <Text style={styles.incomeArrow}>↓</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Pemasukan</Text>
            <Text style={styles.incomeValue}>{formatCurrency(totalIncome)}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconExpense}>
            <Text style={styles.expenseArrow}>↑</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Pengeluaran</Text>
            <Text style={styles.expenseValue}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F97316", // Primary Orange
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  badgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "600",
  },
  balanceText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIconIncome: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statIconExpense: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  incomeArrow: {
    color: "#D1FAE5",
    fontWeight: "bold",
    fontSize: 16,
  },
  expenseArrow: {
    color: "#FEE2E2",
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
