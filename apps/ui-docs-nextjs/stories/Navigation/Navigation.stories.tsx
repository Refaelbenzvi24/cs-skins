import React from 'react'
import {Main, Navigation, NavigationItem} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react'
import {useState, useEffect} from "@storybook/addons"
import type {NavigationItemType} from "../AppBar/AppBar.stories";
import {useRouter} from "next/router"

const SectionComponent = Navigation
const SectionComponentName = 'Navigation'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta

const navigationOptions = [
	{label: 'Home', value: '#main'},
	{label: 'Experience', value: '#experience'},
	{label: 'Projects', value: '#projects'},
	{label: 'Skills', value: '#skills'},
	{label: 'Contact', value: '#contact'},
] as const

const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	
	const [currentNavigation, setCurrentNavigation] = useState<NavigationItemType>(navigationOptions[0])
	const router = useRouter()
	
	useEffect(() => {
		const currentNavigation = navigationOptions.filter(nav => nav.value === router.asPath)[0]
		if (currentNavigation && setCurrentNavigation) setCurrentNavigation(() => currentNavigation)
	}, [router.asPath]);
	
	//TODO: fix initialState don't change
	return (
		<Main className="flex justify-center py-10">
			<div>
				<SectionComponent
					{...args}
					selected={currentNavigation}
					options={navigationOptions}>
					{({label, value}, index) => (
						<NavigationItem
							{...{label, value}}
							href={value}
							key={index}
							selected={currentNavigation}/>
					)}
				</SectionComponent>
			</div>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps,
}
