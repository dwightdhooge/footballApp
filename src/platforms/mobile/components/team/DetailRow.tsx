import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface DetailRowProps {
  label: string;
  value: string | number;
  style?: any;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  style,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.detailRow, style]}>
      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: theme.colors.text }]}>
        {value}
      </Text>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    detailLabel: {
      ...theme.typography.body,
    },
    detailValue: {
      ...theme.typography.body,
      fontWeight: "600",
    },
  });
