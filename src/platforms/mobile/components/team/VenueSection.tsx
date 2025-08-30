import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { TeamDetail } from "@/types/api";
import { CachedImage } from "@/components/common/CachedImage";
import { DetailRow } from "./DetailRow";

interface VenueSectionProps {
  team: TeamDetail;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ team }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  if (!team.venue) {
    return null;
  }

  return (
    <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("teamDetail.venue")}
      </Text>

      <View style={styles.venueContainer}>
        <CachedImage
          url={team.venue.image}
          size={120}
          fallbackText={team.venue.name.charAt(0)}
          borderRadius={8}
          resizeMode="cover"
          ttl={30 * 24 * 60 * 60 * 1000} // 30 days for venue images
          style={styles.venueImage}
        />

        <View style={styles.venueInfo}>
          <Text style={[styles.venueName, { color: theme.colors.text }]}>
            {team.venue.name}
          </Text>
          <Text
            style={[styles.venueAddress, { color: theme.colors.textSecondary }]}
          >
            {team.venue.address}
          </Text>
          <Text
            style={[styles.venueCity, { color: theme.colors.textSecondary }]}
          >
            {team.venue.city}
          </Text>

          <View style={styles.venueDetails}>
            <DetailRow
              label={t("teamDetail.capacity")}
              value={team.venue.capacity.toLocaleString()}
              style={styles.venueDetailRow}
            />

            <DetailRow
              label={t("teamDetail.surface")}
              value={team.venue.surface}
              style={styles.venueDetailRow}
            />
          </View>
        </View>
      </View>
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
    venueContainer: {
      flexDirection: "row",
    },
    venueImage: {
      marginRight: theme.spacing.md,
    },
    venueInfo: {
      flex: 1,
    },
    venueName: {
      ...theme.typography.h3,
      marginBottom: theme.spacing.xs,
    },
    venueAddress: {
      ...theme.typography.body,
      marginBottom: theme.spacing.xs,
    },
    venueCity: {
      ...theme.typography.body,
      marginBottom: theme.spacing.md,
    },
    venueDetails: {
      gap: theme.spacing.sm,
    },
    venueDetailRow: {
      paddingVertical: theme.spacing.xs, // Smaller padding for venue details
    },
  });


