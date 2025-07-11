/**
 * File: TaskInputModal.tsx
 * Description: Animated bottom-sheet modal for adding/editing tasks.
 * Handles title input, subject & priority chip selection, and add/update actions.
 *
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
    Dimensions
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";

// 🔸 Constants
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const priorities = ["High", "Medium", "Low"];

// ─────────────────────────────────────────────
// 🔸 Props
// ─────────────────────────────────────────────

type Props = {
    visible: boolean; // Controls visibility of modal
    onClose: () => void; // Callback to close modal
    onAdd: () => void; // Callback to add/update task
    title: string; // Current task title
    setTitle: (text: string) => void; // Update title text
    subject: string; // Selected subject
    setSubject: (subject: string) => void; // Update subject
    priority: string; // Selected priority
    setPriority: (priority: string) => void; // Update priority
    isEditing?: boolean; // Optional flag for edit mode
};

// ─────────────────────────────────────────────
// 🔸 Component: TaskInputModal
// ─────────────────────────────────────────────

export default function TaskInputModal({
    visible,
    onClose,
    onAdd,
    title,
    setTitle,
    subject,
    setSubject,
    priority,
    setPriority,
    isEditing = false
}: Props) {
    const colors = useTheme();
    const subjects = useAppSelector(state => state.settings.subjects);

    // Slide and fade animations
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // ─────────────────────────────────────────────
    // 🎞 Animate modal in/out
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 12,
                    bounciness: 6
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [visible]);

    if (!visible) return null; // Prevent rendering when not needed

    // ─────────────────────────────────────────────
    // 🧱 Render
    // ─────────────────────────────────────────────
    return (
        <Modal
            visible
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Background tap closes modal */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    style={[
                        styles.overlay,
                        { backgroundColor: colors.overlay, opacity: fadeAnim }
                    ]}
                >
                    {/* Inside tap only dismisses keyboard */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    backgroundColor: colors.card,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            {/* Title */}
                            <Text
                                style={[styles.title, { color: colors.text }]}
                            >
                                {isEditing ? "Edit Task" : "New Task"}
                            </Text>

                            {/* Task input */}
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.inputBackground,
                                        color: colors.text
                                    }
                                ]}
                                placeholder="Enter task title"
                                placeholderTextColor={colors.tertiaryText}
                                value={title}
                                onChangeText={setTitle}
                                returnKeyType="done"
                            />

                            {/* Priority selector */}
                            <Text
                                style={[
                                    styles.label,
                                    { color: colors.secondaryText }
                                ]}
                            >
                                Priority
                            </Text>
                            <View style={styles.chipRow}>
                                {priorities.map(p => (
                                    <Pressable
                                        key={p}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor:
                                                    colors.chipBackground
                                            },
                                            priority === p && {
                                                backgroundColor: colors.primary
                                            }
                                        ]}
                                        onPress={() => setPriority(p)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                { color: colors.secondaryText },
                                                priority === p &&
                                                    styles.selectedChipText
                                            ]}
                                        >
                                            {p}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* Subject selector */}
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color: colors.secondaryText,
                                        marginTop: 16
                                    }
                                ]}
                            >
                                Subject
                            </Text>
                            <View style={styles.chipRow}>
                                {subjects.map(s => (
                                    <Pressable
                                        key={s}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor:
                                                    colors.chipBackground
                                            },
                                            subject === s && {
                                                backgroundColor: colors.primary
                                            }
                                        ]}
                                        onPress={() => setSubject(s)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                { color: colors.secondaryText },
                                                subject === s &&
                                                    styles.selectedChipText
                                            ]}
                                        >
                                            {s}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* Footer buttons */}
                            <View style={styles.buttonRow}>
                                <Pressable
                                    style={styles.cancelButton}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        onClose();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.cancelText,
                                            { color: colors.tertiaryText }
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.addButton,
                                        { backgroundColor: colors.primary }
                                    ]}
                                    onPress={onAdd}
                                >
                                    <Text style={styles.addButtonText}>
                                        {isEditing ? "Update" : "Add"}
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end"
    },
    card: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 70,
        minHeight: 320
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16
    },
    input: {
        padding: 14,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 8
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 48,
        alignSelf: "flex-start"
    },
    chipText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "500"
    },
    selectedChipText: {
        color: "#fff",
        fontWeight: "600"
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 28,
        gap: 12
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    cancelText: {
        fontSize: 16
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    }
});
