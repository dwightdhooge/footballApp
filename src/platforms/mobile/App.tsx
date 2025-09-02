import React from "react";
import { StatusBar } from "expo-status-bar";
import { ExpoRoot } from "expo-router";
import "@/i18n"; // Initialize i18n

// Type declaration for require.context
declare const require: {
  context: (path: string) => any;
};

// Must be exported or Fast Refresh won't update the context
export function App() {
  return (
    <>
      <StatusBar style="auto" />
      <ExpoRoot context={require.context("./app")} />
    </>
  );
}
