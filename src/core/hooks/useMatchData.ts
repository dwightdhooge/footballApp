import { useState, useEffect, useCallback } from "react";
import { Event, Lineup } from "@/core/types/api";
import { fetchEvents, fetchLineups } from "@/services/api";

interface UseMatchDataReturn {
  events: Event[];
  lineups: Lineup[];
  isLoadingEvents: boolean;
  isLoadingLineups: boolean;
  eventsError: string | null;
  lineupsError: string | null;
  refetchEvents: () => Promise<void>;
  refetchLineups: () => Promise<void>;
}

/**
 * Custom hook for fetching match-related data (events and lineups)
 */
export const useMatchData = (
  fixtureId: number,
  leagueId?: number,
  season?: number
): UseMatchDataReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingLineups, setIsLoadingLineups] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [lineupsError, setLineupsError] = useState<string | null>(null);
  const [hasAttemptedEventsFetch, setHasAttemptedEventsFetch] = useState(false);
  const [hasAttemptedLineupsFetch, setHasAttemptedLineupsFetch] = useState(
    false
  );

  const fetchEventsData = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      setEventsError(null);

      if (!leagueId || !season) {
        throw new Error("Missing league ID or season information");
      }

      const eventsData = await fetchEvents(fixtureId);
      // Even if the API returns an empty array, this is a valid response
      setEvents(eventsData);
      setHasAttemptedEventsFetch(true);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsError(error instanceof Error ? error.message : "Unknown error");
      setHasAttemptedEventsFetch(true);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [fixtureId, leagueId, season]);

  const fetchLineupsData = useCallback(async () => {
    try {
      setIsLoadingLineups(true);
      setLineupsError(null);

      if (!leagueId || !season) {
        throw new Error("Missing league ID or season information");
      }

      const lineupsData = await fetchLineups(fixtureId);
      // Even if the API returns an empty array, this is a valid response
      setLineups(lineupsData);
      setHasAttemptedLineupsFetch(true);
    } catch (error) {
      console.error("Error fetching lineups:", error);
      setLineupsError(error instanceof Error ? error.message : "Unknown error");
      setHasAttemptedLineupsFetch(true);
    } finally {
      setIsLoadingLineups(false);
    }
  }, [fixtureId, leagueId, season]);

  const refetchEvents = async () => {
    await fetchEventsData();
  };

  const refetchLineups = async () => {
    await fetchLineupsData();
  };

  // Load events when component mounts to show goals in MatchInfo
  useEffect(() => {
    if (!hasAttemptedEventsFetch && !isLoadingEvents) {
      fetchEventsData();
    }
  }, [fetchEventsData, hasAttemptedEventsFetch, isLoadingEvents]);

  // Load lineups when component mounts to have them ready
  useEffect(() => {
    if (!hasAttemptedLineupsFetch && !isLoadingLineups) {
      fetchLineupsData();
    }
  }, [fetchLineupsData, hasAttemptedLineupsFetch, isLoadingLineups]);

  return {
    events,
    lineups,
    isLoadingEvents,
    isLoadingLineups,
    eventsError,
    lineupsError,
    refetchEvents,
    refetchLineups,
  };
};
