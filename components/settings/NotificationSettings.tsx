/**
 * File: NotificationTimeSelecto.tsx
 * Description: Allows user to select a time for daily notifications/reminders.
 * Supports both Android and iOS DateTimePicker UIs, and syncs time to Redux settings.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 */

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
    Modal
} from "react-native";
import DateTimePicker, {
    DateTimePickerEvent
} from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setNotificationTime } from "@/features/settings/settingsSlice";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

// ─────────────────────────────────────────────
// 🔸 Component: NotificationTimeSelecto
// ─────────────────────────────────────────────

/**
 * Renders a time selector for daily notification reminders.
 * Uses platform-specific picker UIs and updates the Redux store with the chosen time.
 */
export default function NotificationTimeSelecto() {
    const theme = useTheme();
    const dispatch = useDispatch();

    const currentTime = useSelector(
        (state: RootState) => state.settings.notificationTime
    );
    const [showPicker, setShowPicker] = useState(false);

    /**
     * Parse stored time string (e.g., "08:30") into a Date object.
     * Defaults to 08:00 if not set.
     */
    const initialDate = (() => {
        const [h = "08", m = "00"] = currentTime?.split(":") ?? [];
        const date = new Date();
        date.setHours(Number(h), Number(m));
        return date;
    })();

    const [tempTime, setTempTime] = useState<Date>(initialDate);

    /**
     * Called when user confirms a new time.
     * Dispatches the selected time to Redux as "HH:MM" string.
     */
    const handleConfirm = (event: DateTimePickerEvent, selectedTime?: Date) => {
        if (Platform.OS === "android") setShowPicker(false);
        if (selectedTime) {
            const h = selectedTime.getHours().toString().padStart(2, "0");
            const m = selectedTime.getMinutes().toString().padStart(2, "0");
            const timeStr = `${h}:${m}`;
            console.log("[NotificationSelector] Selected time:", timeStr);
            dispatch(setNotificationTime(`${h}:${m}`));
        }
    };

    /**
     * Converts the 24hr string to a user-friendly 12hr format (e.g. "08:30 AM").
     */
    const formatTime = (): string => {
        if (!currentTime) return "Off";
        const [hh, mm] = currentTime.split(":");
        const hour = parseInt(hh, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${mm} ${ampm}`;
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.labelRow}>
                    <Ionicons
                        name="alarm-outline"
                        size={18}
                        color={theme.primary}
                    />
                    <Text style={[styles.label, { color: theme.text }]}>
                        Reminder
                    </Text>
                </View>

                <Pressable
                    onPress={() => setShowPicker(true)}
                    style={({ pressed }) => [
                        styles.timeButton,
                        { backgroundColor: theme.chipBackground },
                        pressed && styles.pressed
                    ]}
                >
                    <Text style={[styles.timeText, { color: theme.text }]}>
                        {formatTime()}
                    </Text>
                </Pressable>
            </View>

            {/* Android Inline Picker */}
            {Platform.OS === "android" && showPicker && (
                <DateTimePicker
                    value={tempTime}
                    mode="time"
                    display="default"
                    onChange={handleConfirm}
                />
            )}

            {/* iOS Modal Picker */}
            {Platform.OS === "ios" && (
                <Modal transparent visible={showPicker} animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View
                            style={[
                                styles.modalCard,
                                { backgroundColor: theme.card }
                            ]}
                        >
                            <DateTimePicker
                                value={tempTime}
                                mode="time"
                                display="spinner"
                                onChange={(e, date) =>
                                    date && setTempTime(date)
                                }
                            />
                            <View style={styles.modalActions}>
                                <Pressable
                                    onPress={() => setShowPicker(false)}
                                    style={styles.cancelBtn}
                                >
                                    <Text style={{ color: theme.tertiaryText }}>
                                        Cancel
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        handleConfirm(null as any, tempTime);
                                        setShowPicker(false);
                                    }}
                                    style={[
                                        styles.confirmBtn,
                                        { backgroundColor: theme.primary }
                                    ]}
                                >
                                    <Text style={styles.confirmText}>Set</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    label: {
        fontSize: 16,
        fontWeight: "500"
    },
    timeButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 999
    },
    timeText: {
        fontSize: 14,
        fontWeight: "500"
    },
    pressed: {
        opacity: 0.7
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000055",
        justifyContent: "center",
        alignItems: "center"
    },
    modalCard: {
        width: "80%",
        borderRadius: 20,
        padding: 20
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 16,
        gap: 12
    },
    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8
    },
    confirmBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10
    },
    confirmText: {
        color: "#fff",
        fontWeight: "600"
    }
});