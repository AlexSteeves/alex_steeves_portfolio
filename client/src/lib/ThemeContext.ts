import { createContext } from "react";

export type Theme = "dark" | "light";

export const ThemeContext = createContext<[Theme, () => void] | null>(null);
