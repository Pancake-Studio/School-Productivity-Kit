"use client";

import { useTheme } from "../theme-provider";
import Image from "next/image";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            <Image
                width={24}
                height={24}
                src={theme === "dark" ? "/icon/moon.svg" : "/icon/sun.svg"}
                alt={theme === "dark" ? "moon" : "sun"}
                className={theme === "dark"
                    ? "invert"           // สีขาวใน dark mode
                    : "invert-0"         // สีดำใน light mode
                }
            />
        </button>
    );
}