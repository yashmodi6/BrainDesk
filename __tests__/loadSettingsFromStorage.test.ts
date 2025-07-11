import { loadSettingsFromStorage } from "../features/settings/settingsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("loadSettingsFromStorage", () => {
  it("returns default values if nothing is stored", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadSettingsFromStorage();

    expect(result).toEqual({
      themeMode: "system",
      subjects: ["Physics", "Chemistry", "Math"],
      notificationTime: null,
    });
  });

  it("returns stored values if available", async () => {
    const stored = {
      themeMode: "dark",
      subjects: ["Biology", "History"],
      notificationTime: "08:30",
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(stored));

    const result = await loadSettingsFromStorage();

    expect(result).toEqual(stored);
  });

  it("handles corrupted JSON and falls back to defaults", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("not-a-valid-json");

    const result = await loadSettingsFromStorage();

    expect(result).toEqual({
      themeMode: "system",
      subjects: ["Physics", "Chemistry", "Math"],
      notificationTime: null,
    });
  });
});