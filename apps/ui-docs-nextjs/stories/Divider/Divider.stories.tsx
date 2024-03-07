import React from 'react'
import { Divider, Main, Typography } from "@acme/ui"
import type { Story } from "@storybook/react"
import type { ComponentMeta } from '@storybook/react';


const SectionComponent     = Divider
const SectionComponentName = 'Divider'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const DividerTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	return (
		<Main className="py-10 px-10">
			<Typography variant={'h1'}>
				H1 with divider
			</Typography>
			<SectionComponent {...args}/>
		</Main>
	)
}

export const Default = DividerTemplate.bind({})
Default.args         = {
	...SectionComponent.defaultProps,
	thickness: '3px'
}
