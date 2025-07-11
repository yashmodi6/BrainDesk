/**
 * File: AppInfo.tsx
 * Description: Displays basic application info (version, build, about) in a styled card layout.
 * Uses icons and themes to present data dynamically.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Application from "expo-application";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

// ─────────────────────────────────────────────
// 🔹 Types
// ─────────────────────────────────────────────

/**
 * InfoItem represents a single row of app information.
 * Each item includes an icon, label, value, and optional multiline support.
 */
type InfoItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  multiline?: boolean;
};

// ─────────────────────────────────────────────
// 🔸 Component: AppInfo
// ─────────────────────────────────────────────

/**
 * Renders a card with version, build, and about info.
 * Styled using dynamic theming and responsive layout.
 */
export const AppInfo = () => {
  const theme = useTheme();

  // Define the list of information items to display
  const infoItems: InfoItem[] = [
    {
      icon: "cube-outline",
      label: "Version",
      value: Application.nativeApplicationVersion || "1.0.0",
    },
    {
      icon: "build-outline",
      label: "Build",
      value: Application.nativeBuildVersion || "1",
    },
    {
      icon: "information-circle-outline",
      label: "About",
      value: "BrainDesk is your clean, personal to-do companion.",
      multiline: true,
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.overlay,
        },
      ]}
    >
      {infoItems.map((item, index) => (
        <View key={item.label}>
          <View
            style={[
              styles.row,
              item.multiline && styles.rowMultiline,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={theme.text}
              style={[
                styles.icon,
                item.multiline && styles.iconMultiline,
              ]}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {item.label}
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.secondaryText,
                  },
                  item.multiline && styles.multilineValue,
                ]}
              >
                {item.value}
              </Text>
            </View>
          </View>

          {/* Render divider only between rows */}
          {index < infoItems.length - 1 && (
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.overlay },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    overflow: "hidden",
    elevation: 1,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowMultiline: {
    alignItems: "flex-start", // Aligns multiline content to top
  },
  icon: {
    width: 22,
    marginRight: 12,
    marginTop: 2,
  },
  iconMultiline: {
    marginTop: 3, // Adjust icon alignment for multiline rows
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    marginTop: 4,
    flexShrink: 1,
    lineHeight: 20,
  },
  multilineValue: {
    textAlign: "left",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
});