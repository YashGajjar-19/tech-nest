import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check localStorage or System Preference
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("tech_nest_theme");
            if (saved) return saved;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // 1. Remove both potential classes to be safe
        root.classList.remove("light", "dark");
        // 2. Add the current theme class
        root.classList.add(theme);
        // 3. Persist to storage
        localStorage.setItem("tech_nest_theme", theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);