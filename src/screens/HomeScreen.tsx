import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useTransactionContext } from "@/context/TransactionContext";
import { SummaryCard } from "@/components/fintrack/SummaryCard";
import { TransactionCard } from "@/components/fintrack/TransactionCard";
import { LoadingState } from "@/components/fintrack/LoadingState";
import { ErrorState } from "@/components/fintrack/ErrorState";
import { EmptyState } from "@/components/fintrack/EmptyState";
import MonthSelector from "@/components/fintrack/MonthSelector";
import { isSameMonthYear, getMonthYearName } from "@/utils/date";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { transactions, loading, error, refreshData } = useTransactionContext();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const handleChangeMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const selectedMonthTransactions = useMemo(() => {
    return transactions.filter((t) =>
      isSameMonthYear(t.date, selectedYear, selectedMonth)
    );
  }, [transactions, selectedYear, selectedMonth]);

  const totalIncome = useMemo(() => {
    return selectedMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [selectedMonthTransactions]);

  const totalExpense = useMemo(() => {
    return selectedMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [selectedMonthTransactions]);

  const balance = totalIncome - totalExpense;

  const latestTransactions = useMemo(() => {
    return [...selectedMonthTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [selectedMonthTransactions]);

  const monthYearTitle = getMonthYearName(selectedYear, selectedMonth);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} colors={["#F97316"]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image
              source={require("@/assets/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>Halo, Selamat Datang!</Text>
              <Text style={styles.appName}>FinTrack Mobile</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButtonHeader}
            activeOpacity={0.8}
            onPress={() => (navigation as any).navigate("AddTransaction")}
          >
            <Text style={styles.addButtonText}>+ Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Pemilih Bulan */}
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onChangeMonth={handleChangeMonth}
        />

        {/* Ringkasan Keuangan */}
        <SummaryCard
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          monthName={monthYearTitle}
        />

        {/* Transaksi Terbaru */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Transaksi Terbaru ({monthYearTitle})
          </Text>
          {latestTransactions.length > 0 && (
            <TouchableOpacity onPress={() => (navigation as any).navigate("History")}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && transactions.length === 0 ? (
          <LoadingState message={`Memuat transaksi ${monthYearTitle}...`} />
        ) : error && transactions.length === 0 ? (
          <ErrorState message={error} onRetry={refreshData} />
        ) : latestTransactions.length === 0 ? (
          <EmptyState message={`Belum ada transaksi pada bulan ${monthYearTitle}.`} />
        ) : (
          latestTransactions.map((trx) => <TransactionCard key={trx.id} transaction={trx} />)
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
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    marginRight: 10,
  },
  greeting: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  addButtonHeader: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  addButtonText: {
    color: "#F97316",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F97316",
  },
});
