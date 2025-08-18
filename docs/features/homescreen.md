# Homescreen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Snelle toegang** tot voetbaldata via landen zoeken
- **Persoonlijke favorieten** beheren en snel toegang krijgen
- **Ontdekking** van populaire landen via suggested countries
- **Efficiënte zoekervaring** met minimale API calls

### User Stories

1. **Als voetbalfan** wil ik landen kunnen zoeken om snel bij voetbaldata te komen
2. **Als gebruiker** wil ik mijn favoriete landen kunnen toevoegen/verwijderen
3. **Als nieuwe gebruiker** wil ik voorgestelde landen zien om te ontdekken
4. **Als gebruiker** wil ik een responsieve zoekervaring zonder onnodige API calls

## 🏗 Technical Implementation

### Componenten Structuur

```
Homescreen/
├── SafeAreaView/        # Safe area wrapper
├── Header/              # App header (titel, subtitle)
├── SearchBar/           # Zoekfunctionaliteit met debouncing
├── SearchResults/       # Zoekresultaten weergave
├── FavoritesSection/    # Favoriete landen swimlane
├── SuggestedSection/    # Voorgestelde landen swimlane
└── CountryCard/         # Herbruikbare land kaart (zie components.md)
```

### Search Functionaliteit

#### SearchBar Component

- **Minimum Characters**: 3 karakters voor API call
- **Debounce Time**: 500ms na laatste karakter input
- **Placeholder**: "Zoek naar landen (min. 3 karakters)..."
- **Loading State**: Spinner tijdens API call
- **Clear Button**: X icon om zoekopdracht te wissen

#### Search Logic

```javascript
// Search state management
{
  searchTerm: string,
  searchResults: Country[], // API response format
  isSearching: boolean,
  hasSearched: boolean,
  error: string | null
}

// Search validation
const isValidSearch = (term) => term.length >= 3;

// Debounced search function
const debouncedSearch = useCallback(
  debounce((searchTerm) => {
    if (isValidSearch(searchTerm)) {
      performSearch(searchTerm);
    }
  }, 500),
  []
);
```

#### Search Results Display

- **Conditional Rendering**: Toon alleen bij search results
- **Hide Swimlanes**: FavoritesSection en SuggestedSection verbergen bij zoeken
- **Empty State**: "Geen landen gevonden voor '{searchTerm}'"
- **Loading State**: Skeleton loading voor search results
- **Error State**: "Er is een fout opgetreden bij het zoeken"

### Data Flow

1. **User Input** → Validate minimum 3 characters
2. **Debounce Timer** → 500ms delay
3. **API Call** → `/countries?search={searchTerm}`
4. **Results Display** → Hide swimlanes, show results
5. **Clear Search** → Show swimlanes again

### API Endpoints

- `GET /countries` - Alle landen ophalen
- `GET /countries?search={query}` - Zoeken in landen (min. 3 chars)

### API Response Structure

```javascript
// Expected API response format
{
  "get": "countries",
  "parameters": {
    "search": "searchTerm"
  },
  "errors": [],
  "results": 1,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "name": "Country Name",
      "code": "CC",
      "flag": "https://media.api-sports.io/flags/cc.svg"
    }
  ]
}
```

### State Management

```javascript
// Search Context
{
  searchTerm: string,
  searchResults: Country[], // API response format
  isSearching: boolean,
  hasSearched: boolean,
  error: string | null,
  performSearch: (term: string) => void,
  clearSearch: () => void,
  setSearchTerm: (term: string) => void
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Geen internet**: Toon cached data, offline message
- **Lege zoekresultaten**: "Geen landen gevonden" message
- **API Rate Limit**: Graceful degradation, retry mechanism
- **Dubbele favorieten**: Preventie in UI en data layer
- **Te korte zoekterm**: Geen API call, toon validatie message
- **Snelle typing**: Debounce voorkomt onnodige calls
- **Zoekterm wijziging**: Cancel vorige request, start nieuwe
- **SVG Loading Errors**: Fallback naar placeholder vlag

### Performance Optimizations

- **Debounced Search**: 500ms delay voor API calls
- **Minimum Characters**: 3 karakters voorkomt onnodige calls
- **Request Cancellation**: Cancel vorige request bij nieuwe search
- **Lazy Loading**: Alleen zichtbare landen laden
- **SVG Caching**: React Native SVG caching voor vlaggen
- **Virtual Scrolling**: Voor grote lijsten landen

### Error Handling

- **API Errors**: Retry mechanism met exponential backoff
- **Network Timeout**: 10 seconden timeout, fallback UI
- **Invalid Data**: Graceful degradation, error boundaries
- **Rate Limit**: User feedback en cached data
- **Search Validation**: Clear feedback voor te korte zoektermen
- **SVG Errors**: Fallback naar placeholder icon

## 📱 UI/UX Specifications

### SafeAreaView Component

```javascript
{
  style: object,       // Safe area styling
  children: ReactNode  // Screen content
}
```

### Header Component

```javascript
{
  title: string,       // "Soccer App"
  subtitle: string     // "Ontdek voetbaldata per land"
}
```

### SearchBar Component

- **Placeholder**: "Zoek naar landen (min. 3 karakters)..."
- **Debounce**: 500ms
- **Clear Button**: X icon om zoekopdracht te wissen
- **Loading State**: Spinner tijdens API call
- **Validation**: Rode border/tekst bij < 3 karakters
- **Character Counter**: "2/3 karakters" indicator

### Search Results Layout

```javascript
// Conditional rendering logic
const shouldShowSearchResults = hasSearched && searchTerm.length >= 3;
const shouldShowSwimlanes = !shouldShowSearchResults;

// Layout structure
{
  shouldShowSearchResults ? (
    <SearchResults results={searchResults} />
  ) : (
    <>
      <FavoritesSection />
      <SuggestedSection />
    </>
  );
}
```

### CountryCard Usage

```javascript
// In Search Results
<CountryCard
  name={country.name}
  code={country.code}
  flag={country.flag}
  isFavorite={isFavorite(country.code)}
  onPress={() => navigateToCountry(country)}
  onHeartPress={() => toggleFavorite(country)}
  size="large"
/>

// In Favorites Section
<CountryCard
  name={favorite.name}
  code={favorite.code}
  flag={favorite.flag}
  isFavorite={true}
  onPress={() => navigateToCountry(favorite)}
  onHeartPress={() => removeFavorite(favorite)}
  size="large"
  showHeart={true}
/>

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

### FavoritesSection

- **Title**: "Mijn Favorieten"
- **Empty State**: "Nog geen favorieten toegevoegd"
- **Horizontal Scroll**: Swimlane layout
- **Max Items**: 5 zichtbaar, rest via scroll
- **Hidden**: Bij actieve zoekopdracht

### SuggestedSection

- **Title**: "Voorgestelde Landen"
- **Countries**: BE, NL, GB-ENG, ES, IT, FR, DE
- **Horizontal Scroll**: Swimlane layout
- **Static Data**: Geen API call nodig
- **Hidden**: Bij actieve zoekopdracht

### Search Results Section

- **Title**: "Zoekresultaten voor '{searchTerm}'"
- **Empty State**: "Geen landen gevonden voor '{searchTerm}'"
- **Loading State**: Skeleton cards (3-5 items)
- **Error State**: "Er is een fout opgetreden bij het zoeken"
- **Clear Search**: "Zoekopdracht wissen" button

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Gebruiker kan landen zoeken via searchbar (min. 3 karakters)
- [ ] Zoekopdracht wordt gedebounced (500ms)
- [ ] API call wordt alleen uitgevoerd bij ≥ 3 karakters
- [ ] Zoekresultaten vervangen swimlanes tijdens zoeken
- [ ] Swimlanes worden getoond bij lege zoekopdracht
- [ ] Gebruiker kan landen toevoegen/verwijderen als favoriet
- [ ] Favorieten worden opgeslagen en geladen bij app start
- [ ] Voorgestelde landen worden getoond
- [ ] Tappen op land kaart navigeert naar detail screen
- [ ] Zoekopdracht kan gewist worden met clear button
- [ ] Search results hebben API-compatible structuur
- [ ] SVG vlaggen worden correct gerenderd met SvgUri

### Non-Functional Requirements

- [ ] Search response time < 2 seconden
- [ ] App start time < 3 seconden
- [ ] Offline functionaliteit voor favorieten
- [ ] Error states voor alle edge cases
- [ ] Loading states voor alle async operaties
- [ ] Debounce werkt correct (geen onnodige API calls)
- [ ] Request cancellation bij nieuwe zoekopdracht
- [ ] SVG caching voor betere performance
- [ ] Error handling voor SVG loading

### UI Requirements

- [ ] Responsive design voor verschillende screen sizes
- [ ] Consistent styling met app theme
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Clear visual feedback voor zoekvalidatie
- [ ] Smooth transitions tussen search en swimlane views
- [ ] SVG fallback voor loading errors
