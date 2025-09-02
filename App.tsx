// App.tsx - vervang alles met dit
import React from "react";
import { Platform } from "react-native";

// Import platform-specifieke App
import { App as MobileApp } from "./src/platforms/mobile/App";
import { AppExpoRouter as MobileAppExpoRouter } from "./src/platforms/mobile/AppExpoRouter";
import WebApp from "./src/platforms/web/App";

// Feature flag voor Expo Router migration
const USE_EXPO_ROUTER_MOBILE = true; // Zet op true om Expo Router te testen

export const App = () => {
  if (Platform.OS === "web") {
    return <WebApp />;
  }

  // Mobile: Switch tussen React Navigation en Expo Router
  if (USE_EXPO_ROUTER_MOBILE) {
    return <MobileAppExpoRouter />;
  }

  return <MobileApp />;
};
