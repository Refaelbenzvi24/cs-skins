import React from "react"
import {useState} from "@storybook/addons";
import {Button, Main, theme, Typography} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react';
import {backgrounds} from "../../utils/constants";
import type {ButtonProps} from "@acme/ui/src/nextjs/components/Buttons/Button";
import {buttonDefaultProps} from "@acme/ui/src/nextjs/components/Buttons/Button";
import {omit} from "../../utils/objectsUtils";

const SectionComponent = Button
const SectionComponentName = 'Button'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const ButtonTemplate: Story<ButtonProps> = ({...args}) => {
	const [isBackdropActive, setIsBackdropActive] = useState(false)
	
	return (
		<Main className="flex justify-center py-10">
			<div className="space-x-2">
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}>
					<Typography variant={'button'}>
						Primary
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.secondary}
					colorsForStatesDark={theme.colorSchemeByState.secondary}>
					<Typography variant={'button'}>
						Secondary
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.accent}
					colorsForStatesDark={theme.colorSchemeByState.accent}>
					<Typography variant={'button'}
					            darkColor={args.text ? 'inherit': 'black'}>
						Accent
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.body2}
					colorsForStatesDark={theme.colorSchemeByState.body2}>
					<Typography variant={'button'} color={args.text ? 'inherit': 'white'}>
						Body2
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.success}
					colorsForStatesDark={theme.colorSchemeByState.success}>
					<Typography variant={'button'} color={args.text ? 'inherit': 'black'}>
						Success
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.header1}
					colorsForStatesDark={theme.colorSchemeByState.header1}>
					<Typography variant={'button'} color={args.text ? 'inherit': 'white'}>
						Success
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.white}
					colorsForStatesDark={theme.colorSchemeByState.white}>
					<Typography variant={'button'} color={args.text ? 'inherit': 'black'}>
						Success
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.overlaysDark}
					colorsForStatesDark={theme.colorSchemeByState.overlaysDark}>
					<Typography variant={'button'} color={args.text ? 'inherit': 'white'}>
						Success
					</Typography>
				</Button>
				
				<Button
					{...args}
					onClick={() => setIsBackdropActive(!isBackdropActive)}
					colorsForStates={theme.colorSchemeByState.light}
					colorsForStatesDark={theme.colorSchemeByState.light}>
					<Typography variant={'button'}
					            color={args.text ? 'inherit': 'black'}>
						Success
					</Typography>
				</Button>
			</div>
		</Main>
	)
}


export const Default = ButtonTemplate.bind({})
Default.args = {
	...omit(buttonDefaultProps, 'colorsForStates')
}
