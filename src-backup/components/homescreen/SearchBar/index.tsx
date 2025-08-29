import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  isValid?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder,
  isLoading = false,
  isValid = true,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, isValid);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
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
      </View>
      {!isValid && value.length > 0 && (
        <Text style={styles.errorText}>{t("search.minCharacters")}</Text>
      )}
    </View>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  isValid: boolean
) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      height: 48,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderColor: isValid ? theme.colors.border : theme.colors.error,
      paddingHorizontal: theme.spacing.sm,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
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
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
  });

export default SearchBar;
