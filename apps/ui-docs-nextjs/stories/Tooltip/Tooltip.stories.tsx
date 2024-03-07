import React from 'react'
import { Button, Main, Tooltip } from "@acme/ui"
import type { Story, ComponentMeta } from '@storybook/react'


const SectionComponent     = Tooltip
const SectionComponentName = 'Tooltip'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	return (
		<Main className="flex justify-center py-10">
			<SectionComponent
				{...args}
				tooltip={`Hello! I'm a button with tooltip`} placement={'bottom-center'}>
				<Button>
					Hover above me
				</Button>
			</SectionComponent>
		</Main>
	)
}

export const Default = SectionTemplate.bind({
	...SectionComponent.defaultProps
})
Default.args         = {}
