// src/context/ThemeContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ThemeContext = createContext(null);

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

const COLOR_SCHEMES = {
  DEFAULT: "default",
  BLUE: "blue",
  GREEN: "green",
  PURPLE: "purple",
  ORANGE: "orange",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || THEMES.LIGHT;
  });

  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem("colorScheme") || COLOR_SCHEMES.DEFAULT;
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "medium";
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  /**
   * Apply theme to document
   */
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("theme-light", "theme-dark");

    // Add current theme class
    if (theme === THEMES.AUTO) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.add(prefersDark ? "theme-dark" : "theme-light");
    } else {
      root.classList.add(`theme-${theme}`);
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
   * Apply color scheme
   */
  useEffect(() => {
    const root = document.documentElement;

    // Remove all color scheme classes
    Object.values(COLOR_SCHEMES).forEach((scheme) => {
      root.classList.remove(`color-scheme-${scheme}`);
    });

    // Add current color scheme class
    root.classList.add(`color-scheme-${colorScheme}`);

    // Save to localStorage
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  /**
   * Apply font size
   */
  useEffect(() => {
    const root = document.documentElement;

    // Remove all font size classes
    root.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large"
    );

    // Add current font size class
    root.classList.add(`font-size-${fontSize}`);

    // Save to localStorage
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  }, []);

  /**
   * Set specific theme
   */
  const changeTheme = useCallback((newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  /**
   * Change color scheme
   */
  const changeColorScheme = useCallback((newScheme) => {
    if (Object.values(COLOR_SCHEMES).includes(newScheme)) {
      setColorScheme(newScheme);
    }
  }, []);

  /**
   * Change font size
   */
  const changeFontSize = useCallback((newSize) => {
    const validSizes = ["small", "medium", "large"];
    if (validSizes.includes(newSize)) {
      setFontSize(newSize);
    }
  }, []);

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("sidebarCollapsed", newValue);
      return newValue;
    });
  }, []);

  /**
   * Reset to defaults
   */
  const resetTheme = useCallback(() => {
    setTheme(THEMES.LIGHT);
    setColorScheme(COLOR_SCHEMES.DEFAULT);
    setFontSize("medium");
    setSidebarCollapsed(false);
    localStorage.removeItem("theme");
    localStorage.removeItem("colorScheme");
    localStorage.removeItem("fontSize");
    localStorage.removeItem("sidebarCollapsed");
  }, []);

  /**
   * Check if dark mode
   */
  const isDarkMode = useCallback(() => {
    if (theme === THEMES.DARK) return true;
    if (theme === THEMES.AUTO) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }, [theme]);

  const value = {
    theme,
    colorScheme,
    fontSize,
    sidebarCollapsed,
    toggleTheme,
    changeTheme,
    changeColorScheme,
    changeFontSize,
    toggleSidebar,
    resetTheme,
    isDarkMode,
    THEMES,
    COLOR_SCHEMES,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme hook
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export default ThemeContext;
