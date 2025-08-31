import { API_CONFIG } from "./config";
import { Country, CountriesApiResponse, ApiError } from "@/core/types/api";

export const handleApiError = (error: any): ApiError => {
  if (error.status) {
    switch (error.status) {
      case 429:
        return {
          type: "RATE_LIMIT",
          message: "API limit bereikt",
          status: 429,
        };
      case 401:
        return { type: "AUTH_ERROR", message: "API key ongeldig", status: 401 };
      case 500:
        return {
          type: "SERVER_ERROR",
          message: "Server niet beschikbaar",
          status: 500,
        };
      default:
        return {
          type: "NETWORK_ERROR",
          message: "Netwerk fout",
          status: error.status,
        };
    }
  }
  return { type: "NETWORK_ERROR", message: "Netwerk fout" };
};

export const searchCountries = async (
  searchQuery: string = ""
): Promise<Country[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/countries${
        searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
      }`,
      {
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: CountriesApiResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(`API Error: ${data.errors.join(", ")}`);
    }

    return data.response;
  } catch (error) {
    console.error("Countries API error:", error);
    throw error;
  }
};
