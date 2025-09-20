import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'blue';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    availableThemes: Theme[];
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
    availableThemes: ['light', 'dark', 'blue'],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const stored = localStorage.getItem(storageKey) as Theme;
        if (stored && ['light', 'dark', 'blue'].includes(stored)) {
            return stored;
        }
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove previous theme classes
        root.classList.remove('light', 'dark', 'blue');

        // Add new theme class
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'blue') {
            root.classList.add('blue');
        } else {
            // light theme is default, no class needed
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        availableThemes: ['light', 'dark', 'blue'] as Theme[],
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};