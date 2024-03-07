import React from 'react'
import { Main, Typography } from "@acme/ui"
import type { Story, ComponentMeta } from '@storybook/react'


const SectionComponent     = Typography
const SectionComponentName = 'Typography'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title:      SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	return (
		<Main className="flex justify-center items-center py-10">
			<div className="flex flex-col space-y-8">
				<SectionComponent variant={'h1'}>
					H1 Text Example
				</SectionComponent>

				<SectionComponent variant={'h2'}>
					H2 Text Example
				</SectionComponent>

				<SectionComponent variant={'h3'}>
					H3 Text Example
				</SectionComponent>

				<SectionComponent variant={'subtitle'}>
					Subtitle Text Example
				</SectionComponent>

				<SectionComponent variant={'preTitle'}>
					Pre-title Text Example
				</SectionComponent>

				<SectionComponent variant={'body'}>
					Body Text Example
				</SectionComponent>

				<SectionComponent variant={'small'}>
					Small Text Example
				</SectionComponent>

				<SectionComponent variant={'bold'}>
					Bold Text Example
				</SectionComponent>

				<SectionComponent variant={'button'}>
					Button Text Example
				</SectionComponent>

				<SectionComponent variant={'link'}>
					Link Text Example
				</SectionComponent>
			</div>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args         = {}
