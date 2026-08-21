import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator,
  StatusBar,
} from "react-native";

interface AppSplashScreenProps {
  message?: string;
}

export default function AppSplashScreen({
  message = "Menyiapkan data transaksi...",
}: AppSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appTitle}>FinTrack</Text>
        <Text style={styles.appSubtitle}>Manajemen Keuangan Cerdas</Text>

        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#F97316" />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FinTrack Mobile • v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 22,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
    marginBottom: 36,
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  footer: {
    position: "absolute",
    bottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
