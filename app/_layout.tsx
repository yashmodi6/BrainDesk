/**
 * File: app/_layout.tsx
 * Purpose: Root layout for the BrainDesk app using Expo Router and Redux.
 * Loads persisted Redux state (settings, tasks) before rendering the app.
 */

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Slot } from "expo-router";
import { Provider } from "react-redux";

import { store } from "@/store";
import { bootstrapApp } from "@/store/bootstrap";
import { useAppSelector } from "@/store/hooks";

// 🌱 App content rendered after Redux hydration
function AppContent() {
  const notificationTime = useAppSelector(
    state => state.settings.notificationTime
  );

  if (notificationTime === undefined) {
    // ⏳ Settings not yet loaded
    return null;
  }

  return <Slot />;
}

// 🚀 App root layout
export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    bootstrapApp().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff"
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}