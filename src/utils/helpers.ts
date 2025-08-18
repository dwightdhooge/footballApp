import { Season } from "../types/api";

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidSearch = (term: string): boolean => {
  return term.length >= 3;
};

export const canShowFixtures = (season: Season): boolean => {
  return season.coverage?.fixtures?.events === true;
};

export const canShowStandings = (season: Season): boolean => {
  return season.coverage?.standings === true;
};
