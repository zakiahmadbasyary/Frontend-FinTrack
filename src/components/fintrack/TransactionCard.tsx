import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useTransactionContext } from "@/context/TransactionContext";

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getCategoryById } = useTransactionContext();
  const category = getCategoryById(transaction.category_id);

  const isIncome = transaction.type === "income";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("TransactionDetail", { id: transaction.id })}
    >
      <View style={[styles.iconContainer, isIncome ? styles.iconIncome : styles.iconExpense]}>
        <Text style={[styles.iconText, isIncome ? styles.incomeIconText : styles.expenseIconText]}>
          {isIncome ? "↓" : "↑"}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category?.name || transaction.category_id || "Transaksi"}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description ? transaction.description : formatDate(transaction.date)}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amountText, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconIncome: {
    backgroundColor: "#ECFDF5",
  },
  iconExpense: {
    backgroundColor: "#FEF2F2",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  incomeIconText: {
    color: "#059669",
  },
  expenseIconText: {
    color: "#DC2626",
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#64748B",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  amountIncome: {
    color: "#059669",
  },
  amountExpense: {
    color: "#DC2626",
  },
  dateText: {
    fontSize: 11,
    color: "#94A3B8",
  },
});
