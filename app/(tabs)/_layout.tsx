import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Platform, View, StyleSheet } from "react-native";
import React from "react";

import { useTheme } from "@/hooks/useTheme";

export default function TabLayout() {
    const theme = useTheme();

    const tabBarHeight = Platform.select({
        ios: 70,
        android: 70,
        default: 60
    });

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.card
                },
                headerTintColor: theme.text,
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopColor: "transparent",
                    height: tabBarHeight
                },
                tabBarItemStyle: {
                    flex: 1
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.tertiaryText,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600"
                },
                tabBarIconStyle: {
                    marginBottom: 2
                },
                tabBarButton: (props) => (
                    <Pressable
                        onPress={props.onPress}
                        android_ripple={{
                            color: theme.overlay,
                            borderless: false
                        }}
                        style={({ pressed }) => [
                            {
                                flex: 1,
                                borderRadius: 10, // Helps ripple stay contained
                                opacity:
                                    Platform.OS === "ios" && pressed ? 0.7 : 1
                            },
                            props.style
                        ]}
                        {...props}
                    >
                        <View style={styles.tabButtonContent}>
                            {props.children}
                        </View>
                    </Pressable>
                )
            }}
        >
            <Tabs.Screen
                name="todo/index"
                options={{
                    title: "To-Do",
                    tabBarLabel: "To-Do",
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="checkbox-outline"
                            size={24}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="Settings/index"
                options={{
                    title: "Settings",
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color={color}
                        />
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabButtonContent: {
        flex: 1,
        justifyContent: "center", // center icon+label within tab
        alignItems: "center"
    }
});