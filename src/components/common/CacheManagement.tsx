import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useSvgCacheManagement } from "@/hooks/useSvgCache";
import { useImageCacheManagement } from "@/hooks/useImageCache";

interface CacheStats {
  size: number;
  oldest: number | null;
  newest: number | null;
  totalSize: number;
  typeBreakdown: Record<string, number>;
}

const CacheManagement: React.FC = () => {
  const { theme } = useTheme();
  const {
    clearCache: clearSvgCache,
    getCacheStats: getSvgStats,
    cleanupCache: cleanupSvgCache,
  } = useSvgCacheManagement();
  const {
    clearCache: clearImageCache,
    getCacheStats: getImageStats,
    cleanupCache: cleanupImageCache,
  } = useImageCacheManagement();

  const [svgStats, setSvgStats] = useState<CacheStats>({
    size: 0,
    oldest: null,
    newest: null,
    totalSize: 0,
    typeBreakdown: {},
  });
  const [imageStats, setImageStats] = useState<CacheStats>({
    size: 0,
    oldest: null,
    newest: null,
    totalSize: 0,
    typeBreakdown: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = async () => {
    try {
      const [svgCacheStats, imageCacheStats] = await Promise.all([
        getSvgStats(),
        getImageStats(),
      ]);
      setSvgStats(svgCacheStats);
      setImageStats(imageCacheStats);
    } catch (error) {
      console.warn("Error loading cache stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearAllCache = () => {
    Alert.alert(
      "Clear All Cache",
      "Are you sure you want to clear all cached images? This will free up storage space but images will need to be downloaded again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await Promise.all([clearSvgCache(), clearImageCache()]);
              await loadStats();
              Alert.alert("Success", "All cache cleared successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCleanupAllCache = async () => {
    setIsLoading(true);
    try {
      await Promise.all([cleanupSvgCache(), cleanupImageCache()]);
      await loadStats();
      Alert.alert("Success", "All cache cleaned up successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to cleanup cache");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const styles = getStyles(theme);

  const totalCachedItems = svgStats.size + imageStats.size;
  const totalCacheSize = svgStats.totalSize + imageStats.totalSize;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Cache Management</Text>

      {/* Overall Stats */}
      <View style={styles.overallStatsContainer}>
        <Text style={styles.statsTitle}>Overall Cache Statistics</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Cached Items:</Text>
          <Text style={styles.statValue}>{totalCachedItems}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Cache Size:</Text>
          <Text style={styles.statValue}>{formatFileSize(totalCacheSize)}</Text>
        </View>
      </View>

      {/* SVG Cache Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>SVG Cache (Flags, Icons)</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cached Items:</Text>
          <Text style={styles.statValue}>{svgStats.size}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cache Size:</Text>
          <Text style={styles.statValue}>
            {formatFileSize(svgStats.totalSize)}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Oldest Cache:</Text>
          <Text style={styles.statValue}>{formatDate(svgStats.oldest)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Newest Cache:</Text>
          <Text style={styles.statValue}>{formatDate(svgStats.newest)}</Text>
        </View>
      </View>

      {/* Image Cache Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Image Cache (Team Logos, etc.)</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cached Items:</Text>
          <Text style={styles.statValue}>{imageStats.size}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cache Size:</Text>
          <Text style={styles.statValue}>
            {formatFileSize(imageStats.totalSize)}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Oldest Cache:</Text>
          <Text style={styles.statValue}>{formatDate(imageStats.oldest)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Newest Cache:</Text>
          <Text style={styles.statValue}>{formatDate(imageStats.newest)}</Text>
        </View>
      </View>

      {/* Type Breakdown */}
      {Object.keys(imageStats.typeBreakdown).length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Image Type Breakdown</Text>
          {Object.entries(imageStats.typeBreakdown).map(([type, count]) => (
            <View key={type} style={styles.statRow}>
              <Text style={styles.statLabel}>{type.toUpperCase()}:</Text>
              <Text style={styles.statValue}>{count}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cleanupButton]}
          onPress={handleCleanupAllCache}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Cleanup Expired</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearAllCache}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Clear All Cache</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Images are automatically cached to improve performance and reduce data
        usage. SVG files (flags, icons) are cached for 24 hours, team logos for
        7 days. Cache can hold up to 1000 items before automatic cleanup.
      </Text>
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginVertical: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.onSurface,
      marginBottom: 16,
    },
    overallStatsContainer: {
      marginBottom: 20,
    },
    statsContainer: {
      marginBottom: 20,
    },
    statsTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    statValue: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.onSurface,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignItems: "center",
    },
    cleanupButton: {
      backgroundColor: theme.colors.primary,
    },
    clearButton: {
      backgroundColor: theme.colors.error,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 14,
      fontWeight: "500",
    },
    infoText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
      lineHeight: 16,
    },
  });

export default CacheManagement;
