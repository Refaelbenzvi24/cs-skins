import {Button} from "@acme/ui";
import useTranslation from "next-translate/useTranslation"
import {ComponentProps} from "react";
import IconCarbonLanguage from "~icons/carbon/language"
import {useRouter} from "next/router"
import clsx from "clsx";
import {css} from "@emotion/css"
import tw from "twin.macro"
import setLanguage from 'next-translate/setLanguage'

const LanguageSelector = (props: ComponentProps<typeof Button>) => {
	const {className, ...restProps} = props
	
	const {lang} = useTranslation()
	
	
	const languageToggle = async () => {
		const currentLang = lang === 'en' ? 'he' : 'en'
		document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr'
		await setLanguage(currentLang)
	}
	
	return (
		<Button
			text
			noPadding
			size={'22px'}
			className={`${css`
        ${tw`p-[10px]`};
			`} ${clsx(className)}`}
			{...restProps}
			aria-label="language"
			id="language-toggle-button"
			onClick={async () => await languageToggle()}>
			<IconCarbonLanguage/>
		</Button>
	)
}

export default LanguageSelector
