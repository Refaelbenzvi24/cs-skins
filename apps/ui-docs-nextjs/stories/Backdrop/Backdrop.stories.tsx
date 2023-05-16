import React from "react"
import {useState} from "@storybook/addons";
import {Backdrop, Button, Main, Typography} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react';
import type {BackdropProps} from "@acme/ui/src/nextjs/components/Backdrop/Backdrop";

const SectionComponent = Backdrop
const SectionComponentName = 'Backdrop'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const BackdropTemplate: Story<BackdropProps> = ({...args}) => {
	const [isBackdropActive, setIsBackdropActive] = useState(false)
	
	return (
		<>
			<SectionComponent {...args}
			                  onClick={() => setIsBackdropActive(false)}
			                  active={isBackdropActive}>
			</SectionComponent>
			
			<Main className="flex justify-center py-10">
				<div className="space-x-2">
					<Button
						onClick={() => setIsBackdropActive(!isBackdropActive)}>
						<Typography variant={'button'}>
							Backdrop Toggle
						</Typography>
					</Button>
				</div>
			</Main>
		</>
	)
}

export const Default = BackdropTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps
}
