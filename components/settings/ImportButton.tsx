/**
 * File: ImportButton.tsx
 * Description: Allows the user to import a JSON backup file and merge it with current data.
 * Uses Expo DocumentPicker and FileSystem for file access, and validates task/settings structure.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTheme } from "@/hooks/useTheme";
import { mergeTasks, Task } from "@/features/todo/todoSlice";
import { mergeSettings } from "@/features/settings/settingsSlice";
import { AlertModal } from "@/components/AlertModal";

// ─────────────────────────────────────────────
// 🔸 Component: ImportButton
// ─────────────────────────────────────────────

/**
 * Imports JSON backup and merges tasks and settings into current Redux state.
 * Shows modal alerts on success, warning (nothing to import), or error.
 */
export default function ImportButton() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const currentTasks = useAppSelector(state => state.todo.tasks);

    const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
    const [alertTitle, setAlertTitle] = useState(""); // Modal title
    const [alertMessage, setAlertMessage] = useState(""); // Modal message
    const [alertType, setAlertType] = useState<"success" | "warning" | "error">(
        "success"
    ); // Modal type

    /**
     * Shows a styled alert modal with provided type and message.
     * @param type - Type of modal (success, warning, error)
     * @param title - Title of the alert
     * @param message - Message shown in modal
     */
    const showAlert = (
        type: "success" | "warning" | "error",
        title: string,
        message: string
    ) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setModalVisible(true);
    };

    // Handles import flow: pick file, validate structure, merge into state
    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true
            });

            // Exit early if user cancels or file is invalid
            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const file = result.assets[0];
            const content = await FileSystem.readAsStringAsync(file.uri);
            const parsed = JSON.parse(content);

            // Validate backup file structure
            if (!Array.isArray(parsed.tasks)) {
                throw new Error("Invalid format: 'tasks' array missing.");
            }

            if (typeof parsed.settings !== "object" || parsed.settings === null) {
                throw new Error("Invalid format: 'settings' object missing.");
            }

            // Filter only valid task objects
            const validTasks: Task[] = parsed.tasks.filter(
                (t: any) =>
                    t &&
                    typeof t.id === "string" &&
                    typeof t.text === "string" &&
                    typeof t.subject === "string" &&
                    typeof t.priority === "string" &&
                    typeof t.createdAt === "string"
            );

            // Prevent duplicate imports
            const existingIds = new Set(currentTasks.map(t => t.id));
            const newTasks = validTasks.filter(t => !existingIds.has(t.id));

            // No new data to import
            if (newTasks.length === 0) {
                showAlert("warning", "Nothing to Import", "No new tasks found to merge.");
                return;
            }

            // Merge new tasks and settings into store
            dispatch(mergeTasks(validTasks));
            dispatch(mergeSettings(parsed.settings));

            // Show success
            showAlert(
                "success",
                "Import Successful",
                `${newTasks.length} new tasks merged.`
            );
        } catch (err: any) {
            // Handle malformed file or unexpected failure
            showAlert("error", "Import Failed", err.message || "Could not import data.");
        }
    };

    return (
        <>
            <Pressable
                onPress={handleImport}
                style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: theme.card },
                    pressed && { opacity: 0.6 }
                ]}
            >
                <View style={styles.iconLabel}>
                    <Ionicons
                        name="cloud-upload-outline"
                        size={18}
                        color={theme.primary}
                    />
                    <Text style={[styles.text, { color: theme.text }]}>
                        Import Data
                    </Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.tertiaryText}
                />
            </Pressable>

            {/* Modal alert based on import outcome */}
            <AlertModal
                visible={modalVisible}
                type={alertType}
                title={alertTitle}
                message={alertMessage}
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
    row: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 1
    },
    iconLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    text: {
        fontSize: 15,
        fontWeight: "500"
    }
});