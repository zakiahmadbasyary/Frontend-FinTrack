import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useTransactionContext } from "@/context/TransactionContext";
import { deleteTransaction } from "@/services/transactionService";
import { formatCurrency } from "@/utils/currency";
import { formatDateFull } from "@/utils/date";

type DetailRouteProp = RouteProp<RootStackParamList, "TransactionDetail">;

export default function TransactionDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id } = route.params;
  const { transactions, getCategoryById, refreshData } = useTransactionContext();

  const [deleting, setDeleting] = useState(false);

  const transaction = transactions.find((t) => String(t.id) === String(id));
  const category = transaction ? getCategoryById(transaction.category_id) : undefined;

  const isIncome = transaction?.type === "income";

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus transaksi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteTransaction(id);
              await refreshData();
              Alert.alert("Berhasil", "Transaksi telah dihapus.", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (err: any) {
              Alert.alert("Gagal", err?.message || "Gagal menghapus transaksi.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!transaction) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Transaksi tidak ditemukan</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.detailCard}>
        <View style={[styles.iconCircle, isIncome ? styles.incomeCircle : styles.expenseCircle]}>
          <Text style={styles.iconText}>{isIncome ? "↓" : "↑"}</Text>
        </View>

        <View style={[styles.typeBadge, isIncome ? styles.incomeBadge : styles.expenseBadge]}>
          <Text style={[styles.typeBadgeText, isIncome ? styles.incomeBadgeText : styles.expenseBadgeText]}>
            {isIncome ? "PEMASUKAN" : "PENGELUARAN"}
          </Text>
        </View>

        <Text style={[styles.amountText, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Kategori</Text>
          <Text style={styles.infoValue}>
            {category?.name || transaction.category_id || "Transaksi"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tanggal</Text>
          <Text style={styles.infoValue}>{formatDateFull(transaction.date)}</Text>
        </View>

        {transaction.description ? (
          <View style={styles.infoRowVertical}>
            <Text style={styles.infoLabel}>Deskripsi / Catatan</Text>
            <Text style={styles.descriptionValue}>{transaction.description}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("EditTransaction", { id: transaction.id })}
      >
        <Text style={styles.editButtonText}>Edit Transaksi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
        activeOpacity={0.8}
        disabled={deleting}
        onPress={handleDelete}
      >
        {deleting ? (
          <ActivityIndicator color="#DC2626" />
        ) : (
          <Text style={styles.deleteButtonText}>Hapus Transaksi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  incomeCircle: {
    backgroundColor: "#ECFDF5",
  },
  expenseCircle: {
    backgroundColor: "#FEF2F2",
  },
  iconText: {
    fontSize: 30,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  incomeBadge: {
    backgroundColor: "#D1FAE5",
  },
  expenseBadge: {
    backgroundColor: "#FEE2E2",
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  incomeBadgeText: {
    color: "#059669",
  },
  expenseBadgeText: {
    color: "#DC2626",
  },
  amountText: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 20,
  },
  amountIncome: {
    color: "#059669",
  },
  amountExpense: {
    color: "#DC2626",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoRowVertical: {
    width: "100%",
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  descriptionValue: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: "#F97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
