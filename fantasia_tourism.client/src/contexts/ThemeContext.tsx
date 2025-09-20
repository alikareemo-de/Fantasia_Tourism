import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'sepia';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    themes: { value: Theme; label: string; description: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
    { value: 'light' as Theme, label: 'Light', description: 'Clean and bright interface with white background and sky blue highlights' },
    { value: 'dark' as Theme, label: 'Dark', description: 'Dark background with turquoise highlights' },
    { value: 'sepia' as Theme, label: 'Tropical', description: 'Warm and vibrant style with orange, yellow, and palm green colors' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('photo-dream-theme');
        return (saved as Theme) || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Remove all theme classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-sepia');

        // Add current theme class
        if (theme !== 'light') {
            root.classList.add(`theme-${theme}`);
        }

        // Save to localStorage
        localStorage.setItem('photo-dream-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}