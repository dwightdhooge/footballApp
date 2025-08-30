import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "@/core/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { ScoresStackParamList } from "@/core/types/navigation";
import { usePlayerData } from "@/core/hooks/usePlayerData";
import { CachedImage } from "@/components/common/CachedImage";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type PlayerDetailRouteProp = RouteProp<ScoresStackParamList, "PlayerDetail">;
type PlayerDetailNavigationProp = StackNavigationProp<ScoresStackParamList>;

export const PlayerDetailScreen: React.FC = () => {
  const route = useRoute<PlayerDetailRouteProp>();
  const navigation = useNavigation<PlayerDetailNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"career" | "stats">("career");
  const { item: initialPlayerProfile } = route.params;
  const styles = getStyles(theme);

  // Set up header with favorite button
  useLayoutEffect(() => {
    if (initialPlayerProfile?.player?.id) {
      navigation.setOptions({
        headerRight: () => (
          <FavoriteButton
            item={initialPlayerProfile}
            type="player"
            style={styles.headerButton}
          />
        ),
      });
    }
  }, [navigation, initialPlayerProfile, styles.headerButton]);

  // Safety check for route params
  if (!initialPlayerProfile?.player?.id) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {t("playerDetail.invalidPlayerData")}
          </Text>
        </View>
      </View>
    );
  }

  const {
    playerProfile,
    careerData,
    isLoadingProfile,
    isLoadingCareer,
    profileError,
    careerError,
    refetchProfile,
    refetchCareer,
  } = usePlayerData(initialPlayerProfile.player.id, initialPlayerProfile);

  // Add a small delay to ensure data is properly loaded
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (playerProfile) {
      setIsDataReady(true);
    }
  }, [playerProfile]);

  useEffect(() => {
    // Only fetch career data once when component mounts
    refetchCareer();
  }, []); // Empty dependency array - only run once

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
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("playerDetail.loadingProfile")}
          </Text>
        </View>
      </View>
    );
  }

  if (!playerProfile) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
      </View>
    );
  }

  const { player } = playerProfile;

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

  // Don't render content until data is ready
  if (!isDataReady) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("playerDetail.loadingProfile")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderPlayerHeader()}
        {renderTabNavigation()}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    headerButton: {
      paddingHorizontal: theme.spacing.md,
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
