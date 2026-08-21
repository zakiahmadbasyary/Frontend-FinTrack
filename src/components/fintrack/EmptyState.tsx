import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "@/components/fintrack/Icon";

interface EmptyStateProps {
  message?: string;
  showAddButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "Belum ada transaksi bulan ini.",
  showAddButton = true,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="history" size={26} color="#F97316" />
      </View>
      <Text style={styles.messageText}>{message}</Text>

      {showAddButton && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => (navigation as any).navigate("AddTransaction")}
        >
          <Text style={styles.buttonText}>+ Tambah Transaksi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  messageText: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
