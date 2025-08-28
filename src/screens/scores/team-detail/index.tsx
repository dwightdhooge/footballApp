import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Team } from "../../../types/api";
import { ScoresStackParamList } from "../../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { useTeamData } from "@/hooks";
import { DetailHeaderTitle, DetailHeaderButton } from "@/components";
import CachedImage from "@/components/common/CachedImage";

// Components
import TeamDetailHeader from "../../../components/team/TeamDetailHeader";
import TeamInfoSection from "../../../components/team/TeamInfoSection";
import VenueSection from "../../../components/team/VenueSection";

type TeamDetailScreenNavigationProp = StackNavigationProp<
  ScoresStackParamList,
  "TeamDetail"
>;

type TeamDetailScreenRouteProp = RouteProp<ScoresStackParamList, "TeamDetail">;

const TeamDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<TeamDetailScreenRouteProp>();
  const navigation = useNavigation<TeamDetailScreenNavigationProp>();
  const { item: team } = route.params;

  const styles = getStyles(theme);

  // 🎯 Eén hook voor alle data logica!
  const { team: teamInfo, isLoading, error, refetch } = useTeamData(team.id);

  // Set up header with team info and favorite button
  React.useLayoutEffect(() => {
    const logo = (
      <CachedImage
        url={team.logo}
        size={24}
        fallbackText="Team"
        borderRadius={4}
        resizeMode="contain"
        ttl={30 * 24 * 60 * 60 * 1000} // 30 days for team logos
        style={styles.headerTeamLogo}
      />
    );

    navigation.setOptions({
      headerTitle: () => (
        <DetailHeaderTitle
          logo={logo}
          title={team.name}
          subtitle={teamInfo?.team.country}
        />
      ),
      headerRight: () => (
        <DetailHeaderButton
          item={team}
          type="team"
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation, team, teamInfo, styles.headerButton, styles.headerTeamLogo]);

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            {t("teamDetail.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !teamInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {t("teamDetail.errorTitle")}
          </Text>
          <Text
            style={[styles.errorMessage, { color: theme.colors.textSecondary }]}
          >
            {error || t("teamDetail.errorMessage")}
          </Text>
          <Text
            style={[styles.retryButton, { color: theme.colors.primary }]}
            onPress={handleRetry}
          >
            {t("teamDetail.retry")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TeamDetailHeader team={teamInfo} basicTeam={team} />

        <TeamInfoSection team={teamInfo} />

        <VenueSection team={teamInfo} />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    headerTeamLogo: {
      marginRight: theme.spacing.sm,
    },
    headerButton: {
      paddingHorizontal: theme.spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    errorTitle: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight,
      marginBottom: theme.spacing.sm,
    },
    errorMessage: {
      fontSize: theme.typography.body.fontSize,
      lineHeight: theme.typography.body.fontSize,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    retryButton: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
    },
  });

export default TeamDetailScreen;
