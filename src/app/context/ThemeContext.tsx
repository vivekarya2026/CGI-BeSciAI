/**
 * ============================================
 * 🎨 THEME CONTEXT — ThemeContext.tsx
 * ============================================
 *
 * This context manages the app's visual theme (Light, Dark, System).
 * It works by adding/removing the 'dark' class on the <html> element,
 * which activates the dark CSS variables defined in theme.css.
 *
 * HOW IT WORKS:
 * 1. 'light'  → removes .dark class (uses :root CSS vars)
 * 2. 'dark'   → adds .dark class (uses .dark CSS vars)
 * 3. 'system' → checks the OS preference via matchMedia
 *
 * HOW TO USE IN ANY COMPONENT:
 *   import { useTheme } from '../context/ThemeContext';
 *   const { theme, setTheme, resolvedTheme } = useTheme();
 *
 * PERSISTENCE:
 * The selected theme is saved to localStorage so it
 * persists across browser refreshes.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// SECTION 1: TYPE DEFINITIONS
// ============================================

/** The three theme options the user can pick */
export type ThemeOption = 'system' | 'light' | 'dark';

/** What the context provides to consumers */
interface ThemeContextType {
    theme: ThemeOption;              // What the user selected
    resolvedTheme: 'light' | 'dark'; // The actual active theme (resolved from 'system')
    setTheme: (theme: ThemeOption) => void;
}

// ============================================
// SECTION 2: CONTEXT CREATION
// ============================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// SECTION 3: HELPER — Apply Theme to <html>
// ============================================

function applyTheme(theme: ThemeOption): 'light' | 'dark' {
    const root = document.documentElement;

    let resolved: 'light' | 'dark';

    if (theme === 'system') {
        // Check OS preference
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        resolved = theme;
    }

    // Toggle the .dark class on <html>
    if (resolved === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    return resolved;
}

// ============================================
// SECTION 4: PROVIDER COMPONENT
// ============================================

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Load saved preference (default = 'light')
    const [theme, setThemeState] = useState<ThemeOption>(() => {
        const stored = localStorage.getItem('app_theme');
        return (stored as ThemeOption) || 'light';
    });

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Apply theme whenever it changes
    useEffect(() => {
        const resolved = applyTheme(theme);
        setResolvedTheme(resolved);
    }, [theme]);

    // Listen for OS theme changes if "system" is selected
    useEffect(() => {
        if (theme !== 'system') return;

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            const resolved = applyTheme('system');
            setResolvedTheme(resolved);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    // Save to localStorage and update state
    const setTheme = (newTheme: ThemeOption) => {
        setThemeState(newTheme);
        localStorage.setItem('app_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ============================================
// SECTION 5: CUSTOM HOOK
// ============================================

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
