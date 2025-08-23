import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Team } from "../../../types/api";
import { useTheme } from "@/context/ThemeContext";
import CachedImage from "../../common/CachedImage";

interface TeamInfoProps {
  team: Team;
  logoSize?: number;
  nameSize?: number;
  showWinner?: boolean;
  style?: any;
}

const TeamInfo: React.FC<TeamInfoProps> = ({
  team,
  logoSize = 40,
  nameSize = 14,
  showWinner = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, logoSize, nameSize);

  return (
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
        {showWinner && team.winner && <Text style={styles.crown}>👑</Text>}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {team.name}
      </Text>
    </View>
  );
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
