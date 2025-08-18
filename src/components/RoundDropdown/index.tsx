import React, { useState } from "react";
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

interface RoundDropdownProps {
  rounds: string[];
  selectedRound: string | null;
  currentRound: string | null;
  onRoundChange: (round: string) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  showCurrent?: boolean;
  style?: StyleProp<ViewStyle>;
}

const RoundDropdown: React.FC<RoundDropdownProps> = ({
  rounds,
  selectedRound,
  currentRound,
  onRoundChange,
  disabled = false,
  placeholder,
  size = "medium",
  showCurrent = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, size, selectedRound, isOpen);

  const handleRoundSelect = (round: string) => {
    onRoundChange(round);
    setIsOpen(false);
  };

  const getRoundDisplay = (roundName: string): string => {
    const roundMap: Record<string, string> = {
      Final: "Finale",
      "Semi-finals": t("cupDetail.roundNames.Semi-finals"),
      "Quarter-finals": t("cupDetail.roundNames.Quarter-finals"),
      "Round of 16": "1/8 Finale",
      "Round of 32": "1/16 Finale",
      "Round of 64": "1/32 Finale",
      "Qualifying Round": t("cupDetail.roundNames.Qualifying Round"),
      "Preliminary Round": t("cupDetail.roundNames.Preliminary Round"),
    };

    return roundMap[roundName] || roundName;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdown, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={styles.selectedText}>
          {selectedRound
            ? getRoundDisplay(selectedRound)
            : placeholder || t("cupDetail.selectRound")}
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
              data={rounds}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selectedRound === item && styles.selectedOption,
                  ]}
                  onPress={() => handleRoundSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedRound === item && styles.selectedOptionText,
                    ]}
                  >
                    {getRoundDisplay(item)}
                    {showCurrent &&
                      currentRound === item &&
                      ` ${t("leagueDetail.current")}`}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.optionsList}
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
  selectedRound: string | null,
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
      color: selectedRound ? theme.colors.text : theme.colors.textSecondary,
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
    optionText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedOptionText: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });

export default RoundDropdown;
