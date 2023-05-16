import React from "react"
import {useState} from "@storybook/addons";
import {AppBar, Main, Navigation, NavigationItem, Row} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react';
import type {AppBarProps} from "@acme/ui/src/nextjs/components/AppBar/AppBar";

const SectionComponent = AppBar
const SectionComponentName = 'AppBar'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


export interface NavigationItemType {
	label: string,
	value: string,
	
	[key: string]: any
}

const AppBarTemplate: Story<AppBarProps> = ({...args}) => {
	
	const navigationOptions = [
		{label: 'Home', value: '#main'},
		{label: 'Experience', value: '#experience'},
		{label: 'Projects', value: '#projects'},
		{label: 'Skills', value: '#skills'},
		{label: 'Contact', value: '#contact'},
	] as const
	
	const [currentNavigation, setCurrentNavigation] = useState<NavigationItemType>(navigationOptions[0])
	
	
	return (
		<>
			<SectionComponent
				{...args}
				className="justify-between px-20">
				<Row className="items-center">
					<Navigation
						selected={currentNavigation}
						options={navigationOptions}>
						{({label, value}, index) => (
							<NavigationItem
								{...{label, value}}
								href={value}
								key={index}
								selected={currentNavigation}
								onSelect={() => setCurrentNavigation({label, value})}/>
						)}
					</Navigation>
				</Row>
			</SectionComponent>
			
			<Main className="h-[200vh]">
			</Main>
		</>
	)
}

export const Default = AppBarTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps
}

export const HideOnScroll = AppBarTemplate.bind({})
HideOnScroll.args = {
	...SectionComponent.defaultProps,
	hideOnScroll: true
}
