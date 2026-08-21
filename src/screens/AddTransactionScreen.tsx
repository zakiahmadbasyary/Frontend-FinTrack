import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTransactionContext } from "@/context/TransactionContext";
import { createTransaction } from "@/services/transactionService";
import { TransactionType } from "@/types/transaction";
import { getTodayYMD } from "@/utils/date";

import DatePickerInput from "@/components/fintrack/DatePickerInput";

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { categories, refreshData } = useTransactionContext();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(getTodayYMD());
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    return categories.filter((c) => !c.type || c.type === type);
  }, [categories, type]);

  const handleSubmit = async () => {
    setErrorMsg(null);

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg("Jumlah nominal harus lebih besar dari 0");
      return;
    }

    if (!categoryId) {
      setErrorMsg("Kategori wajib dipilih");
      return;
    }

    if (!date.trim()) {
      setErrorMsg("Tanggal wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      await createTransaction({
        type,
        amount: numericAmount,
        category_id: categoryId,
        date: date.trim(),
        description: description.trim() || undefined,
      });

      await refreshData();

      Alert.alert("Berhasil", "Transaksi baru telah berhasil ditambahkan!", [
        {
          text: "OK",
          onPress: () => {
            setAmount("");
            setCategoryId("");
            setDescription("");
            (navigation as any).navigate("Home");
          },
        },
      ]);
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menyimpan transaksi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Tambah Transaksi</Text>
        <Text style={styles.subtitle}>Catat pengeluaran atau pemasukan baru</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Tipe Transaksi</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeOption, type === "expense" && styles.typeExpenseActive]}
            onPress={() => {
              setType("expense");
              setCategoryId("");
            }}
          >
            <Text
              style={[styles.typeOptionText, type === "expense" && styles.typeOptionTextActive]}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeOption, type === "income" && styles.typeIncomeActive]}
            onPress={() => {
              setType("income");
              setCategoryId("");
            }}
          >
            <Text style={[styles.typeOptionText, type === "income" && styles.typeOptionTextActive]}>
              Pemasukan
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Jumlah Nominal (Rp)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>Rp</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>Pilih Kategori</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {availableCategories.length === 0 ? (
            <Text style={styles.noCatText}>Tidak ada kategori tersedia</Text>
          ) : (
            availableCategories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <DatePickerInput
          value={date}
          onChange={setDate}
          label="Tanggal Transaksi"
        />

        <Text style={styles.label}>Deskripsi / Catatan (Opsional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Contoh: Makan siang bersama teman..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          activeOpacity={0.8}
          disabled={submitting}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Simpan Transaksi</Text>
          )}
        </TouchableOpacity>
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
    paddingBottom: 16,
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
  formContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 14,
  },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 14,
    padding: 4,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  typeExpenseActive: {
    backgroundColor: "#DC2626",
  },
  typeIncomeActive: {
    backgroundColor: "#059669",
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  typeOptionTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    height: 52,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  categoryChipActive: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  noCatText: {
    fontSize: 13,
    color: "#94A3B8",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#F97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
