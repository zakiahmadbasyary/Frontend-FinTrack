import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import BottomTabNavigator from "./BottomTabNavigator";
import TransactionDetailScreen from "@/screens/TransactionDetailScreen";
import EditTransactionScreen from "@/screens/EditTransactionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          headerShown: true,
          title: "Detail Transaksi",
          headerTintColor: "#F97316",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "700", color: "#0F172A" },
        }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{
          headerShown: true,
          title: "Edit Transaksi",
          headerTintColor: "#F97316",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTitleStyle: { fontWeight: "700", color: "#0F172A" },
        }}
      />
    </Stack.Navigator>
  );
}
