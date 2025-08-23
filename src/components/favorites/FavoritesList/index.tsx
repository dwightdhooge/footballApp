import React from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteItem, FavoriteType } from "@/services/storage/favorites";
import CountryCard from "../../country/CountryCard";
import LeagueCard from "../../league/LeagueCard";
import TeamCard from "../../team/TeamCard";
import PlayerCard from "../../player/PlayerCard";

interface FavoritesListProps {
  category: "countries" | "competitions" | "teams" | "players";
  favorites: FavoriteItem[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  category,
  favorites,
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { removeFavoriteItem } = useFavorites();

  const renderFavoriteItem = ({
    item,
    index,
  }: {
    item: FavoriteItem;
    index: number;
  }) => {
    const handlePress = () => {
      try {
        switch (category) {
          case "countries":
            (navigation as any).navigate("CountryDetail", { item });
            break;
          case "competitions":
            const leagueItem = item as any;
            if (leagueItem.league.type === "League") {
              (navigation as any).navigate("LeagueDetail", { item });
            } else {
              (navigation as any).navigate("CupDetail", { item });
            }
            break;
          case "teams":
            (navigation as any).navigate("TeamDetail", { item });
            break;
          case "players":
            (navigation as any).navigate("PlayerDetail", { item });
            break;
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    const handleRemove = async () => {
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
        case "countries":
          return "country";
        case "competitions":
          return "competition";
        case "teams":
          return "team";
        case "players":
          return "player";
        default:
          return "country";
      }
    };

    const renderCard = () => {
      switch (category) {
        case "countries":
          const country = item as any;
          return (
            <CountryCard
              name={country.name}
              code={country.code}
              flag={country.flag}
              onPress={handlePress}
              onRemove={handleRemove}
              size="small"
            />
          );

        case "competitions":
          const leagueItem = item as any;
          return (
            <LeagueCard
              id={leagueItem.league.id}
              name={leagueItem.league.name}
              logo={leagueItem.league.logo}
              type={leagueItem.league.type}
              onPress={handlePress}
              onRemove={handleRemove}
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
              onRemove={handleRemove}
              size="small"
            />
          );

        case "players":
          const player = item as any;
          return (
            <PlayerCard
              id={player.player.id}
              name={player.player.name}
              photo={player.player.photo}
              position={player.player.position}
              onPress={handlePress}
              onRemove={handleRemove}
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
      case "countries":
        const country = item as any;
        return `country_${country.code}`;
      case "competitions":
        const leagueItem = item as any;
        return `competition_${leagueItem.league.id}`;
      case "teams":
        const team = item as any;
        return `team_${team.id}`;
      case "players":
        const player = item as any;
        return `player_${player.player.id}`;
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

  return (
    <View style={styles.container}>
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
  });

export default FavoritesList;
