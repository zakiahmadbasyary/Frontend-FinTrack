import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Mengambil data...",
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <ActivityIndicator size="small" color="#F97316" style={styles.spinner} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginBottom: 12,
  },
  spinner: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
});
