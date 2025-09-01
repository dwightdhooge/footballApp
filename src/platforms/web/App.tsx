// src/platforms/web/App.tsx
import React from "react";
import { ExpoRoot } from "expo-router";

export default function App() {
  // Laat Expo Router routes vinden in src/platforms/web/app
  const ctx = (require as any).context("./app", true, /\.(tsx|ts)$/);
  return <ExpoRoot context={ctx} />;
}
