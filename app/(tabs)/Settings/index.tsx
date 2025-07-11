/**
 * File: SettingsScreen.tsx
 * Description: Main settings screen of BrainDesk.
 * Allows users to configure theme, subjects, notifications, and app preferences.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-10
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";

// ─────────────────────────────────────────────
// 🔌 Settings Components (Modular UI)
// ─────────────────────────────────────────────
import ThemeModeSelector from "@/components/settings/ThemeModeSelector";
import SubjectManager from "@/components/settings/SubjectManager";
import NotificationSettings from "@/components/settings/NotificationSettings";
import ExportButton from "@/components/settings/ExportButton";
import ImportButton from "@/components/settings/ImportButton";
import DeleteAllButton from "@/components/settings/DeleteAllButton";
import { AppInfo } from "@/components/settings/AppInfo";

/**
 * Renders a scrollable settings screen.
 * Divided into modular sections like theme, tasks, notifications, and app actions.
 */
export default function SettingsScreen() {
    const theme = useTheme();

    /**
     * Utility to render a styled section title.
     *
     * @param title - Title text for the section.
     * @param topOffset - Optional top margin, default is 32.
     * @returns JSX element for section header.
     */
    const renderSectionTitle = (title: string, topOffset = 32) => (
        <Text
            style={[
                styles.sectionTitle,
                { color: theme.text, marginTop: topOffset }
            ]}
            accessibilityRole="header"
        >
            {title}
        </Text>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            {/* ───── 🎨 Appearance Settings ───── */}
            {renderSectionTitle("Appearance", 0)}
            <ThemeModeSelector />

            {/* ───── ✅ Task Preferences ───── */}
            {renderSectionTitle("Task Preferences")}
            <SubjectManager />
            {/* TODO: Add default subject and priority options */}

            {/* ───── 🔔 Notification Settings ───── */}
            {renderSectionTitle("Notifications")}
            <NotificationSettings />

            {/* ───── ⚙️ App Management Tools ───── */}
            {renderSectionTitle("App Management")}
            <ExportButton />
            <ImportButton />
            <DeleteAllButton />

            {/* ───── ℹ️ About Section ───── */}
            {renderSectionTitle("About")}
            <AppInfo />
        </ScrollView>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        padding: 20,
        paddingBottom: 40 // avoids cutoff for last button
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12
    }
});