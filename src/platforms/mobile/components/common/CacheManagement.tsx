import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useSvgCacheManagement } from "@/hooks/useSvgCache";
import { useImageCacheManagement } from "@/hooks/useImageCache";

interface CacheStats {
  size: number;
  oldest: number | null;
  newest: number | null;
  totalSize?: number;
  typeBreakdown?: Record<string, number>;
}

export const CacheManagement: React.FC = () => {
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

      // Ensure all required properties are present
      const normalizedSvgStats: CacheStats = {
        size: svgCacheStats.size || 0,
        oldest: svgCacheStats.oldest || null,
        newest: svgCacheStats.newest || null,
        totalSize: (svgCacheStats as any).totalSize || 0,
        typeBreakdown: (svgCacheStats as any).typeBreakdown || {},
      };

      const normalizedImageStats: CacheStats = {
        size: imageCacheStats.size || 0,
        oldest: imageCacheStats.oldest || null,
        newest: imageCacheStats.newest || null,
        totalSize: (imageCacheStats as any).totalSize || 0,
        typeBreakdown: (imageCacheStats as any).typeBreakdown || {},
      };

      setSvgStats(normalizedSvgStats);
      setImageStats(normalizedImageStats);
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalCacheSize =
    (svgStats.totalSize || 0) + (imageStats.totalSize || 0);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Cache Management
      </Text>

      <View style={styles.statsContainer}>
        <View
          style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.statTitle, { color: theme.colors.text }]}>
            Total Cache Size
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {formatSize(totalCacheSize)}
          </Text>
        </View>

        <View
          style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.statTitle, { color: theme.colors.text }]}>
            SVG Files
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {svgStats.size}
          </Text>
          <Text
            style={[styles.statSubtext, { color: theme.colors.textSecondary }]}
          >
            {formatSize(svgStats.totalSize || 0)}
          </Text>
        </View>

        <View
          style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.statTitle, { color: theme.colors.text }]}>
            Image Files
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {imageStats.size}
          </Text>
          <Text
            style={[styles.statSubtext, { color: theme.colors.textSecondary }]}
          >
            {formatSize(imageStats.totalSize || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View
          style={[
            styles.detailSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            SVG Cache Details
          </Text>
          <Text
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
          >
            Oldest: {formatDate(svgStats.oldest)}
          </Text>
          <Text
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
          >
            Newest: {formatDate(svgStats.newest)}
          </Text>
          {svgStats.typeBreakdown &&
            Object.keys(svgStats.typeBreakdown).length > 0 && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Types: {Object.keys(svgStats.typeBreakdown).join(", ")}
              </Text>
            )}
        </View>

        <View
          style={[
            styles.detailSection,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Image Cache Details
          </Text>
          <Text
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
          >
            Oldest: {formatDate(imageStats.oldest)}
          </Text>
          <Text
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
          >
            Newest: {formatDate(imageStats.newest)}
          </Text>
          {imageStats.typeBreakdown &&
            Object.keys(imageStats.typeBreakdown).length > 0 && (
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Types: {Object.keys(imageStats.typeBreakdown).join(", ")}
              </Text>
            )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleCleanupAllCache}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            {isLoading ? "Cleaning..." : "Cleanup All Cache"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: theme.colors.error }]}
          onPress={handleClearAllCache}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearButtonText, { color: theme.colors.text }]}>
            {isLoading ? "Clearing..." : "Clear All Cache"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 10,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailSection: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
