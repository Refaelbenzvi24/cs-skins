import React from 'react'
import {Card} from "@acme/ui"
import type {Story} from "@storybook/react"
import type {ComponentMeta} from '@storybook/react';

const SectionComponent = Card
const SectionComponentName = 'Card'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const CardTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	return (
		<SectionComponent className="m-2" {...args}>
		</SectionComponent>
	)
}

export const Default = CardTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps
}
