import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/core/context/ThemeContext";
import { useFavorites } from "@/core/context/FavoritesContext";
import { useTeamData } from "@/core/hooks/useTeamData";
import { Ionicons } from "@expo/vector-icons";
import { PlaceholderState } from "@/components/utility/PlaceholderState";

// Components
import { TeamDetailHeader } from "@/components/team/TeamDetailHeader";
import { TeamInfoSection } from "@/components/team/TeamInfoSection";
import { VenueSection } from "@/components/team/VenueSection";

export default function TeamDetailScreen() {
  const { id, name, logo, country } = useLocalSearchParams<{
    id: string;
    name?: string;
    logo?: string;
    country?: string;
  }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isItemFavorite, toggleFavoriteItem } = useFavorites();

  const styles = getStyles(theme);

  // Create a basic team object for favorites and initial display
  const basicTeam = {
    id: parseInt(id),
    name: name || "Team",
    logo: logo || "",
    country: country || "",
  };

  // Hook for all data logic
  const { team: teamInfo, isLoading, error, refetch } = useTeamData(
    parseInt(id)
  );

  const isTeamFavorite = teamInfo
    ? isItemFavorite(teamInfo.team, "team")
    : false;

  const handleRetry = () => {
    refetch();
  };

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.teamNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: basicTeam.name,
            headerShown: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <PlaceholderState
            message={t("teamDetail.loading")}
            icon="hourglass-outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !teamInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: basicTeam.name,
            headerShown: true,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {t("teamDetail.errorTitle")}
          </Text>
          <Text
            style={[styles.errorMessage, { color: theme.colors.textSecondary }]}
          >
            {error || t("teamDetail.errorMessage")}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleRetry}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.retryButtonText,
                { color: theme.colors.onPrimary },
              ]}
            >
              {t("teamDetail.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: teamInfo.team.name || basicTeam.name,
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() =>
                teamInfo && toggleFavoriteItem(teamInfo.team, "team")
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={isTeamFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isTeamFavorite ? theme.colors.error : theme.colors.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <TeamDetailHeader team={teamInfo} basicTeam={basicTeam} />

        <TeamInfoSection team={teamInfo} />

        <VenueSection team={teamInfo} />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    errorTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    errorMessage: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
    },
  });
