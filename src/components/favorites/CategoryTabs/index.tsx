import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

interface CategoryTabsProps {
  selectedCategory: "players" | "teams" | "leagues" | "cups" | "countries";
  onCategoryChange: (
    category: "players" | "teams" | "leagues" | "cups" | "countries"
  ) => void;
  counts: {
    players: number;
    teams: number;
    leagues: number;
    cups: number;
    countries: number;
  };
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
  counts,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const categories = [
    {
      key: "players",
      label: t("favorites.categories.players"),
      count: counts.players,
    },
    {
      key: "teams",
      label: t("favorites.categories.teams"),
      count: counts.teams,
    },
    {
      key: "leagues",
      label: t("favorites.categories.leagues"),
      count: counts.leagues,
    },
    {
      key: "cups",
      label: t("favorites.categories.cups"),
      count: counts.cups,
    },
    {
      key: "countries",
      label: t("favorites.categories.countries"),
      count: counts.countries,
    },
  ] as const;

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.tab,
                isSelected ? styles.tabSelected : styles.tabUnselected,
              ]}
              onPress={() => onCategoryChange(category.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isSelected
                    ? styles.tabLabelSelected
                    : styles.tabLabelUnselected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      justifyContent: "center",
    },
    tabSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    tabUnselected: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    tabLabel: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: theme.typography.caption.fontWeight,
      marginRight: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    tabLabelSelected: {
      color: theme.colors.text,
    },
    tabLabelUnselected: {
      color: theme.colors.text,
    },
    countBadge: {
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      minWidth: 20,
      alignItems: "center",
    },
    countBadgeSelected: {
      backgroundColor: theme.colors.text,
    },
    countBadgeUnselected: {
      backgroundColor: theme.colors.textSecondary,
    },
    countText: {
      fontSize: theme.typography.caption.fontSize,
      fontWeight: "bold",
    },
    countTextSelected: {
      color: theme.colors.primary,
    },
    countTextUnselected: {
      color: theme.colors.background,
    },
  });

export default CategoryTabs;
