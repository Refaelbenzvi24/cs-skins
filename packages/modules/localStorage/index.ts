type ThemeName = 'light' | 'dark'

export default class LocalStorage {
	static THEME = 'theme'
	static IS_ANIMATIONS_ACTIVE = 'is_animations_active'
	
	static getTheme(): ThemeName | undefined {
		if (typeof window === 'undefined') return undefined
		
		const theme = localStorage.getItem(LocalStorage.THEME)
		return theme as ThemeName | undefined
	}
	
	static setTheme(theme: boolean | string) {
		if (typeof window === 'undefined') return
		localStorage.setItem(LocalStorage.THEME, theme.toString())
	}
	
	static getIsAnimationsActive() {
		if (typeof window === 'undefined') return undefined
		
		const isAnimationsActive = localStorage.getItem(LocalStorage.IS_ANIMATIONS_ACTIVE)
		return isAnimationsActive === null ? null : isAnimationsActive === 'true'
	}
	
	static setIsAnimationsActive(isAnimationsActive: boolean) {
		if (typeof window === 'undefined') return
		localStorage.setItem(LocalStorage.IS_ANIMATIONS_ACTIVE, String(isAnimationsActive))
	}
}
