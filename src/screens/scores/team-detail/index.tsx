import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import {
  useRoute,
  useNavigation,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { ScoresStackParamList } from "@/types/navigation";
import { useTeamData } from "@/hooks";
import { useFavorites } from "@/context/FavoritesContext";
import { LoadingState, ErrorState } from "@/components/common/StateComponents";
import TeamDetailHeader from "@/components/team/TeamDetailHeader";
import TeamInfoSection from "@/components/team/TeamInfoSection";
import VenueSection from "@/components/team/VenueSection";
import { Team } from "@/types/api";

type TeamDetailRouteProp = RouteProp<ScoresStackParamList, "TeamDetail">;
type TeamDetailNavigationProp = NavigationProp<
  ScoresStackParamList,
  "TeamDetail"
>;

interface RouteParams {
  item: Team;
}

const TeamDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<TeamDetailNavigationProp>();
  const route = useRoute<TeamDetailRouteProp>();
  const { item } = route.params;

  const styles = getStyles(theme);

  // Fetch team data
  const { team, isLoading, error, refetch } = useTeamData(item.id);

  // Favorites functionality
  const {
    isItemFavorite,
    addFavoriteItem,
    removeFavoriteItem,
  } = useFavorites();

  const handleToggleFavorite = async () => {
    try {
      if (isItemFavorite(item, "team")) {
        await removeFavoriteItem(`team_${item.id}`, "team");
      } else {
        await addFavoriteItem(item, "team");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LoadingState message={t("teamDetail.loading")} />
      </SafeAreaView>
    );
  }

  if (error || !team) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ErrorState
          error={error || t("teamDetail.errorMessage")}
          title={t("teamDetail.errorTitle")}
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <TeamDetailHeader
          team={team}
          basicTeam={item}
          isFavorite={isItemFavorite(item, "team")}
          onToggleFavorite={handleToggleFavorite}
        />

        <TeamInfoSection team={team} />

        <VenueSection team={team} />
      </ScrollView>
    </SafeAreaView>
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
  });

export default TeamDetailScreen;
