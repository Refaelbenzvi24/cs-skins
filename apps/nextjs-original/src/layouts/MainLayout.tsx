import MainLayoutAppBar, {type NavigationItemType} from "~/components/layouts/MainLayout/AppBar";
import MainLayoutMobileAppBar from "~/components/layouts/MainLayout/MobileAppBar";
import {Main} from "@acme/ui";
import {useState, type ReactNode} from "react";
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation"
import {css} from "@emotion/css"
import tw from "twin.macro"

interface MainLayoutProps {
	children?: ReactNode
}

const MainLayout = ({children}: MainLayoutProps) => {
	const router = useRouter()
	const {t} = useTranslation()
	
	const navigationOptions = [
		{label: t('common:home'), value: '/'},
		{label: t('common:contact'), value: '/contact'},
	] as const
	
	const initialNavigation = navigationOptions.filter(navigationItem => navigationItem.value === router.route)[0]
	
	const [currentNavigation, setCurrentNavigation] = useState<NavigationItemType>(initialNavigation || navigationOptions[0])
	
	return (
		<div className="h-full">
			<MainLayoutAppBar
				className={css`
          ${tw`max-[800px]:hidden`};
				`}
				{...{setCurrentNavigation, navigationOptions, currentNavigation}}/>
			
			<MainLayoutMobileAppBar
				className={css`
          ${tw`min-[800px]:hidden`};
				`}
				currentNavigation={currentNavigation}
				navigationOptions={navigationOptions}/>
			
			<Main className="justify-center overflow-x-hidden">
				{children}
			</Main>
		</div>
	)
}

export default MainLayout
