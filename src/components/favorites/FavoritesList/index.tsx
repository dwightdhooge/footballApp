import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteItem, FavoriteType } from "@/services/storage/favorites";
import CountryCard from "../../country/CountryCard";
import LeagueCard from "../../league/LeagueCard";
import TeamCard from "../../team/TeamCard";
import PlayerCard from "../../player/PlayerCard";
import { ScoresStackParamList } from "@/types/navigation";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/common/StateComponents";

interface FavoritesListProps {
  category: "players" | "teams" | "leagues" | "countries";
  favorites: FavoriteItem[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  category,
  favorites,
}) => {
  const navigation = useNavigation<NavigationProp<ScoresStackParamList>>();
  const { theme } = useTheme();
  const { removeFavoriteItem } = useFavorites();
  const { t } = useTranslation();

  const renderFavoriteItem = ({
    item,
    index,
  }: {
    item: FavoriteItem;
    index: number;
  }) => {
    const handlePress = () => {
      switch (category) {
        case "players":
          const playerItem = item as any;
          navigation.navigate("PlayerDetail", { item: playerItem });
          break;
        case "teams":
          const teamItem = item as any;
          navigation.navigate("TeamDetail", { item: teamItem });
          break;
        case "leagues":
          const leagueItem = item as any;
          if (leagueItem.league.type === "League") {
            navigation.navigate("LeagueDetail", { item: leagueItem });
          } else {
            navigation.navigate("CupDetail", { item: leagueItem });
          }
          break;
        case "countries":
          const countryItem = item as any;
          navigation.navigate("CountryDetail", { item: countryItem });
          break;
      }
    };

    const handleRemove = async (item: FavoriteItem, category: string) => {
      try {
        const itemId = getItemId(item, category);
        const favoriteType = getFavoriteType(category);
        await removeFavoriteItem(itemId, favoriteType);
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    };

    const getFavoriteType = (category: string): FavoriteType => {
      switch (category) {
        case "players":
          return "player";
        case "teams":
          return "team";
        case "leagues":
          return "leagues";
        case "countries":
          return "country";
        default:
          return "country";
      }
    };

    const renderCard = () => {
      switch (category) {
        case "players":
          const player = item as any;
          return (
            <PlayerCard
              id={player.player.id}
              name={player.player.name}
              photo={player.player.photo}
              position={player.player.position}
              onPress={handlePress}
              onRemove={() => handleRemove(item, category)}
              size="small"
            />
          );
        case "teams":
          const team = item as any;
          return (
            <TeamCard
              id={team.id}
              name={team.name}
              logo={team.logo}
              onPress={handlePress}
              onRemove={() => handleRemove(item, category)}
              size="small"
            />
          );
        case "leagues":
          const leagueItem = item as any;
          return (
            <LeagueCard
              id={leagueItem.league.id}
              name={leagueItem.league.name}
              logo={leagueItem.league.logo}
              type={leagueItem.league.type}
              onPress={handlePress}
              onRemove={() => handleRemove(item, category)}
              size="small"
            />
          );
        case "countries":
          return (
            <CountryCard
              name={(item as any).name}
              code={(item as any).code}
              flag={(item as any).flag}
              onPress={handlePress}
              onRemove={() => handleRemove(item, category)}
              size="small"
            />
          );
        default:
          return null;
      }
    };

    return <View style={styles.cardContainer}>{renderCard()}</View>;
  };

  const getItemId = (item: FavoriteItem, category: string): string => {
    switch (category) {
      case "players":
        const player = item as any;
        return `player_${player.player.id}`;
      case "teams":
        const team = item as any;
        return `team_${team.id}`;
      case "leagues":
        const leagueItem = item as any;
        return `leagues_${leagueItem.league.id}`;
      case "countries":
        const country = item as any;
        return `country_${country.code}`;
      default:
        return `unknown_${Date.now()}`;
    }
  };

  const getItemLayout = (data: any, index: number) => ({
    length: 116, // 100 (height) + 16 (marginBottom)
    offset: Math.floor(index / 3) * 116, // 3 kolommen per rij
    index,
  });

  const styles = getStyles(theme);

  const getEmptyStateMessage = () => {
    switch (category) {
      case "players":
        return t("favorites.emptyPlayers");
      case "teams":
        return t("favorites.emptyTeams");
      case "leagues":
        return t("favorites.emptyLeagues");
      case "countries":
        return t("favorites.emptyCountries");
      default:
        return t("favorites.emptyGeneral");
    }
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState message={getEmptyStateMessage()} icon="heart-outline" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => getItemId(item, category)}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayout}
        />
      )}
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md, // 16px padding zoals op home
      paddingBottom: theme.spacing.xl,
    },
    row: {
      justifyContent: "flex-start",
      marginBottom: theme.spacing.md, // 16px tussen rijen
    },
    cardContainer: {
      width: "32%", // Vaste breedte voor 3 kolommen met kleine spacing
      marginHorizontal: theme.spacing.xs / 2, // 4px tussen cards (2px aan elke kant)
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
  });

export default FavoritesList;
