import React from 'react'
import {Main, TextField, useIsDark} from "@acme/ui"
import type {Story, ComponentMeta} from '@storybook/react';
import {useState} from "react";

const SectionComponent = TextField
const SectionComponentName = 'TextField'

const Meta: ComponentMeta<typeof SectionComponent> = {
	title: SectionComponentName,
	parameters: {
		layout: 'fullscreen'
	}
}

export default Meta


const SectionTemplate: Story<React.ComponentProps<typeof SectionComponent>> = (args) => {
	const [value, setValue] = useState<string>('')
	const isDark = useIsDark()

	return (
		<Main className="px-10 py-10">
			<SectionComponent
				{...args}
				dark={isDark}
				onChange={(event) => setValue(event.target.value)}
				value={value}
			/>
		</Main>
	)
}

export const Default = SectionTemplate.bind({})
Default.args = {
	...SectionComponent.defaultProps,
	placeholder: 'This is a TextField placeholder',
	label: 'This is a TextField label',
	helperText: 'This is a helper text'
}
