import React from 'react'
import {Main, Select} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react';
import {useState} from "@storybook/addons";

const SectionComponent = Select
const SectionComponentName = 'Select'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta

interface SelectOption {
	label: string,
	value: string
}

const selectOptions = [
	{label: 'First Option', value: 'First Option'},
	{label: 'Second Option', value: 'Second Option'},
	{label: 'Third Option', value: 'Third Option'},
	{label: 'Fourth Option', value: 'Fourth Option'},
	{label: 'Fifth Option', value: 'Fifth Option'}
] as const


const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	const [selected, setSelected] = useState<SelectOption | undefined>(undefined)
	
	return (
		<Main className="px-10 py-10">
			<SectionComponent
				{...args}
				options={selectOptions}
				value={selected}
				onChange={(value) => setSelected(value)}
			/>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps,
	label: 'this is a label',
	placeholder: 'this is a placeholder',
}
