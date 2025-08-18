import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

interface CupHeaderProps {
  title?: string;
}

const CupHeader: React.FC<CupHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>{t("common.back")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    backButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      marginRight: theme.spacing.md,
    },
    backText: {
      color: theme.colors.primary,
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
    },
    title: {
      flex: 1,
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
    },
  });

export default CupHeader;
