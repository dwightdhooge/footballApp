# Internationalization (i18n) Setup

Dit project gebruikt `react-i18next` voor internationalisatie met automatische taalherkenning. Alle hardcoded teksten zijn vervangen door translation keys, ondersteund door een cross-platform architectuur.

## 📍 Locatie

Deze documentatie bevindt zich in `docs/general/i18n-setup.md` als onderdeel van de projectdocumentatie.

## 🏗 Structuur

```
src/
├── shared/
│   └── i18n/
│       ├── index.ts              # Hoofdconfiguratie met automatische taalherkenning
│       └── translations/
│           ├── nl-BE.json       # Nederlandse (België) vertalingen
│           ├── en.json          # Engelse vertalingen
│           └── fr-BE.json       # Franse (België) vertalingen
└── platforms/
    ├── mobile/                   # Mobile platform implementatie
    └── web/                      # Web platform implementatie

docs/general/
└── i18n-setup.md                # Deze documentatie
```

## 🌍 Automatische Taalherkenning

De app detecteert automatisch de taal van het toestel:

- **Nederlands (nl-BE)**: Voor toestellen met Nederlandse taalinstelling
- **Frans (fr-BE)**: Voor toestellen met Franse taalinstelling
- **Engels (en)**: Voor alle andere talen (fallback)

Gebruikt `expo-localization` voor automatische detectie op mobile en `navigator.language` op web.

## 🔧 Gebruik

### 1. Importeer useTranslation

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t("common.loading")}</Text>;
};
```

### 2. Translation Keys

Alle keys zijn georganiseerd in logische groepen:

- `common.*` - Algemene teksten (loading, error, etc.)
- `navigation.*` - Navigatie labels
- `homescreen.*` - Hoofdscherm teksten
- `settings.*` - Instellingen teksten
- `favorites.*` - Favorieten teksten
- `search.*` - Zoekfunctionaliteit teksten
- `errors.*` - Foutmeldingen
- `platform.*` - Platform-specifieke teksten

### 3. Interpolatie

Voor dynamische waarden:

```tsx
// In nl-BE.json
"search.noResults": "Geen resultaten gevonden voor '{{query}}'"

// In component
{t('search.noResults', { query: searchTerm })}
```

### 4. Nieuwe Talen Toevoegen

1. Maak een nieuwe JSON file aan in `src/shared/i18n/translations/` (bijv. `de.json`)
2. Voeg de taal toe aan de resources in `src/shared/i18n/index.ts`
3. Update de `getDeviceLanguage()` functie indien nodig

### 5. Bestaande Teksten Bijwerken

1. Voeg de nieuwe key toe aan alle taalbestanden (`nl-BE.json`, `en.json`, `fr-BE.json`)
2. Vervang de hardcoded tekst door `{t('key.path')}`
3. Importeer `useTranslation` in de component

## 🏗 Technical Implementation

### i18n Configuration

```typescript
// src/shared/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { Platform } from "react-native";

// Import translation files
import en from "./translations/en.json";
import nlBE from "./translations/nl-BE.json";
import frBE from "./translations/fr-BE.json";

// Platform-specific language detection
const getDeviceLanguage = (): string => {
  if (Platform.OS === "web") {
    // Web platform
    const browserLang = navigator.language || navigator.languages?.[0] || "en";
    return browserLang;
  } else {
    // Mobile platform
    return Localization.locale;
  }
};

// Language mapping
const languageMap: Record<string, string> = {
  nl: "nl-BE",
  "nl-BE": "nl-BE",
  fr: "fr-BE",
  "fr-BE": "fr-BE",
  en: "en",
  "en-US": "en",
  "en-GB": "en",
};

// Get supported language
const getSupportedLanguage = (locale: string): string => {
  const baseLang = locale.split("-")[0];
  const fullLocale = locale.includes("-")
    ? locale
    : `${baseLang}-${baseLang.toUpperCase()}`;

  return languageMap[fullLocale] || languageMap[baseLang] || "en";
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "nl-BE": { translation: nlBE },
    "fr-BE": { translation: frBE },
  },
  lng: getSupportedLanguage(getDeviceLanguage()),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
```

### Translation Files Structure

#### English (en.json)

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "retry": "Retry",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add"
  },
  "navigation": {
    "scores": "Scores",
    "favorites": "Favorites",
    "settings": "Settings",
    "debug": "Debug"
  },
  "homescreen": {
    "title": "Soccer App",
    "searchPlaceholder": "Search countries...",
    "suggestedTitle": "Suggested Countries",
    "favoritesTitle": "Your Favorites"
  },
  "settings": {
    "title": "Settings",
    "theme": "Theme",
    "language": "Language",
    "autoTheme": "Auto Theme",
    "lightTheme": "Light Theme",
    "darkTheme": "Dark Theme"
  },
  "errors": {
    "networkError": "Network error. Please check your connection.",
    "apiError": "API error. Please try again later.",
    "generalError": "Something went wrong. Please try again."
  }
}
```

#### Dutch (nl-BE.json)

```json
{
  "common": {
    "loading": "Laden...",
    "error": "Fout",
    "retry": "Opnieuw proberen",
    "cancel": "Annuleren",
    "save": "Opslaan",
    "delete": "Verwijderen",
    "edit": "Bewerken",
    "add": "Toevoegen"
  },
  "navigation": {
    "scores": "Scores",
    "favorites": "Favorieten",
    "settings": "Instellingen",
    "debug": "Debug"
  },
  "homescreen": {
    "title": "Voetbal App",
    "searchPlaceholder": "Zoek landen...",
    "suggestedTitle": "Voorgestelde Landen",
    "favoritesTitle": "Jouw Favorieten"
  },
  "settings": {
    "title": "Instellingen",
    "theme": "Thema",
    "language": "Taal",
    "autoTheme": "Automatisch Thema",
    "lightTheme": "Licht Thema",
    "darkTheme": "Donker Thema"
  },
  "errors": {
    "networkError": "Netwerk fout. Controleer je verbinding.",
    "apiError": "API fout. Probeer het later opnieuw.",
    "generalError": "Er is iets misgegaan. Probeer het opnieuw."
  }
}
```

#### French (fr-BE.json)

```json
{
  "common": {
    "loading": "Chargement...",
    "error": "Erreur",
    "retry": "Réessayer",
    "cancel": "Annuler",
    "save": "Sauvegarder",
    "delete": "Supprimer",
    "edit": "Modifier",
    "add": "Ajouter"
  },
  "navigation": {
    "scores": "Scores",
    "favorites": "Favoris",
    "settings": "Paramètres",
    "debug": "Debug"
  },
  "homescreen": {
    "title": "App Football",
    "searchPlaceholder": "Rechercher des pays...",
    "suggestedTitle": "Pays Suggérés",
    "favoritesTitle": "Vos Favoris"
  },
  "settings": {
    "title": "Paramètres",
    "theme": "Thème",
    "language": "Langue",
    "autoTheme": "Thème Auto",
    "lightTheme": "Thème Clair",
    "darkTheme": "Thème Sombre"
  },
  "errors": {
    "networkError": "Erreur réseau. Vérifiez votre connexion.",
    "apiError": "Erreur API. Réessayez plus tard.",
    "generalError": "Quelque chose s'est mal passé. Réessayez."
  }
}
```

### Platform-Specific Usage

#### Mobile Platform

```typescript
// src/platforms/mobile/components/common/DetailHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../core/context/ThemeContext";

interface DetailHeaderProps {
  title: string;
  onBack: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ title, onBack }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>{t("common.back")}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.sm,
    },
    backText: {
      ...theme.typography.body,
      color: theme.colors.primary,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      flex: 1,
    },
  });

export default DetailHeader;
```

#### Web Platform

```typescript
// src/platforms/web/components/SearchBar.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../core/context/ThemeContext";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const styles = getStyles(theme);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || t("homescreen.searchPlaceholder")}
        style={styles.input}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch} style={styles.button}>
        {t("common.search")}
      </button>
    </div>
  );
};

const getStyles = (theme: Theme) => ({
  container: {
    display: "flex",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    padding: theme.spacing.sm,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  button: {
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    backgroundColor: theme.colors.primary,
    color: "#FFFFFF",
    border: "none",
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SearchBar;
```

### Dynamic Language Switching

```typescript
// Language switcher component
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../core/context/ThemeContext";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, i18n.language === "en" && styles.activeButton]}
        onPress={() => changeLanguage("en")}
      >
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === "nl-BE" && styles.activeButton,
        ]}
        onPress={() => changeLanguage("nl-BE")}
      >
        <Text style={styles.buttonText}>Nederlands</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === "fr-BE" && styles.activeButton,
        ]}
        onPress={() => changeLanguage("fr-BE")}
      >
        <Text style={styles.buttonText}>Français</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    button: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    buttonText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
    },
  });

export default LanguageSwitcher;
```

### Error Handling

```typescript
// Error boundary with i18n
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../core/context/ThemeContext";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("errors.somethingWentWrong")}</Text>
      <Text style={styles.message}>{error.message}</Text>
      <TouchableOpacity style={styles.button} onPress={resetError}>
        <Text style={styles.buttonText}>{t("common.retry")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    message: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    buttonText: {
      ...theme.typography.button,
      color: "#FFFFFF",
    },
  });

export default ErrorFallback;
```

## 🧪 Quality Considerations

### Edge Cases

- **Missing Translation Keys**: Fallback naar fallback language
- **Invalid Language Codes**: Graceful degradation naar default
- **Platform Mismatch**: Platform-specific language detection
- **Network Issues**: Offline language support
- **Memory Issues**: Efficient translation loading

### Performance Optimizations

- **Lazy Loading**: Load translations on demand
- **Caching**: Cache loaded translations
- **Bundle Splitting**: Separate translation bundles
- **Tree Shaking**: Remove unused translations

### Error Handling

- **Missing Keys**: Fallback naar fallback language
- **Invalid JSON**: Validation en error reporting
- **Loading Errors**: Graceful degradation
- **Platform Errors**: Platform-specific error handling

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Automatische taalherkenning werkt op beide platforms
- [ ] Taal switching werkt correct
- [ ] Alle hardcoded teksten zijn vervangen door translation keys
- [ ] Fallback naar Engels bij ontbrekende vertalingen
- [ ] Platform-specifieke optimalisaties

### Non-Functional Requirements

- [ ] Taal switching performance < 100ms
- [ ] Memory efficient translation storage
- [ ] Cross-platform consistency
- [ ] Accessibility compliance

### UI Requirements

- [ ] Consistent text rendering across platforms
- [ ] Proper text sizing en layout
- [ ] RTL language support (indien nodig)
- [ ] Platform-specific text optimizations

## 🔧 Usage Examples

### In Search Results

```typescript
{
  t("search.noResults", { query: searchTerm });
}
{
  t("search.resultsCount", { count: results.length });
}
```

### In Error Messages

```typescript
{
  t("errors.networkError");
}
{
  t("errors.apiError", { code: error.status });
}
```

### In Navigation

```typescript
{
  t("navigation.scores");
}
{
  t("navigation.favorites");
}
{
  t("navigation.settings");
}
```

### In Settings

```typescript
{
  t("settings.theme");
}
{
  t("settings.language");
}
{
  t("settings.autoTheme");
}
```

## 🔗 Related Documentation

- [App Overview](app-overview.md) - Algemene app informatie
- [Project Structure](project-structure.md) - Project structuur
- [Components](components.md) - Herbruikbare componenten
- [Navigation](navigation.md) - Navigatie structuur
- [Theming](theming.md) - Theming en styling approach
