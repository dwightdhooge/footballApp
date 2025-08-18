# Settings Screen Feature

## 🎯 Product Requirements

### Gebruikersdoelen

- **Thema configuratie** aanpassen naar persoonlijke voorkeuren
- **Device theme volgen** of manueel thema selecteren
- **App versie** informatie bekijken

### User Stories

1. **Als gebruiker** wil ik het thema van mijn device kunnen volgen
2. **Als gebruiker** wil ik manueel een thema kunnen selecteren
3. **Als gebruiker** wil ik de app versie kunnen bekijken

## 🏗 Technical Implementation

### Componenten Structuur

```
SettingsScreen/
├── SafeAreaView/        # Safe area wrapper
├── SettingsHeader/      # Settings header met titel
├── ThemeSection/        # Thema configuratie sectie
│   ├── AutoThemeSwitch/ # Switch voor device theme volgen
│   └── ManualThemeSelector/ # Manuele thema selectie
├── AppVersionSection/   # App versie informatie
└── SettingsItem/        # Herbruikbare settings item
```

### Navigation Flow

1. **Settings Tab** → Navigate naar SettingsScreen
2. **Theme Configuration** → Toggle auto theme of manueel thema selecteren
3. **App Version** → Bekijk app versie informatie

### Settings Categories

#### Theme Configuration

- **Auto Theme**: Volg device theme (system)
- **Manual Theme**: Manueel light/dark theme selecteren
- **Theme Preview**: Preview van geselecteerd thema

#### App Information

- **App Version**: Huidige app versie
- **Build Number**: App build informatie

### State Management

```typescript
// Settings Context
interface SettingsContextType {
  // Theme Configuration
  isAutoTheme: boolean; // Volg device theme
  manualTheme: "light" | "dark" | null; // Manueel geselecteerd thema
  currentTheme: "light" | "dark"; // Huidig actief thema

  // App Information
  appVersion: string; // App versie (e.g., "1.0.0")
  buildNumber: string; // Build nummer (e.g., "1")

  // Actions
  toggleAutoTheme: () => void;
  setManualTheme: (theme: "light" | "dark") => void;
  getCurrentTheme: () => "light" | "dark";
}
```

## 🧪 Quality Considerations

### Edge Cases

- **Device theme changes**: Detecteer en reageer op device theme wijzigingen
- **Invalid theme values**: Fallback naar default theme
- **Storage errors**: Graceful degradation bij AsyncStorage issues
- **App version unavailable**: Fallback naar placeholder versie
- **Theme persistence errors**: Rollback naar laatste werkende theme

### Performance Optimizations

- **Theme switching**: Smooth transitions tussen themes
- **Settings persistence**: Efficient AsyncStorage usage
- **Memory management**: Cleanup van oude theme data
- **Lazy loading**: Theme components alleen laden wanneer nodig

### Error Handling

- **Storage errors**: Graceful degradation bij storage issues
- **Theme detection errors**: Fallback naar light theme
- **App version errors**: Fallback naar placeholder versie
- **Theme persistence errors**: Rollback naar laatste werkende theme

## 📱 UI/UX Specifications

### SafeAreaView Component

```javascript
{
  style: object,       // Safe area styling
  children: ReactNode  // Screen content
}
```

### SettingsHeader Component

```javascript
{
  title: string,        // "Instellingen"
  subtitle?: string,    // Optional subtitle
  onBack?: () => void   // Optional back navigation
}
```

### ThemeSection Component

```javascript
{
  isAutoTheme: boolean,           // Volg device theme
  manualTheme: 'light' | 'dark' | null, // Manueel thema
  onToggleAutoTheme: () => void, // Toggle auto theme
  onSetManualTheme: (theme: 'light' | 'dark') => void, // Set manueel thema
  disabled?: boolean              // Disabled state
}
```

### AutoThemeSwitch Component

```javascript
{
  isAutoTheme: boolean,           // Volg device theme
  onToggle: () => void,          // Toggle auto theme
  disabled?: boolean,             // Disabled state
  subtitle?: string               // Optional subtitle
}
```

### ManualThemeSelector Component

```javascript
{
  currentTheme: 'light' | 'dark',        // Huidig actief thema van de app
  onSelectTheme: (theme: 'light' | 'dark') => void, // Select thema
  disabled?: boolean,                     // Disabled state (wanneer auto theme aan is)
  isReadOnly?: boolean                    // Read-only state (wanneer auto theme aan is)
}
```

### AppVersionSection Component

```javascript
{
  appVersion: string,             // App versie
  buildNumber: string,            // Build nummer
  subtitle?: string               // Optional subtitle
}
```

### Screen Layout

```
┌─────────────────────────┐
│ SafeAreaView            │
├─────────────────────────┤
│ Settings Header         │
│ "Instellingen"          │
├─────────────────────────┤
│ Theme Section           │
│ ├─ Auto Theme Switch    │
│ │   [Follow Device ▼]   │
│ └─ Manual Theme Selector│
│    [Light] [Dark]       │
│    (altijd zichtbaar,   │
│    disabled bij auto)   │
├─────────────────────────┤
│ App Version Section     │
│ └─ Version 1.0.0 (1)   │
└─────────────────────────┘
```

### Visual Design

- **Header**: Clean header met titel "Instellingen"
- **Theme Section**: Duidelijke sectie met auto theme switch
- **Manual Theme Selector**: Radio buttons of segmented control voor light/dark (altijd zichtbaar)
- **App Version**: Subtle versie informatie onderaan
- **Theme Preview**: Kleine preview van geselecteerd thema
- **Loading States**: Smooth transitions tussen themes

### Interaction States

- **Normal**: Default styling
- **Pressed**: Slight scale down (0.95)
- **Disabled**: Reduced opacity, no interactions (manual selector wanneer auto aan)
- **Read-Only**: Visual indication dat selector read-only is
- **Loading**: Smooth theme transition
- **Selected**: Highlighted state voor huidig actief thema
- **Auto Active**: Special styling wanneer auto theme actief is

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Gebruiker kan navigeren naar Settings Screen
- [ ] Auto theme switch werkt correct
- [ ] Manual theme selector is altijd zichtbaar
- [ ] Manual theme selector is disabled wanneer auto theme aan is
- [ ] Manual theme selector toont altijd het huidige actieve thema
- [ ] Theme wijzigingen worden direct toegepast
- [ ] Settings worden persistent opgeslagen
- [ ] App versie wordt correct weergegeven
- [ ] Device theme wordt correct gedetecteerd

### Non-Functional Requirements

- [ ] Settings screen load time < 1 seconde
- [ ] Theme switching tijd < 500ms
- [ ] Settings persistence werkt correct
- [ ] Error handling voor alle edge cases
- [ ] Smooth transitions tussen themes
- [ ] Offline functionaliteit voor theme settings

### UI Requirements

- [ ] Responsive design voor verschillende screen sizes
- [ ] Consistent styling met app theme
- [ ] Accessibility support (VoiceOver, TalkBack)
- [ ] Dark/Light mode support
- [ ] Smooth theme transitions
- [ ] Clear visual feedback voor theme selection
- [ ] Proper disabled states voor manual selector
- [ ] Read-only visual indication voor manual selector

### Data Requirements

- [ ] Theme settings persistence via AsyncStorage
- [ ] Device theme detection werkt correct
- [ ] Theme state management werkt correct
- [ ] App version detection werkt correct
- [ ] Theme fallback naar light theme werkt

## 🔧 Usage Examples

### ThemeSection Usage

```javascript
<ThemeSection
  isAutoTheme={isAutoTheme}
  manualTheme={manualTheme}
  onToggleAutoTheme={toggleAutoTheme}
  onSetManualTheme={setManualTheme}
/>
```

### AutoThemeSwitch Usage

```javascript
<AutoThemeSwitch
  isAutoTheme={isAutoTheme}
  onToggle={toggleAutoTheme}
  subtitle="Volg het thema van je device"
/>
```

### ManualThemeSelector Usage

```javascript
<ManualThemeSelector
  currentTheme={currentTheme}
  onSelectTheme={setManualTheme}
  disabled={isAutoTheme}
  isReadOnly={isAutoTheme}
/>
```

### AppVersionSection Usage

```javascript
<AppVersionSection appVersion="1.0.0" buildNumber="1" subtitle="Soccer App" />
```

### Theme State Management

```typescript
// Theme context
interface ThemeContextType {
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
  currentTheme: "light" | "dark";
  toggleAutoTheme: () => void;
  setManualTheme: (theme: "light" | "dark") => void;
  getCurrentTheme: () => "light" | "dark";
}

// Theme provider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAutoTheme, setIsAutoTheme] = useState<boolean>(true);
  const [manualTheme, setManualTheme] = useState<"light" | "dark" | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Toggle auto theme
  const toggleAutoTheme = (): void => {
    setIsAutoTheme(!isAutoTheme);
    if (!isAutoTheme) {
      // Schakel naar auto mode
      setManualTheme(null);
      // Detecteer device theme
      const deviceTheme = Appearance.getColorScheme() || "light";
      setCurrentTheme(deviceTheme);
    }
  };

  // Set manual theme
  const setManualThemeHandler = (theme: "light" | "dark"): void => {
    setManualTheme(theme);
    setCurrentTheme(theme);
    setIsAutoTheme(false);
  };

  // Get current theme for display
  const getCurrentThemeForDisplay = (): "light" | "dark" => {
    if (isAutoTheme) {
      return Appearance.getColorScheme() || "light";
    }
    return manualTheme || "light";
  };

  // Get current theme
  const getCurrentTheme = (): "light" | "dark" => {
    if (isAutoTheme) {
      return Appearance.getColorScheme() || "light";
    }
    return manualTheme || "light";
  };

  // Listen to device theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isAutoTheme) {
        setCurrentTheme(colorScheme || "light");
      }
    });

    return () => subscription?.remove();
  }, [isAutoTheme]);

  return (
    <ThemeContext.Provider
      value={{
        isAutoTheme,
        manualTheme,
        currentTheme,
        toggleAutoTheme,
        setManualTheme: setManualThemeHandler,
        getCurrentTheme,
        getCurrentThemeForDisplay,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
```

### Theme Persistence

```typescript
// Save theme settings
const saveThemeSettings = async (settings: {
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem("theme_settings", JSON.stringify(settings));
  } catch (error) {
    console.error("Theme settings save error:", error);
  }
};

// Load theme settings
const loadThemeSettings = async (): Promise<{
  isAutoTheme: boolean;
  manualTheme: "light" | "dark" | null;
} | null> => {
  try {
    const settings = await AsyncStorage.getItem("theme_settings");
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    console.error("Theme settings load error:", error);
  }
  return {
    isAutoTheme: true,
    manualTheme: null,
  };
};

// Initialize theme settings
const initializeTheme = async (): Promise<void> => {
  const settings = await loadThemeSettings();
  if (settings) {
    setIsAutoTheme(settings.isAutoTheme);
    setManualTheme(settings.manualTheme);

    if (settings.isAutoTheme) {
      const deviceTheme = Appearance.getColorScheme() || "light";
      setCurrentTheme(deviceTheme);
    } else {
      setCurrentTheme(settings.manualTheme || "light");
    }
  }
};
```

### App Version Detection

```typescript
// Get app version
const getAppVersion = (): { version: string; buildNumber: string } => {
  try {
    return {
      version: Constants.expoConfig?.version || "1.0.0",
      buildNumber:
        Constants.expoConfig?.ios?.buildNumber ||
        Constants.expoConfig?.android?.versionCode ||
        "1",
    };
  } catch (error) {
    console.error("App version detection error:", error);
    return {
      version: "1.0.0",
      buildNumber: "1",
    };
  }
};
```
