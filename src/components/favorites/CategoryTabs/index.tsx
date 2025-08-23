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
  selectedCategory: "countries" | "competitions" | "teams" | "players";
  onCategoryChange: (
    category: "countries" | "competitions" | "teams" | "players"
  ) => void;
  counts: {
    countries: number;
    competitions: number;
    teams: number;
    players: number;
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
      key: "countries",
      label: t("favorites.categories.countries"),
      count: counts.countries,
    },
    {
      key: "competitions",
      label: t("favorites.categories.competitions"),
      count: counts.competitions,
    },
    {
      key: "teams",
      label: t("favorites.categories.teams"),
      count: counts.teams,
    },
    {
      key: "players",
      label: t("favorites.categories.players"),
      count: counts.players,
    },
  ] as const;

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
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() => onCategoryChange(category.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isSelected ? theme.colors.text : theme.colors.text,
                  },
                ]}
              >
                {category.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.text
                      : theme.colors.textSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    {
                      color: isSelected
                        ? theme.colors.primary
                        : theme.colors.background,
                    },
                  ]}
                >
                  {category.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 20,
    alignItems: "center",
  },
  countText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CategoryTabs;
