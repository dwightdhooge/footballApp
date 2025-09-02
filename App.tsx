// App.tsx - vervang alles met dit
import React from "react";
import { Platform } from "react-native";

// Import platform-specifieke App
import { App as MobileApp } from "./src/platforms/mobile/App";
import WebApp from "./src/platforms/web/App";

export const App = () => {
  if (Platform.OS === "web") {
    return <WebApp />;
  }

  // Mobile: Nu volledig Expo Router
  return <MobileApp />;
};
