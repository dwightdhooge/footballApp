import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Fixture } from "../../types/api";
import MatchCard from "../MatchCard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../common/StateComponents";

interface MatchesListProps {
  fixtures: Fixture[];
  isLoading: boolean;
  error: string | null;
  onMatchPress: (fixture: Fixture) => void;
  onRetry?: () => void;
}

const MatchesList: React.FC<MatchesListProps> = ({
  fixtures,
  isLoading,
  error,
  onMatchPress,
  onRetry,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme);

  const renderMatch = ({ item }: { item: Fixture }) => (
    <View style={styles.matchItem}>
      <MatchCard
        fixture={item}
        onPress={() => onMatchPress(item)}
        size="medium"
        showVenue={true}
        showStatus={true}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingState message={t("matchCard.loadingMatches")} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title={t("matchCard.errorLoading")}
        onRetry={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={fixtures}
      renderItem={renderMatch}
      keyExtractor={(item) => item.fixture.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={() => (
        <EmptyState
          icon="⚽"
          title={t("matchCard.noMatches")}
          message={t("matchCard.noMatchesDescription")}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    matchItem: {
      marginBottom: 12,
    },
  });

export default MatchesList;
