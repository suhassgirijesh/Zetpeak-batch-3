# Theme System Documentation

## Overview

CiniKraft now includes a comprehensive light/dark theme system with automatic system preference detection. Users can choose between Dark, Light, or Auto modes through their Profile settings.

## Features

✅ **Dark Theme** - Cinematic dark interface (default)
✅ **Light Theme** - Clean light interface  
✅ **Auto Mode** - Automatically matches system preference
✅ **Persistent** - Theme preference saved in localStorage
✅ **Smooth Transitions** - 300ms transitions when switching themes
✅ **System Detection** - Listens for OS theme changes in Auto mode

## How It Works

### 1. Theme Storage
Theme preferences are stored in localStorage with key: `cinikraft-theme`

Available values:
- `dark` - Force dark theme
- `light` - Force light theme  
- `auto` - Follow system preference

### 2. CSS Variables

The theme system uses CSS custom properties defined in `frontend/src/index.css`:

**Dark Theme (Default)**
```css
:root {
  --bg-primary: #0a0a0f;      /* Deep black */
  --bg-secondary: #12121a;    /* Slightly lighter */
  --text-primary: #ffffff;    /* White text */
  --text-secondary: #a1a1aa;  /* Gray text */
}
```

**Light Theme**
```css
[data-theme="light"] {
  --bg-primary: #ffffff;      /* White background */
  --bg-secondary: #f8f9fa;    /* Light gray */
  --text-primary: #1a1a24;    /* Dark text */
  --text-secondary: #52525b;  /* Medium gray */
}
```

The theme is applied by setting the `data-theme` attribute on the `<html>` element.

### 3. Theme Utility (`frontend/src/utils/theme.js`)

**Core Functions:**

- `setTheme(theme)` - Apply and save theme
- `getSavedTheme()` - Get stored theme preference
- `getSystemTheme()` - Detect OS theme preference
- `initializeTheme()` - Initialize theme on app load
- `toggleTheme()` - Quick toggle between light/dark

**Example Usage:**
```javascript
import { setTheme, THEMES } from '../utils/theme';

// Set theme
setTheme(THEMES.DARK);   // Force dark
setTheme(THEMES.LIGHT);  // Force light
setTheme(THEMES.AUTO);   // Auto-detect
```

### 4. Integration Points

**App.jsx** - Theme initialization
```javascript
import { initializeTheme } from './utils/theme';

useEffect(() => {
  initializeTheme();  // Load saved theme on app start
}, []);
```

**Profile.jsx** - Theme switching
```javascript
import { setTheme, getSavedTheme } from '../utils/theme';

// Load current theme
useEffect(() => {
  const savedTheme = getSavedTheme();
  setPreferences(prev => ({ ...prev, theme: savedTheme }));
}, []);

// Apply theme when user changes preference
const handlePreferenceChange = (key, value) => {
  if (key === "theme") {
    setTheme(value);  // Apply immediately
  }
};
```

## User Experience

### Changing Theme

1. Navigate to **Profile Settings** (click avatar in header → "Profile Settings")
2. Go to **Preferences** tab
3. Select theme from dropdown:
   - **Dark** - Always use dark theme
   - **Light** - Always use light theme
   - **Auto** - Match system preference
4. Theme applies **immediately** (no save button needed)
5. Preference is **automatically saved** to localStorage

### Auto Mode

When "Auto" is selected:
- If OS is in dark mode → Dark theme
- If OS is in light mode → Light theme
- Listens for OS theme changes and updates automatically

## Technical Details

### CSS Architecture

All colors use CSS variables, making theme switching instant:

```css
/* Component styling - works for both themes */
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

### Theme Detection

System preference is detected using CSS media query:
```javascript
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### Smooth Transitions

When theme changes, a 300ms transition is applied to background and text colors:
```javascript
document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
```

## Customization

### Adding New Theme Colors

1. Add variable to `:root` in `index.css`:
```css
:root {
  --new-color: #value-for-dark;
}
```

2. Override for light theme:
```css
[data-theme="light"] {
  --new-color: #value-for-light;
}
```

3. Use in components:
```css
.element {
  color: var(--new-color);
}
```

### Adding New Themes

To add a new theme (e.g., "blue"):

1. Update `THEMES` in `theme.js`:
```javascript
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  BLUE: 'blue',
  AUTO: 'auto',
};
```

2. Add CSS variables:
```css
[data-theme="blue"] {
  --bg-primary: #001529;
  --bg-secondary: #002140;
  /* ... more colors */
}
```

3. Update Profile dropdown with new option

## Browser Support

✅ Chrome 49+
✅ Firefox 31+
✅ Safari 9.1+
✅ Edge 15+

Features:
- CSS Custom Properties (CSS Variables)
- localStorage API
- Media Query API (prefers-color-scheme)

## Performance

- **Zero Runtime Cost** - Pure CSS with JavaScript only for switching
- **No Flash** - Theme applied before first render
- **Minimal Storage** - Only stores preference string (~10 bytes)
- **Event Listeners** - Single listener for system theme changes

## Testing

### Manual Testing

1. **Test Dark Theme:**
   - Set theme to "Dark" in Profile
   - Verify all pages use dark colors
   - Refresh page → Should stay dark

2. **Test Light Theme:**
   - Set theme to "Light" in Profile  
   - Verify all pages use light colors
   - Refresh page → Should stay light

3. **Test Auto Mode:**
   - Set theme to "Auto" in Profile
   - Change OS theme setting
   - Verify app follows OS theme
   - No refresh needed

4. **Test Persistence:**
   - Set any theme
   - Close browser completely
   - Reopen → Theme should be remembered

### Browser DevTools Testing

**Check localStorage:**
```javascript
localStorage.getItem('cinikraft-theme')
// Should return: "dark", "light", or "auto"
```

**Check HTML attribute:**
```javascript
document.documentElement.getAttribute('data-theme')
// Should return: "light" (or null for dark)
```

**Simulate OS theme change:**
Chrome DevTools → Rendering → Emulate CSS media feature prefers-color-scheme

## Troubleshooting

### Theme not persisting
- Check localStorage is enabled in browser
- Check for localStorage quota errors in console

### Theme not switching  
- Verify `data-theme` attribute on `<html>` element
- Check for CSS specificity conflicts
- Ensure all colors use CSS variables

### Auto mode not working
- Check browser support for `prefers-color-scheme`
- Verify system has dark/light mode setting
- Check console for media query listener errors

## Future Enhancements

Potential improvements:

- [ ] Custom theme creator (user-defined colors)
- [ ] Theme scheduling (dark at night, light during day)
- [ ] Per-page theme override
- [ ] High contrast mode for accessibility
- [ ] Color blind friendly themes
- [ ] Theme preview before applying
- [ ] Export/import custom themes

## Credits

Theme system designed and implemented for CiniKraft.
Uses modern CSS custom properties and system integration for optimal performance.

---

**Last Updated:** October 17, 2025
**Version:** 1.0.0
