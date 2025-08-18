import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Fixture } from "../../types/api";
import MatchCard from "../MatchCard";

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t("matchCard.noMatches")}</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{t("matchCard.retry")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>{t("matchCard.loadingMatches")}</Text>
    </View>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  if (error) {
    return renderErrorState();
  }

  return (
    <FlatList
      data={fixtures}
      renderItem={renderMatch}
      keyExtractor={(item) => item.fixture.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={renderEmptyState}
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.colors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    errorText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 16,
      color: theme.colors.error,
    },
    retryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    retryText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 16,
      marginTop: 12,
      color: theme.colors.textSecondary,
    },
  });

export default MatchesList;
