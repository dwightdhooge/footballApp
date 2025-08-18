# Favorites System Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Persoonlijke landen** opslaan voor snelle toegang
- **Favorieten beheren** (toevoegen/verwijderen)
- **Snelle navigatie** naar favoriete landen
- **Offline toegang** tot favoriete data

### User Stories

1. **Als gebruiker** wil ik landen kunnen toevoegen als favoriet
2. **Als gebruiker** wil ik mijn favorieten kunnen bekijken op de homescreen
3. **Als gebruiker** wil ik favorieten kunnen verwijderen
4. **Als gebruiker** wil ik mijn favorieten behouden na app herstart
5. **Als gebruiker** wil ik snel toegang hebben tot mijn favoriete landen

## 🏗 Technical Implementation

### Componenten Structuur

```
FavoritesSystem/
├── FavoritesContext/     # State management
├── FavoritesSection/     # Homescreen swimlane
├── FavoritesScreen/      # Volledige favorieten overzicht
├── FavoriteCard/         # Favoriet item component
└── FavoritesStorage/     # AsyncStorage utilities
```

### State Management

```typescript
// Favorites Context
interface FavoritesContextType {
  favorites: Country[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (country: Country) => Promise<void>;
  removeFavorite: (countryId: number) => Promise<void>;
  isFavorite: (countryId: number) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
}
```

### Data Persistence

```typescript
// AsyncStorage Keys
const STORAGE_KEYS = {
  FAVORITES: '@soccer_app_favorites',
  FAVORITES_TIMESTAMP: '@soccer_app_favorites_timestamp'
} as const;

// Storage structure
interface FavoritesStorageData {
  favorites: Country[];
  lastUpdated: number;
  version: string;
}
```

### Favorites Section (Homescreen)

- **Title**: "Mijn Favorieten"
- **Layout**: Horizontal scrollable swimlane
- **Max Visible**: 5 items, rest via scroll
- **Empty State**: "Nog geen favorieten toegevoegd"
- **Loading State**: Skeleton cards (3 items)

### Favorites Screen (Dedicated)

- **Title**: "Mijn Favoriete Landen"
- **Layout**: Vertical scrollable list
- **Search**: Filter favorieten
- **Sort Options**: Naam, recent toegevoegd
- **Bulk Actions**: Select multiple, remove all

### Add to Favorites Flow

```typescript
// Add to favorites flow
const addToFavorites = async (country: Country): Promise<void> => {
  try {
    // Check if already favorite
    if (isFavorite(country.code)) {
      return;
    }

    // Add to favorites
    const newFavorites = [...favorites, country];
    await saveFavorites(newFavorites);
    
    // Update context
    setFavorites(newFavorites);
  } catch (error) {
    console.error("Add favorite error:", error);
    throw error;
  }
};

// Remove from favorites flow
const removeFromFavorites = async (countryId: number): Promise<void> => {
  try {
    // Remove from favorites
    const newFavorites = favorites.filter(fav => fav.code !== countryId.toString());
    await saveFavorites(newFavorites);
    
    // Update context
    setFavorites(newFavorites);
  } catch (error) {
    console.error("Remove favorite error:", error);
    throw error;
  }
};

// Save favorites to storage
const saveFavorites = async (favorites: Country[]): Promise<void> => {
  try {
    const storageData: FavoritesStorageData = {
      favorites,
      lastUpdated: Date.now(),
      version: '1.0.0'
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(storageData));
  } catch (error) {
    console.error("Save favorites error:", error);
    throw error;
  }
};

// Load favorites from storage
const loadFavorites = async (): Promise<void> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (storedData) {
      const parsedData: FavoritesStorageData = JSON.parse(storedData);
      setFavorites(parsedData.favorites);
    }
  } catch (error) {
    console.error("Load favorites error:", error);
    setError(error instanceof Error ? error.message : "Unknown error");
  }
};

// Check if country is favorite
const isFavorite = (countryCode: string): boolean => {
  return favorites.some(fav => fav.code === countryCode);
};
```

## 🧪 Quality Considerations

### Edge Cases

- **Dubbele favorieten**: Preventie in UI en data layer
- **Storage vol**: Graceful degradation, user warning
- **Corrupte data**: Data validation en recovery
- **Sync issues**: Conflict resolution tussen devices
- **Offline mode**: Favorieten blijven beschikbaar
- **Storage quota**: Fallback naar memory storage

### Performance Optimizations

- **Lazy Loading**: Alleen zichtbare favorieten laden
- **Caching**: Favorieten in memory cache
- **Batch Operations**: Bulk add/remove operations
- **Storage Optimization**: Compressie van stored data
- **Background Sync**: Sync in background thread

### Error Handling

- **Storage Errors**: Fallback naar memory storage
- **Data Corruption**: Auto-recovery van corrupte data
- **Network Issues**: Offline mode voor favorieten
- **Memory Issues**: Cleanup van oude data
- **Version Conflicts**: Data migration tussen app versions

## 📱 UI/UX Specifications

### FavoriteCard Component

```javascript
{
  id: number,
  name: string,
  flag: string,
  code: string,
  onPress: () => void,
  onRemove: () => void,
  isRemovable: boolean
}
```

### Heart Icon (CountryCard)

- **Empty Heart**: Outline icon voor niet-favoriet
- **Filled Heart**: Solid icon voor favoriet
- **Animation**: Smooth transition bij toggle
- **Accessibility**: "Toevoegen aan favorieten" / "Verwijderen uit favorieten"

### FavoritesSection (Homescreen)

- **Height**: 120px (fixed)
- **Scroll Direction**: Horizontal
- **Item Width**: 100px per card
- **Spacing**: 12px tussen items
- **Padding**: 16px aan zijkanten

### FavoritesScreen (Dedicated)

- **Layout**: Vertical FlatList
- **Item Height**: 80px
- **Search Bar**: Top van screen
- **Sort Button**: Top right
- **Empty State**: Centered met CTA

### Add to Favorites Flow

1. **User taps heart** → Visual feedback (animation)
2. **API call** → Add to favorites endpoint
3. **Local storage** → Update AsyncStorage
4. **Context update** → Update favorites state
5. **UI update** → Heart icon changes

### Remove from Favorites Flow

1. **User taps heart** → Confirmation dialog
2. **User confirms** → Remove from storage
3. **Context update** → Update favorites state
4. **UI update** → Remove from list/section

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Gebruiker kan landen toevoegen als favoriet
- [ ] Gebruiker kan landen verwijderen uit favorieten
- [ ] Favorieten worden opgeslagen in AsyncStorage
- [ ] Favorieten worden geladen bij app start
- [ ] Favorieten zijn beschikbaar offline
- [ ] Dubbele favorieten worden voorkomen
- [ ] Favorieten worden getoond in homescreen swimlane
- [ ] Favorieten zijn toegankelijk via dedicated screen
- [ ] Heart icon toont correcte status (filled/empty)
- [ ] Favorieten kunnen gefilterd en gesorteerd worden

### Non-Functional Requirements

- [ ] Favorites load time < 1 seconde
- [ ] Add/remove favorite < 500ms
- [ ] Offline functionaliteit voor alle favorieten operaties
- [ ] Data persistence tussen app sessions
- [ ] Error handling voor alle storage operaties
- [ ] Memory efficient voor grote favorieten lijsten

### UI Requirements

- [ ] Smooth animations voor heart icon transitions
- [ ] Consistent styling met app theme
- [ ] Accessibility support voor alle favorieten acties
- [ ] Responsive design voor verschillende screen sizes
- [ ] Clear visual feedback voor alle user actions
- [ ] Intuitive empty states en loading states

### Data Requirements

- [ ] Favorites data is encrypted in storage
- [ ] Data validation voor corrupte entries
- [ ] Version migration voor app updates
- [ ] Backup/restore functionaliteit
- [ ] Data export mogelijkheid (optioneel)
