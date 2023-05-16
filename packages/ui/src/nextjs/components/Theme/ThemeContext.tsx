import {createContext} from 'react'

import type {ThemeContextType, ThemeOptions} from './types'

export const getStorageTheme = (storageKey: string) => {
	if (typeof window === 'undefined') return undefined
	
	const theme = localStorage.getItem(storageKey)
	return theme as ThemeOptions | undefined
}

export const setLocalStorageTheme = (value: ThemeOptions, storageKey: string) => {
	if (typeof window === 'undefined') return;
	
	localStorage.setItem(storageKey, value)
}

export const getInitialTheme = (defaultValue: ThemeOptions, storageKey: string): ThemeOptions => {
	const storedTheme = getStorageTheme(storageKey)
	if (storedTheme) {
		return storedTheme
	}
	
	const userMedia = typeof window === 'undefined' ? undefined : window.matchMedia('(prefers-color-scheme:dark)')
	if (userMedia && userMedia.matches) {
		return 'dark'
	}
	
	return defaultValue
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
