import { ThemeColors } from "../styles/theme";

/**
 * Utility functies voor match components
 */

export const getStatusColor = (status: string, theme: ThemeColors) => {
  switch (status.toLowerCase()) {
    case "ft":
    case "finished":
      return theme.success;
    case "1h":
    case "2h":
    case "ht":
    case "live":
      return theme.warning;
    case "ns":
    case "scheduled":
    case "not started":
      return theme.textSecondary;
    default:
      return theme.textSecondary;
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "ft":
    case "finished":
      return "Beëindigd";
    case "1h":
      return "1e Helft";
    case "2h":
      return "2e Helft";
    case "ht":
      return "Rust";
    case "live":
      return "Live";
    case "ns":
    case "scheduled":
    case "not started":
      return "Gepland";
    default:
      return status;
  }
};

export const formatScore = (home: number | null, away: number | null) => {
  if (home === null || away === null) {
    return "vs";
  }
  return `${home} - ${away}`;
};

export const formatPenaltyScore = (
  home: number | null,
  away: number | null
) => {
  if (home === null || away === null) {
    return null;
  }
  return `(${home}-${away})`;
};

export const getEventIcon = (type: string, detail: string) => {
  const typeLower = type.toLowerCase();
  const detailLower = detail.toLowerCase();

  switch (typeLower) {
    case "goal":
      if (detailLower.includes("penalty")) {
        return "🎯";
      } else if (detailLower.includes("own goal")) {
        return "😵";
      }
      return "⚽";
    case "card":
      if (detailLower.includes("red")) {
        return "🟥";
      } else if (detailLower.includes("yellow")) {
        return "🟨";
      }
      return "🟨";
    case "subst":
      return "🔄";
    case "var":
      return "📺";
    case "foul":
      return "⚠️";
    case "corner":
      return "🏁";
    case "free kick":
      return "🎯";
    case "throw in":
      return "📏";
    case "offside":
      return "🚩";
    case "injury":
      return "🏥";
    case "break":
      return "⏸️";
    case "missed penalty":
      return "❌";
    case "saved penalty":
      return "🧤";
    case "post":
      return "🥅";
    case "crossbar":
      return "🥅";
    default:
      return "•";
  }
};

export const getEventColor = (
  type: string,
  detail: string,
  theme: ThemeColors
) => {
  const typeLower = type.toLowerCase();
  const detailLower = detail.toLowerCase();

  switch (typeLower) {
    case "goal":
      if (detailLower.includes("own goal")) {
        return theme.error;
      }
      return theme.success;
    case "card":
      if (detailLower.includes("red")) {
        return theme.error;
      }
      return theme.warning;
    case "subst":
      return theme.primary;
    case "var":
      return theme.warning;
    case "foul":
      return theme.error;
    case "corner":
      return theme.primary;
    case "free kick":
      return theme.primary;
    case "throw in":
      return theme.primary;
    case "offside":
      return theme.warning;
    case "injury":
      return theme.error;
    case "break":
      return theme.textSecondary;
    case "missed penalty":
      return theme.error;
    case "saved penalty":
      return theme.warning;
    case "post":
      return theme.warning;
    case "crossbar":
      return theme.warning;
    default:
      return theme.textSecondary;
  }
};

export const formatEventTime = (elapsed: number, extra: number | null) => {
  if (extra && extra > 0) {
    return `${elapsed}+${extra}'`;
  }
  return `${elapsed}'`;
};

export const formatMatchDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("nl-BE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatMatchTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isPenaltyGoal = (detail: string): boolean => {
  return detail.toLowerCase().includes("penalty");
};

export const getFormationDisplay = (formation: string): string => {
  // Convert formation like "4-3-3" to "4-3-3"
  return formation || "N/A";
};

export const getPlayerPositionDisplay = (position: string): string => {
  const positionMap: Record<string, string> = {
    G: "GK",
    D: "DEF",
    M: "MID",
    F: "FWD",
  };
  return positionMap[position] || position;
};
