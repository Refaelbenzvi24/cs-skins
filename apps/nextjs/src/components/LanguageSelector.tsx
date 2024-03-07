"use client";
import { Button } from "@acme/ui";
import type { ComponentProps } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "~/app/i18n/client"


const LanguageSelector = (props: ComponentProps<typeof Button>) => {
	const { className, ...restProps } = props

	const { i18n } = useTranslation()
	const router   = useRouter()
	const pathname = usePathname()

	const languageToggle = async () => {
		const lng                     = i18n.language
		const currentLang             = lng === "he" ? "en" : "he"
		document.documentElement.dir  = currentLang === "he" ? "rtl" : "ltr"
		document.documentElement.lang = currentLang
		const newPathname             = pathname.replace(`${lng}`, `${currentLang}`)
		await i18n.changeLanguage(currentLang)
		router.refresh()
		router.push(newPathname)
	}

	return (
		<Button
			text
			noPadding
			size={"22px"}
			className={`p-[10px] ${clsx(className ?? "")}`}
			{...restProps}
			aria-label="language"
			id="language-toggle-button"
			onClick={() => languageToggle()}>
			<IconCarbonLanguage/>
		</Button>
	)
}

export default LanguageSelector
