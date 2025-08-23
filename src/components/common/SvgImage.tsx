import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { useSvgCache } from "@/hooks/useSvgCache";

interface SvgImageProps {
  url: string;
  size: number;
  onError?: (error: Error) => void;
  style?: any;
  ttl?: number; // custom TTL in milliseconds
  fallbackText?: string; // custom fallback text
  showLoadingIndicator?: boolean; // whether to show loading indicator
  borderRadius?: number; // custom border radius
}

const SvgImage: React.FC<SvgImageProps> = ({
  url,
  size,
  onError,
  style,
  ttl,
  fallbackText = "Image",
  showLoadingIndicator = true,
  borderRadius = 4,
}) => {
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  const { svgData, isLoading, error } = useSvgCache(url, { ttl });

  const styles = getStyles(theme, size, borderRadius);

  // Handle errors from the cache hook
  React.useEffect(() => {
    if (error) {
      console.warn("SVG loading error:", error);
      setHasError(true);
      onError?.(error);
    }
  }, [error, onError]);

  // Show loading state
  if (isLoading && showLoadingIndicator) {
    return (
      <View style={[styles.container, styles.loading, style]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  // Show error state
  if (hasError || !svgData) {
    return (
      <View style={[styles.container, styles.fallback, style]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SvgXml width={size} height={size} xml={svgData} style={styles.svg} />
    </View>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  size: number,
  borderRadius: number
) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    svg: {
      borderRadius,
    },
    loading: {
      width: size,
      height: size,
      backgroundColor: theme.colors.surface,
      borderRadius,
      alignItems: "center",
      justifyContent: "center",
    },
    fallback: {
      width: size,
      height: size,
      backgroundColor: theme.colors.surface,
      borderRadius,
      alignItems: "center",
      justifyContent: "center",
    },
    fallbackText: {
      fontSize: Math.max(12, size * 0.4), // responsive font size
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

export default SvgImage;
