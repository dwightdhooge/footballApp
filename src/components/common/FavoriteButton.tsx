import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteItem, FavoriteType } from "@/services/storage/favorites";

interface FavoriteButtonProps {
  item: FavoriteItem;
  type: FavoriteType;
  size?: number;
  style?: any;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  type,
  size = 24,
  style,
}) => {
  const { theme } = useTheme();
  const { toggleFavoriteItem, isItemFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  // Update favorite status when component mounts or item changes
  useEffect(() => {
    setIsFavorite(isItemFavorite(item, type));
  }, [item, type, isItemFavorite]);

  const handlePress = async () => {
    try {
      await toggleFavoriteItem(item, type);
      // Update local state to trigger re-render
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={size}
        color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});

export default FavoriteButton;
