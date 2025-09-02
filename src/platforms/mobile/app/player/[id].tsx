import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useTheme } from "@/core/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useFavorites } from "@/core/context/FavoritesContext";
import { usePlayerData } from "@/core/hooks/usePlayerData";
import { CachedImage } from "@/components/common/CachedImage";
import { PlaceholderState } from "@/components/utility/PlaceholderState";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isItemFavorite, toggleFavoriteItem } = useFavorites();

  const [activeTab, setActiveTab] = useState<"career" | "stats">("career");
  const styles = getStyles(theme);

  // Safety check for route params
  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <PlaceholderState
          message={t("errors.playerNotFound")}
          icon="alert-circle-outline"
        />
      </SafeAreaView>
    );
  }

  // Simple: just fetch player data by ID
  const {
    playerProfile,
    careerData,
    isLoadingProfile,
    isLoadingCareer,
    profileError,
    careerError,
    refetchProfile,
    refetchCareer,
  } = usePlayerData(parseInt(id));

  const isPlayerFavorite = playerProfile
    ? isItemFavorite(playerProfile, "player")
    : false;

  // Fetch career data on mount
  useEffect(() => {
    refetchCareer();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.getFullYear();
    } catch {
      return dateString;
    }
  };

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Player",
            headerShown: true,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("playerDetail.loadingProfile")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!playerProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Player",
            headerShown: true,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {profileError || t("playerDetail.errorLoadingProfile")}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={refetchProfile}
          >
            <Text
              style={[
                styles.retryButtonText,
                { color: theme.colors.onPrimary },
              ]}
            >
              {t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const player = playerProfile;

  const renderPlayerHeader = () => (
    <View
      style={[
        styles.playerHeader,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.playerInfoContainer}>
        <View style={styles.playerTextInfo}>
          <Text style={[styles.playerName, { color: theme.colors.text }]}>
            {`${player?.firstname} ${player?.lastname}`}
          </Text>

          <View style={styles.playerDetails}>
            {player?.age && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {`${t("playerDetail.age")}: ${player.age}`}
              </Text>
            )}
            {player?.birth?.country && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {`${t("playerDetail.nationality")}: ${player.birth.country}`}
              </Text>
            )}
            {player?.height && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {`${t("playerDetail.height")}: ${player.height}`}
              </Text>
            )}
            {player?.weight && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {`${t("playerDetail.weight")}: ${player.weight}`}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.playerPhotoContainer}>
          <CachedImage
            url={player?.photo}
            size={120}
            fallbackText={t("playerDetail.player")}
          />
        </View>
      </View>

      <View style={styles.playerInfo}>
        <Text
          style={[styles.playerPosition, { color: theme.colors.textSecondary }]}
        >
          {player?.position}
        </Text>
        {player?.number && (
          <Text
            style={[styles.playerNumber, { color: theme.colors.textSecondary }]}
          >
            {`• #${player.number}`}
          </Text>
        )}
      </View>
    </View>
  );

  const renderTabNavigation = () => (
    <View
      style={[
        styles.tabNavigation,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "career" && { borderBottomColor: theme.colors.primary },
        ]}
        onPress={() => setActiveTab("career")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === "career"
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
            },
          ]}
        >
          {t("playerDetail.career")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "stats" && { borderBottomColor: theme.colors.primary },
        ]}
        onPress={() => setActiveTab("stats")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === "stats"
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
            },
          ]}
        >
          {t("playerDetail.statistics")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCareerContent = () => (
    <View style={styles.tabContent}>
      {isLoadingCareer ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("playerDetail.loadingCareer")}
          </Text>
        </View>
      ) : careerError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {careerError}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={refetchCareer}
          >
            <Text
              style={[
                styles.retryButtonText,
                { color: theme.colors.onPrimary },
              ]}
            >
              {t("common.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : careerData.length > 0 ? (
        <View style={styles.careerList}>
          {careerData.map((careerItem, index) => (
            <View
              key={`${careerItem.team.id}-${index}`}
              style={[
                styles.careerItem,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.teamInfo}>
                <CachedImage
                  url={careerItem.team.logo}
                  size={32}
                  fallbackText={t("playerDetail.team")}
                />
                <Text style={[styles.teamName, { color: theme.colors.text }]}>
                  {careerItem.team.name}
                </Text>
              </View>

              <View style={styles.seasonsContainer}>
                {careerItem.seasons.map((season, seasonIndex) => (
                  <Text
                    key={seasonIndex}
                    style={[
                      styles.seasonText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {`${formatDate(season.toString())}${
                      seasonIndex < careerItem.seasons.length - 1 ? ", " : ""
                    }`}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            {t("playerDetail.noCareerData")}
          </Text>
        </View>
      )}
    </View>
  );

  const renderStatsContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.placeholderContainer}>
        <Ionicons
          name="stats-chart"
          size={48}
          color={theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.placeholderText,
            { color: theme.colors.textSecondary },
          ]}
        >
          {t("playerDetail.statisticsComingSoon")}
        </Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "career":
        return renderCareerContent();
      case "stats":
        return renderStatsContent();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title:
            `${player?.firstname || ""} ${player?.lastname || ""}`.trim() ||
            player?.name ||
            "Player",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavoriteItem(player, "player")}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPlayerFavorite ? "heart" : "heart-outline"}
                size={24}
                color={
                  isPlayerFavorite ? theme.colors.error : theme.colors.text
                }
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderPlayerHeader()}
        {renderTabNavigation()}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    favoriteButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.sm,
    },
    playerHeader: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    playerInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      width: "100%",
      marginBottom: theme.spacing.md,
    },
    playerTextInfo: {
      flex: 1,
      marginRight: theme.spacing.lg,
    },
    playerPhotoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: "hidden",
    },
    playerName: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      textAlign: "left",
      marginBottom: theme.spacing.sm,
    },
    playerInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      justifyContent: "center",
    },
    playerPosition: {
      fontSize: theme.typography.body.fontSize,
      marginRight: theme.spacing.sm,
    },
    playerNumber: {
      fontSize: theme.typography.body.fontSize,
    },
    playerDetails: {
      alignItems: "flex-start",
    },
    detailText: {
      fontSize: theme.typography.small.fontSize,
      marginBottom: theme.spacing.xs,
    },
    tabNavigation: {
      flexDirection: "row",
      borderBottomWidth: 1,
    },
    tabButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabText: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
    },
    tabContent: {
      padding: theme.spacing.md,
    },
    loadingContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
    },
    errorContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    errorText: {
      fontSize: theme.typography.body.fontSize,
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
      fontWeight: theme.typography.h3.fontWeight,
    },
    careerList: {
      gap: theme.spacing.md,
    },
    careerItem: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
    },
    teamInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    teamName: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      flex: 1,
    },
    seasonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    seasonText: {
      fontSize: theme.typography.small.fontSize,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
    },
    placeholderContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    placeholderText: {
      fontSize: theme.typography.body.fontSize,
      textAlign: "center",
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
  });
