import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const BattleContext = createContext({});

export const BattleProvider = ({ children }) => {
    // Try to load from localStorage so queue survives refresh
    const [selectedDevices, setSelectedDevices] = useState(() => {
        const saved = localStorage.getItem("battle_queue");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("battle_queue", JSON.stringify(selectedDevices));
    }, [selectedDevices]);

    const addToBattle = (device) => {
        if (selectedDevices.find(d => d.id === device.id)) {
            return toast.error("UNIT_ALREADY_QUEUED");
        }
        if (selectedDevices.length >= 3) {
            return toast.error("BATTLE_QUEUE_FULL (MAX 3)");
        }
        setSelectedDevices([...selectedDevices, device]);
        toast.success("UNIT_ADDED_TO_QUEUE");
    };

    const removeFromBattle = (id) => {
        setSelectedDevices(prev => prev.filter(d => d.id !== id));
    };

    const isInBattle = (id) => selectedDevices.some(d => d.id === id);

    return (
        <BattleContext.Provider value={{ selectedDevices, addToBattle, removeFromBattle, isInBattle }}>
            {children}
        </BattleContext.Provider>
    );
};

export const useBattle = () => useContext(BattleContext);