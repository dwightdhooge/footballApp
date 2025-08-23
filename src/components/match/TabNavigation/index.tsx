import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

type TabType = "info" | "events" | "lineups";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  const tabs = [
    { id: "info" as TabType, label: t("tabs.info") },
    { id: "events" as TabType, label: t("tabs.events") },
    { id: "lineups" as TabType, label: t("tabs.lineups") },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      position: "relative",
    },
    activeTab: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 3,
      borderBottomColor: theme.colors.primary,
    },
    tabLabel: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "500",
      color: theme.colors.textSecondary,
    },
    activeTabLabel: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

export default TabNavigation;
