// Theme Management Utility

const THEME_KEY = 'cinikraft-theme';
const THEME_ATTRIBUTE = 'data-theme';

/**
 * Available themes
 */
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto',
};

/**
 * Get the system's preferred color scheme
 */
export const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.DARK;
  
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDarkMode ? THEMES.DARK : THEMES.LIGHT;
};

/**
 * Get the currently saved theme preference
 */
export const getSavedTheme = () => {
  if (typeof window === 'undefined') return THEMES.DARK;
  
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && Object.values(THEMES).includes(saved)) {
      return saved;
    }
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
  }
  
  return THEMES.DARK;
};

/**
 * Get the effective theme to apply
 * (resolves 'auto' to actual theme based on system preference)
 */
export const getEffectiveTheme = (theme) => {
  if (theme === THEMES.AUTO) {
    return getSystemTheme();
  }
  return theme;
};

/**
 * Apply theme to the document
 */
export const applyTheme = (theme) => {
  if (typeof window === 'undefined') return;
  
  const effectiveTheme = getEffectiveTheme(theme);
  
  // Remove any existing theme attribute
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  
  // Apply new theme (only set attribute for light theme, dark is default)
  if (effectiveTheme === THEMES.LIGHT) {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, THEMES.LIGHT);
  }
  
  // Add smooth transition for theme change
  document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 300);
};

/**
 * Save theme preference to localStorage
 */
export const saveTheme = (theme) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};

/**
 * Set and save theme
 */
export const setTheme = (theme) => {
  if (!Object.values(THEMES).includes(theme)) {
    console.error(`Invalid theme: ${theme}`);
    return;
  }
  
  applyTheme(theme);
  saveTheme(theme);
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = () => {
  if (typeof window === 'undefined') return;
  
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
  
  // Listen for system theme changes when in auto mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const currentTheme = getSavedTheme();
    if (currentTheme === THEMES.AUTO) {
      applyTheme(THEMES.AUTO);
    }
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleSystemThemeChange);
  }
  
  return savedTheme;
};

/**
 * Get current theme from document
 */
export const getCurrentTheme = () => {
  if (typeof window === 'undefined') return THEMES.DARK;
  
  const attribute = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return attribute === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
  const current = getCurrentTheme();
  const newTheme = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(newTheme);
  return newTheme;
};

export default {
  THEMES,
  getSystemTheme,
  getSavedTheme,
  getEffectiveTheme,
  applyTheme,
  saveTheme,
  setTheme,
  initializeTheme,
  getCurrentTheme,
  toggleTheme,
};
