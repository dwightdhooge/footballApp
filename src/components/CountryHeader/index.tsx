import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Country } from "../../types/api";

interface CountryHeaderProps {
  country: Country;
  onBack: () => void;
}

const CountryHeader: React.FC<CountryHeaderProps> = ({ country, onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>{t("common.back")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: 16,
    },
    backText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.primary,
    },
  });

export default CountryHeader;
