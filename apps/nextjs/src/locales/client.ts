import { createI18nClient } from "next-international/client";
import { translations } from "~/locales/translations"

export const {
	useI18n,
	useScopedI18n,
	I18nProviderClient,
	useCurrentLocale,
	useChangeLocale,
} = createI18nClient(translations);

export const useDir = () => useCurrentLocale() === "he" ? "rtl" : "ltr";
