import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { TeamDetail } from "@/types/api";
import { DetailRow } from "./DetailRow";

interface TeamInfoSectionProps {
  team: TeamDetail;
}

export const TeamInfoSection: React.FC<TeamInfoSectionProps> = ({ team }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  return (
    <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("teamDetail.teamInfo")}
      </Text>

      <DetailRow label={t("teamDetail.founded")} value={team.team.founded} />

      <DetailRow
        label={t("teamDetail.type")}
        value={
          team.team.national ? t("teamDetail.national") : t("teamDetail.club")
        }
      />
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    section: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
    },
    sectionTitle: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.md,
    },
  });
