/**
 * File: AlertModal.tsx
 * Description: Custom reusable modal for alert messages (success, warning, error)
 * Features optional confirmation and cancel actions.
 *
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

// ─────────────────────────────────────────────
// 🔸 Types
// ─────────────────────────────────────────────

type AlertType = "success" | "warning" | "error";

type AlertModalProps = {
    visible: boolean;            // Whether the modal is shown
    type: AlertType;             // Alert icon and color theme
    title: string;               // Modal title
    message?: string;            // Optional multi-line message
    onClose: () => void;         // Called on cancel or outside tap
    onConfirm?: () => void;      // Optional confirm handler
    confirmText?: string;        // Confirm button label
    cancelText?: string;         // Cancel button label
};

// Maps alert type to icon name
const iconMap: Record<AlertType, string> = {
    success: "checkmark-circle",
    warning: "warning",
    error: "close-circle"
};

// ─────────────────────────────────────────────
// 🔹 Component
// ─────────────────────────────────────────────

export const AlertModal: React.FC<AlertModalProps> = ({
    visible,
    type,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "OK",
    cancelText = "Cancel"
}) => {
    const theme = useTheme();

    // Set icon color based on alert type
    const iconColor = {
        success: theme.success,
        warning: theme.warning,
        error: theme.danger
    }[type];

    // Split message into lines for multiline rendering
    const messageLines = message?.split("\n") || [];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
                <Pressable
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: theme.card,
                            borderWidth: 0,
                            shadowColor: theme.isDark ? "transparent" : "#000",
                            shadowOpacity: theme.isDark ? 0 : 0.1,
                            elevation: theme.isDark ? 0 : 6
                        }
                    ]}
                >
                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <Ionicons
                            name={iconMap[type]}
                            size={48}
                            color={iconColor}
                        />
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, { color: theme.text }]}>
                        {title}
                    </Text>

                    {/* Multiline Message */}
                    {messageLines.map((line, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.message,
                                {
                                    color: theme.secondaryText,
                                    marginBottom:
                                        index === messageLines.length - 1
                                            ? 24
                                            : 4
                                }
                            ]}
                        >
                            {line}
                        </Text>
                    ))}

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        {onConfirm && (
                            <TouchableOpacity onPress={onClose}>
                                <Text
                                    style={[
                                        styles.cancelText,
                                        { color: theme.tertiaryText }
                                    ]}
                                >
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={onConfirm ?? onClose}
                            style={[
                                styles.confirmButton,
                                { backgroundColor: theme.primary }
                            ]}
                        >
                            <Text style={styles.confirmText}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </View>
        </Modal>
    );
};

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24
    },
    modalContainer: {
        width: "100%",
        maxWidth: 400,
        padding: 24,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12
    },
    iconWrapper: {
        alignItems: "center",
        marginBottom: 16
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8
    },
    message: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12
    },
    confirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999
    },
    confirmText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600"
    },
    cancelText: {
        fontSize: 15,
        fontWeight: "400",
        paddingVertical: 10,
        paddingHorizontal: 12
    }
});