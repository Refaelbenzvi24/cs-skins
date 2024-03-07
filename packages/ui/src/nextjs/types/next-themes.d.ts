declare module "next-themes" {
	import type React from 'react';
	import type { UseThemeProps, ThemeProviderProps } from 'next-themes/dist/types';
	import type { ThemeOptions } from "../components/Theme/types";

	interface UseThemePropsExtended extends UseThemeProps {
		theme?: 'dark' | 'light'
	}

	export declare const useTheme: () => UseThemePropsExtended;
	export declare const ThemeProvider: React.FC<ThemeProviderProps>;
}
