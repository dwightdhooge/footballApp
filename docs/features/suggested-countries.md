# Suggested Countries Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Ontdekking** van populaire voetballanden voor nieuwe gebruikers
- **Snelle toegang** tot veelgebruikte landen
- **Onboarding** van nieuwe gebruikers
- **Content curation** van relevante voetballanden

### User Stories

1. **Als nieuwe gebruiker** wil ik voorgestelde landen zien om te ontdekken
2. **Als gebruiker** wil ik snel toegang hebben tot populaire voetballanden
3. **Als gebruiker** wil ik landen kunnen toevoegen uit de voorgestelde lijst
4. **Als gebruiker** wil ik een overzicht van belangrijke voetballanden

## 🏗 Technical Implementation

### Componenten Structuur

```
SuggestedCountries/
├── SuggestedSection/     # Homescreen swimlane
└── SuggestedData/        # Statische landen data
```

### Static Data Structure (API-Compatible)

```typescript
// Predefined suggested countries matching API response structure
interface SuggestedCountriesApiResponse {
  get: string;
  parameters: {
    suggested: boolean;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: Country[];
}

const SUGGESTED_COUNTRIES_RESPONSE: SuggestedCountriesApiResponse = {
  get: "countries",
  parameters: {
    suggested: true,
  },
  errors: [],
  results: 7,
  paging: {
    current: 1,
    total: 1,
  },
  response: [
    {
      name: "Belgium",
      code: "BE",
      flag: "https://media.api-sports.io/flags/be.svg",
    },
    {
      name: "Netherlands",
      code: "NL",
      flag: "https://media.api-sports.io/flags/nl.svg",
    },
    {
      name: "England",
      code: "GB-ENG",
      flag: "https://media.api-sports.io/flags/gb-eng.svg",
    },
    {
      name: "Spain",
      code: "ES",
      flag: "https://media.api-sports.io/flags/es.svg",
    },
    {
      name: "Italy",
      code: "IT",
      flag: "https://media.api-sports.io/flags/it.svg",
    },
    {
      name: "France",
      code: "FR",
      flag: "https://media.api-sports.io/flags/fr.svg",
    },
    {
      name: "Germany",
      code: "DE",
      flag: "https://media.api-sports.io/flags/de.svg",
    },
  ],
};

// Helper function to extract countries from response
const getSuggestedCountries = (): Country[] => {
  return SUGGESTED_COUNTRIES_RESPONSE.response;
};

// Helper function to get country by code
const getSuggestedCountryByCode = (code: string): Country | undefined => {
  return SUGGESTED_COUNTRIES_RESPONSE.response.find(
    (country) => country.code === code
  );
};
```

### Data Management

- **Static Data**: Geen API calls nodig
- **API-Compatible**: Zelfde structuur als API response
- **Local Storage**: Data in app bundle
- **No Caching**: Direct beschikbaar
- **No Network**: Offline functionaliteit

### SuggestedSection (Homescreen)

- **Title**: "Voorgestelde Landen"
- **Layout**: Horizontal scrollable swimlane
- **Max Visible**: 7 items (alle voorgestelde landen)
- **Scroll**: Smooth horizontal scroll
- **Hidden**: Bij actieve zoekopdracht

### CountryCard Usage

```typescript
// In Suggested Section
<CountryCard
  name={suggested.name}
  code={suggested.code}
  flag={suggested.flag}
  isFavorite={isFavorite(suggested.code)}
  onPress={() => navigateToCountry(suggested)}
  onHeartPress={() => toggleFavorite(suggested)}
  size="large"
/>
```

### Visual Hierarchy

1. **Flag** (prominent, top) - SVG rendered via FlagSvg
2. **Country Name** (bold, center)
3. **Code** (small, bottom)
4. **Heart Icon** (top right, overlay)

### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.95)
- **Favorite**: Heart filled, accent color
- **Loading**: Skeleton state (rare)
- **Error**: Placeholder icon

## 🧪 Quality Considerations

### Edge Cases

- **Geen voorgestelde landen**: Fallback naar lege state
- **Invalid country codes**: Data validation
- **Missing flags**: Fallback naar generieke vlag
- **API code mismatch**: Mapping tussen app en API codes
- **Localization**: Landnamen in verschillende talen
- **SVG Loading Errors**: Fallback naar placeholder
- **Network Issues**: Offline flag rendering

### Performance Optimizations

- **Static Data**: Geen API calls, instant loading
- **SVG Optimization**: React Native SVG caching
- **Memory Efficient**: Kleine data footprint
- **No Network**: Offline functionaliteit
- **Lazy Loading**: SVG's alleen laden wanneer zichtbaar

### Error Handling

- **Data Corruption**: Fallback naar backup data
- **Missing Data**: Graceful degradation
- **Invalid Codes**: Data validation en filtering
- **SVG Errors**: Fallback naar placeholder icon
- **Network Errors**: Offline mode voor flags

## 📱 UI/UX Specifications

### SuggestedSection Layout

- **Height**: 120px (fixed)
- **Scroll Direction**: Horizontal
- **Item Width**: 120px per card (large size)
- **Spacing**: 12px tussen items
- **Padding**: 16px aan zijkanten
- **Background**: Subtle background color

### CountryCard Usage

```javascript
// In Suggested Section
<CountryCard
  name={suggested.name}
  code={suggested.code}
  flag={suggested.flag}
  isFavorite={isFavorite(suggested.code)}
  onPress={() => navigateToCountry(suggested)}
  onHeartPress={() => toggleFavorite(suggested)}
  size="large"
/>
```

### Visual Hierarchy

1. **Flag** (prominent, top) - SVG rendered via FlagSvg
2. **Country Name** (bold, center)
3. **Code** (small, bottom)
4. **Heart Icon** (top right, overlay)

### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.95)
- **Favorite**: Heart filled, accent color
- **Loading**: Skeleton state (rare)
- **Error**: Placeholder icon

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Voorgestelde landen worden getoond op homescreen
- [ ] Alle 7 voorgestelde landen zijn zichtbaar
- [ ] Gebruiker kan landen toevoegen als favoriet
- [ ] Gebruiker kan op landen klikken voor details
- [ ] Voorgestelde landen zijn verborgen tijdens zoeken
- [ ] Landen hebben correcte vlaggen en namen
- [ ] Heart icon toont correcte favoriet status
- [ ] Data structuur is identiek aan API response
- [ ] SVG vlaggen worden correct gerenderd met SvgUri

### Non-Functional Requirements

- [ ] Instant loading (geen API calls)
- [ ] Offline functionaliteit
- [ ] Consistent styling met app theme
- [ ] Smooth horizontal scrolling
- [ ] Responsive design voor verschillende screen sizes
- [ ] SVG caching voor betere performance
- [ ] Error handling voor SVG loading

### UI Requirements

- [ ] Clear visual hierarchy
- [ ] Consistent card design
- [ ] Smooth animations voor interactions
- [ ] Accessibility support
- [ ] Dark/Light mode support
- [ ] Proper spacing en typography
- [ ] SVG fallback voor loading errors

### Data Requirements

- [ ] Correcte API codes voor elk land
- [ ] Geldige SVG vlag URLs
- [ ] Accurate landnamen (Engels)
- [ ] Consistent data format met API
- [ ] Localization support (optioneel)
- [ ] SVG URL validation

## 🔧 Configuration

### Country Selection Criteria

- **Popularity**: Meest bekeken voetballanden
- **Competition Level**: Top-tier competities
- **User Base**: Relevante voor doelgroep
- **API Coverage**: Goede data beschikbaarheid

### Future Enhancements

- **Dynamic Suggestions**: Gebaseerd op user behavior
- **Seasonal Updates**: Wisselen van landen per seizoen
- **Regional Suggestions**: Gebaseerd op user location
- **Personalization**: Adaptieve suggesties
