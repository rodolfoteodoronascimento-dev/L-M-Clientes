import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme') as Theme | null;
            if (storedTheme) {
                return storedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark'; // Default for non-browser environments
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        localStorage.setItem('theme', theme);

    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
