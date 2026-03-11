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
        'cgi-purple': '#5236ab',
        'cgi-red': '#e31937',
        
        // Purple Scale
        purple: {
          50: '#f2f1f9',
          100: '#e6e3f3',
          200: '#cbc3e6',
          300: '#afa3d8',
          400: '#9e83f5',
          500: '#755ebc',
          600: '#5236ab',
          700: '#3a2679',
          800: '#2d1e5e',
          900: '#200a58',
        },
        
        // Gray Scale
        gray: {
          50: '#efefef',
          100: '#c0c0c0',
          200: '#a8a8a8',
          300: '#767676',
          400: '#5c5c5c',
          500: '#333333',
          600: '#2e2e2e',
          700: '#242424',
          800: '#1c1c1c',
          900: '#151515',
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
        'card': '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12)',
        'purple': '0 4px 12px rgba(139,92,246,0.3)',
        'app': 'var(--app-shadow)',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-red': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-gray': 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
      },
    },
  },
  plugins: [],
} satisfies Config
