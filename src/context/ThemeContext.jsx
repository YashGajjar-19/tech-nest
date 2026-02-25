import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={true}>
            {children}
        </NextThemesProvider>
    );
}

export function useTheme() {
    const { theme, setTheme, systemTheme } = useNextTheme();

    // Maintain compatible interface
    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    // If initial loading or value is not ready, default to 'dark' for UI consistency
    const currentTheme = theme === "system" ? systemTheme : theme;

    return { theme: currentTheme || "dark", setTheme, toggleTheme };
}