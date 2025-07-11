/**
 * File: TodoScreen.tsx
 * Description: Renders the main To-Do screen including task creation,
 * filtering, editing, and calendar-based selection.
 * Integrates Redux state with visual and animated components.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-10
 */

import "react-native-get-random-values"; // ✅ UUID polyfill for React Native
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    FlatList,
    Pressable,
    StyleSheet,
    Animated,
    Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    addTask,
    editTask,
    Task,
    loadTasksFromStorage
} from "@/features/todo/todoSlice";

import TaskInputModal from "@/components/todo/TaskInputModal";
import TaskItem from "@/components/todo/TaskItem";
import FilterPanel from "@/components/todo/FilterPanel";
import InlineWeekCalendar from "@/components/todo/InlineWeekCalendar";
import { useTheme } from "@/hooks/useTheme";
import { AlertModal } from "@/components/AlertModal";

/**
 * TodoScreen
 *
 * Displays a weekly calendar, task list, filters, and FAB for adding tasks.
 * Handles both new task creation and task editing.
 */
export default function TodoScreen() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(state => state.todo.tasks);

    // ─────────────────────────────────────────────
    // 🔽 Local UI state
    // ─────────────────────────────────────────────
    const [selectedDate, setSelectedDate] = useState(
        dayjs().format("YYYY-MM-DD")
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const subjects = useAppSelector(state => state.settings.subjects);
    const [subject, setSubject] = useState(subjects[0] || "");
    const [priority, setPriority] = useState("Medium");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);

    // ─────────────────────────────────────────────
    // 🔽 Filter logic
    // ─────────────────────────────────────────────
    const [showFilters, setShowFilters] = useState(false);
    const [filterPriority, setFilterPriority] = useState("All");
    const [filterSubject, setFilterSubject] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const filterHeightAnim = useRef(new Animated.Value(0)).current;

    // 🔄 Load saved tasks from AsyncStorage when component mounts
    useEffect(() => {
        dispatch(loadTasksFromStorage());
    }, []);

    /**
     * Toggles filter panel visibility using height animation.
     */
    const toggleFilters = () => {
        Animated.timing(filterHeightAnim, {
            toValue: showFilters ? 0 : 200,
            duration: 300,
            useNativeDriver: false
        }).start();
        setShowFilters(prev => !prev);
    };

    /**
     * Prepares modal for new task input.
     */
    const handleOpenModal = () => {
        setIsEditing(false);
        setTitle("");
        setSubject(subjects[0] || "");
        setPriority("Medium");
        setModalVisible(true);
    };

    /**
     * Closes modal and resets form state.
     */
    const handleCloseModal = () => {
        setModalVisible(false);
        setTitle("");
        setIsEditing(false);
        setEditId(null);
    };

    /**
     * Dispatches either add or edit task based on `isEditing`.
     * Also validates required fields.
     */
    const handleAddTask = () => {
        if (!title.trim() || !subject || !priority) {
            setAlertVisible(true);
            return;
        }

        if (isEditing && editId) {
            dispatch(
                editTask({
                    id: editId,
                    text: title.trim(),
                    subject,
                    priority,
                    completed: false,
                    createdAt: selectedDate
                })
            );
        } else {
            dispatch(
                addTask({
                    text: title.trim(),
                    subject,
                    priority,
                    createdAt: selectedDate
                })
            );
        }

        handleCloseModal();
    };

    /**
     * Preloads task values into modal for editing.
     *
     * @param task - Task object selected for editing
     */
    const handleEditTask = (task: Task) => {
        setIsEditing(true);
        setEditId(task.id);
        setTitle(task.text);
        setSubject(task.subject);
        setPriority(task.priority);
        setModalVisible(true);
    };

    // 🔍 Filters all tasks based on selected date and filters
    const filteredTasks = tasks.filter(task => {
        const isSameDate = dayjs(task.createdAt).isSame(selectedDate, "day");
        const matchPriority =
            filterPriority === "All" || task.priority === filterPriority;
        const matchSubject =
            filterSubject === "All" || task.subject === filterSubject;
        const matchStatus =
            filterStatus === "All" ||
            (filterStatus === "Completed" && task.completed) ||
            (filterStatus === "Pending" && !task.completed);
        return isSameDate && matchPriority && matchSubject && matchStatus;
    });

    // ✅ Used to determine whether the day has any tasks at all
    const hasTasksForSelectedDate = tasks.some(task =>
        dayjs(task.createdAt).isSame(selectedDate, "day")
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* 📆 Inline calendar at top */}
            <InlineWeekCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
            />

            {/* 🎛 Filter toggle button */}
            {hasTasksForSelectedDate && (
                <Pressable
                    style={[
                        styles.filterToggle,
                        { backgroundColor: theme.primary + "22" }
                    ]}
                    onPress={toggleFilters}
                >
                    <Ionicons
                        name="filter"
                        size={22}
                        color={theme.secondaryText}
                    />
                    <Text
                        style={[
                            styles.filterText,
                            { color: theme.secondaryText }
                        ]}
                    >
                        Filters
                    </Text>
                </Pressable>
            )}

            {/* 🧮 Filter panel (animated) */}
            {hasTasksForSelectedDate && (
                <FilterPanel
                    filterPriority={filterPriority}
                    setFilterPriority={setFilterPriority}
                    filterSubject={filterSubject}
                    setFilterSubject={setFilterSubject}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    heightAnim={filterHeightAnim}
                />
            )}

            {/* 📋 Render tasks or empty state */}
            {hasTasksForSelectedDate ? (
                filteredTasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text
                            style={[
                                styles.emptyText,
                                { color: theme.tertiaryText }
                            ]}
                        >
                            No tasks match current filters.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TaskItem task={item} onEdit={handleEditTask} />
                        )}
                        contentContainerStyle={{
                            padding: 16,
                            paddingBottom: 100
                        }}
                    />
                )
            ) : (
                <View style={styles.emptyContainer}>
                    <Text
                        style={[
                            styles.emptyText,
                            { color: theme.tertiaryText }
                        ]}
                    >
                        You have no todos set for this day. Enjoy 🎉
                    </Text>
                </View>
            )}

            {/* ➕ Floating Action Button to add task */}
            <Pressable
                style={[styles.fab, { backgroundColor: theme.primary }]}
                onPress={handleOpenModal}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            {/* 📝 Task creation/edit modal */}
            <TaskInputModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onAdd={handleAddTask}
                title={title}
                setTitle={setTitle}
                subject={subject}
                setSubject={setSubject}
                priority={priority}
                setPriority={setPriority}
                isEditing={isEditing}
            />

            {/* ⚠️ Alert shown for missing input */}
            <AlertModal
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                type="error"
                title="Missing Information"
                message="Please enter a task title, subject and priority to proceed."
            />
        </View>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    filterToggle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: 12,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 10,
        backgroundColor: "#E5E7EB"
    },
    filterText: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "600"
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32
    },
    emptyText: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center"
    },
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#6366F1",
        borderRadius: 999,
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5
    }
});