import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { Season } from "../../types/api";

interface SeasonDropdownProps {
  seasons: Season[];
  selectedSeason: Season | null;
  onSeasonChange: (season: Season) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  showCurrent?: boolean;
  coverageType?: "standings" | "fixtures";
  style?: StyleProp<ViewStyle>;
}

const SeasonDropdown: React.FC<SeasonDropdownProps> = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  disabled = false,
  placeholder,
  size = "medium",
  showCurrent = false,
  coverageType,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, size, selectedSeason, isOpen);

  // Keep a ref to list so we can scroll to selected item on open
  const listRef = useRef<any>(null);

  // Filter seasons based on coverage type
  const getFilteredSeasons = (): Season[] => {
    if (!coverageType) return seasons;

    return seasons.filter((season) => {
      if (coverageType === "standings") {
        return season.coverage?.standings === true;
      }
      if (coverageType === "fixtures") {
        return season.coverage?.fixtures?.events === true;
      }
      return true;
    });
  };

  const filteredSeasons = getFilteredSeasons();

  // When opening, scroll list to the currently selected value
  useEffect(() => {
    if (isOpen && selectedSeason) {
      const index = filteredSeasons.findIndex(
        (s) => s.year === selectedSeason.year
      );
      if (index >= 0) {
        setTimeout(() => {
          try {
            listRef.current?.scrollToIndex({
              index,
              animated: false,
              viewPosition: 0.5,
            });
          } catch {}
        }, 0);
      }
    }
  }, [isOpen, selectedSeason, filteredSeasons]);

  const handleSeasonSelect = (season: Season) => {
    onSeasonChange(season);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdown, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={styles.selectedText}>
          {selectedSeason
            ? `${selectedSeason.year}`
            : placeholder || t("leagueDetail.selectSeason")}
        </Text>
        <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              ref={listRef}
              data={filteredSeasons}
              keyExtractor={(item) => item.year.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedSeason?.year === item.year && styles.selectedOption,
                  ]}
                  onPress={() => handleSeasonSelect(item)}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedSeason?.year === item.year &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.year}
                    </Text>
                    {showCurrent && item.current && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>
                          {t("leagueDetail.current")}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  listRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                    viewPosition: 0.5,
                  });
                }, 0);
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (
  theme: ReturnType<typeof useTheme>["theme"],
  size: string,
  selectedSeason: Season | null,
  isOpen: boolean
) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      height: size === "small" ? 32 : size === "large" ? 48 : 40,
    },
    disabled: {
      opacity: 0.5,
    },
    selectedText: {
      flex: 1,
      fontWeight: "500",
      fontSize: size === "small" ? 12 : size === "large" ? 16 : 14,
      color: selectedSeason ? theme.colors.text : theme.colors.textSecondary,
    },
    chevron: {
      marginLeft: 8,
      fontSize: size === "small" ? 12 : size === "large" ? 16 : 14,
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      borderRadius: 8,
      maxHeight: 300,
      width: "80%",
      backgroundColor: theme.colors.surface,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    optionsList: {
      maxHeight: 250,
    },
    option: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + "20",
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedOptionText: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
    currentBadge: {
      backgroundColor: theme.colors.primary + "20",
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 8,
    },
    currentBadgeText: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "500",
    },
  });

export default SeasonDropdown;
