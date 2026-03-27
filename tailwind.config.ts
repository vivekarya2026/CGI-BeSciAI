import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // CGI Brand Colors
        'cgi-purple': 'var(--cgi-purple)',
        'cgi-red': 'var(--cgi-red)',
        'cgi-gray': 'var(--cgi-gray)',

        // Purple Scale
        purple: {
          50: 'var(--purple-50)',
          100: 'var(--purple-100)',
          200: 'var(--purple-200)',
          300: 'var(--purple-300)',
          400: 'var(--purple-400)',
          500: 'var(--purple-500)',
          600: 'var(--purple-600)',
          700: 'var(--purple-700)',
          800: 'var(--purple-800)',
          900: 'var(--purple-900)',
        },

        // Gray Scale
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },

        // Red Scale
        red: {
          50: 'var(--red-50)',
          100: 'var(--red-100)',
          200: 'var(--red-200)',
          300: 'var(--red-300)',
          400: 'var(--red-400)',
          500: 'var(--cgi-red)',
          600: 'var(--red-600)',
          700: 'var(--red-700)',
          800: 'var(--red-800)',
          900: 'var(--red-900)',
        },

        // White Scale
        white: {
          DEFAULT: 'var(--white)',
          100: 'var(--white-100)',
          200: 'var(--white-200)',
          300: 'var(--white-300)',
          400: 'var(--white-400)',
          500: 'var(--white-500)',
          600: 'var(--white-600)',
          700: 'var(--white-700)',
        },

        // Success Scale
        success: {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          base: 'var(--success-base)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
        },

        // Warning Scale
        warning: {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          base: 'var(--warning-base)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
        },

        // Error Scale
        error: {
          50: 'var(--error-50)',
          100: 'var(--error-100)',
          200: 'var(--error-200)',
          300: 'var(--error-300)',
          400: 'var(--error-400)',
          base: 'var(--error-base)',
          600: 'var(--error-600)',
          700: 'var(--error-700)',
          800: 'var(--error-800)',
          900: 'var(--error-900)',
        },

        // Magenta Scale
        magenta: {
          200: 'var(--magenta-200)',
          300: 'var(--magenta-300)',
          base: 'var(--magenta-base)',
          600: 'var(--magenta-600)',
        },

        // Archetype Colors
        archetype: {
          trailblazer: 'var(--archetype-trailblazer)',
          guide: 'var(--archetype-guide)',
          connector: 'var(--archetype-connector)',
          explorer: 'var(--archetype-explorer)',
          champion: 'var(--archetype-champion)',
          innovator: 'var(--archetype-innovator)',
        },

        // App Semantic Colors (CSS Variables)
        'app-bg': 'var(--app-bg)',
        'app-surface': 'var(--app-surface)',
        'app-surface-hover': 'var(--app-surface-hover)',
        'app-surface-alt': 'var(--app-surface-alt)',
        'app-text-primary': 'var(--app-text-primary)',
        'app-text-secondary': 'var(--app-text-secondary)',
        'app-text-muted': 'var(--app-text-muted)',
        'app-text-hint': 'var(--app-text-hint)',
        'app-border': 'var(--app-border)',
        'app-border-strong': 'var(--app-border-strong)',
        'app-brand': 'var(--app-brand)',
        'app-brand-light': 'var(--app-brand-light)',
      },
      boxShadow: {
        'card': 'var(--shadow-chart-card)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'primary-btn': 'var(--shadow-primary-button)',
        'secondary-btn': 'var(--shadow-secondary-button)',
        'btn-hover': 'var(--shadow-button-hover)',
        'dropdown': 'var(--shadow-dropdown)',
        'modal': 'var(--shadow-modal)',
        'alerts': 'var(--shadow-alerts)',
        'filter': 'var(--shadow-filter)',
        'app': 'var(--app-shadow)',
      },
      backgroundImage: {
        'gradient-cgi': 'var(--gradient-a-45)',
        'gradient-cgi-vertical': 'var(--gradient-a-vertical)',
        'gradient-cgi-counter': 'var(--gradient-a-vertical-counter)',
        'gradient-cgi-b': 'var(--gradient-b-vertical)',
        'gradient-purple': 'linear-gradient(135deg, var(--purple-400) 0%, var(--purple-700) 100%)',
        'gradient-gray': 'linear-gradient(135deg, var(--white-500) 0%, var(--gray-50) 100%)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
      },
    },
  },
  plugins: [],
} satisfies Config
