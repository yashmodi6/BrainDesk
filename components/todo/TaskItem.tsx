/**
 * File: TaskItem.tsx
 * Description: Renders a single swipeable to-do task item.
 * Supports completion toggle, swipe-to-edit, and swipe-to-delete with haptics and theming.
 *
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import React, { useMemo, useRef } from "react";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
    GestureHandlerRootView,
    Swipeable
} from "react-native-gesture-handler";

import { useAppDispatch } from "@/store/hooks";
import { toggleTask, deleteTask, Task } from "@/features/todo/todoSlice";
import { useTheme } from "@/hooks/useTheme";

// ─────────────────────────────────────────────
// 🔸 Props
// ─────────────────────────────────────────────

type Props = {
    task: Task; // Task data
    onEdit: (task: Task) => void; // Callback to initiate edit mode
};

// ─────────────────────────────────────────────
// 🔸 Component: TaskItem
// ─────────────────────────────────────────────

export default function TaskItem({ task, onEdit }: Props) {
    const dispatch = useAppDispatch();
    const swipeableRef = useRef<Swipeable>(null);
    const theme = useTheme();

    // ─── Mark task as complete/incomplete ─────
    const handleToggleTask = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        dispatch(toggleTask(task.id));
    };

    // ─── Delete task ─────
    const handleDelete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(deleteTask(task.id));
        swipeableRef.current?.close();
    };

    // ─── Trigger edit mode ─────
    const handleEdit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onEdit(task);
        swipeableRef.current?.close();
    };

    // ─── Memoize color based on priority ─────
    const priorityColor = useMemo(() => {
        switch (task.priority) {
            case "High":
                return theme.danger;
            case "Medium":
                return "#F59E0B";
            case "Low":
                return "#10B981";
            default:
                return theme.tertiaryText;
        }
    }, [task.priority, theme]);

    // ─────────────────────────────────────────────
    // 🔹 Swipe Actions
    // ─────────────────────────────────────────────

    const renderRightActions = (
        _: Animated.AnimatedInterpolation,
        dragX: Animated.Value
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 40],
            extrapolate: "clamp"
        });

        return (
            <Animated.View style={styles.swipeDeleteBG}>
                <Animated.View
                    style={[styles.iconButton, { transform: [{ translateX }] }]}
                >
                    <Ionicons name="trash" size={24} color="#fff" />
                </Animated.View>
            </Animated.View>
        );
    };

    const renderLeftActions = (
        _: Animated.AnimatedInterpolation,
        dragX: Animated.Value
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [0, 50],
            outputRange: [-40, 0],
            extrapolate: "clamp"
        });

        return (
            <Animated.View style={styles.swipeEditBG}>
                <Animated.View
                    style={[styles.iconButton, { transform: [{ translateX }] }]}
                >
                    <Ionicons name="create" size={24} color="#fff" />
                </Animated.View>
            </Animated.View>
        );
    };

    // ─────────────────────────────────────────────
    // 🧱 Render
    // ─────────────────────────────────────────────

    return (
        <GestureHandlerRootView>
            <View style={styles.swipeWrapper}>
                <Swipeable
                    ref={swipeableRef}
                    renderRightActions={renderRightActions}
                    renderLeftActions={renderLeftActions}
                    overshootRight={false}
                    overshootLeft={false}
                    rightThreshold={60}
                    leftThreshold={60}
                    onSwipeableRightOpen={handleDelete}
                    onSwipeableLeftOpen={handleEdit}
                >
                    <Pressable
                        onPress={handleToggleTask}
                        style={[
                            styles.taskItem,
                            { backgroundColor: theme.card },
                            task.completed && { opacity: 0.5 }
                        ]}
                        accessibilityLabel={`Task: ${task.text}`}
                        accessible
                    >
                        <View style={styles.row}>
                            <Ionicons
                                name={
                                    task.completed
                                        ? "checkmark-circle"
                                        : "ellipse-outline"
                                }
                                size={20}
                                color={
                                    task.completed
                                        ? "#22C55E"
                                        : theme.tertiaryText
                                }
                                style={{ marginRight: 8 }}
                            />

                            <View>
                                <Text
                                    style={[
                                        styles.taskText,
                                        { color: theme.text },
                                        task.completed && {
                                            textDecorationLine: "line-through"
                                        }
                                    ]}
                                >
                                    {task.text}
                                </Text>

                                <View style={styles.metaRow}>
                                    <Text
                                        style={[
                                            styles.meta,
                                            { color: priorityColor }
                                        ]}
                                    >
                                        {task.priority}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.metaDot,
                                            { color: theme.tertiaryText }
                                        ]}
                                    >
                                        •
                                    </Text>
                                    <Text
                                        style={[
                                            styles.meta,
                                            { color: theme.secondaryText }
                                        ]}
                                    >
                                        {task.subject}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Swipeable>
            </View>
        </GestureHandlerRootView>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    swipeWrapper: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden"
    },
    taskItem: {
        padding: 14
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    taskText: {
        fontSize: 16,
        fontWeight: "500"
    },
    metaRow: {
        flexDirection: "row",
        marginTop: 4,
        alignItems: "center",
        gap: 4
    },
    meta: {
        fontSize: 12
    },
    metaDot: {
        fontSize: 12
    },
    swipeDeleteBG: {
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1
    },
    swipeEditBG: {
        backgroundColor: "#3B82F6",
        justifyContent: "center",
        alignItems: "flex-start",
        flex: 1
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(0,0,0,0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 16
    }
});