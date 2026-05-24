import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Load theme from localStorage on mount only
    useEffect(() => {
        // Apply theme synchronously to prevent flash
        const savedTheme = localStorage.getItem('noteIt_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        setTheme(savedTheme);
    }, []);

    // Memoized toggle function to prevent unnecessary re-renders
    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Update DOM directly for instant visual feedback
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('noteIt_theme', newTheme);
            return newTheme;
        });
    }, []);

    // Memoize context value to prevent unnecessary re-renders of consumers
    const value = useMemo(() => ({ 
        theme, 
        toggleTheme
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export { ThemeProvider, useTheme };
