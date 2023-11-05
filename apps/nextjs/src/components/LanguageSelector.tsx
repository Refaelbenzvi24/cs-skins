"use client";
import { Button } from "@acme/ui";
import type { ComponentProps } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation"
import { useChangeLocale, useCurrentLocale } from "~/locales/client"


const LanguageSelector = (props: ComponentProps<typeof Button>) => {
	const { className, ...restProps } = props


	const router = useRouter()
	const pathname = usePathname()

	const locale = useCurrentLocale()
	const changeLocale = useChangeLocale()

	const languageToggle = () => {
		const currentLang = locale === "he" ? "en" : "he"
		document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr"
		document.documentElement.lang = currentLang
		const newPathname = pathname.replace(`${locale}`, `${currentLang}`)
		changeLocale(currentLang)
		router.refresh()
		router.push (newPathname)
	}

	return (
		<Button
			text
			noPadding
			size={"22px"}
			className={`p-[10px] ${clsx (className ?? "")}`}
			{...restProps}
			aria-label="language"
			id="language-toggle-button"
			onClick={() => languageToggle ()}>
			<IconCarbonLanguage/>
		</Button>
	)
}

export default LanguageSelector
