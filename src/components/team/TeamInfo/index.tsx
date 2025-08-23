import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Team } from "../../../types/api";
import { useTheme } from "@/context/ThemeContext";
import CachedImage from "../../common/CachedImage";

interface TeamInfoProps {
  team: Team;
  logoSize?: number;
  nameSize?: number;
  showWinner?: boolean;
  style?: any;
  onPress?: () => void;
  disabled?: boolean;
}

const TeamInfo: React.FC<TeamInfoProps> = ({
  team,
  logoSize = 40,
  nameSize = 14,
  showWinner = false,
  style,
  onPress,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, logoSize, nameSize);

  const TeamContent = () => (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        <CachedImage
          url={team.logo}
          size={logoSize}
          fallbackText="Team"
          borderRadius={logoSize}
          resizeMode="contain"
          ttl={7 * 24 * 60 * 60 * 1000} // 7 days for team logos
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {team.name}
      </Text>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.touchableContainer}
      >
        <TeamContent />
      </TouchableOpacity>
    );
  }

  return <TeamContent />;
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  logoSize: number,
  nameSize: number
) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    touchableContainer: {
      alignItems: "center",
    },
    logoContainer: {
      position: "relative",
      marginBottom: theme.spacing.sm,
    },
    logo: {
      width: logoSize,
      height: logoSize,
      borderRadius: logoSize,
    },
    crown: {
      position: "absolute",
      top: -theme.spacing.xs,
      right: -theme.spacing.xs,
      fontSize: theme.typography.body.fontSize,
    },
    name: {
      fontSize: nameSize,
      fontWeight: "500",
      textAlign: "center",
      color: theme.colors.text,
      maxWidth: logoSize * 2.5,
    },
  });

export default TeamInfo;
