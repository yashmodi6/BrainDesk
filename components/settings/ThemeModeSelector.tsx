/**
 *
 * File: ThemeDropdown.tsx
 * Description: Allows user to select app theme (Light / Dark / System).
 * Dropdown is animated and anchored to trigger button location.
 *
 * Author: BrainDesk Team
 * Created: 2025-07-11
 **/

import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    findNodeHandle,
    UIManager,
    ViewStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setThemeMode } from "@/features/settings/settingsSlice";
import { useTheme } from "@/hooks/useTheme";

// Available theme modes
const MODES = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System Default", value: "system" }
] as const;

// ─────────────────────────────────────────────
// 🔸 Component: ThemeDropdown
// ─────────────────────────────────────────────

/**
 * Dropdown menu for selecting application theme.
 * Anchors to its trigger and uses animated visibility.
 */
export default function ThemeDropdown() {
    const dispatch = useAppDispatch();
    const themeMode = useAppSelector(state => state.settings.themeMode);
    const theme = useTheme();

    const [visible, setVisible] = useState(false); // Modal visibility
    const [position, setPosition] = useState({ x: 0, y: 0, width: 150 }); // Trigger position
    const dropdownAnim = useRef(new Animated.Value(0)).current; // Animation driver
    const triggerRef = useRef<View>(null); // Ref for measuring button position

    const currentLabel = MODES.find(m => m.value === themeMode)?.label ?? "";

    /**
     * Opens the dropdown, positioning it based on trigger button.
     */
    const openDropdown = () => {
        if (visible) return; // prevent flicker
        if (triggerRef.current) {
            const node = findNodeHandle(triggerRef.current);
            if (node) {
                UIManager.measureInWindow(node, (x, y, width, height) => {
                    setPosition({ x, y: y + height, width });
                    setVisible(true);
                    Animated.timing(dropdownAnim, {
                        toValue: 1,
                        duration: 180,
                        useNativeDriver: true
                    }).start();
                });
            }
        }
    };

    /**
     * Closes the dropdown with fade/slide animation.
     */
    const closeDropdown = () => {
        Animated.timing(dropdownAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true
        }).start(() => setVisible(false));
    };

    /**
     * Sets the selected theme mode in global state.
     */
    const handleSelect = (value: "light" | "dark" | "system") => {
        dispatch(setThemeMode(value));
        closeDropdown();
    };

    // Animate dropdown position and opacity
    const dropdownTranslateY = dropdownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 0]
    });

    const dropdownOpacity = dropdownAnim;

    /**
     * Renders the modal dropdown.
     */
    const renderDropdown = () => (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={closeDropdown}
        >
            {/* Backdrop press to close */}
            <TouchableWithoutFeedback onPress={closeDropdown}>
                <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            {/* Animated dropdown */}
            <Animated.View
                style={[
                    styles.dropdown,
                    {
                        top: position.y + 4,
                        left: position.x,
                        width: position.width,
                        backgroundColor: theme.card,
                        transform: [{ translateY: dropdownTranslateY }],
                        opacity: dropdownOpacity
                    } as Animated.AnimatedStyleProp<ViewStyle>
                ]}
            >
                {MODES.map(option => (
                    <Pressable
                        key={option.value}
                        onPress={() => handleSelect(option.value)}
                        style={({ pressed }) => [
                            styles.option,
                            pressed && { backgroundColor: theme.overlay }
                        ]}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color:
                                    option.value === themeMode
                                        ? theme.primary
                                        : theme.text,
                                fontWeight:
                                    option.value === themeMode ? "600" : "400"
                            }}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                ))}
            </Animated.View>
        </Modal>
    );

    return (
        <View style={styles.wrapper}>
            {/* Label row */}
            <View style={styles.labelRow}>
                <Ionicons
                    name="color-palette-outline"
                    size={20}
                    color={theme.primary}
                />
                <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
            </View>

            {/* Dropdown trigger */}
            <Pressable
                ref={triggerRef}
                onPress={openDropdown}
                style={[
                    styles.selector,
                    {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.overlay
                    }
                ]}
            >
                <Text style={{ color: theme.text, fontSize: 15 }}>
                    {currentLabel}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={theme.tertiaryText}
                    style={{ marginLeft: 8 }}
                />
            </Pressable>

            {renderDropdown()}
        </View>
    );
}

// ─────────────────────────────────────────────
// 🎨 Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16
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
    selector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        width: 150
    },
    dropdown: {
        position: "absolute",
        borderRadius: 10,
        paddingVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 6,
        zIndex: 9999
    },
    option: {
        paddingHorizontal: 16,
        paddingVertical: 10
    }
});
