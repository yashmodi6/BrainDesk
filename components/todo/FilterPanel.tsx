/**
 * File: FilterPanel.tsx
 * Description: Animated filter section for Priority, Subject, and Status.
 * Props allow parent control of filters and panel animation.
 *
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";

interface FilterPanelProps {
  filterPriority: string;
  setFilterPriority: (val: string) => void;
  filterSubject: string;
  setFilterSubject: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  heightAnim: Animated.Value;
}

// ─────────────────────────────────────────────
// 🔸 Component: FilterPanel
// ─────────────────────────────────────────────

/**
 * Renders a collapsible animated panel with filter chips.
 * Categories: Priority, Subject (dynamic), Status.
 * Controlled externally via props.
 */
export default function FilterPanel({
  filterPriority,
  setFilterPriority,
  filterSubject,
  setFilterSubject,
  filterStatus,
  setFilterStatus,
  heightAnim
}: FilterPanelProps) {
  const theme = useTheme();
  const subjects = useAppSelector(state => state.settings.subjects);

  return (
    <Animated.View style={[styles.animatedWrapper, { height: heightAnim }]}>
      <View style={[styles.filterContainer, { backgroundColor: theme.background }]}>
        {/* Priority Filter */}
        <Text style={[styles.filterLabel, { color: theme.secondaryText }]}>
          Priority
        </Text>
        <View style={styles.filterRow}>
          {["All", "High", "Medium", "Low"].map(p => (
            <Pressable
              key={p}
              onPress={() => setFilterPriority(p)}
              style={[
                styles.chip,
                { backgroundColor: theme.chipBackground },
                filterPriority === p && { backgroundColor: theme.primary }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.secondaryText },
                  filterPriority === p && {
                    color: "#fff",
                    fontWeight: "600"
                  }
                ]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Subject Filter */}
        <Text style={[styles.filterLabel, { color: theme.secondaryText }]}>
          Subject
        </Text>
        <View style={styles.filterRow}>
          {["All", ...subjects].map(subject => (
            <Pressable
              key={subject}
              onPress={() => setFilterSubject(subject)}
              style={[
                styles.chip,
                { backgroundColor: theme.chipBackground },
                filterSubject === subject && { backgroundColor: theme.primary }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.secondaryText },
                  filterSubject === subject && {
                    color: "#fff",
                    fontWeight: "600"
                  }
                ]}
              >
                {subject}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Status Filter */}
        <Text style={[styles.filterLabel, { color: theme.secondaryText }]}>
          Status
        </Text>
        <View style={styles.filterRow}>
          {["All", "Completed", "Pending"].map(status => (
            <Pressable
              key={status}
              onPress={() => setFilterStatus(status)}
              style={[
                styles.chip,
                { backgroundColor: theme.chipBackground },
                filterStatus === status && { backgroundColor: theme.primary }
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.secondaryText },
                  filterStatus === status && {
                    color: "#fff",
                    fontWeight: "600"
                  }
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  animatedWrapper: {
    overflow: "hidden"
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  chipText: {
    fontSize: 13
  }
});