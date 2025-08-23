import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { ScoresStackParamList } from "@/types/navigation";
import {
  PlayerProfile,
  PlayerTeam,
  PlayerProfileApiResponse,
} from "@/types/api";
import CachedImage from "@/components/common/CachedImage";
import { Ionicons } from "@expo/vector-icons";

type PlayerDetailRouteProp = RouteProp<ScoresStackParamList, "PlayerDetail">;
type PlayerDetailNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "PlayerDetail"
>;

const PlayerDetailScreen: React.FC = () => {
  const navigation = useNavigation<PlayerDetailNavigationProp>();
  const route = useRoute<PlayerDetailRouteProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"career" | "stats">("career");
  const [careerData, setCareerData] = useState<PlayerTeam[]>([]);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const { item: initialPlayerProfile } = route.params;

  useEffect(() => {
    fetchPlayerProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "career") {
      fetchCareerData();
    }
  }, [activeTab]);

  const fetchPlayerProfile = async () => {
    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const response = await fetch(
        `https://v3.football.api-sports.io/players/profiles?player=${initialPlayerProfile.player.id}`,
        {
          headers: {
            "x-apisports-key": "be585eb3815e94b55b2fdfc52b3e925c",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PlayerProfileApiResponse = await response.json();

      if (data.errors && data.errors.length > 0) {
        throw new Error(`API Error: ${data.errors.join(", ")}`);
      }

      if (data.response && data.response.length > 0) {
        setPlayerProfile(data.response[0]);
      } else {
        // Use initial data if API doesn't return profile
        setPlayerProfile(initialPlayerProfile);
      }
    } catch (err) {
      console.error("Player profile fetch error:", err);
      setProfileError(t("playerDetail.errorLoadingProfile"));
      // Use initial data as fallback
      setPlayerProfile(initialPlayerProfile);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchCareerData = async () => {
    if (careerData.length > 0) return; // Already loaded

    setIsLoadingCareer(true);
    setError(null);

    try {
      const response = await fetch(
        `https://v3.football.api-sports.io/players/teams?player=${initialPlayerProfile.player.id}`,
        {
          headers: {
            "x-apisports-key": "be585eb3815e94b55b2fdfc52b3e925c",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        throw new Error(`API Error: ${data.errors.join(", ")}`);
      }

      setCareerData(data.response || []);
    } catch (err) {
      console.error("Career data fetch error:", err);
      setError(t("playerDetail.errorLoadingCareer"));
    } finally {
      setIsLoadingCareer(false);
    }
  };

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
            onPress={fetchPlayerProfile}
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
            {player.firstname} {player.lastname}
          </Text>

          <View style={styles.playerDetails}>
            {player.age && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("playerDetail.age")}: {player.age}
              </Text>
            )}
            {player.birth?.country && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("playerDetail.nationality")}: {player.birth.country}
              </Text>
            )}
            {player.height && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("playerDetail.height")}: {player.height}
              </Text>
            )}
            {player.weight && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t("playerDetail.weight")}: {player.weight}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.playerPhotoContainer}>
          <CachedImage
            url={player.photo}
            size={120}
            fallbackText={t("playerDetail.player")}
          />
        </View>
      </View>

      <View style={styles.playerInfo}>
        <Text
          style={[styles.playerPosition, { color: theme.colors.textSecondary }]}
        >
          {player.position}
        </Text>
        {player.number && (
          <Text
            style={[styles.playerNumber, { color: theme.colors.textSecondary }]}
          >
            • #{player.number}
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
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={fetchCareerData}
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
                    {formatDate(season.toString())}
                    {seasonIndex < careerItem.seasons.length - 1 ? ", " : ""}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  playerHeader: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  playerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 16,
  },
  playerTextInfo: {
    flex: 1,
    marginRight: 20,
  },
  playerPhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  playerPosition: {
    fontSize: 16,
    marginRight: 8,
  },
  playerNumber: {
    fontSize: 16,
  },
  playerDetails: {
    alignItems: "flex-start",
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  tabNavigation: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  careerList: {
    gap: 16,
  },
  careerItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  seasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  seasonText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

export default PlayerDetailScreen;
