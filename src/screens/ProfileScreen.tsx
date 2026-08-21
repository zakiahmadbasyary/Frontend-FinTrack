import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Pengguna</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.userCard}>
          <View style={styles.logoCircle}>
            <Image
              source={require("@/assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.userName}>FinTrack User</Text>
          <Text style={styles.userEmail}>user@fintrack.app</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pro Member</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informasi Aplikasi</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Aplikasi</Text>
            <Text style={styles.infoValue}>FinTrack Mobile</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Arsitektur</Text>
            <Text style={styles.infoValue}>React Native CLI</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Backend API</Text>
            <Text style={styles.infoValue}>Vercel + Google Apps Script</Text>
          </View>
        </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
});
