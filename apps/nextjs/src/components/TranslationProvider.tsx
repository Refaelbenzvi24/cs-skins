"use client";
import { I18nProviderClient } from "~/locales/client"
import type { ReactNode } from "react"

interface TranslationsProviderProps {
	children: ReactNode
	locale: string
}

const TranslationProvider = ({ children, locale }: TranslationsProviderProps) => {
	return (
		<I18nProviderClient locale={locale}>
			{children}
		</I18nProviderClient>
	)
}

export default TranslationProvider
