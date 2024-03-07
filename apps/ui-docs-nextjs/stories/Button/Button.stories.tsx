import React from "react"
import { Button, Main, Typography } from "@acme/ui"
import type { Story, ComponentMeta } from '@storybook/react';
import type { ButtonProps } from "@acme/ui/src/nextjs/components/Buttons/Button";


const SectionComponent     = Button
const SectionComponentName = 'Button'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const ButtonTemplate: Story<ButtonProps> = ({ ...args }) => {

	return (
		<Main className="flex justify-center py-10">
			<div className="space-x-2">
				<Button
					{...args}>
					<Typography variant={'button'}>
						Primary
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'secondary'}
					colorsForStatesDark={'secondary'}>
					<Typography variant={'button'}>
						Secondary
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'accent'}
					colorsForStatesDark={'accent'}>
					<Typography variant={'button'}
					            colorDark={args.text ? 'inherit' : 'black'}>
						Accent
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'body2'}
					colorsForStatesDark={'body2'}>
					<Typography variant={'button'} color={args.text ? 'inherit' : 'white'}>
						Body2
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'success'}
					colorsForStatesDark={'success'}>
					<Typography variant={'button'} color={args.text ? 'inherit' : 'black'}>
						Success
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'header1'}
					colorsForStatesDark={'header1'}>
					<Typography variant={'button'} color={args.text ? 'inherit' : 'white'}>
						Success
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'white'}
					colorsForStatesDark={'white'}>
					<Typography variant={'button'} color={args.text ? 'inherit' : 'black'}>
						Success
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'overlaysDark'}
					colorsForStatesDark={'overlaysDark'}>
					<Typography variant={'button'} color={args.text ? 'inherit' : 'white'}>
						Success
					</Typography>
				</Button>

				<Button
					{...args}
					colorsForStates={'light'}
					colorsForStatesDark={'light'}>
					<Typography variant={'button'}
					            color={args.text ? 'inherit' : 'black'}>
						Success
					</Typography>
				</Button>
			</div>
		</Main>
	)
}


export const Default = ButtonTemplate.bind({})
