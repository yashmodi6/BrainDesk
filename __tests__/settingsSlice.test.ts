import settingsReducer, {
  setThemeMode,
  addSubject,
  deleteSubject,
  clearSettings,
  setNotificationTime,
  loadSettings,
  mergeSettings,
  SettingsState
} from "../features/settings/settingsSlice";

describe("settingsSlice", () => {
  const initialState: SettingsState = {
    themeMode: "system",
    subjects: ["Physics", "Chemistry", "Math"],
    notificationTime: null
  };

  it("should return the initial state", () => {
    const result = settingsReducer(undefined, { type: "@@INIT" });
    expect(result).toEqual(initialState);
  });

  it("should set the theme mode", () => {
    const result = settingsReducer(initialState, setThemeMode("dark"));
    expect(result.themeMode).toBe("dark");
  });

  it("should add a subject", () => {
    const result = settingsReducer(initialState, addSubject("Biology"));
    expect(result.subjects).toContain("Biology");
  });

  it("should not add duplicate subject", () => {
    const result = settingsReducer(initialState, addSubject("Physics"));
    const count = result.subjects.filter(s => s === "Physics").length;
    expect(count).toBe(1);
  });

  it("should delete a subject", () => {
    const result = settingsReducer(initialState, deleteSubject("Chemistry"));
    expect(result.subjects).not.toContain("Chemistry");
  });

  it("should clear all settings", () => {
    const modifiedState: SettingsState = {
      themeMode: "dark",
      subjects: ["Art", "Music"],
      notificationTime: "08:00"
    };
    const result = settingsReducer(modifiedState, clearSettings());
    expect(result).toEqual(initialState);
  });

  it("should set the notification time", () => {
    const result = settingsReducer(initialState, setNotificationTime("09:30"));
    expect(result.notificationTime).toBe("09:30");
  });

  it("should load partial settings", () => {
    const result = settingsReducer(initialState, loadSettings({
      themeMode: "light",
      subjects: ["History"]
    }));
    expect(result.themeMode).toBe("light");
    expect(result.subjects).toEqual(["History"]);
    expect(result.notificationTime).toBe(null);
  });

  it("should merge settings and deduplicate subjects", () => {
    const currentState: SettingsState = {
      themeMode: "system",
      subjects: ["Physics", "Chemistry"],
      notificationTime: null
    };

    const result = settingsReducer(currentState, mergeSettings({
      themeMode: "dark",
      subjects: ["Physics", "Biology"],
      notificationTime: "07:00"
    }));

    expect(result.themeMode).toBe("dark");
    expect([...result.subjects].sort()).toEqual(["Physics", "Chemistry", "Biology"].sort());
    expect(result.notificationTime).toBe("07:00");
  });
});