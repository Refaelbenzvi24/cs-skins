import { createContext } from "react"
import { type SelectColors } from "./SelectColors"

interface SelectContextType {
	theme: {
		isDark: boolean
		colors: SelectColors
		colorsDark: SelectColors
	}
}

export const SelectContext = createContext<SelectContextType> ({} as SelectContextType)
