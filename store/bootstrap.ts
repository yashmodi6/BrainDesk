/**
 * File: store/bootstrap.ts
 * Description: Initializes the app state by loading settings and tasks from AsyncStorage.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { store } from "@/store";
import {
  loadSettings,
  loadSettingsFromStorage
} from "@/features/settings/settingsSlice";
import {
  loadTasksFromStorage
} from "@/features/todo/todoSlice"; // ✅ Async thunk

/**
 * bootstrapApp
 *
 * Loads persisted settings and tasks from AsyncStorage into Redux store.
 * Called during app startup (e.g. in root layout).
 */
export async function bootstrapApp() {
  try {
    // ⚙️ Load saved user settings
    const savedSettings = await loadSettingsFromStorage();
    store.dispatch(loadSettings(savedSettings));

    // ✅ Load tasks using async thunk (ensures fulfillment in extraReducers)
    await store.dispatch(loadTasksFromStorage());
  } catch (error) {
    console.error("App bootstrap failed", error);
  }
}