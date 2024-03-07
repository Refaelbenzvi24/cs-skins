import React from 'react'
import { Main, Tab, Tabs, Typography } from "@acme/ui"
import type { Story, ComponentMeta } from '@storybook/react'


const SectionComponent     = Tabs
const SectionComponentName = 'Tabs'

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
			<div>
				<SectionComponent
					{...args}>
					<Tab>
						<Typography variant={'body'}>
							Test1
						</Typography>
					</Tab>
					<Tab>
						<Typography variant={'body'}>
							Test2
						</Typography>
					</Tab>
					<Tab>
						<Typography variant={'body'}>
							Test3
						</Typography>
					</Tab>
				</SectionComponent>
			</div>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args         = {}
