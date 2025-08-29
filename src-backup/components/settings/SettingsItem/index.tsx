import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  onPress,
  disabled = false,
  showChevron = true,
  icon,
  style,
  children,
}) => {
  const { theme } = useTheme();
  const Container = onPress ? TouchableOpacity : View;

  const styles = getStyles(theme, disabled);

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={disabled ? theme.colors.textSecondary : theme.colors.text}
            />
          </View>
        )}

        <View style={[styles.textContainer, icon && styles.textWithIcon]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {children && <View style={styles.children}>{children}</View>}

        {showChevron && onPress && (
          <View style={styles.chevronContainer}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={
                disabled
                  ? theme.colors.textSecondary
                  : theme.colors.textSecondary
              }
            />
          </View>
        )}
      </View>
    </Container>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  disabled: boolean
) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.spacing.sm,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
      width: 24,
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
    },
    textWithIcon: {
      marginLeft: theme.spacing.xs,
    },
    title: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: "500",
      color: disabled ? theme.colors.textSecondary : theme.colors.text,
    },
    subtitle: {
      fontSize: theme.typography.small.fontSize,
      marginTop: theme.spacing.xs,
      color: theme.colors.textSecondary,
    },
    children: {
      marginLeft: theme.spacing.sm,
    },
    chevronContainer: {
      marginLeft: theme.spacing.sm,
    },
    disabled: {
      opacity: 0.5,
    },
  });

export default SettingsItem;
