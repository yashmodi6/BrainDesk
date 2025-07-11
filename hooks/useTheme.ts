/**
 * File: hooks/useTheme.ts
 * Description: Hook to get the current theme object based on user/system preference.
 * Author: BrainDesk Team
 * Last Updated: 2025-07-11
 */

import { Appearance } from "react-native";
import { LightTheme, DarkTheme } from "@/constants/theme";
import { useAppSelector } from "@/store/hooks";

/**
 * useTheme
 *
 * Returns the theme object (`LightTheme` or `DarkTheme`) depending on the user's
 * selected theme mode (`light`, `dark`, or `system`) in settings.
 */
export const useTheme = () => {
  const userPreference = useAppSelector(state => state.settings.themeMode);

  // Get current system theme (light or dark)
  const systemScheme = Appearance.getColorScheme() === "dark" ? "dark" : "light";

  // Decide final scheme based on user setting
  const finalScheme = userPreference === "system" ? systemScheme : userPreference;

  // Return theme object
  return finalScheme === "dark" ? DarkTheme : LightTheme;
};