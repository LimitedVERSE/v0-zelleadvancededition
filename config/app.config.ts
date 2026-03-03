/**
 * Application configuration
 * Centralized settings for the Zelle Money Transfer Interface
 */

export const appConfig = {
  // Application metadata
  name: "Zelle Money Transfer",
  description: "Secure money transfer via Zelle Network",
  version: "1.0.0",

  // API simulation settings
  api: {
    simulatedDelay: 300, // milliseconds
    enableMockData: true,
  },

  // UI settings
  ui: {
    itemsPerPage: 16,
    searchDebounceMs: 300,
    colors: {
      primary: "#6D1ED4", // Zelle purple
      secondary: "#000000", // Black
      background: "#FFFFFF", // White
    },
  },

  // Feature flags
  features: {
    enableSearch: true,
    enableDropdowns: true,
    enableKeyboardNavigation: true,
  },

  // Accessibility settings
  accessibility: {
    announceLoadingStates: true,
    focusVisibleRings: true,
  },
} as const

export type AppConfig = typeof appConfig
