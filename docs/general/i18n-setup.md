# Internationalization (i18n) Setup

Dit project gebruikt `react-i18next` voor internationalisatie met automatische taalherkenning. Alle hardcoded teksten zijn vervangen door translation keys.

## 📍 Locatie

Deze documentatie bevindt zich in `docs/general/i18n-setup.md` als onderdeel van de projectdocumentatie.

## 🏗 Structuur

```
src/i18n/
├── index.ts              # Hoofdconfiguratie met automatische taalherkenning
└── translations/
    ├── nl-BE.json       # Nederlandse (België) vertalingen
    ├── en.json          # Engelse vertalingen
    └── fr-BE.json       # Franse (België) vertalingen

docs/general/
└── i18n-setup.md        # Deze documentatie
```

## 🌍 Automatische Taalherkenning

De app detecteert automatisch de taal van het toestel:

- **Nederlands (nl-BE)**: Voor toestellen met Nederlandse taalinstelling
- **Frans (fr-BE)**: Voor toestellen met Franse taalinstelling
- **Engels (en)**: Voor alle andere talen (fallback)

Gebruikt `expo-localization` voor automatische detectie.

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

### 3. Interpolatie

Voor dynamische waarden:

```tsx
// In nl-BE.json
"search.noResults": "Geen resultaten gevonden voor '{{query}}'"

// In component
{t('search.noResults', { query: searchTerm })}
```

### 4. Nieuwe Talen Toevoegen

1. Maak een nieuwe JSON file aan in `src/i18n/translations/` (bijv. `de.json`)
2. Voeg de taal toe aan de resources in `src/i18n/index.ts`
3. Update de `getDeviceLanguage()` functie indien nodig

### 5. Bestaande Teksten Bijwerken

1. Voeg de nieuwe key toe aan alle taalbestanden (`nl-BE.json`, `en.json`, `fr-BE.json`)
2. Vervang de hardcoded tekst door `{t('key.path')}`
3. Importeer `useTranslation` in de component

## ✅ Voordelen

- **Onderhoudbaarheid**: Alle teksten op één plek
- **Flexibiliteit**: Eenvoudig nieuwe talen toevoegen
- **Consistentie**: Gestandaardiseerde tekststructuur
- **Type Safety**: TypeScript ondersteuning via react-i18next
- **Automatische Detectie**: App past zich aan aan de taal van het toestel
- **Fallback**: Engels als standaard voor onbekende talen
- **Meertalige Ondersteuning**: Nederlands, Frans en Engels

## 🔗 Gerelateerde Documentatie

- [App Overview](app-overview.md) - Algemene app informatie
- [Project Structure](project-structure.md) - Project structuur
- [Components](components.md) - Herbruikbare componenten
- [Navigation](navigation.md) - Navigatie structuur
