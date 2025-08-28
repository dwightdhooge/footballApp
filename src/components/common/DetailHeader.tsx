import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import FavoriteButton from "./FavoriteButton";
import { FavoriteItem, FavoriteType } from "@/services/storage/favorites";

interface DetailHeaderTitleProps {
  logo?: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface DetailHeaderButtonProps {
  item: FavoriteItem;
  type: FavoriteType;
  style?: any;
}

export const DetailHeaderTitle: React.FC<DetailHeaderTitleProps> = ({
  logo,
  title,
  subtitle,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.headerTitle}>
      {logo && <View style={styles.logoContainer}>{logo}</View>}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

export const DetailHeaderButton: React.FC<DetailHeaderButtonProps> = ({
  item,
  type,
  style,
}) => {
  return <FavoriteButton item={item} type={type} style={style} />;
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    headerTitle: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoContainer: {
      marginRight: theme.spacing.sm,
    },
    textContainer: {
      flexDirection: "column",
    },
    title: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      lineHeight: theme.typography.h3.fontSize,
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.small.fontSize,
      lineHeight: theme.typography.small.fontSize,
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
    },
  });
