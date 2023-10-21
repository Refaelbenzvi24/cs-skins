"use client";
import { Button } from "@acme/ui";
import { ComponentProps, startTransition } from "react";
import IconCarbonLanguage from "~icons/carbon/language"
import { useRouter, usePathname } from "next-intl/client";
import { useLocale } from "next-intl";
import clsx from "clsx";
import { css } from "@emotion/css"
import tw from "twin.macro"

const LanguageSelector = (props: ComponentProps<typeof Button>) => {
	const { className, ...restProps } = props

	const router = useRouter ()
	const pathname = usePathname ()
	const locale = useLocale ()

	const languageToggle = async () => {
		const currentLang = locale === "en" ? "he" : "en"
		document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr"
		document.documentElement.lang = currentLang
		startTransition(() => {
			router.push (pathname, { locale: currentLang })
		});
	}

	return (
		<Button
			text
			noPadding
			size={"22px"}
			className={`${css`
              ${tw`p-[10px]`};
			`} ${clsx (className)}`}
			{...restProps}
			aria-label="language"
			id="language-toggle-button"
			onClick={async () => await languageToggle ()}>
			<IconCarbonLanguage/>
		</Button>
	)
}

export default LanguageSelector
