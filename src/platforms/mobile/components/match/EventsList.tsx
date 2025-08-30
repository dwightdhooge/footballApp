import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Event, Team } from "@/types/api";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./../common/StateComponents";
import { EventItem } from "./EventItem";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onEventPress?: (event: Event) => void;
  homeTeam?: Team;
  awayTeam?: Team;
  onRetry?: () => void;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  error,
  onEventPress,
  homeTeam,
  awayTeam,
  onRetry,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme);

  if (isLoading) {
    return <LoadingState message={t("events.loading")} />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title={t("events.error.title")}
        onRetry={onRetry}
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="document-text-outline"
        message={t("events.empty.message")}
      />
    );
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <EventItem
      event={item}
      onPress={onEventPress ? () => onEventPress(item) : undefined}
      homeTeam={homeTeam}
      awayTeam={awayTeam}
    />
  );

  // Sort events in reverse chronological order (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.time.elapsed + (a.time.extra || 0);
    const timeB = b.time.elapsed + (b.time.extra || 0);
    return timeB - timeA; // Descending order
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedEvents}
        renderItem={renderEvent}
        keyExtractor={(item, index) => `event-${item.time.elapsed}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: theme.colors.surface,
    },
    listContent: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
  });
