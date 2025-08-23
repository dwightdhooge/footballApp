import { Country } from "./api";

export interface CountryCardProps {
  name: string;
  code: string;
  flag: string;
  onPress: () => void;
  onRemove?: () => void; // Alleen voor favorites list
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export interface FlagSvgProps {
  url: string;
  size: number;
  onError?: (error: Error) => void;
  style?: any;
  ttl?: number; // custom TTL in milliseconds for this specific SVG
}
