"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null; // ดึงค่าที่เคยบันทึกไว้
        const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"; // อ่าน theme จาก OS ของผู้ใช้

        const initial = saved ?? preferred; // ถ้ามีค่าใน localStorage ใช้อันนั้น ถ้าไม่มีใช้จาก OS
        setTheme(initial);
        document.documentElement.classList.toggle("dark", initial === "dark"); // เพิ่ม/ลบ class "dark" บน <html>
    }, []); // [] = รันแค่ครั้งเดียวตอน mount

    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            localStorage.setItem("theme", next);
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);