import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Event } from "../../types/api";
import EventItem from "../EventItem";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../common/StateComponents";

interface EventsListProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onEventPress?: (event: Event) => void;
  homeTeamName?: string;
  onRetry?: () => void;
}

const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading,
  error,
  onEventPress,
  homeTeamName,
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
        icon="📝"
        title={t("events.empty.title")}
        message={t("events.empty.message")}
      />
    );
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <EventItem
      event={item}
      onPress={onEventPress ? () => onEventPress(item) : undefined}
      size="medium"
      homeTeamName={homeTeamName}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
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
      backgroundColor: theme.colors.surface,
    },
    listContent: {
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
  });

export default EventsList;
