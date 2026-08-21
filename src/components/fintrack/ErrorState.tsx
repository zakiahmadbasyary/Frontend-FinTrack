import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Gagal mengambil data.",
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconBadgeText}>!</Text>
      </View>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={onRetry}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconBadgeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#991B1B",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
