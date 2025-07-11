/**
 * File: store/index.ts
 * Description: Redux store configuration for BrainDesk.
 * Combines all slices and exports typed hooks for dispatch and state.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/features/todo/todoSlice";
import settingsReducer from "@/features/settings/settingsSlice";

// ==========================
// Configure Store
// ==========================

export const store = configureStore({
    reducer: {
        todo: todoReducer,        // Task-related state
        settings: settingsReducer // App settings (theme, subjects, notifications)
    }
});

// ==========================
// Types
// ==========================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;