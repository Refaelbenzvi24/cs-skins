import { AppBar, Navigation, NavigationItem, Row, ThemeToggle, Tooltip } from "@acme/ui"
import type { ComponentProps } from "react";
import { useEffect } from "react";
import clsx from "clsx";
import LanguageSelector from "~/components/LanguageSelector";
import { useTranslation } from "~/app/i18n/client"


export interface NavigationItemType {
	label: string
	value: string
}

interface MainLayoutAppBarProps {
	navigationOptions: NavigationItemType[] | readonly NavigationItemType[]
	currentNavigation: NavigationItemType
	setCurrentNavigation?: (navigation: NavigationItemType | (() => NavigationItemType)) => void
}


const MainLayoutAppBar = (props: MainLayoutAppBarProps & Partial<ComponentProps<typeof AppBar>>) => {
	const { setCurrentNavigation, navigationOptions, currentNavigation, className, ...restProps } = props

	const { t } = useTranslation()

	const navigationOptionsString = JSON.stringify(navigationOptions)

	useEffect(() => {
		const currentNavigation = navigationOptions.filter(nav => nav.value === router.asPath)[0]
		if(currentNavigation && setCurrentNavigation) setCurrentNavigation(() => currentNavigation)
	}, [navigationOptionsString, router.asPath, setCurrentNavigation])


	return (
		<AppBar
			{...restProps}
			className={`justify-between px-16 ${clsx(className)}`}>
			<Row className="items-center">
				{/*<Image src={"/Logo.svg"} alt={'logo'} width={38} height={45}/>*/}

				<Navigation
					className="ltr:pl-[184px] rtl:pr-[184px]"
					selected={currentNavigation}
					options={navigationOptions}>
					{({ label, value }, index) => (
						<NavigationItem
							{...{ label, value }}
							href={value}
							key={index}
							selected={currentNavigation}/>
					)}
				</Navigation>
			</Row>

			<Row className="space-x-2">
				<Row className="ltr:pl-2 rtl:pr-2">
					<Tooltip tooltip={t('common:language')}
					         color={'colorScheme.overlaysDark'}
					         placement="bottom-center">
						<LanguageSelector/>
					</Tooltip>

					<Tooltip tooltip={t('common:theme')}
					         color={'colorScheme.overlaysDark'}
					         placement="bottom-center">
						<ThemeToggle/>
					</Tooltip>
				</Row>
			</Row>
		</AppBar>
	)
}

export default MainLayoutAppBar
