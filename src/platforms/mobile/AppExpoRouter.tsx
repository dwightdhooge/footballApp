// src/platforms/mobile/AppExpoRouter.tsx
import React from "react";
import { ExpoRoot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/i18n"; // Initialize i18n

export const AppExpoRouter = () => {
  // Context voor mobile app directory
  const ctx = (require as any).context("./app", true, /\.(tsx|ts)$/);

  return (
    <>
      <StatusBar style="auto" />
      <ExpoRoot context={ctx} />
    </>
  );
};
