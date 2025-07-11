/**
 * File: DeleteAllButton.tsx
 * Description: Provides a pressable option to clear all app data (tasks and settings).
 * Shows confirmation and success modals using AlertModal component.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch } from "@/store/hooks";
import { useTheme } from "@/hooks/useTheme";
import { clearTasks } from "@/features/todo/todoSlice";
import { clearSettings } from "@/features/settings/settingsSlice";
import { AlertModal } from "@/components/AlertModal";

// ─────────────────────────────────────────────
// 🔸 Component: DeleteAllButton
// ─────────────────────────────────────────────

/**
 * Renders a "Delete All Data" button.
 * When pressed, prompts user to confirm deletion.
 * On confirmation, clears tasks and settings and shows a success modal.
 */
export default function DeleteAllButton() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [modalVisible, setModalVisible] = useState(false); // Controls warning modal visibility
    const [successVisible, setSuccessVisible] = useState(false); // Controls success modal visibility

    // Triggered when user taps the button — opens warning modal
    const handleDelete = () => {
        setModalVisible(true);
    };

    // Called after user confirms deletion — clears Redux state and shows success
    const confirmDelete = () => {
        dispatch(clearTasks());
        dispatch(clearSettings());
        setModalVisible(false);
        setSuccessVisible(true);
    };

    return (
        <>
            <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                    styles.container,
                    { backgroundColor: theme.card },
                    pressed && styles.pressed
                ]}
            >
                <View style={styles.content}>
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color={theme.danger}
                    />
                    <Text style={[styles.label, { color: theme.danger }]}>
                        Delete All Data
                    </Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.tertiaryText}
                />
            </Pressable>

            {/* Confirmation Modal */}
            <AlertModal
                visible={modalVisible}
                type="warning"
                title="Delete All Data"
                message={`This will permanently delete all your tasks and settings.
This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onClose={() => setModalVisible(false)}
                onConfirm={confirmDelete}
            />

            {/* Success Modal */}
            <AlertModal
                visible={successVisible}
                type="success"
                title="Data Deleted"
                message="All data has been reset."
                onClose={() => setSuccessVisible(false)}
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
        opacity: 0.6 // Reduces opacity when button is pressed
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
