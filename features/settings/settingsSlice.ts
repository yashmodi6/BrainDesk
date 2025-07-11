/**
 * File: settingsSlice.ts
 * Description: Redux slice for user settings (theme, subjects, notifications) + AsyncStorage sync.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storageKeys";

/** Theme selection options */
export type ThemeMode = "light" | "dark" | "system";

/** Redux state structure for settings */
type SettingsState = {
    themeMode: ThemeMode;
    subjects: string[];
    notificationTime: string | null;
};

/** Default state values */
const defaultState: SettingsState = {
    themeMode: "system",
    subjects: ["Physics", "Chemistry", "Math"],
    notificationTime: null
};

//
// ─── REDUX SLICE ────────────────────────────────────────────────────────────────
//

const settingsSlice = createSlice({
    name: "settings",
    initialState: defaultState,
    reducers: {
        /** Update theme mode and persist */
        setThemeMode(state, action: PayloadAction<ThemeMode>) {
            state.themeMode = action.payload;
            saveSettingsToStorage({ themeMode: action.payload });
        },

        /** Add a subject if not already in the list */
        addSubject(state, action: PayloadAction<string>) {
            if (!state.subjects.includes(action.payload)) {
                state.subjects.push(action.payload);
                saveSettingsToStorage({ subjects: [...state.subjects] });
            }
        },

        /** Remove subject by name */
        deleteSubject(state, action: PayloadAction<string>) {
            state.subjects = state.subjects.filter(
                subject => subject !== action.payload
            );
            saveSettingsToStorage({ subjects: [...state.subjects] });
        },

        /** Set notification time (or null to disable) */
        setNotificationTime(state, action: PayloadAction<string | null>) {
            state.notificationTime = action.payload;
            saveSettingsToStorage({ notificationTime: action.payload });
        },

        /** Load full or partial state from storage (bootstrapping) */
        loadSettings(state, action: PayloadAction<Partial<SettingsState>>) {
            const { themeMode, subjects, notificationTime } = action.payload;

            if (themeMode !== undefined) {
                state.themeMode = themeMode;
            }

            if (Array.isArray(subjects)) {
                state.subjects = subjects;
            }

            if (
                typeof notificationTime === "string" ||
                notificationTime === null
            ) {
                state.notificationTime = notificationTime;
            }
        },

        /** Merge incoming state with current, deduplicating subjects */
        mergeSettings(state, action: PayloadAction<Partial<SettingsState>>) {
            const incoming = action.payload;

            if (incoming.themeMode) {
                state.themeMode = incoming.themeMode;
            }

            if (Array.isArray(incoming.subjects)) {
                const uniqueSubjects = new Set([
                    ...state.subjects,
                    ...incoming.subjects
                ]);
                state.subjects = Array.from(uniqueSubjects);
            }

            if (
                typeof incoming.notificationTime === "string" ||
                incoming.notificationTime === null
            ) {
                state.notificationTime = incoming.notificationTime;
            }

            saveSettingsToStorage({
                themeMode: state.themeMode,
                subjects: state.subjects,
                notificationTime: state.notificationTime
            });
        },

        /** Reset all settings to default */
        clearSettings(state) {
            state.themeMode = "system";
            state.subjects = ["Physics", "Chemistry", "Math"];
            state.notificationTime = null;
            AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
        }
    }
});

//
// ─── EXPORTS ────────────────────────────────────────────────────────────────────
//

export const {
    setThemeMode,
    addSubject,
    deleteSubject,
    setNotificationTime,
    loadSettings,
    mergeSettings,
    clearSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;

//
// ─── ASYNCSTORAGE HELPERS ───────────────────────────────────────────────────────
//

/**
 * Save partial settings to AsyncStorage (merging with existing).
 */
async function saveSettingsToStorage(partial: Partial<SettingsState>) {
    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        const current = existing ? JSON.parse(existing) : {};
        const merged = { ...current, ...partial };

        await AsyncStorage.setItem(
            STORAGE_KEYS.SETTINGS,
            JSON.stringify(merged)
        );
    } catch (err) {
        console.error("Error saving settings:", err);
    }
}

/**
 * Load settings from AsyncStorage (with fallback to defaults).
 */
export async function loadSettingsFromStorage(): Promise<SettingsState> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        const parsed = json ? JSON.parse(json) : {};
        return {
            themeMode: parsed.themeMode ?? defaultState.themeMode,
            subjects: Array.isArray(parsed.subjects)
                ? parsed.subjects
                : defaultState.subjects,
            notificationTime:
                typeof parsed.notificationTime === "string"
                    ? parsed.notificationTime
                    : defaultState.notificationTime
        };
    } catch (err) {
        console.error("Error loading settings:", err);
        return defaultState;
    }
}
