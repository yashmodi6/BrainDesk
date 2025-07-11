/**
 * File: constants/theme.ts
 * Description: Light and dark color schemes used throughout BrainDesk.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

export type Theme = {
    background: string;
    card: string;
    taskcard?: string;
    text: string;
    secondaryText: string;
    tertiaryText: string;
    inputBackground: string;
    chipBackground: string;
    primary: string;
    danger: string;
    success: string;
    warning: string;
    info: string;
    overlay: string;
    isDark?: boolean; // Optional flag for conditional logic
};

export const LightTheme: Theme = {
    background: "#ffffff",
    card: "#f9fafb",
    taskcard: "#ebedf0",
    text: "#111827",
    secondaryText: "#374151",
    tertiaryText: "#6B7280",
    inputBackground: "#F3F4F6",
    chipBackground: "#E5E7EB",
    primary: "#6366F1",
    danger: "#EF4444",
    success: "#22c55e",
    warning: "#facc15",
    info: "#3B82F6",
    overlay: "rgba(0, 0, 0, 0.15)",
    isDark: false
};

export const DarkTheme: Theme = {
    background: "#121212",
    card: "#1f1f1f",
    text: "#ffffff",
    secondaryText: "#d1d5db",
    tertiaryText: "#9ca3af",
    inputBackground: "#2a2a2a",
    chipBackground: "#374151",
    primary: "#8b95f9",
    danger: "#f87171",
    success: "#4ade80",
    warning: "#fde047",
    info: "#60a5fa",
    overlay: "rgba(255, 255, 255, 0.1)",
    isDark: true
};