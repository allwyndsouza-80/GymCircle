/**
 * Design System Configuration
 * 
 * Centralized theme configuration for consistent styling across the application.
 * Currently using the "Dark Amber" theme - additional themes can be added here.
 */

export const themes = {
  darkAmber: {
    name: 'Dark Amber',
    colors: {
      // Primary brand color
      primary: '#F59E0B',
      primaryHot: '#FF6B00',
      primaryDark: '#D97706',
      primaryLight: '#FFB830',
      
      // Background colors
      black: '#080808',
      steel: '#111111',
      panel: '#161616',
      
      // Border & dividers
      border: '#282828',
      borderLight: '#333333',
      
      // Text colors
      white: '#F5F0E8',
      muted: '#666666',
      mutedLight: '#888888',
      mutedDark: '#444444',
      mutedExtraDark: '#333333',
      
      // Semantic colors
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    
    fonts: {
      display: "'Bebas Neue', sans-serif",
      heading: "'Oswald', sans-serif",
      body: "'DM Sans', sans-serif",
    },
    
    fontImports: [
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Oswald:wght@700&display=swap'
    ],
    
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      '2xl': '64px',
      '3xl': '80px',
      '4xl': '120px',
    },
    
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    
    transitions: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s',
      verySlow: '0.8s',
    },
    
    animations: {
      // Easing functions
      easing: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        linear: 'linear',
      },
      
      // Animation durations
      duration: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s',
        verySlow: '0.8s',
      },
    },
    
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
      md: '0 4px 16px rgba(0, 0, 0, 0.15)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
      glow: '0 12px 40px rgba(245, 158, 11, 0.35)',
    },
    
    effects: {
      noise: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      backdropBlur: 'blur(12px)',
      gridSize: '60px',
    },
  },
  
  // Future theme example (commented out)
  // lightBlue: {
  //   name: 'Light Blue',
  //   colors: {
  //     primary: '#3B82F6',
  //     ...
  //   },
  //   ...
  // },
} as const

// Active theme - change this to switch themes app-wide
export const ACTIVE_THEME = 'darkAmber' as const

// Export the active theme
export const theme = themes[ACTIVE_THEME]

// Type exports for TypeScript
export type Theme = typeof theme
export type ThemeColors = typeof theme.colors
export type ThemeFonts = typeof theme.fonts
