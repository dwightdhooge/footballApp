import React, { useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWebTheme } from "../context/WebThemeProvider";
import { useTranslation } from "react-i18next";
import { useSearch } from "@/context/SearchContext";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSearchPress?: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  onSearchPress,
  placeholder,
  isLoading = false,
}) => {
  const { theme } = useWebTheme();
  const { t } = useTranslation();
  const { performSearch } = useSearch();

  const styles = getStyles(theme);

  // Debounced search effect
  useEffect(() => {
    if (value.length > 0) {
      const timeoutId = setTimeout(() => {
        performSearch(value);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [value, performSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || t("homescreen.searchPlaceholder")}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.loadingIndicator}
          />
        )}
        {value.length > 0 && !isLoading && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {onSearchPress && (
          <TouchableOpacity
            onPress={onSearchPress}
            style={styles.searchIconContainer}
          >
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.primary}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useWebTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: 600,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      height: 48,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.sm,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
    },
    loadingIndicator: {
      marginLeft: theme.spacing.sm,
    },
    clearButton: {
      padding: 2,
      marginLeft: theme.spacing.sm,
    },
    searchIconContainer: {
      padding: 2,
      marginLeft: theme.spacing.sm,
    },
    searchIcon: {
      // No margin needed for right icon
    },
  });
