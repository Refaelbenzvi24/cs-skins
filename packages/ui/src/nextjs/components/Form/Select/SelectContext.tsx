'use client'
import { createContext } from "react"
import { type SelectColors } from "./SelectColors"

export interface SelectContextProps {
	textInput?: boolean
}

export interface SelectContextType {
	theme: {
		isDark: boolean
		colors: SelectColors
		colorsDark: SelectColors
	},
	props: SelectContextProps
}

export const SelectContext = createContext<SelectContextType> ({} as SelectContextType)
