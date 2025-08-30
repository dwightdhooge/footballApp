import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { useImageCache } from "@/hooks/useImageCache";

interface CachedImageProps {
  url: string;
  size: number;
  onError?: (error: Error) => void;
  style?: any;
  ttl?: number; // custom TTL in milliseconds
  fallbackText?: string; // custom fallback text
  showLoadingIndicator?: boolean; // whether to show loading indicator
  borderRadius?: number; // custom border radius
  resizeMode?: "contain" | "cover" | "stretch" | "repeat" | "center";
}

export const CachedImage: React.FC<CachedImageProps> = ({
  url,
  size,
  onError,
  style,
  ttl,
  fallbackText = "Image",
  showLoadingIndicator = false,
  borderRadius = 4,
  resizeMode = "contain",
}) => {
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  const { imageData, isLoading, error } = useImageCache(url, { ttl });

  const styles = getStyles(theme, size, borderRadius);

  // Handle errors from the cache hook
  React.useEffect(() => {
    if (error) {
      console.warn("Image loading error:", error);
      setHasError(true);
      onError?.(error);
    }
  }, [error, onError]);

  // Show skeleton while loading
  if (isLoading) {
    return <View style={[styles.container, styles.skeleton, style]} />;
  }

  // Show error state
  if (hasError || !imageData) {
    return (
      <View style={[styles.container, styles.fallback, style]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  // Determine if it's an SVG or other image type
  const isSvg =
    url.toLowerCase().includes(".svg") ||
    (imageData && imageData.startsWith("<svg"));

  if (isSvg) {
    // Render SVG
    return (
      <View style={[styles.container, style]}>
        <SvgXml
          width={size}
          height={size}
          xml={imageData}
          style={[styles.svg, { borderRadius }]}
        />
      </View>
    );
  } else {
    // Render other image types (PNG, JPG, etc.)
    // For cached images, we need to reconstruct the data URL
    const dataUrl = `data:image/png;base64,${imageData}`;

    return (
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: dataUrl }}
          style={[styles.image, { borderRadius }]}
          resizeMode={resizeMode}
        />
      </View>
    );
  }
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
    image: {
      width: size,
      height: size,
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
    skeleton: {
      width: size,
      height: size,
      backgroundColor: theme.colors.surface,
      borderRadius,
    },
  });
