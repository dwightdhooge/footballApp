import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SvgUri } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { FlagSvgProps } from "@/types/components";

const FlagSvg: React.FC<FlagSvgProps> = ({
  url,
  size = 24,
  onError,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = getStyles(theme, size);

  const handleError = (error: Error) => {
    console.warn("Flag loading error:", error);
    setHasError(true);
    onError?.(error);
  };

  if (hasError) {
    return (
      <View style={[styles.container, styles.fallback, style]}>
        <Text style={styles.fallbackText}>{t("common.flagFallback")}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <SvgUri
        width={size}
        height={size}
        uri={url}
        onError={handleError}
        style={styles.flag}
      />
    </View>
  );
};

const getStyles = (theme: ReturnType<typeof useTheme>["theme"], size: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    flag: {
      borderRadius: 4,
    },
    fallback: {
      width: size,
      height: size,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    fallbackText: {
      fontSize: 16,
    },
  });

export default FlagSvg;
