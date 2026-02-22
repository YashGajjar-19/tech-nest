/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CommandContext = createContext();

export function CommandProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // We need this to navigate when a user selects a result

    // Toggle function
    const toggleCommand = () => setIsOpen((prev) => !prev);

    // Keyboard Listener (Cmd+K or Ctrl+K)
    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Helper to close search and go to page
    const navigateTo = (path) => {
        setIsOpen(false);
        navigate(path);
    }

    return (
        <CommandContext.Provider value={{ isOpen, setIsOpen, toggleCommand, navigateTo }}>
            {children}
        </CommandContext.Provider>
    );
}

export const useCommand = () => useContext(CommandContext);