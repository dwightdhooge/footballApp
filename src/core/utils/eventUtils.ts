import { Event } from "@/core/types/api";

/**
 * Utility functions for processing match events
 */

export interface GoalScorer {
  name: string;
  isPenalty: boolean;
}

export interface SubstitutionEvent {
  playerOut: string;
  playerIn: string;
  minute: number;
}

/**
 * Get all goal scorers from events with penalty info
 */
export const getGoalScorers = (events: Event[]): GoalScorer[] => {
  return events
    .filter((event) => event.type.toLowerCase() === "goal")
    .map((event) => ({
      name: event.player?.name || "",
      isPenalty: event.detail?.toLowerCase().includes("penalty") || false,
    }));
};

/**
 * Get all yellow card recipients from events
 */
export const getYellowCardPlayers = (events: Event[]): string[] => {
  return events
    .filter(
      (event) =>
        event.type.toLowerCase() === "card" &&
        event.detail?.toLowerCase().includes("yellow card")
    )
    .map((event) => event.player?.name || "");
};

/**
 * Get all red card recipients from events
 */
export const getRedCardPlayers = (events: Event[]): string[] => {
  return events
    .filter(
      (event) =>
        event.type.toLowerCase() === "card" &&
        event.detail?.toLowerCase().includes("red card")
    )
    .map((event) => event.player?.name || "");
};

/**
 * Get all substitution events from events
 */
export const getSubstitutionEvents = (events: Event[]): SubstitutionEvent[] => {
  return events
    .filter((event) => event.type.toLowerCase() === "subst")
    .map((event) => ({
      playerOut: event.player?.name || "",
      playerIn: event.assist?.name || "", // Using assist field for player coming in
      minute: event.time?.elapsed || 0,
    }));
};

/**
 * Normalize player name for consistent matching
 */
export const normalizePlayerName = (name: string): string => {
  return (
    name
      .toLowerCase()
      // Replace special characters with their basic equivalents
      .replace(/[ščćđž]/g, (match) => {
        const replacements: { [key: string]: string } = {
          š: "s",
          č: "c",
          ć: "c",
          đ: "d",
          ž: "z",
        };
        return replacements[match] || match;
      })
      // Remove other special characters and keep only letters and spaces
      .replace(/[^a-z\s]/g, "")
      .trim()
  );
};

/**
 * Check if a player name matches another name (with flexible matching)
 */
export const isPlayerNameMatch = (
  playerName: string,
  eventPlayerName: string
): boolean => {
  // Exact match
  if (eventPlayerName === playerName) return true;

  const normalizedEventPlayer = normalizePlayerName(eventPlayerName);
  const normalizedPlayer = normalizePlayerName(playerName);

  // Check if one name contains the other
  if (
    normalizedEventPlayer.includes(normalizedPlayer) ||
    normalizedPlayer.includes(normalizedEventPlayer)
  ) {
    return true;
  }

  // Check for abbreviated first names (e.g., "T. Hazard" vs "Thorgan Hazard")
  const eventPlayerWords = normalizedEventPlayer.split(" ");
  const playerWords = normalizedPlayer.split(" ");

  // If both have multiple words, check if last names match and first names are abbreviated
  if (eventPlayerWords.length > 1 && playerWords.length > 1) {
    const eventPlayerLastName = eventPlayerWords[eventPlayerWords.length - 1];
    const playerLastName = playerWords[playerWords.length - 1];

    if (eventPlayerLastName === playerLastName) {
      // Check if first names could be abbreviated versions
      const eventPlayerFirstName = eventPlayerWords[0];
      const playerFirstName = playerWords[0];

      // If one is single letter and other starts with that letter
      if (
        (eventPlayerFirstName.length === 1 &&
          playerFirstName.startsWith(eventPlayerFirstName)) ||
        (playerFirstName.length === 1 &&
          eventPlayerFirstName.startsWith(playerFirstName))
      ) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Check if a player has scored (with flexible name matching)
 */
export const hasPlayerScored = (
  playerName: string,
  events: Event[]
): boolean => {
  const goalScorers = getGoalScorers(events);
  return goalScorers.some((scorer) =>
    isPlayerNameMatch(playerName, scorer.name)
  );
};

/**
 * Check if a player has scored a penalty (with flexible name matching)
 */
export const hasPlayerScoredPenalty = (
  playerName: string,
  events: Event[]
): boolean => {
  const goalScorers = getGoalScorers(events);
  return goalScorers.some(
    (scorer) => isPlayerNameMatch(playerName, scorer.name) && scorer.isPenalty
  );
};

/**
 * Check if a player has received a yellow card (with flexible name matching)
 */
export const hasPlayerYellowCard = (
  playerName: string,
  events: Event[]
): boolean => {
  const yellowCardPlayers = getYellowCardPlayers(events);
  return yellowCardPlayers.some((cardPlayerName) =>
    isPlayerNameMatch(playerName, cardPlayerName)
  );
};

/**
 * Check if a player has received a red card (with flexible name matching)
 */
export const hasPlayerRedCard = (
  playerName: string,
  events: Event[]
): boolean => {
  const redCardPlayers = getRedCardPlayers(events);
  return redCardPlayers.some((cardPlayerName) =>
    isPlayerNameMatch(playerName, cardPlayerName)
  );
};

/**
 * Check if a player has been substituted out
 */
export const hasPlayerBeenSubstitutedOut = (
  playerName: string,
  events: Event[]
): boolean => {
  const substitutionEvents = getSubstitutionEvents(events);
  return substitutionEvents.some((sub) =>
    isPlayerNameMatch(playerName, sub.playerOut)
  );
};

/**
 * Check if a player has been substituted in
 */
export const hasPlayerBeenSubstitutedIn = (
  playerName: string,
  events: Event[]
): boolean => {
  const substitutionEvents = getSubstitutionEvents(events);
  return substitutionEvents.some((sub) =>
    isPlayerNameMatch(playerName, sub.playerIn)
  );
};

/**
 * Get substitution minute for a player
 */
export const getPlayerSubstitutionMinute = (
  playerName: string,
  events: Event[]
): number => {
  const substitutionEvents = getSubstitutionEvents(events);
  const subEvent = substitutionEvents.find(
    (sub) =>
      isPlayerNameMatch(playerName, sub.playerOut) ||
      isPlayerNameMatch(playerName, sub.playerIn)
  );
  return subEvent?.minute || 0;
};
