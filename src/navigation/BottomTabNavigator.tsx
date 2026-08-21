import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { MainTabParamList } from "./types";
import HomeScreen from "@/screens/HomeScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import AddTransactionScreen from "@/screens/AddTransactionScreen";
import SummaryScreen from "@/screens/SummaryScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import Icon from "@/components/fintrack/Icon";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F1F5F9",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color }) => <Icon name="history" color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          title: "Tambah",
          tabBarIcon: () => (
            <View style={styles.addIconBadge}>
              <Text style={styles.addIconText}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          title: "Ringkasan",
          tabBarIcon: ({ color }) => <Icon name="summary" color={color} size={20} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <Icon name="profile" color={color} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
  addIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addIconText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 24,
  },
});
