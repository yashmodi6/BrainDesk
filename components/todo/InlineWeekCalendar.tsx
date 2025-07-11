/**
 * File: InlineWeekCalendar.tsx
 * Description: Horizontal scrollable week-view calendar with "Today" jump button.
 * Dynamically loads past/future weeks as the user scrolls.
 *
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions
} from "react-native";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useTheme } from "@/hooks/useTheme";

// Extend dayjs to support ISO week handling (weeks starting from Monday)
dayjs.extend(isoWeek);

// ─────────────────────────────────────────────
// 🔸 Types and Constants
// ─────────────────────────────────────────────

interface Props {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

const screenWidth = Dimensions.get("window").width;

// ─────────────────────────────────────────────
// 🔸 Component: InlineWeekCalendar
// ─────────────────────────────────────────────

export default function InlineWeekCalendar({ selectedDate, onSelectDate }: Props) {
    const flatListRef = useRef<FlatList>(null);
    const theme = useTheme();
    const today = dayjs();
    const todayStr = today.format("YYYY-MM-DD");

    const [weeks, setWeeks] = useState<dayjs.Dayjs[][]>([]);
    const [showTodayButton, setShowTodayButton] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(2); // Centered at today on mount

    // ─────────────────────────────────────────────
    // 🧠 Build initial week list (5 weeks: -2 to +2)
    // ─────────────────────────────────────────────
    useEffect(() => {
        const base = today.startOf("isoWeek");
        const tempWeeks: dayjs.Dayjs[][] = [];

        for (let i = -2; i <= 2; i++) {
            const start = base.add(i, "week");
            const week = Array.from({ length: 7 }, (_, j) => start.add(j, "day"));
            tempWeeks.push(week);
        }

        setWeeks(tempWeeks);

        // Auto-scroll to the current (middle) week on mount
        setTimeout(() => {
            const todayIndex = tempWeeks.findIndex(week =>
                week.some(d => d.isSame(today, "day"))
            );
            if (todayIndex !== -1) {
                flatListRef.current?.scrollToIndex({ index: todayIndex, animated: false });
                setCurrentIndex(todayIndex);
            }
        }, 0);
    }, []);

    // ─────────────────────────────────────────────
    // 📆 Select a date from the calendar
    // ─────────────────────────────────────────────
    const handleSelectDate = (date: string) => {
        onSelectDate(date);
        setShowTodayButton(date !== todayStr);
    };

    // 🔁 Jump back to today
    const scrollToToday = () => {
        const index = weeks.findIndex(week =>
            week.some(d => d.isSame(today, "day"))
        );
        flatListRef.current?.scrollToIndex({ index, animated: true });
        onSelectDate(todayStr);
        setShowTodayButton(false);
    };

    // 🧱 Add past/future weeks as needed on scroll
    const loadMoreWeeks = (direction: "left" | "right") => {
        if (direction === "left") {
            const first = weeks[0][0].subtract(2, "week").startOf("isoWeek");
            const newWeeks: dayjs.Dayjs[][] = [];
            for (let i = 0; i < 2; i++) {
                const start = first.add(i, "week");
                newWeeks.push(Array.from({ length: 7 }, (_, j) => start.add(j, "day")));
            }
            setWeeks(prev => [...newWeeks, ...prev]);
            setCurrentIndex(prev => prev + 2);
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: currentIndex + 2,
                    animated: false
                });
            }, 0);
        } else {
            const last = weeks[weeks.length - 1][0].add(1, "week").startOf("isoWeek");
            const newWeeks: dayjs.Dayjs[][] = [];
            for (let i = 0; i < 2; i++) {
                const start = last.add(i, "week");
                newWeeks.push(Array.from({ length: 7 }, (_, j) => start.add(j, "day")));
            }
            setWeeks(prev => [...prev, ...newWeeks]);
        }
    };

    // 🔁 Handle scroll index changes to load more weeks
    const handleMomentumScrollEnd = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(index);

        if (index <= 1) loadMoreWeeks("left");
        else if (index >= weeks.length - 2) loadMoreWeeks("right");
    };

    // ─────────────────────────────────────────────
    // 📅 Render one full week row
    // ─────────────────────────────────────────────
    const renderWeek = ({ item: week }: { item: dayjs.Dayjs[] }) => {
        // Determine visible month label for this week
        const monthCounts: Record<number, number> = {};
        week.forEach(day => {
            const m = day.month();
            monthCounts[m] = (monthCounts[m] || 0) + 1;
        });
        const dominantMonthNum = Number(
            Object.entries(monthCounts).reduce((a, b) => (a[1] >= b[1] ? a : b))[0]
        );
        const dominantYear = week[0].year();
        const dominantMonth = dayjs().month(dominantMonthNum).format("MMMM") + ` ${dominantYear}`;

        return (
            <View style={{ width: screenWidth }}>
                <Text style={[styles.monthLabel, { color: theme.secondaryText }]}>
                    {dominantMonth}
                </Text>

                <View style={styles.weekRow}>
                    {week.map(day => {
                        const dayStr = day.format("YYYY-MM-DD");
                        const isSelected = dayStr === selectedDate;
                        const isToday = day.isSame(today, "day");
                        const isCurrentMonth =
                            day.month() === today.month() && day.year() === today.year();

                        return (
                            <Pressable
                                key={dayStr}
                                onPress={() => handleSelectDate(dayStr)}
                                style={[
                                    styles.dateContainer,
                                    isSelected && { backgroundColor: theme.primary }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        { color: theme.tertiaryText },
                                        !isCurrentMonth && { color: "#9ca3af" },
                                        isToday && { color: "#10B981", fontWeight: "600" },
                                        isSelected && { color: "#fff" }
                                    ]}
                                >
                                    {day.format("dd")}
                                </Text>
                                <Text
                                    style={[
                                        styles.dateText,
                                        { color: theme.text },
                                        !isCurrentMonth && { color: "#9ca3af" },
                                        isToday && { color: "#10B981", fontWeight: "600" },
                                        isSelected && { color: "#fff" }
                                    ]}
                                >
                                    {day.date()}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        );
    };

    // ─────────────────────────────────────────────
    // 📦 Render
    // ─────────────────────────────────────────────
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.overlay
                }
            ]}
        >
            <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                data={weeks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderWeek}
                getItemLayout={(_, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index
                })}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
            />

            {showTodayButton && (
                <Pressable
                    style={[
                        styles.todayButton,
                        { backgroundColor: theme.chipBackground }
                    ]}
                    onPress={scrollToToday}
                >
                    <Text
                        style={[styles.todayButtonText, { color: theme.text }]}
                    >
                        Today
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomWidth: 1
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginTop: 8
    },
    dateContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 12,
        flex: 1
    },
    dayText: {
        fontSize: 12
    },
    dateText: {
        fontSize: 16,
        fontWeight: "500"
    },
    monthLabel: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600"
    },
    todayButton: {
        alignSelf: "center",
        marginTop: 6,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 999
    },
    todayButtonText: {
        fontSize: 13,
        fontWeight: "600"
    }
});