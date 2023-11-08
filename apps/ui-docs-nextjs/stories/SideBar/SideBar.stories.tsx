import React from 'react'
import {
	Button,
	HamburgerSideBar as Hamburger,
	SideBar as UiSideBar,
	Main,
	Navigation,
	theme,
	Typography,
	Col,
	SideBarLink,
	LinkButton,
	LongDivider,
	Row,
	Tooltip,
	IconButton,
	useThemeValue, SideBarButton, Card,
} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react'
import {useState} from "@storybook/addons"
import type {NavigationItemType} from "../AppBar/AppBar.stories";
import {css} from "@emotion/css"
import tw from "twin.macro"
import IconMdiBellOutline from "~icons/mdi/bellOutline"
import IconMdiLogout from "~icons/mdi/logout"
import IconMdiSettings from "~icons/mdi/settings"
import IconCarbonMoon from "~icons/carbon/moon"
import IconCarbonLight from "~icons/carbon/light"
import IconCarbonLanguage from "~icons/carbon/language"

const SectionComponent1 = Hamburger
const SectionComponent2 = UiSideBar

const SectionComponentName = 'SideBar'

const Meta: ComponentMeta<typeof SectionComponent1> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate1: Story<React.ComponentProps<typeof SectionComponent1>> = (args) => {
	const navigationOptions = [
		{label: 'Home', value: '#main'},
		{label: 'Experience', value: '#experience'},
		{label: 'Projects', value: '#projects'},
		{label: 'Skills', value: '#skills'},
		{label: 'Contact', value: '#contact'},
	] as const

	const [currentNavigation, setCurrentNavigation] = useState<NavigationItemType>(navigationOptions[0])
	const [isHamburgerSideBarOpen, setIsHamburgerSideBarOpen] = useState<boolean>(false)

	return (
		<>
			<SectionComponent1
				{...args}
				isOpen={isHamburgerSideBarOpen}
				onIsOpenChange={setIsHamburgerSideBarOpen}>

				<Navigation
					className="space-y-4 mt-[-80px] items-center justify-center mt-auto"
					vertical
					options={navigationOptions}
					selected={currentNavigation}>
					{({label, value}, index) => (
						<Button
							key={index}
							width="fit-content"
							colorsForStates={'header1'}
							colorsForStatesDark={'light'}
							onClick={() => {
								setIsHamburgerSideBarOpen(false)
								setTimeout(() => {
									if (setCurrentNavigation) setCurrentNavigation({label, value})
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
								darkStrokeColor={theme.colorScheme.light}>
								{label}
							</Typography>
						</Button>
					)}
				</Navigation>
			</SectionComponent1>
			<Main className="flex justify-center py-10">
				<Card>
					<Typography variant={'body'}>
						Test text
					</Typography>
				</Card>
			</Main>
		</>
	)
}

export const HamburgerSideBar = SectionTemplate1.bind({})
HamburgerSideBar.args = {
	...SectionComponent1.defaultProps,
}


const SectionTemplate2: Story<React.ComponentProps<typeof SectionComponent2>> = (args) => {
	const themeValue = useThemeValue()

	return (
		<>
			<SectionComponent2 {...args}>
				<Col className={css`${tw`flex h-full flex-col justify-between`}`}>
					<Col>
						<div className={css`${tw`py-4 px-8 flex flex-row`}`}>
							<Typography variant={'h3'}>
								App Name
							</Typography>
						</div>

						<SideBarLink id="home-button">
							<LinkButton href="/"
							            colorsForStates={'primary'}
							            colorsForStatesDark={'primary'}
							            text>
								<Typography variant={'button'}
								            size={0.72}>
									Home
								</Typography>
							</LinkButton>
						</SideBarLink>

						<SideBarLink id="crypto-button">
							<LinkButton href="/cryptocurrencies"
							            colorsForStates={'primary'}
							            colorsForStatesDark={'primary'}
							            text>
								<Typography variant={'button'}
								            size={0.72}>
									Cryptocurrencies
								</Typography>
							</LinkButton>
						</SideBarLink>

						<SideBarLink id="news-button">
							<LinkButton href="/news"
							            colorsForStates={'primary'}
							            colorsForStatesDark={'primary'}
							            text>
								<Typography variant={'button'}
								            size={0.72}>
									News
								</Typography>
							</LinkButton>
						</SideBarLink>

						<SideBarLink id="about-button">
							<LinkButton href="/about"
							            colorsForStates={'primary'}
							            colorsForStatesDark={'primary'}
							            text>
								<Typography variant={'button'}
								            size={0.72}>
									About
								</Typography>
							</LinkButton>
						</SideBarLink>

						<SideBarLink id="404-button">
							<LinkButton href="/someNonExistingPage"
							            colorsForStates={'primary'}
							            colorsForStatesDark={'primary'}
							            text>
								<Typography variant={'button'}
								            size={0.72}>
									404
								</Typography>
							</LinkButton>
						</SideBarLink>
					</Col>

					<Col>
						<LongDivider/>
						<Row className="py-3 px-3 justify-around">

							<Tooltip placement="top-center"
							         tooltip={'Settings'}>
								<IconButton size={20}>
									<IconMdiSettings/>
								</IconButton>
							</Tooltip>

							<Tooltip placement="top-center"
							         tooltip={'Notifications'}>
								<IconButton size={20}>
									<IconMdiBellOutline/>
								</IconButton>
							</Tooltip>

							<Tooltip placement="top-center"
							         tooltip={'Theme'}>
								<IconButton size={20}>
									{themeValue === 'dark' && <IconCarbonMoon/>}
									{themeValue === 'light' && <IconCarbonLight/>}
								</IconButton>
							</Tooltip>

							<Tooltip placement="top-center"
							         tooltip={'Language'}>
								<IconButton size={20}>
									<IconCarbonLanguage/>
								</IconButton>
							</Tooltip>

							<Tooltip placement="top-center"
							         tooltip={'Logout'}>
								<IconButton size={20}>
									<IconMdiLogout/>
								</IconButton>
							</Tooltip>

						</Row>
					</Col>
				</Col>
			</SectionComponent2>

			<SideBarButton
				colorsForStates={'white'}
				colorsForStatesDark={'overlaysDark'}/>

			<Main>
			</Main>
		</>
	)
}

export const SideBar = SectionTemplate2.bind({})
