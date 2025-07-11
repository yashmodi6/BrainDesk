/**
 * File: ExportButton.tsx
 * Description: Provides a pressable UI for exporting all tasks and settings as a JSON file.
 * Uses Expo FileSystem and Sharing APIs to write and share the exported backup file.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAppSelector } from "@/store/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { AlertModal } from "@/components/AlertModal";

// ─────────────────────────────────────────────
// 🔸 Component: ExportButton
// ─────────────────────────────────────────────

/**
 * Renders a button that exports app data (tasks + settings) as a JSON file.
 * Shows an error modal if export fails.
 */
export default function ExportButton() {
    const theme = useTheme();
    const tasks = useAppSelector(state => state.todo.tasks);
    const settings = useAppSelector(state => state.settings);
    const [modalVisible, setModalVisible] = useState(false); // Controls error modal visibility

    // Called when user presses the export button
    const handleExport = async () => {
        try {
            // Prepare export data as a formatted JSON string
            const exportData = JSON.stringify({ tasks, settings }, null, 2);

            // Define file path in device's document directory
            const fileUri =
                FileSystem.documentDirectory + "braindesk_backup.json";

            // Write the JSON file to disk
            await FileSystem.writeAsStringAsync(fileUri, exportData, {
                encoding: FileSystem.EncodingType.UTF8
            });

            // Trigger share dialog for the JSON file
            await Sharing.shareAsync(fileUri, {
                mimeType: "application/json",
                dialogTitle: "Export BrainDesk Data"
            });
        } catch (error) {
            // Show error modal if something goes wrong
            console.error("Export failed:", error);
            setModalVisible(true);
        }
    };

    return (
        <>
            <Pressable
                onPress={handleExport}
                style={({ pressed }) => [
                    styles.container,
                    { backgroundColor: theme.card },
                    pressed && styles.pressed
                ]}
            >
                <View style={styles.content}>
                    <Ionicons
                        name="download-outline"
                        size={18}
                        color={theme.primary}
                    />
                    <Text style={[styles.label, { color: theme.text }]}>
                        Export Data
                    </Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.tertiaryText}
                />
            </Pressable>

            {/* Error Modal */}
            <AlertModal
                visible={modalVisible}
                type="error"
                title="Export Failed"
                message={`Something went wrong while exporting your data.\n\nPlease try again.`}
                confirmText="OK"
                onClose={() => setModalVisible(false)}
            />
        </>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 1
    },
    pressed: {
        opacity: 0.6 // Visually indicates press interaction
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    label: {
        fontSize: 15,
        fontWeight: "500"
    }
});