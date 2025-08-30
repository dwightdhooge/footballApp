import { API_CONFIG } from "./config";
import { EventsApiResponse, Event } from "@/core/types/api";

export const fetchEvents = async (fixtureId: number): Promise<Event[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/fixtures/events?fixture=${fixtureId}`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: EventsApiResponse = await response.json();

    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    // Validate and parse events data
    const validatedEvents = validateEvents(data);

    // Sort events chronologically
    const sortedEvents = sortEventsChronologically(validatedEvents);

    return sortedEvents;
  } catch (error) {
    console.error("Events API error:", error);
    throw error;
  }
};

// Validation functions
const validateEvents = (data: EventsApiResponse): Event[] => {
  if (!data.response || !Array.isArray(data.response)) {
    return [];
  }
  return data.response.filter(
    (event) => event && event.time && event.team && event.type
  );
};

// Sort events chronologically
const sortEventsChronologically = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    const timeA = a.time.elapsed + (a.time.extra || 0);
    const timeB = b.time.elapsed + (b.time.extra || 0);
    return timeA - timeB;
  });
};
