import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type IconName =
  | "home"
  | "history"
  | "summary"
  | "profile"
  | "search"
  | "calendar"
  | "plus"
  | "income"
  | "expense";

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
}

export default function Icon({ name, color = "#64748B", size = 20 }: IconProps) {
  switch (name) {
    case "home":
      return (
        <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
          {/* Roof */}
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: size * 0.45,
              borderRightWidth: size * 0.45,
              borderBottomWidth: size * 0.35,
              borderStyle: "solid",
              backgroundColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: color,
            }}
          />
          {/* Base */}
          <View
            style={{
              width: size * 0.65,
              height: size * 0.45,
              backgroundColor: color,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              marginTop: 1,
            }}
          />
        </View>
      );

    case "history":
      return (
        <View
          style={{
            width: size * 0.75,
            height: size * 0.9,
            borderWidth: 1.8,
            borderColor: color,
            borderRadius: 3,
            padding: 2.5,
            justifyContent: "space-around",
          }}
        >
          <View style={{ height: 1.8, backgroundColor: color, borderRadius: 1, width: "100%" }} />
          <View style={{ height: 1.8, backgroundColor: color, borderRadius: 1, width: "75%" }} />
          <View style={{ height: 1.8, backgroundColor: color, borderRadius: 1, width: "90%" }} />
        </View>
      );

    case "summary":
      return (
        <View
          style={{
            width: size,
            height: size,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingHorizontal: 1,
            paddingBottom: 1,
          }}
        >
          <View style={{ width: size * 0.24, height: size * 0.45, backgroundColor: color, borderRadius: 1.5 }} />
          <View style={{ width: size * 0.24, height: size * 0.85, backgroundColor: color, borderRadius: 1.5 }} />
          <View style={{ width: size * 0.24, height: size * 0.65, backgroundColor: color, borderRadius: 1.5 }} />
        </View>
      );

    case "profile":
      return (
        <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
          {/* Head */}
          <View
            style={{
              width: size * 0.4,
              height: size * 0.4,
              borderRadius: (size * 0.4) / 2,
              backgroundColor: color,
              marginBottom: 1,
            }}
          />
          {/* Body */}
          <View
            style={{
              width: size * 0.75,
              height: size * 0.35,
              borderTopLeftRadius: size * 0.35,
              borderTopRightRadius: size * 0.35,
              backgroundColor: color,
            }}
          />
        </View>
      );

    case "search":
      return (
        <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              width: size * 0.62,
              height: size * 0.62,
              borderRadius: (size * 0.62) / 2,
              borderWidth: 1.8,
              borderColor: color,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <View
            style={{
              width: 2,
              height: size * 0.36,
              backgroundColor: color,
              position: "absolute",
              bottom: 1,
              right: 2,
              transform: [{ rotate: "-45deg" }],
            }}
          />
        </View>
      );

    case "calendar":
      return (
        <View
          style={{
            width: size * 0.85,
            height: size * 0.85,
            borderWidth: 1.6,
            borderColor: color,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View style={{ height: size * 0.25, backgroundColor: color }} />
          <View style={{ flex: 1, padding: 1.5, justifyContent: "space-around" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );

    case "income":
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: size * 0.6, fontWeight: "800", marginTop: -1 }}>↓</Text>
        </View>
      );

    case "expense":
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: size * 0.6, fontWeight: "800", marginTop: -1 }}>↑</Text>
        </View>
      );

    case "plus":
      return (
        <Text style={{ color, fontSize: size, fontWeight: "bold", lineHeight: size }}>+</Text>
      );

    default:
      return null;
  }
}
