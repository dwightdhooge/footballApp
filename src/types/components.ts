import { Country } from "./api";

export interface CountryCardProps {
  name: string;
  code: string;
  flag: string;
  isFavorite: boolean;
  onPress: () => void;
  onHeartPress: () => void;
  size?: "small" | "medium" | "large";
  showHeart?: boolean;
  disabled?: boolean;
}

export interface FlagSvgProps {
  url: string;
  size: number;
  onError?: (error: Error) => void;
  style?: any;
  ttl?: number; // custom TTL in milliseconds for this specific SVG
}
