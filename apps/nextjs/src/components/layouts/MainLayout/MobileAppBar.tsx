import {AnimatePresence, motion} from "framer-motion"
import {css} from "@emotion/css"
import {
	Button,
	Col,
	HamburgerSideBar,
	Navigation,
	Row,
	theme,
	ThemeToggle,
	Tooltip,
	Typography,
	useIsDark,
	useMain
} from "@acme/ui"
import type { ComponentProps} from "react";
import {useState, useEffect} from "react"
import tw from "twin.macro"

import type {NavigationItemType} from "./AppBar"
import {useRouter} from "next/router"
import SocialLinks from "~/components/SocialLinks";
import clsx from "clsx";
import LanguageSelector from "~/components/LanguageSelector";


export interface MainLayoutMobileAppBarProps {
	navigationOptions: NavigationItemType[] | readonly NavigationItemType[]
	currentNavigation: NavigationItemType
	setCurrentNavigation?: (navigation: NavigationItemType) => void
}

const MainLayoutMobileAppBar = (props: MainLayoutMobileAppBarProps & ComponentProps<typeof Row>) => {
	const router = useRouter()
	const {t, lang} = useTranslation()
	const dir = lang === 'he' ? 'rtl' : 'ltr'

	const {navigationOptions, currentNavigation, setCurrentNavigation, className, ...restProps} = props

	const [isHamburgerSideBarOpen, setIsHamburgerSideBarOpen] = useState<boolean>(false)

	const {setAppBarState, setAppBarOpts} = useMain()
	const isDark = useIsDark()


	useEffect(() => {
		setAppBarState(() => true)

		return () => {
			setAppBarState(() => false)
		}
	}, [setAppBarState])


	useEffect(() => {
		setAppBarOpts((prev) => ({
			...prev,
			height: 75,
		}))
	}, [setAppBarOpts])


	return (
		<Row
			{...restProps}
			className={`${css`
        ${tw`absolute w-full items-center h-[75px]`}
        & ~ #main {
          padding-top: 75px;
        }
			`} ${clsx(className)}`}>

			{/*<Image*/}
			{/*	className={css`*/}
      {/*    [dir="ltr"] & {*/}
      {/*      margin-left: 60px;*/}
      {/*      @media screen and (max-width: 1200px) {*/}
      {/*        margin-left: 20px;*/}
      {/*      }*/}
      {/*    }*/}

      {/*    [dir="rtl"] & {*/}
      {/*      margin-right: 60px;*/}
      {/*      @media screen and (max-width: 1200px) {*/}
      {/*        margin-right: 20px;*/}
      {/*      }*/}
      {/*    }*/}
			{/*	`}*/}
			{/*	src={"/Logo.svg"}*/}
			{/*	alt={'YAM'}*/}
			{/*	width={38} height={45}/>*/}

			<HamburgerSideBar
				className="overflow-hidden"
				dir={dir }
				isOpen={isHamburgerSideBarOpen}
				bgColor={theme.colorScheme.light}
				bgColorDark={theme.colorScheme.dark}
				onIsOpenChange={setIsHamburgerSideBarOpen}>
				<AnimatePresence>
					{isHamburgerSideBarOpen && (
						<motion.div
							className="flex flex-col h-full w-full"
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}>
							<Row className="mt-[-34px] mx-[12px] space-x-[18px] rtl:space-x-reverse">
								<Tooltip tooltip={'Theme'}
								         color={theme.colorScheme.overlaysDark}
								         placement="bottom-center">
									<ThemeToggle
										color={theme.colorScheme.secondary}/>
								</Tooltip>

								<Tooltip tooltip={t('common:language')}
								         color={theme.colorScheme.overlaysDark}
								         placement="bottom-center">
									<LanguageSelector/>
								</Tooltip>
							</Row>

							<Navigation
								className="mt-[-80px] items-center justify-center mt-auto"
								vertical
								options={navigationOptions}
								selected={currentNavigation}>
								{({label, value}, index) => (
									<Button
										key={index}
										width="fit-content"
										onClick={() => {
											setIsHamburgerSideBarOpen(false)
											setTimeout(() => {
												if (setCurrentNavigation) setCurrentNavigation({label, value})
												router.push(value)
											}, 800)
										}}
										text>
										<Typography
											variant="button"
											className="w-fit"
											size={1}
											weight={500}
											strokeSize={0.45}
											strokeColor={theme.colorScheme.header1}
											darkStrokeColor={theme.colorScheme.light}
											color={theme.colorScheme.header1}
											colorDark={theme.colorScheme.light}>
											{label}
										</Typography>
									</Button>
								)}
							</Navigation>

							<Col className="mb-[40px] mt-auto z-[300]">
								<Row className="justify-center">
									<Typography variant="button"
									            color={theme.colorScheme.header1}
									            colorDark={theme.colorScheme.light}
									            size={0.8}
									            weight={400}>
										{t('common:get in touch')}
									</Typography>
								</Row>

								<Row className="pt-[12px] justify-center space-x-[18px] rtl:space-x-reverse">
									<SocialLinks
										tw="space-s-2"
										linksProps={{
											size: '22px'
										}}/>
								</Row>
							</Col>

							<div className={css`
                position: absolute;
                bottom: -55px;
                left: -35px;
                height: 300px;
                width: 200vw;
                rotate: 165deg;
                background-color: ${isDark ? theme.colorScheme.overlaysDark : theme.colorScheme.light2};
							`}/>
						</motion.div>
					)}
				</AnimatePresence>
			</HamburgerSideBar>
		</Row>
	)
}

export default MainLayoutMobileAppBar
