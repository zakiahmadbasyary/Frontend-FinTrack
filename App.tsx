import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  TransactionProvider,
  useTransactionContext,
} from "@/context/TransactionContext";
import RootNavigator from "@/navigation/RootNavigator";
import AppSplashScreen from "@/components/fintrack/AppSplashScreen";

function MainAppContent() {
  const { loading, transactions } = useTransactionContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Tampilkan Splash Screen minimal 1.2 detik agar transisi mulus
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || (loading && transactions.length === 0)) {
    return <AppSplashScreen message="Menyiapkan aplikasi FinTrack..." />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <MainAppContent />
      </TransactionProvider>
    </SafeAreaProvider>
  );
}
