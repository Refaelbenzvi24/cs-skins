import {type ReactElement, useEffect, useState} from 'react'
import {setCookie} from "cookies-next"
import {ThemeProvider as EmotionThemeProvider, Global} from '@emotion/react'
import {GlobalStyles as BaseStyles} from 'twin.macro'
import GlobalStyles from "../../styles/GlobalStyles";
import type {ThemeOptions} from './types'
import {getInitialTheme, getStorageTheme, ThemeContext} from "./ThemeContext";


const updateDomThemeValue = (theme: ThemeOptions) => {
	const root = window.document.documentElement
	const isDark = theme === 'dark'
	
	root.classList.remove(isDark ? 'light' : 'dark')
	root.classList.add(theme)
}

const updateStorageThemeValue = (theme: ThemeOptions, storageKey: string) => {
	setCookie(storageKey, theme, {maxAge: 60 * 60 * 24 * 30 * 365})
	localStorage.setItem(storageKey, theme)
}

interface ThemeProviderOptions {
	children: ReactElement
	initialTheme: ThemeOptions | undefined | null
	defaultTheme: ThemeOptions
	storageKey?: string
}

const ThemeProvider = ({children, storageKey = 'theme', defaultTheme, initialTheme}: ThemeProviderOptions) => {
	const [theme, setTheme] = useState<ThemeOptions>(initialTheme || getInitialTheme(defaultTheme, storageKey))
	
	const toggleTheme = () => {
		const currentThemeValue = theme === 'dark' ? 'light' : 'dark'
		setTheme(currentThemeValue)
		updateDomThemeValue(currentThemeValue)
		updateStorageThemeValue(currentThemeValue, storageKey)
	}
	
	useEffect(() => {
		const syncStateWithStorage = () => {
			const storageValue = getStorageTheme(storageKey)
			
			if (typeof storageValue === 'undefined') return;
			
			setTheme(storageValue)
			updateDomThemeValue(storageValue)
		}
		
		window.addEventListener('storage', syncStateWithStorage)
		return () => {
			window.removeEventListener('storage', syncStateWithStorage)
		}
	}, [storageKey]);
	
	
	return (
		<>
			<BaseStyles/>
			<GlobalStyles/>
			<Global styles={{html: {scrollBehavior: 'smooth'}}}/>
			<EmotionThemeProvider theme={{isDark: theme === 'dark'}}>
				<ThemeContext.Provider
					value={{theme, toggleTheme}}>
					{children}
				</ThemeContext.Provider>
			</EmotionThemeProvider>
		</>
	)
}

export default ThemeProvider
